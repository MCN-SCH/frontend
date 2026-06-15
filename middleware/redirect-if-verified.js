export default defineNuxtRouteMiddleware(() => {
  const deviceCookie = useCookie('device_id')

  const deviceId = deviceCookie.value
  const verifyCookie = useCookie('mcn')

  if (verifyCookie.value === 'a8fcab8-9c1e-4a7c-9d0e-f2b3c4d5e6f') {
    return navigateTo(`/`)
  }
})

