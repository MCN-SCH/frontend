import BaseService from '~/services/BaseService.js'

let instance = null

class HomeService extends BaseService {
  constructor() {
    super('home')
  }

  static getInstance() {
    if (!instance) {
      instance = new HomeService()
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
}

export default HomeService
