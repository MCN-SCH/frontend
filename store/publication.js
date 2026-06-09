import { defineStore } from 'pinia'
import PublicationService from '~/services/PublicationService.js'

export const usePublicationStore = defineStore('publication', () => {
  const product = ref({})
  const service = PublicationService.getInstance()

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

  //store
  const register = async (params) => {
    try {
      const { data } = await service.store(params)
      const products = data || {}
      product.value = products
      return products
    } catch (error) {
      ElMessage.error(error.message || 'Create failed')
      throw new Error(`Create failed: ${error.message || 'Unknown error'}`)
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

  //getFilterOptions
  const getFilterOptions = async () => {
    try {
      const { data } = await service.filterOptions()
      return data || {}
    } catch (error) {
      ElMessage.error(error.message || 'Get filter options failed')
      throw new Error(
        `Get filter options failed: ${error.message || 'Unknown error'}`,
      )
    }
  }

  //delete
  const detelePub = async (id) => {
    try {
      await service.delete(id)
      ElMessage.success('Delete successful')
    } catch (error) {
      ElMessage.error(error.message || 'Delete failed')
      throw new Error(`Delete failed: ${error.message || 'Unknown error'}`)
    }
  }

  return {
    product: computed(() => product.value),
    index,
    update,
    show,
    register,
    getFilterOptions,
    detelePub
  }
})
