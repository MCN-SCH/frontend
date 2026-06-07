import { defineStore } from 'pinia'
import MemberService from '~/services/MemberService.js'

export const useMemberStore = defineStore('member', () => {
  const product = ref({})
  const service = MemberService.getInstance()

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

  //show
  const show = async (id) => {
    try {
      const { data } = await service.show(id)
      const products = data || {}
      product.value = products
      return products
    } catch (error) {
      ElMessage.error(error.message || 'Get failed')
      throw new Error(`Get failed: ${error.message || 'Unknown error'}`)
    }
  }

  //update
  const update = async (id, params) => {
    try {
      const { data } = await service.update(id, params)
      const products = data || {}
      product.value = products
      return products
    } catch (error) {
      throw new Error(`Update failed: ${error.message || 'Unknown error'}`)
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
    update,
    show,
    resetPassword
  }
})
