import { useQuery } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Paginate'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/type/product.type'
import AsideFilter from './components/AsideFilter'
import ProductItem from './components/ProductItem'
import SortProductList from './components/SortProductList'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: productsData } = useQuery({
    queryKey: ['prosucts', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategory()
    }
  })

  const productList = productsData?.data.data.products
  const categoryList = categoryData?.data.data || []
  return (
    <div className=' bg-gray-100 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter categoryList={categoryList} queryConfig={queryConfig} />
          </div>
          <div className='col-span-9'>
            {productsData?.data.data.pagination.page_size && (
              <SortProductList queryConfig={queryConfig} pageSize={productsData?.data.data.pagination.page_size} />
            )}
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {productList &&
                productList.map((product, index) => (
                  <div className='col-span-1' key={index}>
                    <ProductItem product={product} />
                  </div>
                ))}
            </div>
            {productsData?.data.data.pagination.page_size && (
              <Pagination queryConfig={queryConfig} pageSize={productsData?.data.data.pagination.page_size} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
