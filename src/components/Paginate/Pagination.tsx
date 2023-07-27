import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { QueryConfig } from 'src/pages/ProductList/ProductList'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
const RANGE = 2

export default function Pagination({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const navigate = useNavigate()
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='mx-2 rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='mx-2 rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(1)
      .map((_, index) => {
        const pageNumber = index + 1
        const isActive = Number(page) === pageNumber
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber < page - RANGE && pageNumber > RANGE) {
          return renderDotBefore(index)
        }

        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: String(pageNumber)
              }).toString()
            }}
            key={index}
            onClick={() => (queryConfig.page = String(pageNumber))}
            className={
              isActive
                ? 'mx-2 rounded bg-orange px-3 py-2 text-gray-100 shadow-sm '
                : 'mx-2 rounded bg-white px-3 py-2 shadow-sm  hover:text-orange'
            }
          >
            {pageNumber}
          </Link>
        )
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
    <div className='mt-4 flex flex-wrap items-center justify-center'>
      <button
        className={
          page === 1
            ? 'disabled mx-2 cursor-not-allowed rounded bg-white px-3 py-2 shadow-sm'
            : 'mx-2 rounded bg-white px-3 py-2 shadow-sm'
        }
        onClick={handlePrev}
      >
        prev
      </button>
      {renderPagination()}
      <button
        className={
          page === pageSize
            ? 'disabled mx-2 cursor-not-allowed rounded bg-white px-3 py-2 shadow-sm'
            : 'mx-2 rounded bg-white px-3 py-2 shadow-sm '
        }
        onClick={handleNext}
      >
        next
      </button>
    </div>
  )
}
