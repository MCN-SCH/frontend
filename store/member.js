import { defineStore } from 'pinia'
import MemberService from '~/services/Services.js'

export const useMemberStore = defineStore('member', () => {
  const product = ref({})
  const service = MemberService.getInstance()

  const index = async (params) => {
    try {
      console.log('Member Store - Index Params:', params)
      const { data } = await service.member(params)
      const products = data || {}
      product.value = products
      return products
    } catch (error) {
      ElMessage.error(error.message || 'Get failed')
      throw new Error(`Get failed: ${error.message || 'Unknown error'}`)
    }
  }

  return {
    product: computed(() => product.value),
    index
  }
})
