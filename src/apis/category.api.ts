import { category } from 'src/type/category.type'
import { SuccessResponseApi } from 'src/type/utils.type'
import http from 'src/utils/http'

const categoryApi = {
  getCategory() {
    return http.get<SuccessResponseApi<category[]>>('categories')
  }
}
export default categoryApi
