import path from 'src/constants/path'
import { AuthResponse } from 'src/type/auth.type'
import http from 'src/utils/http'

const authApi = {
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>(path.register, body),
  loginAccount: (body: { email: string; password: string }) => http.post<AuthResponse>(path.login, body),
  LogoutAccount: () => http.post(path.logout)
}

export default authApi
