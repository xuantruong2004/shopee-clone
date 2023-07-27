import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { Purchase } from 'src/type/purchase.type'
import { formatCurrency } from 'src/utils/utils'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  // const [extendedPurchases, setExtendedPurchases] = useState<extendedPurchase[]>([])
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchase', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })
  const purchaseList = purchasesInCartData?.data.data

  const location = useLocation()
  const purchaseIdBuyNow = location.state?.purchaseId

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const buyPurchaseMutation = useMutation({
    mutationFn: purchaseApi.buyPurchase,
    onSuccess: (data) => {
      toast.success(data.data.message)
      refetch()
    }
  })
  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  // xu ly xoá state khi load lai trang
  useEffect(() => {
    return window.history.replaceState(null, '')
  }, [])
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendPurchaseObject = keyBy(prev, '_id')
      return (
        purchaseList?.map((purchase) => ({
          ...purchase,
          disabled: false,
          checked: Boolean(extendPurchaseObject[purchase._id]?.checked) || purchase._id === purchaseIdBuyNow
        })) || []
      )
    })
  }, [purchaseList, purchaseIdBuyNow, setExtendedPurchases])

  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])

  const handleChecked = (indexId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[indexId].checked = event.target.checked
      })
    )
  }
  const handleAllChecked = () => {
    if (isAllChecked) {
      setExtendedPurchases(
        produce((draft) => {
          draft.map((purchase) => (purchase.checked = false))
        })
      )
    } else {
      setExtendedPurchases(
        produce((draft) => {
          draft.map((purchase) => (purchase.checked = true))
        })
      )
    }
  }
  const handletypeQuantity = (purchaseIndex: number, value: number) => {
    if (value)
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].buy_count = value
        })
      )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }
  const deletePurchase = (purchaseId: string[]) => {
    deletePurchaseMutation.mutate(purchaseId)
  }
  const totalPayment = useMemo(
    () =>
      extendedPurchases.reduce(
        (acc, purchase) => (purchase.checked ? acc + Number(purchase.buy_count) * Number(purchase.price) : acc),
        0
      ),
    [extendedPurchases]
  )
  const totalPaymentBeforeDiscount = useMemo(
    () =>
      extendedPurchases.reduce(
        (acc, purchase) =>
          purchase.checked ? acc + Number(purchase.buy_count) * Number(purchase.price_before_discount) : acc,
        0
      ),
    [extendedPurchases]
  )
  const purchaseChecked = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])

  const purchaseListChecked = () => {
    return purchaseChecked.map((purchase) => purchase._id)
  }

  const totalBuy = useMemo(
    () => extendedPurchases.reduce((acc, purchase) => (purchase.checked ? acc + 1 : acc), 0),
    [extendedPurchases]
  )

  const handleBuyPurchaseChecked = () => {
    if (purchaseChecked.length > 0) {
      const body = purchaseChecked.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyPurchaseMutation.mutate(body)
    }
  }

  if (extendedPurchases.length === 0 && purchaseList?.length === 0)
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='flex h-60 w-60 flex-col items-center'>
          <svg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 650 512' id='empty-cart'>
            <circle cx='337.969' cy='243.395' r='167.695' fill='#dbe8ec' />
            <path
              fill='#dbe8ec'
              d='M574.58343,223.75715V205.64747a13.02087,13.02087,0,0,0-13.02086-13.02087H505.60333a13.02086,13.02086,0,0,1-13.02086-13.02086V161.49606a13.02087,13.02087,0,0,1,13.02086-13.02087h21.45112a13.02087,13.02087,0,0,0,13.02086-13.02087V117.34464a13.02087,13.02087,0,0,0-13.02086-13.02087H143.13523a13.02087,13.02087,0,0,0-13.02087,13.02087v18.10968a13.02087,13.02087,0,0,0,13.02087,13.02087h0a13.02087,13.02087,0,0,1,13.02086,13.02087v18.10968a13.02086,13.02086,0,0,1-13.02086,13.02086H82.7824a13.02087,13.02087,0,0,0-13.02087,13.02087v18.10968A13.02087,13.02087,0,0,0,82.7824,236.778h59.75769A13.02087,13.02087,0,0,1,155.561,249.79889v18.10976c.31905,16.57135-35.82964,13.02087-43.02086,13.02087h-.04775a13.02087,13.02087,0,0,0-13.02087,13.02087V312.06a13.02087,13.02087,0,0,0,13.02087,13.02087h32.85852a13.02087,13.02087,0,0,1,13.02087,13.02087v18.10976a13.02087,13.02087,0,0,1-13.02087,13.02087H108.43743a13.02087,13.02087,0,0,0-13.02086,13.02087V400.3629a13.02086,13.02086,0,0,0,13.02086,13.02086H524.045a13.02087,13.02087,0,0,0,13.02087-13.02086V382.25322A13.02087,13.02087,0,0,0,524.045,369.23235H502.75526a13.02087,13.02087,0,0,1-13.02087-13.02087V338.10172a13.02087,13.02087,0,0,1,13.02087-13.02087h36.62008A13.02087,13.02087,0,0,0,552.39621,312.06V293.95039a13.02087,13.02087,0,0,0-13.02087-13.02087H521.30005a13.02087,13.02087,0,0,1-13.02087-13.02087V249.79889A13.02087,13.02087,0,0,1,521.30005,236.778h40.26252A13.02087,13.02087,0,0,0,574.58343,223.75715Z'
            />
            <circle cx='340.677' cy='148.55' r='46.959' fill='#3086a3' />
            <path
              fill='none'
              stroke='#f9ae2b'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={4}
              d='M324.05253,138.77179q-.00092-.08715-.00092-.17432a16.62566,16.62566,0,1,1,16.86682,16.62391v15.09678'
            />
            <line
              x1='419.668'
              x2='451.971'
              y1='116.939'
              y2='116.939'
              fill='none'
              stroke='#3086a3'
              strokeLinecap='round'
              strokeMiterlimit={10}
              strokeWidth={3}
            />
            <line
              x1='419.668'
              x2='451.971'
              y1='126.25'
              y2='126.25'
              fill='none'
              stroke='#3086a3'
              strokeLinecap='round'
              strokeMiterlimit={10}
              strokeWidth={3}
            />
            <line
              x1='419.668'
              x2='451.971'
              y1='135.56'
              y2='135.56'
              fill='none'
              stroke='#3086a3'
              strokeLinecap='round'
              strokeMiterlimit={10}
              strokeWidth={3}
            />
            <line
              x1='119.153'
              x2='151.456'
              y1='293.762'
              y2='293.762'
              fill='none'
              stroke='#3086a3'
              strokeLinecap='round'
              strokeMiterlimit={10}
              strokeWidth={3}
            />
            <line
              x1='119.153'
              x2='151.456'
              y1='303.072'
              y2='303.072'
              fill='none'
              stroke='#3086a3'
              strokeLinecap='round'
              strokeMiterlimit={10}
              strokeWidth={3}
            />
            <line
              x1='119.153'
              x2='151.456'
              y1='312.383'
              y2='312.383'
              fill='none'
              stroke='#3086a3'
              strokeLinecap='round'
              strokeMiterlimit={10}
              strokeWidth={3}
            />
            <line
              x1='481.64'
              x2='513.943'
              y1='360.156'
              y2='360.156'
              fill='none'
              stroke='#3086a3'
              strokeLinecap='round'
              strokeMiterlimit={10}
              strokeWidth={3}
            />
            <line
              x1='481.64'
              x2='513.943'
              y1='369.467'
              y2='369.467'
              fill='none'
              stroke='#3086a3'
              strokeLinecap='round'
              strokeMiterlimit={10}
              strokeWidth={3}
            />
            <line
              x1='481.64'
              x2='513.943'
              y1='378.777'
              y2='378.777'
              fill='none'
              stroke='#3086a3'
              strokeLinecap='round'
              strokeMiterlimit={10}
              strokeWidth={3}
            />
            <circle cx='520.577' cy='300.496' r='13.807' fill='#b9d4db' />
            <circle cx='484.141' cy='310.461' r='7.159' fill='#b9d4db' />
            <circle cx='502.32' cy='266.711' r='10.228' fill='#b9d4db' />
            <circle cx='206.393' cy='389.674' r='16.428' fill='#b9d4db' />
            <circle cx='175.001' cy='377.974' r='8.557' fill='#b9d4db' />
            <circle cx='182.861' cy='348.886' r='4.936' fill='#b9d4db' />
            <circle cx='210.185' cy='352.378' r='11.833' fill='#b9d4db' />
            <circle cx='218.423' cy='143.059' r='16.428' fill='#b9d4db' />
            <circle cx='219.09' cy='109.564' r='8.557' fill='#b9d4db' />
            <circle cx='276.085' cy='114.564' r='7.406' fill='#b9d4db' />
            <circle cx='249.141' cy='107.367' r='4.936' fill='#b9d4db' />
            <circle cx='254.877' cy='134.31' r='11.833' fill='#b9d4db' />
            <path
              fill='#409cb5'
              d='M480.85793,233.2431H202.6215L193.549,210.24282h287.309a2.72176,2.72176,0,0,1,2.72176,2.72176v17.55676A2.72176,2.72176,0,0,1,480.85793,233.2431Z'
            />
            <path
              fill='#f9ae2b'
              d='M440.32266,354.08924H251.1267a4.53627,4.53627,0,0,1-4.24692-2.94208L202.6215,233.2431h268.547l-26.4204,117.30658A4.53627,4.53627,0,0,1,440.32266,354.08924Z'
            />
            <path
              fill='#3086a3'
              d='M457.56233,293.66888c-19.355,1.24146-38.71,1.89087-58.065,2.33216-9.6775.27637-19.355.33777-29.03251.50036l-29.0325.16578q-29.0325.02636-58.065-.65723c-19.355-.43945-38.71-1.09216-58.065-2.34107,19.355-1.2489,38.71-1.90148,58.065-2.34106q29.03249-.65185,58.065-.6571l29.0325.16565c9.6775.16259,19.355.224,29.03251.50048C418.8523,291.778,438.20731,292.42755,457.56233,293.66888Z'
            />
            <path
              fill='#3086a3'
              d='M419.70359 233.2431c-1.1026 10.54578-2.78772 20.96045-4.64789 31.33558q-2.82669 15.55462-6.30877 30.96154-3.46357 15.41108-7.56577 30.67835c-1.38006 5.08618-2.80926 10.16137-4.33484 15.21484-.78927 2.52075-1.54083 5.05-2.361 7.56384l-.632 1.90967a4.91879 4.91879 0 01-1.18194 1.85889 4.67456 4.67456 0 01-3.81363 1.32349 4.373 4.373 0 003.11981-1.90845 3.91413 3.91413 0 00.633-1.61035l.25211-1.93872c.3367-2.62269.742-5.22986 1.10959-7.84571.78815-5.21948 1.6727-10.41736 2.60638-15.60412q2.82738-15.55444 6.31671-30.95972 3.47562-15.40833 7.57367-30.67664C413.23631 253.37482 416.17866 243.24335 419.70359 233.2431zM311.58605 354.0893a4.68121 4.68121 0 01-3.92411-1.458 6.69642 6.69642 0 01-1.156-1.8822l-.89646-1.85706c-1.1946-2.47632-2.32068-4.97827-3.4844-7.46619-2.27786-4.9945-4.463-10.02368-6.60287-15.06994q-6.39166-15.14906-12.15434-30.53431-5.78044-15.37866-10.948-30.9873c-3.41577-10.41675-6.65956-20.89807-9.33894-31.59119 5.01886 9.815 9.47332 19.8418 13.75582 29.93323q6.391 15.14941 12.14673 30.53723 5.76888 15.38306 10.94045 30.99012c1.70927 5.20788 3.37323 10.43273 4.94449 15.69238.76086 2.63916 1.55934 5.26416 2.28932 7.91479l.54693 1.98828a5.88655 5.88655 0 00.66687 1.77539A4.37022 4.37022 0 00311.58605 354.0893z'
            />
            <circle cx='298.105' cy='428.058' r='18.743' fill='#409cb5' />
            <circle cx='298.105' cy='428.058' r='8.651' fill='#dbe8ec' />
            <circle cx='406.224' cy='428.058' r='18.743' fill='#409cb5' />
            <circle cx='406.224' cy='428.058' r='8.651' fill='#dbe8ec' />
            <path
              fill='#3086a3'
              d='M343.09231,233.2431c1.83931,9.99671,3.08253,20.02881,4.14664,30.07178q1.55889,15.06646,2.44714,30.173.9072,15.1053,1.161,30.24952c.13792,10.098.0925,20.207-.55473,30.35193-1.84722-9.99622-3.09265-20.02833-4.15473-30.07129q-1.5582-15.06666-2.43905-30.17347-.89487-15.106-1.15285-30.25012C342.40978,253.49628,342.453,243.38739,343.09231,233.2431Z'
            />
            <path
              fill='#409cb5'
              d='M437.93777,399.80133H268.38406a3.00011,3.00011,0,0,1-2.801-1.92578L167.38479,141.898H115.37112a3,3,0,0,1,0-6h54.07593a3.0001,3.0001,0,0,1,2.801,1.92578l98.19824,255.97754H437.93777a3,3,0,0,1,0,6Z'
            />
            <rect width='39.6' height='18.36' x='103.858' y='130.248' fill='#409cb5' rx={2} />
            <circle cx='340.677' cy='179.6' r='2.7' fill='#f9ae2b' />
          </svg>
          <h4 className='pb-5 capitalize'>Chưa có sản phẩm</h4>
          <Link to={path.home} className='rounded bg-orange px-8 py-3 text-white hover:opacity-90'>
            Mua ngay
          </Link>
        </div>
      </div>
    )
  return (
    <div className=' bg-neutral-100 py-16'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className=' min-w-[1128px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6'>
                <div className=' item-center flex'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className=' h-5 w-5 accent-orange'
                      checked={isAllChecked}
                      onChange={handleAllChecked}
                    />
                  </div>
                  <div className='flex-grow text-black'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className=' grid grid-cols-5 text-center'>
                  <div className=' col-span-2'>Đơn giá</div>
                  <div className=' col-span-1'>Số lượng</div>
                  <div className=' col-span-1'>Số tiền</div>
                  <div className=' col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>

            <div className='my-3 rounded'>
              {extendedPurchases &&
                extendedPurchases.map((product, index) => {
                  return (
                    <div
                      className=' grid grid-cols-12  border-b border-gray-300 bg-white px-9  py-5 text-sm text-gray-500 shadow'
                      key={product._id}
                    >
                      <div className='col-span-6 '>
                        <div className=' flex items-center'>
                          <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                            <input
                              type='checkbox'
                              className=' h-5 w-5 accent-orange'
                              checked={product.checked}
                              onChange={handleChecked(index)}
                            />
                          </div>
                          <div className='flex flex-grow text-black'>
                            <img
                              className='h-20 w-20 object-cover'
                              src={product.product.image}
                              alt={product.product.name}
                            />
                            <div className='ml-2 flex-grow overflow-hidden'>
                              <div className='line-clamp-2'>{product.product.name}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-span-6 flex items-center '>
                        <div className=' grid grid-cols-5 text-center'>
                          <div className=' col-span-2 flex items-center justify-center gap-2  '>
                            <div className='text-gray-300 line-through'>
                              ₫ {formatCurrency(product.price_before_discount)}
                            </div>
                            <div className='text-black '>₫{formatCurrency(product.price)}</div>
                          </div>
                          <div className=' col-span-1'>
                            <QuantityController
                              value={product.buy_count}
                              max={product.product.quantity}
                              onIncrease={(value) => handleQuantity(index, value, value <= product.product.quantity)}
                              onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                              onType={(value) => handletypeQuantity(index, value)}
                              onFocusOut={(value) =>
                                handleQuantity(
                                  index,
                                  value,
                                  value <= product.product.quantity &&
                                    value >= 1 &&
                                    value !== purchaseList[index]?.buy_count
                                )
                              }
                            />
                          </div>
                          <div className=' col-span-1 my-auto text-orange'>
                            ₫{formatCurrency(product.buy_count * product.price)}
                          </div>
                          <div className=' col-span-1 flex items-center justify-center'>
                            <button
                              onClick={() => deletePurchase([product._id])}
                              className=' text-orange hover:opacity-75'
                            >
                              Xoá
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10 flex items-center rounded-sm bg-white p-5 px-9 text-sm'>
          <div className=' flex flex-shrink-0 items-center justify-center pr-3'>
            <input
              type='checkbox'
              className='h-5 w-5 accent-orange'
              checked={isAllChecked}
              onChange={handleAllChecked}
            />
          </div>
          <button className='pr-3 capitalize'>Chọn tất cả</button>
          <button
            onClick={() => {
              purchaseListChecked().length > 0 && deletePurchase(purchaseListChecked())
            }}
            className='pr-3'
          >
            Xoá
          </button>
          <div className='ml-auto flex items-center'>
            <div>
              <div className=' flex items-center justify-end'>
                <div className='mr-1 text-black'>Tổng thanh toán ({totalBuy} sản phẩm):</div>
                <div className='text-2xl text-orange '>₫ {formatCurrency(totalPayment)}</div>
              </div>
              <div className='flex items-center justify-end text-sm'>
                <div className='text-gray-500'>tiết kiệm:</div>
                <div className='ml-6 text-orange'>₫ {formatCurrency(totalPaymentBeforeDiscount - totalPayment)}</div>
              </div>
            </div>
            <Button
              className='ml-2 h-10 rounded bg-orange px-12 capitalize text-white hover:opacity-90'
              onClick={handleBuyPurchaseChecked}
              disabled={buyPurchaseMutation.isLoading}
            >
              Mua Hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
