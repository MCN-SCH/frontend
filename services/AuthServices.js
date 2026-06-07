import BaseService from './BaseService.js'

let instance = null
class AuthServices extends BaseService {
  constructor () {
    super('')
  }

  static getInstance () {
    if (!instance) {
      instance = new AuthServices()
    }
    return instance
  }

  async login (req) {
    return await this._post(`${this._prefix}/login`, req)
  }

  //register
  async register (req) {
    return await this._post(`${this._prefix}/register`, req)
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
}

export default AuthServices
