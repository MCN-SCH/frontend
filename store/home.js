import { defineStore } from 'pinia'
import HomeService from '~/services/HomeService.js'

export const useHomeStore = defineStore('home', () => {
  const product = ref({})
  const service = HomeService.getInstance()

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

  return {
    product: computed(() => product.value),
    index
  }
})
