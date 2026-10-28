export default defineNuxtRouteMiddleware(() => {
  const deviceCookie = useCookie('device_id')
  const userCookie = useCookie('user')
  const verifyCookie = useCookie('mcn')

  const deviceId = deviceCookie.value
  const user = userCookie.value?.user

  // Check whether the user is authenticated as an admin.
  if (user && String(user.role) === '1') {
    // Skip OTP verification for admins.
    verifyCookie.value = 'a8fcab8-9c1e-4a7c-9d0e-f2b3c4d5e6f'

    console.log('Redirect If Authenticated Middleware - Device ID:', deviceId)

    if (deviceId) {
      return navigateTo(`/portal/${encodeURIComponent(deviceId)}`)
    }

    return
  }

  // Redirect users who already have the verification cookie.
  if (verifyCookie.value === 'a8fcab8-9c1e-4a7c-9d0e-f2b3c4d5e6f') {
    return navigateTo('/')
  }
})
