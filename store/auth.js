import AuthService from '~/services/AuthService.js'
import { useCookies } from 'vue3-cookies'
import { ElMessage } from 'element-plus'

const authService = AuthService.getInstance()

export const useAuthStore = defineStore('auth', () => {
  const { cookies } = useCookies()
  const user = ref(null)
  const token = ref(null)

  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials)
      console.log(res)

      const { data: userData, token } = res || {}

      if (!token?.access_token) {
        throw new Error('Invalid Credentials')
      }

      const {
        access_token,
        refresh_token,
        token_type,
        expires_in,
        device_id
      } = token

      user.value = userData
      token.value = access_token

      const cookieOptions = {
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: expires_in // optional but recommended
      }

      // Auth cookies
      cookies.set('access_token', access_token, cookieOptions)
      cookies.set('refresh_token', refresh_token, cookieOptions)
      cookies.set('token_type', token_type, cookieOptions)

      // Device tracking
      cookies.set('device_id', device_id, cookieOptions)

      // User info
      cookies.set('user', JSON.stringify(userData), cookieOptions)

      return res
    } catch (error) {
      throw new Error(`Login failed: ${error.message || 'Unknown error'}`)
    }
  }

  return {
    user: computed(() => user.value),
    token,
    login,
  }
})
