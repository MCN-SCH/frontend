export default defineNuxtRouteMiddleware((to) => {
  const deviceCookie = useCookie('device_id')

  const deviceId = deviceCookie.value

  console.log('device:', deviceId)

  if (to.path === '/portal') {
    //if no user redirect to login
    if (!deviceId) {
      return navigateTo('/portal')
    }


    navigateTo(`/portal/${deviceId}`)
    // if (user.role === 1) {
    //   return navigateTo('/admin/dashboard')
    // } else if (user.role === 2) {
    //   return navigateTo('/borrower/dashboard')
    // }
  }
})
