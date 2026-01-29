import { ref, onMounted } from 'vue'

export function useUsbAuth() {
  const supported = ref(false)
  const logs = ref([])

  const status = ref('idle')
  const selectedDeviceName = ref(null)
  const pinModalVisible = ref(false)

  const devices = new Map()

  const GOOD_SERIAL = process.env.GOOD_SERIAL // sha256("password")

  const GOOD_PIN = '1234'

  const log = (msg) => logs.value.push(msg)

  const getLabel = (device) =>
    `${device.manufacturerName || 'Unknown'} — ${
      device.productName || 'Device Token'
    }`

  const sha256 = async (text) => {
    const buffer = new TextEncoder().encode(text)
    const hash = await crypto.subtle.digest('SHA-256', buffer)
    return [...new Uint8Array(hash)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const verifyDevice = async (device) => {
    status.value = 'verifying'

    await device.open().catch(() => {})
    const uid = `${device.productId}${device.serialNumber || ''}${device.vendorId}`
    const hash = await sha256(uid)

    const ok = hash === GOOD_SERIAL

    status.value = 'authorized'
    selectedDeviceName.value = getLabel(device)
    log(`✔ Authorized device: ${getLabel(device)}`)
    //hash
    log(`🔑 Device hash: ${hash}`)

    pinModalVisible.value = true // show PIN modal
  }

  const verifyPin = (pin) => {
    if (pin === GOOD_PIN) {
      status.value = 'login-success'
      pinModalVisible.value = false
      log('🎉 Login successful!')
      return true
    } else {
      log('❌ Incorrect PIN')
      return false
    }
  }

  const requestDevice = async () => {
    try {
      const device = await navigator.usb.requestDevice({ filters: [{}] })
      log(`📥 Selected device: ${getLabel(device)}`)
      await verifyDevice(device)
    } catch {
      log('❌ Device selection canceled')
    }
  }

  const setupEvents = () => {
    navigator.usb.addEventListener('connect', async ({ device }) => {
      log(`🔌 Connected: ${getLabel(device)}`)
      await verifyDevice(device)
    })

    navigator.usb.addEventListener('disconnect', () => {
      log(`❌ Device disconnected`)
      status.value = 'idle'
    })
  }

  onMounted(() => {
    supported.value = !!navigator.usb
    if (supported.value) setupEvents()
    else log('WebDevice not supported')
  })

  return {
    logs,
    supported,
    status,
    selectedDeviceName,
    pinModalVisible,
    requestDevice,
    verifyPin,
  }
}
