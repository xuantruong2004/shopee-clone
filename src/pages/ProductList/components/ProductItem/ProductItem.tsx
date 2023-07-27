import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constants/path'
import { Product } from 'src/type/product.type'
import { formatCurrency, formatNumberToSocial } from 'src/utils/utils'

interface Props {
  product: Product
}

export default function ProductItem({ product }: Props) {
  return (
    <Link to={`${path.home}${product._id}`} onClick={() => console.log(product)}>
      <div className='rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.1rem] hover:border hover:border-red-600 hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.image}
            alt={product.name}
            className=' absolute left-0 top-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[2rem] text-xs line-clamp-2'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='mr-2 max-w-[50%] truncate text-sm text-gray-400 line-through'>
              <span className='text-xs'>₫</span>
              {formatCurrency(product.price_before_discount)}
            </div>

            <div className=' text-orange'>
              <span className='text-xs'>₫</span>
              {formatCurrency(product.price)}
            </div>
          </div>
          <div className='mt-3 flex items-center '>
            <ProductRating rating={product.rating} />
            <div className='ml-1 text-sm'>
              <span>Đã bán</span>
              <span className='ml-1'>{formatNumberToSocial(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
