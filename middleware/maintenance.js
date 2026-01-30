export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig()
  const isMaintenanceMode = `${config.public.maintenanceMode}` === 'true'

  console.log('Maintenance Mode Middleware :', `${config.public.maintenanceMode}`)
  // If in maintenance mode and not already on maintenance page
  if (isMaintenanceMode && to.path !== '/maintenance') {
    return navigateTo('/maintenance')
  }

  // If not in maintenance mode and trying to access maintenance page
  if (!isMaintenanceMode && to.path === '/maintenance') {
    return navigateTo('/')
  }
})
