import { Product, ProductList, ProductListConfig } from 'src/type/product.type'
import { SuccessResponseApi } from 'src/type/utils.type'
import http from 'src/utils/http'

const URL = 'products'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponseApi<ProductList>>(URL, {
      params: params
    })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponseApi<Product>>(`${URL}/${id}`)
  }
}
export default productApi
