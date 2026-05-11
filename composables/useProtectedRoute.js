import CryptoJS from 'crypto-js'

export const useProtectedRoute = () => {
  const config = useRuntimeConfig()

  const getLaravelTime = (timeZone = 'Asia/Seoul') => {
    const now = new Date()

    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
    }).formatToParts(now)

    const map = {}
    for (const p of parts) {
      if (p.type !== 'literal') map[p.type] = p.value
    }

    return `${map.year}-${map.month}-${map.day}-${map.hour}`
  }

  const generateRouteKey = () => {
    const key = config.public.routeSecret || 'default_route_key'
    const timezone = config.public.timezone || 'Asia/Seoul'
    const time = getLaravelTime(timezone)

    const hash = CryptoJS.HmacSHA256(time, key)

    return CryptoJS.enc.Base64.stringify(hash)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  // NEW: Verify signature from Laravel
  const verifyRouteSignature = (signatureToCheck) => {
    if (import.meta.env.DEV) return true // Match Laravel's dev bypass

    const expectedSignature = generateRouteKey()
    return signatureToCheck === expectedSignature
  }

  return {
    generateRouteKey,
    verifyRouteSignature,
  }
}
