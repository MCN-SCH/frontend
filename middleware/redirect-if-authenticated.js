export default defineNuxtRouteMiddleware(() => {
  const deviceCookie = useCookie('device_id')

  const deviceId = deviceCookie.value
  console.log('Redirect If Authenticated Middleware - Device ID:', deviceId)

  if (deviceId) {
    return navigateTo(`/portal/${deviceId}`)
  }
})

