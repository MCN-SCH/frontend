import BaseService from '~/services/BaseService.js'

let instance = null

class MemberService extends BaseService {
  constructor() {
    super('user')
  }

  static getInstance() {
    if (!instance) {
      instance = new MemberService()
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

  //register
  async register (req) {
    return await this._post(`${this._prefix}/`, req)
  }

  //destroy
  async destroy(id) {
    return await this._delete(`${this._prefix}/${id}`)
  }

  //reset password
  async resetPassword(id, payload = {}) {
    return await this._post(`${this._prefix}/change-password/${id}`, payload)
  }
}

export default MemberService
