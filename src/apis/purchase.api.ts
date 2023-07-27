import { Purchase, PurchaseListStatus } from 'src/type/purchase.type'
import { SuccessResponseApi } from 'src/type/utils.type'
import http from 'src/utils/http'

const URL = 'purchases'
const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponseApi<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponseApi<Purchase[]>>(URL, { params })
  },
  buyPurchase(body: { product_id: string; buy_count: number }[]) {
    return http.post<SuccessResponseApi<Purchase[]>>(`${URL}/buy-products`, body)
  },
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessResponseApi<Purchase>>(`${URL}/update-purchase`, body)
  },
  deletePurchase(purchase_id: string[]) {
    return http.delete<SuccessResponseApi<{ delete_count: number }>>(URL, {
      data: purchase_id
    })
  }
}

export default purchaseApi
