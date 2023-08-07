import omit from 'lodash/omit'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from '../../ProductList'
interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

export default function SortProductList({ queryConfig, pageSize }: Props) {
  const navigate = useNavigate()
  const { sort_by = 'createdAt', order = '' } = queryConfig
  const page = Number(queryConfig.page)
  const handleSortBy = (value: string) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: value
          },
          ['order']
        )
      ).toString()
    })
  }
  const handleOrder = (value: string) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: 'price',
        order: value
      }).toString()
    })
  }
  const handlePrev = () => {
    if (page > 1) {
      navigate({
        pathname: path.home,
        search: createSearchParams({
          ...queryConfig,
          page: String(page - 1)
        }).toString()
      })
    }
  }
  const handleNext = () => {
    if (page < pageSize) {
      navigate({
        pathname: path.home,
        search: createSearchParams({
          ...queryConfig,
          page: String(page + 1)
        }).toString()
      })
    }
  }
  return (
    <div className='bg-gray-300/40 px-3 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='p-2'>Sắp xếp theo</div>
          <button
            onClick={() => handleSortBy('view')}
            className={
              sort_by === 'view'
                ? 'inline h-8 cursor-pointer rounded-sm bg-orange px-4 text-center capitalize text-gray-100 hover:bg-orange/80'
                : 'h-8 cursor-pointer rounded-sm bg-white px-4 text-center capitalize '
            }
          >
            Phổ Biến
          </button>

          <button
            onClick={() => handleSortBy('createdAt')}
            className={
              sort_by === 'createdAt'
                ? 'inline h-8 cursor-pointer rounded-sm bg-orange px-4 text-center capitalize text-gray-100 hover:bg-orange/80'
                : 'h-8 cursor-pointer rounded-sm bg-white px-4 text-center capitalize '
            }
          >
            Mới Nhất
          </button>
          <button
            onClick={() => handleSortBy('sold')}
            className={
              sort_by === 'sold'
                ? 'inline h-8 cursor-pointer rounded-sm bg-orange px-4 text-center capitalize text-gray-100 hover:bg-orange/80'
                : 'h-8 cursor-pointer rounded-sm bg-white px-4 text-center capitalize '
            }
          >
            Bán Chạy
          </button>
          <select
            className={
              order
                ? 'h-8 cursor-pointer rounded-sm bg-white px-4 text-left text-orange'
                : 'h-8 cursor-pointer rounded-sm bg-white px-4 text-left'
            }
            onChange={(event) => handleOrder(event.target.value)}
            value={order}
          >
            <option value=''>Giá</option>
            <option value='asc'>Giá: thấp đến cao</option>
            <option value='desc'>Giá: cao đến thấp</option>
          </select>
        </div>
        <div className='flex items-center'>
          <div className=''>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2'>
            <button
              className={
                page === 1
                  ? 'h-8 cursor-not-allowed rounded-br-sm rounded-tr-sm bg-white px-3 shadow-sm'
                  : 'h-8 cursor-pointer rounded-bl-sm rounded-tl-sm bg-white/60 px-3 shadow-sm hover:bg-slate-100'
              }
              onClick={handlePrev}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='h-3 w-3'>
                <path
                  fillRule='evenodd'
                  d='M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
            <button
              className={
                page === pageSize
                  ? 'h-8 cursor-not-allowed rounded-br-sm rounded-tr-sm bg-white px-3 shadow-sm'
                  : 'h-8 cursor-pointer rounded-bl-sm rounded-tl-sm bg-white/60 px-3 shadow-sm hover:bg-slate-100'
              }
              onClick={handleNext}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='h-3 w-3'>
                <path
                  fillRule='evenodd'
                  d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
