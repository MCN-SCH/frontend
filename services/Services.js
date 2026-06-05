import BaseService from './BaseService'

let instance = null
class Services extends BaseService {
  constructor () {
    super('')
  }

  static getInstance () {
    if (!instance) {
      instance = new Services()
    }
    return instance
  }

  async login (req) {
    return await this._post(`${this._prefix}/login`, req)
  }

  async getMe () {
    return await this._get(`${this._prefix}/me`)
  }

  async logout (req) {
    return await this._post(`${this._prefix}/logout`, req)
  }

  async sendCode () {
    return await this._get(`${this._prefix}/send-code`)
  }

  async verifyCode (req) {
    return await this._post(`${this._prefix}/verify`, req)
  }

  //change-password
  async changePassword (req) {
    return await this._post(`${this._prefix}/change-password`, req)
  }

  //refresh token
  async refreshToken (req) {
    return await this._post(`${this._prefix}/refresh`, req)
  }

  //dashboard
  async dashboard (params) {
    return await this._get(`${this._prefix}/dashboard`, params)
  }

  //Member
  async member (payload = {}) {
    const filteredParams = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value != null),
    )
    const queryParams = new URLSearchParams(filteredParams).toString()

    return await this._get(`${this._prefix}/member${queryParams}`, {})
    }
}

export default Services
