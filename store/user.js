import { defineStore } from 'pinia'
import UserService from '~/services/UserService.js'

export const useUserStore = defineStore('user', () => {
  const product = ref({})
  const service = UserService.getInstance()

  const index = async (params) => {
    try {
      const { data } = await service.index(params)
      const products = data || {}
      product.value = products
      return products
    } catch (error) {
      ElMessage.error(error.message || 'Get failed')
      throw new Error(`Get failed: ${error.message || 'Unknown error'}`)
    }
  }

  //destroy
  const destroy = async (id) => {
    try {
      const { data } = await service.destroy(id)
      const products = data || {}
      product.value = products
      return products

    } catch (error) {
      ElMessage.error(error.message || 'Delete failed')
      throw new Error(`Delete failed: ${error.message || 'Unknown error'}`)
    }
  }

  //reset password
  const resetPassword = async (id, params) => {
    try {
      const { data } = await service.resetPassword(id, params)
      const products = data || {}
      product.value = products
      return products
    } catch (error) {
      throw new Error(`Reset password failed: ${error.message || 'Unknown error'}`)
    }
  }

  return {
    product: computed(() => product.value),
    index,
    destroy,
    resetPassword
  }
})
