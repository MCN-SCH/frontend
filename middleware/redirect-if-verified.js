import { useCookies } from 'vue3-cookies'

export default defineNuxtRouteMiddleware(() => {
  const deviceCookie = useCookie('device_id')
  const { value: cookie } = useCookie('user')
  const { cookies } = useCookies()

  const deviceId = deviceCookie.value
  const verifyCookie = useCookie('mcn')

  console.log('User from cookie:', cookie.user.role)

  console.log('User verify cookie:', cookie.user.role === '1')
  //check if user is admin skip otp
  if (cookie.user && cookie.user.role === '1') {
    ElMessage.success('Admin access granted')

    const cookieOptions = {
      secure: true,
      sameSite: 'Strict',
      path: '/',
      maxAge: 3600, // optional but recommended
    }
    cookies.remove('mcn')
    cookies.set('mcn', 'a8fcab8-9c1e-4a7c-9d0e-f2b3c4d5e6f', cookieOptions)
    const deviceCookie = useCookie('device_id')

    const deviceId = deviceCookie.value
    console.log('Redirect If Authenticated Middleware - Device ID:', deviceId)

    if (deviceId) {
      return navigateTo(`/portal/${deviceId}`)
    }  }

  if (verifyCookie.value === 'a8fcab8-9c1e-4a7c-9d0e-f2b3c4d5e6f') {
    return navigateTo(`/`)
  }
})

