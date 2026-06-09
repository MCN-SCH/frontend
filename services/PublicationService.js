import BaseService from '~/services/BaseService.js'

let instance = null

class PublicationService extends BaseService {
  constructor() {
    super('publication')
  }

  static getInstance() {
    if (!instance) {
      instance = new PublicationService()
    }
    return instance
  }

  //Member
  async index(payload = {}) {
    const filteredParams = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value != null),
    )
    const queryParams = new URLSearchParams(filteredParams).toString()

    return await this._get(`${this._prefix}?${queryParams}`, {})
  }

  //getFilterOptions
  async filterOptions() {
    return await this._get(`${this._prefix}/filter-options`, {})
  }

  //store
  async store(payload = {}) {
    return await this._post(`${this._prefix}`, payload)
  }

  //show
  async show(id) {
    return await this._get(`${this._prefix}/${id}`, {})
  }

  //update
  async update(id, payload = {}) {
    return await this._post(`${this._prefix}/${id}`, payload)
  }

  //delete
  async delete(id) {
    return await this._delete(`${this._prefix}/${id}`, {})
  }
}

export default PublicationService
