import BaseService from '~/services/BaseService.js'

let instance = null

class MemberService extends BaseService {
  constructor() {
    super('member')
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

  //show
  async show(id) {
    return await this._get(`${this._prefix}/${id}`, {})
  }

  //update
  async update(id, payload = {}) {
    return await this._post(`${this._prefix}/${id}`, payload)
  }

  //reset password
  async resetPassword(id, payload = {}) {
    return await this._post(`${this._prefix}/reset-password/${id}`, payload)
  }
}

export default MemberService
