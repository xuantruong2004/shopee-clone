import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import Button from 'src/components/Button'
import ProductRating from 'src/components/ProductRating'
import QuantityController from 'src/components/QuantityController'
import { ProductListConfig } from 'src/type/product.type'
import { formatCurrency, formatNumberToSocial } from 'src/utils/utils'
import ProductItem from '../ProductList/components/ProductItem'
import purchaseApi from 'src/apis/purchase.api'
// import { queryClient } from 'src/main'
import { purchaseStatus } from 'src/constants/purchase'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import path from 'src/constants/path'

export default function ProductDetail() {
  const [buyCount, setBuyCount] = useState(1)
  const { nameId } = useParams()
  const [currentIndexImage, setCurrentIndexImage] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const [hoverImage, setHoverImage] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const queryClient = useQueryClient()
  const { isAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  const { data: productDetailData } = useQuery({
    queryKey: ['productDetail', nameId],
    queryFn: () => productApi.getProductDetail(nameId as string)
  })
  const product = productDetailData?.data.data

  const queryConfig = { limit: '20', page: '1', category: product?.category._id }

  const { data: productsData } = useQuery({
    queryKey: ['prosucts', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    enabled: Boolean(product),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  const productCategory = productsData?.data.data.products
  useEffect(() => {
    if (product && product.images.length) {
      setActiveImage(product?.images[0])
    }
    setBuyCount(1)
  }, [product])

  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImage) : []),
    [product, currentIndexImage]
  )
  const handleActiveImage = (index: number) => {
    if (product && product.images.length) {
      setActiveImage(product?.images[currentIndexImage[0] + index])
      setHoverImage(index)
    }
  }

  const handleNextImage = () => {
    if (product?.images && currentIndexImage[1] < product?.images?.length) {
      setCurrentIndexImage([currentIndexImage[0] + 1, currentIndexImage[1] + 1])
    }
  }
  const handlePrevImage = () => {
    if (currentIndexImage[0] > 0) {
      setCurrentIndexImage([currentIndexImage[0] - 1, currentIndexImage[1] - 1])
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
    // const { offsetX, offsetY } = event.nativeEvent

    // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }
  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCounrt = (value: number) => {
    setBuyCount(value)
  }

  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.addToCart(body)
  })

  const addToCart = () => {
    if (isAuthenticated) {
      addToCartMutation.mutate(
        { product_id: product?._id as string, buy_count: buyCount },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['purchase', { status: purchaseStatus.inCart }] })
            toast.success(data.data.message)
          }
        }
      )
    } else {
      navigate(path.login)
    }
  }
  const handleBuyNow = async () => {
    if (isAuthenticated) {
      const res = await addToCartMutation.mutateAsync({ product_id: product?._id as string, buy_count: buyCount })
      const purchase = res.data.data
      navigate(path.cart, {
        state: {
          purchaseId: purchase._id
        }
      })
    } else {
      navigate(path.login)
    }
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container bg-white p-4 shadow'>
        <div className='grid grid-cols-12 gap-9'>
          <div className='col-span-5'>
            <div
              onMouseMove={handleZoom}
              onMouseLeave={handleRemoveZoom}
              className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
            >
              <img
                src={activeImage}
                alt={product?._id}
                className=' absolute left-0 top-0 h-full w-full object-cover'
                ref={imageRef}
              />
            </div>
            <div className='relative mt-4 grid grid-cols-5 gap-1'>
              <button
                onClick={handlePrevImage}
                className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </button>
              {currentImages.map((image, index) => {
                const isActive = index === hoverImage
                return (
                  <div
                    key={image}
                    onMouseEnter={() => handleActiveImage(index)}
                    className='relative w-full overflow-hidden pt-[100%] shadow'
                  >
                    <img src={image} alt={image} className=' absolute left-0 top-0 h-full w-full object-cover' />
                    {isActive && <div className=' absolute inset-0 border-2 border-orange'></div>}
                  </div>
                )
              })}
              <button
                onClick={handleNextImage}
                className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </button>
            </div>
          </div>
          <div className='col-span-7'>
            <h3>{product.name}</h3>
            <div className='mt-2 flex items-center gap-2'>
              <div className='flex gap-1'>
                <div className='text-orange underline underline-offset-2 '>{product?.rating}</div>
                <ProductRating rating={product?.rating} className='h-3 w-3 fill-orange   text-yellow-300' />
              </div>

              <hr className='h-4 w-[1px] bg-gray-400' />
              <div className='flex gap-1'>
                <div className=''>{formatNumberToSocial(product?.sold)}</div>
                <div className='text-gray-500'>đã bán</div>
              </div>
            </div>
            <div className='mt-2 flex items-center gap-3 bg-gray-100 p-4'>
              <div className='text-gray-400 line-through'>₫{formatCurrency(product?.price_before_discount)}</div>
              <div className='text-3xl text-orange'>₫{formatCurrency(product?.price)}</div>
            </div>

            <div className='mt-4 flex items-center gap-10'>
              <div className='text-gray-500'> Số lượng</div>

              <QuantityController
                onIncrease={handleBuyCounrt}
                onDecrease={handleBuyCounrt}
                onType={handleBuyCounrt}
                value={buyCount}
                max={product.quantity}
              />
              <div className='text-xs text-gray-500'> {product.quantity} sản phẩm có sẵn</div>
            </div>

            <div className='mt-4 flex gap-4'>
              <Button
                onClick={addToCart}
                className='rounded border border-orange bg-[rgba(255,87,34,0.1)] px-4 py-3 text-orange hover:opacity-80'
              >
                {' '}
                Thêm vào giỏ hàng
              </Button>
              <Button className='rounded bg-orange px-4 py-3 text-white hover:opacity-90' onClick={handleBuyNow}>
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className=' container mt-6 bg-white'>
        <div className=' p-2 pt-4 capitalize'>Sản phẩm có thể bạn thích</div>
        <div className='grid grid-cols-2 gap-3  p-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
          {productCategory &&
            productCategory.map((product, index) => (
              <div className='col-span-1' key={index}>
                <ProductItem product={product} />
              </div>
            ))}
        </div>
      </div>
      <div className='container mt-8 bg-white p-4 shadow'>
        <div className=' rounded bg-gray-100 p-4 uppercase'> Mô tả sản phẩm</div>
        <div className='mx-4 mb-4 mt-12 text-sm leading-loose'>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product?.description)
            }}
          />
        </div>
      </div>
    </div>
  )
}
