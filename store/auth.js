import Services from '~/services/Services.js'
import { useCookies } from 'vue3-cookies'
import { ElMessage } from 'element-plus'

const authService = Services.getInstance()

export const useAuthStore = defineStore('auth', () => {
  const { cookies } = useCookies()
  const user = ref(null)
  const token = ref(null)

  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials)

      const { data: userData, token } = res || {}

      if (!token?.access_token) {
        throw new Error('Invalid Credentials')
      }

      const {
        access_token,
        refresh_token,
        token_type,
        expires_in,
        device_id,
        expires_at
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
      cookies.set('expires_in', expires_in, expires_in)
      // Device tracking
      cookies.set('device_id', device_id, cookieOptions)
      cookies.set('expires_at', expires_at, cookieOptions)

      // User info
      cookies.set('user', JSON.stringify(userData), cookieOptions)

      return res
    } catch (error) {
      throw new Error(`Login failed: ${error.message || 'Unknown error'}`)
    }
  }

  const sendCode = async () => {
    try {
      const { data } = await authService.sendCode()

      return data
    } catch (error) {
      // ElMessage.error(error.message || 'Failed')
      throw new Error(`Failed: ${error.message || 'Unknown error'}`)
    }
  }

  const getMe = async () => {
    try {
      const { data } = await authService.getMe()
      if (!data) {
        throw new Error('No data returned')
      }
      user.value = data
      return data
    } catch (error) {
      ElMessage.error(error.message || 'Login failed')
      throw new Error(`Login failed: ${error.message || 'Unknown error'}`)
    }
  }

  const logout = async () => {
    user.value = null
    token.value = null
    await authService.logout()

    cookies.remove('access_token')
    cookies.remove('user')
    cookies.remove('tokenType')
  }

  const verifyCode = async (credentials) => {
    try {
      const { data } = await authService.verifyCode(credentials)
      if (!data) {
        throw new Error('No data returned')
      }
      const cookieOptions = {
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      }

      //remove previous cookie if exists
      cookies.remove('mcn')
      cookies.set('mcn', 'a8fcab8-9c1e-4a7c-9d0e-5f2b3c4d5e6f', cookieOptions)
      return data
    } catch (error) {
      // ElMessage.error(error.message || 'Failed')
      throw new Error(`Failed: ${error.message || 'Unknown error'}`)
    }
  }

  //refresh token logic
  const refreshToken = async () => {
    try {
      const refreshToken = cookies.get('refresh_token')

      const { data } = await authService.refreshToken({
        refresh_token: refreshToken
      })

      console.log('Refresh token response:', data.access_token)
      if (!data?.access_token) {
        throw new Error('Invalid refresh response')
      }

      const {
        access_token,
        refresh_token: newRefreshToken,
        token_type,
        expires_in,
        expires_at
      } = data

      const cookieOptions = {
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: expires_in
      }

      // update state
      token.value = access_token

      // update cookies
      cookies.set('access_token', access_token, cookieOptions)
      cookies.set('refresh_token', newRefreshToken, cookieOptions)
      cookies.set('token_type', token_type, cookieOptions)
      cookies.set('expires_in', expires_in, cookieOptions)
      cookies.set('expires_at', expires_at, cookieOptions)

      return refreshToken
    } catch (error) {
      // refresh token expired or invalid
      user.value = null
      token.value = null

      cookies.remove('access_token')
      cookies.remove('refresh_token')
      cookies.remove('token_type')
      cookies.remove('expires_in')
      cookies.remove('user')
      cookies.remove('device_id')
      cookies.remove('mcn')

      throw new Error(
        `Refresh token failed: ${error.message || 'Unknown error'}`
      )
    }
  }

  return {
    user: computed(() => user.value),
    token,
    login,
    sendCode,
    getMe,
    logout,
    verifyCode,
    refreshToken
  }
})
