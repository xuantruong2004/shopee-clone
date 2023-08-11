import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/constants/httpStatusCode.enum'
import { ErrorResponseApi } from 'src/type/utils.type'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}
export function isAxiosExpireTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponseApi<{ name: string; message: string }>>(error) &&
    error.response?.data.data?.name === 'EXPIRED_TOKEN'
  )
}

export const formatCurrency = (value: number | bigint) => new Intl.NumberFormat('de-De').format(value)
export const formatNumberToSocial = (value: number | bigint) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
    .format(value)
    .replace('.', ',')
    .replace('K', 'k')
