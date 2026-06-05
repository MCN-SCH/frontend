import { ElMessage } from 'element-plus'

export default defineNuxtRouteMiddleware(async () => {
  const { value: token } = useCookie('access_token')
  const { value: user } = useCookie('user')
  const verifyCookie = useCookie('mcn')

  if (!token) {
    return navigateTo('/portal')
  }

  if (!verifyCookie.value || verifyCookie.value !== 'a8fcab8-9c1e-4a7c-9d0e-5f2b3c4d5e6f') {
    ElMessage.error('Please Verify Access')
    return navigateTo('/portal/otp')
  }
})
