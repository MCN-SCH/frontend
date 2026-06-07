import BaseService from '~/services/BaseService.js'

let instance = null
class DashboardService extends BaseService {
  constructor () {
    super('dashboard')
  }

  static getInstance () {
    if (!instance) {
      instance = new DashboardService()
    }
    return instance
  }

  //dashboard
  async dashboard (params) {
    return await this._get(`${this._prefix}`, params)
  }
}

export default DashboardService
