import { ref, onMounted, onUnmounted } from "vue"
import * as THREE from "three"

export function useBackgroundAnimation(canvasRef) {

  const currentSeason = ref("spring")

  let scene = null
  let camera = null
  let renderer = null
  let animationFrameId = null

  let time = 0
  let seasonCheckInterval = null
  let resizeTimeout = null

  let elements = {
    background: null,
    ribbons: null,
    particles: null,
    summerEmojis: null,
    clouds: null
  }

  // Preloaded PNG texture for spring (cherry blossom leaf)
  let springLeafTexture = null
  // Preloaded PNG texture for summer (hibiscus - 무궁화)
  let summerFlowerTexture = null

  /* -------------------------------------------------- */
  /* KOREAN SEASON COLORS (background, ribbons, etc.)   */
  /* -------------------------------------------------- */

  const koreanSeasonColors = {
    spring: {
      primary: 0x42a5f5,   // Sky blue
      secondary: 0x90caf9, // Soft blue
      accent: 0x66bb6a,    // Lotus leaf green
      bg: 0xe3f2fd
    },
    summer: {
      primary: 0x2196f3,   // Bright Korean summer sky blue
      secondary: 0x64b5f6, // Lighter sky blue
      accent: 0xff6b35,    // Hibiscus orange-red (무궁화)
      bg: 0xe1f5fe          // Fresh summer sky
    },
    fall: {
      primary: 0xff7043,
      secondary: 0xff8a65,
      accent: 0xffd54f,
      bg: 0xfff3e0
    },
    winter: {
      primary: 0x90caf9,
      secondary: 0xb3e5fc,
      accent: 0xffffff,
      bg: 0xe3f2fd
    }
  }

  /* -------------------------------------------------- */
  /* FLOWER COLORS (for particles)                      */
  /* -------------------------------------------------- */

  const flowerColors = {
    spring: 0xffb6c1,      // cherry blossom pink (벚꽃)
    summer: 0xff6b35,      // hibiscus orange-red (무궁화)
    fall: 0xff7043,        // maple orange
    winter: 0xe0f0ff       // icy blue-white
  }

  /* -------------------------------------------------- */
  /* SUMMER EMOJI LIST                                  */
  /* -------------------------------------------------- */

  const summerEmojis = [
    "🕶️", "🍦", "🏖️", "⚽", "🥤", "🍉", "🏄", "☀️",
    "🐚", "🩴", "🍹", "⛱️", "🌊", "🍧", "🏐", "🥥"
  ]

  /* -------------------------------------------------- */
  /* SAFE DISPOSAL                                      */
  /* -------------------------------------------------- */

  const disposeMaterial = (material) => {
    for (const key in material) {
      const value = material[key]
      if (value && value.isTexture) value.dispose()
    }
    material.dispose()
  }

  const disposeObject = (object) => {
    if (!object) return

    object.traverse((child) => {
      if (child.geometry) child.geometry.dispose()

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(disposeMaterial)
        } else {
          disposeMaterial(child.material)
        }
      }
    })
  }

  /* -------------------------------------------------- */
  /* CREATE TEXTURE FROM EMOJI                          */
  /* -------------------------------------------------- */

  const createEmojiTexture = (emoji, color = "#ffffff") => {
    const canvas = document.createElement("canvas")
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext("2d")

    ctx.clearRect(0, 0, 128, 128)

    // Set font and draw emoji
    ctx.font = "80px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiOne Color', 'Twemoji Mozilla', sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Add subtle glow effect
    ctx.shadowBlur = 10
    ctx.shadowColor = "rgba(255,255,255,0.5)"
    ctx.fillStyle = color
    ctx.fillText(emoji, 64, 64)

    // Reset shadow
    ctx.shadowBlur = 0

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter

    return texture
  }

  /* -------------------------------------------------- */
  /* SUMMER EMOJI PARTICLES                             */
  /* -------------------------------------------------- */

  const createSummerEmojis = () => {
    const group = new THREE.Group()
    // REDUCED: emojiCount reduced from 80 to 56 (30% reduction)
    const emojiCount = 56

    for (let i = 0; i < emojiCount; i++) {
      // Randomly select an emoji from the summer list
      const emoji = summerEmojis[Math.floor(Math.random() * summerEmojis.length)]

      // Random color variation for each emoji
      const colors = ["#ffffff", "#ffeb3b", "#ff9800", "#ff6b35", "#4caf50", "#2196f3"]
      const color = colors[Math.floor(Math.random() * colors.length)]

      const texture = createEmojiTexture(emoji, color)

      // Create sprite material
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      })

      const sprite = new THREE.Sprite(material)

      // Random position in 3D space
      sprite.position.x = (Math.random() - 0.5) * 60
      sprite.position.y = (Math.random() - 0.5) * 30
      sprite.position.z = (Math.random() - 0.5) * 15 - 5

      // Random scale
      const scale = 0.5 + Math.random() * 1
      sprite.scale.set(scale, scale, 1)

      // Store custom properties for animation
      sprite.userData = {
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02,
        speedZ: (Math.random() - 0.5) * 0.01,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        floatAmp: Math.random() * 0.5,
        floatSpeed: 0.5 + Math.random() * 1,
        originalY: sprite.position.y,
        emoji: emoji
      }

      group.add(sprite)
    }

    return group
  }

  /* -------------------------------------------------- */
  /* BACKGROUND                                         */
  /* -------------------------------------------------- */

  const createBackground = () => {

    const colors = koreanSeasonColors[currentSeason.value]

    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 1024

    const ctx = canvas.getContext("2d")

    const gradient = ctx.createLinearGradient(0,0,1024,1024)
    gradient.addColorStop(0, "#ffffff")
    gradient.addColorStop(1, "#" + colors.primary.toString(16))

    ctx.fillStyle = gradient
    ctx.fillRect(0,0,1024,1024)

    // Add summer-specific decorations if summer season
    if (currentSeason.value === "summer") {
      // Draw sun in corner
      ctx.save()
      ctx.shadowBlur = 20
      ctx.shadowColor = "rgba(255,200,0,0.5)"
      ctx.font = "80px 'Segoe UI Emoji', 'Apple Color Emoji'"
      ctx.fillStyle = "#ffeb3b"
      ctx.fillText("☀️", 850, 150)

      // Draw small summer elements scattered
      ctx.font = "40px 'Segoe UI Emoji', 'Apple Color Emoji'"
      ctx.fillStyle = "#ff9800"
      ctx.fillText("🏖️", 100, 900)
      ctx.fillText("🌊", 200, 950)
      ctx.fillStyle = "#4caf50"
      ctx.fillText("🍉", 900, 900)
      ctx.restore()
    }

    const texture = new THREE.CanvasTexture(canvas)

    const geometry = new THREE.PlaneGeometry(120,120)

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      depthWrite: false
    })

    const mesh = new THREE.Mesh(geometry,material)
    mesh.position.z = -20

    return mesh
  }

  /* -------------------------------------------------- */
  /* FLOWER TEXTURE GENERATOR – with PNG for spring & summer */
  /* -------------------------------------------------- */

  const createFlowerTexture = (season) => {
    // For spring, return the preloaded PNG texture if available
    if (season === "spring" && springLeafTexture) {
      return springLeafTexture
    }

    // For summer, return the preloaded hibiscus texture if available
    if (season === "summer" && summerFlowerTexture) {
      return summerFlowerTexture
    }

    // Otherwise generate canvas textures for all seasons (including fallback)
    const canvas = document.createElement("canvas")
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, 256, 256)

    // Draw solid white shape (tinted later by vertex colors)
    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2

    const cx = 128, cy = 128

    switch (season) {
      case "spring": {
        // Fallback hand‑drawn cherry blossom (used if PNG fails)
        ctx.save()
        ctx.translate(cx, cy)
        ctx.beginPath()
        ctx.moveTo(0, -50)
        ctx.quadraticCurveTo(-30, -15, 0, 20)
        ctx.quadraticCurveTo(30, -15, 0, -50)
        ctx.closePath()
        ctx.moveTo(-8, -50)
        ctx.lineTo(0, -62)
        ctx.lineTo(8, -50)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
        break
      }

      case "summer": {
        // Korean Hibiscus (무궁화) - Korea's national flower
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(1.1, 1.1)

        // Draw 5 petals (hibiscus has 5 petals)
        const petals = 5
        for (let i = 0; i < petals; i++) {
          const angle = (i * 2 * Math.PI) / petals - Math.PI / 2
          ctx.save()
          ctx.rotate(angle)

          // Large rounded petal
          ctx.beginPath()
          ctx.ellipse(0, 45, 30, 45, 0, 0, Math.PI * 2)
          ctx.fill()

          // Add petal vein
          ctx.beginPath()
          ctx.moveTo(0, 5)
          ctx.quadraticCurveTo(0, 30, 0, 80)
          ctx.lineWidth = 1.5
          ctx.strokeStyle = "#ffffff"
          ctx.stroke()

          ctx.restore()
        }

        // Center of the flower
        ctx.beginPath()
        ctx.arc(0, 0, 18, 0, Math.PI * 2)
        ctx.fill()

        // Center detail (stamen)
        ctx.beginPath()
        ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2)
        ctx.fillStyle = "#ffeb3b"
        ctx.fill()

        // Small dots around center
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8
          const x = 12 * Math.cos(angle)
          const y = 12 * Math.sin(angle)
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fillStyle = "#ffeb3b"
          ctx.fill()
        }

        ctx.restore()
        break
      }

      case "fall": {
        // Accurate maple leaf with 5 lobes and serrated edges
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(1.2, 1.2)
        ctx.beginPath()

        const lobes = 5
        const outerR = 45
        const innerR = 18

        for (let i = 0; i < lobes * 2; i++) {
          const radius = i % 2 === 0 ? outerR : innerR
          const angle = (i * Math.PI) / lobes - Math.PI / 2
          const x = radius * Math.cos(angle)
          const y = radius * Math.sin(angle)

          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)

          // Serrations on outer lobes
          if (i % 2 === 0 && i < lobes * 2 - 1) {
            const nextAngle = ((i + 1) * Math.PI) / lobes - Math.PI / 2
            const nextX = innerR * Math.cos(nextAngle)
            const nextY = innerR * Math.sin(nextAngle)
            ctx.lineTo(x + (nextX - x) * 0.3, y + (nextY - y) * 0.3)
            ctx.lineTo(nextX - (nextX - x) * 0.3, nextY - (nextY - y) * 0.3)
          }
        }
        ctx.closePath()
        ctx.fill()

        // Veins
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        for (let i = 0; i < lobes; i++) {
          const angle = (i * 2 * Math.PI) / lobes - Math.PI / 2
          const x = 38 * Math.cos(angle)
          const y = 38 * Math.sin(angle)
          ctx.moveTo(cx - 128, cy - 128)
          ctx.lineTo(cx - 128 + x, cy - 128 + y)
        }
        ctx.stroke()
        ctx.restore()
        break
      }

      case "winter": {
        // Snow crystal – six-pointed star with side branches
        ctx.save()
        ctx.translate(cx, cy)
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3
          ctx.save()
          ctx.rotate(angle)
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(0, 58)
          ctx.lineTo(8, 48)
          ctx.lineTo(0, 58)
          ctx.lineTo(-8, 48)
          ctx.fill()
          // side branches
          ctx.beginPath()
          ctx.moveTo(0, 30)
          ctx.lineTo(14, 40)
          ctx.lineTo(0, 30)
          ctx.lineTo(-14, 40)
          ctx.fill()
          ctx.restore()
        }
        ctx.beginPath()
        ctx.arc(0, 0, 14, 0, 2 * Math.PI)
        ctx.fill()
        ctx.restore()
        break
      }
    }

    return new THREE.CanvasTexture(canvas)
  }

  /* -------------------------------------------------- */
  /* PARTICLES                                          */
  /* -------------------------------------------------- */

  const createParticles = () => {
    // REDUCED: particle count reduced from 500 to 350 (30% reduction)
    const count = 350
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const flowerBaseColor = new THREE.Color(flowerColors[currentSeason.value])

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20

      const colorVar = 0.15
      const r = Math.max(0, Math.min(1, flowerBaseColor.r + (Math.random() - 0.5) * colorVar))
      const g = Math.max(0, Math.min(1, flowerBaseColor.g + (Math.random() - 0.5) * colorVar))
      const b = Math.max(0, Math.min(1, flowerBaseColor.b + (Math.random() - 0.5) * colorVar))

      colors[i * 3] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.attributes.position.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const texture = createFlowerTexture(currentSeason.value)
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter

    // Adjust opacity based on season
    let opacity = 1.0
    if (currentSeason.value === 'spring') opacity = 0.5
    if (currentSeason.value === 'summer') opacity = 0.7

    const material = new THREE.PointsMaterial({
      size: 2.0,
      map: texture,
      transparent: true,
      opacity: opacity,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexColors: true,
      alphaTest: 0.05
    })

    return new THREE.Points(geometry, material)
  }

  /* -------------------------------------------------- */
  /* CLOUDS                                             */
  /* -------------------------------------------------- */

  const createClouds = () => {

    const group = new THREE.Group()

    for (let i=0;i<8;i++) { // Increased cloud count for summer

      const geo = new THREE.CircleGeometry(1.5,20)

      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: currentSeason.value === 'summer' ? 0.15 : 0.08,
        transparent: true
      })

      const mesh = new THREE.Mesh(geo,mat)

      mesh.position.set(
        (Math.random()-0.5)*35,
        Math.random()*12,
        -12
      )

      // Random scale for variety
      const scale = 0.8 + Math.random() * 0.7
      mesh.scale.set(scale, scale, 1)

      group.add(mesh)

    }

    return group
  }

  /* -------------------------------------------------- */
  /* SCENE INIT                                         */
  /* -------------------------------------------------- */

  const initScene = () => {

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth/window.innerHeight,
      0.1,
      1000
    )

    camera.position.set(0,2,25)

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      powerPreference: "high-performance",
      precision: "mediump",
      alpha: true
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    buildScene()

  }

  /* -------------------------------------------------- */
  /* BUILD SCENE                                        */
  /* -------------------------------------------------- */

  const buildScene = () => {
    // Ensure scene exists before adding elements
    if (!scene) return

    elements.background = createBackground()
    elements.particles = createParticles()
    elements.clouds = createClouds()

    // Add all elements to scene
    scene.add(elements.background)
    scene.add(elements.particles)
    scene.add(elements.clouds)

    // Only add summer emojis during summer season
    if (currentSeason.value === 'summer') {
      elements.summerEmojis = createSummerEmojis()
      scene.add(elements.summerEmojis)
    }
  }

  /* -------------------------------------------------- */
  /* ANIMATION LOOP                                     */
  /* -------------------------------------------------- */

  let lastFrame = 0
  const FPS = 60
  const interval = 1000/FPS

  const animate = (now=0) => {

    animationFrameId = requestAnimationFrame(animate)

    const delta = now-lastFrame
    if (delta<interval) return

    lastFrame = now-(delta%interval)

    time += 0.003

    if (camera) {
      camera.position.x = Math.sin(time*0.2)*2
    }

    if (elements.ribbons)
      elements.ribbons.rotation.y += 0.0008

    // Cloud animation
    if (elements.clouds) {
      elements.clouds.children.forEach((c)=>{
        c.position.x += currentSeason.value === 'summer' ? 0.015 : 0.01
        if (c.position.x>25) c.position.x = -25
      })
    }

    // Particle animation
    if (elements.particles && elements.particles.geometry && elements.particles.geometry.attributes.position) {
      const positions = elements.particles.geometry.attributes.position.array
      for (let i=0;i<positions.length;i+=9) {
        positions[i+1] += Math.sin(time)*0.01
      }
      elements.particles.geometry.attributes.position.needsUpdate=true
    }

    // Summer emoji animation
    if (elements.summerEmojis && currentSeason.value === 'summer') {
      elements.summerEmojis.children.forEach((sprite, index) => {
        // Floating motion
        sprite.position.y += Math.sin(time * sprite.userData.floatSpeed + index) * 0.005
        sprite.position.x += sprite.userData.speedX
        sprite.position.z += sprite.userData.speedZ

        // Gentle rotation
        if (sprite.material) {
          sprite.material.rotation += sprite.userData.rotationSpeed
        }

        // Wrap around edges
        if (sprite.position.x > 35) sprite.position.x = -35
        if (sprite.position.x < -35) sprite.position.x = 35
        if (sprite.position.y > 20) sprite.position.y = -20
        if (sprite.position.y < -20) sprite.position.y = 20

        // Pulsing scale
        const scale = 0.5 + Math.sin(time * 2 + index) * 0.1
        sprite.scale.set(scale, scale, 1)
      })
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }

  /* -------------------------------------------------- */
  /* RESIZE                                             */
  /* -------------------------------------------------- */

  const handleResize = () => {

    clearTimeout(resizeTimeout)

    resizeTimeout = setTimeout(()=>{

      if (!camera || !renderer) return

      camera.aspect = window.innerWidth/window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      )

    },150)

  }

  /* -------------------------------------------------- */
  /* SEASON UPDATE                                      */
  /* -------------------------------------------------- */

  const rebuildScene = () => {

    if (!scene) return

    Object.keys(elements).forEach((key)=>{
      const el = elements[key]

      if (el) {
        scene.remove(el)
        disposeObject(el)
        elements[key] = null
      }
    })

    buildScene()

  }

  const setSeason = (season) => {

    if (!koreanSeasonColors[season]) return

    currentSeason.value = season
    rebuildScene()

  }

  /* -------------------------------------------------- */
  /* SEASON AUTO CHECK                                  */
  /* -------------------------------------------------- */

  const getCurrentSeason = () => {

    const m = new Date().getMonth()

    if (m>=2 && m<=4) return "spring"
    if (m>=5 && m<=7) return "summer"
    if (m>=8 && m<=10) return "fall"
    return "winter"

  }

  const checkSeasonChange = () => {

    const newSeason = getCurrentSeason()

    if (newSeason !== currentSeason.value) {
      setSeason(newSeason)
    }

  }

  /* -------------------------------------------------- */
  /* START / STOP                                       */
  /* -------------------------------------------------- */

  const startAnimation = async () => {
    if (!canvasRef.value) {
      setTimeout(startAnimation, 100)
      return
    }

    // Preload the cherry blossom PNG from local assets (spring)
    try {
      const springImgModule = await import('~/assets/image/cherry-blossom.png')
      const springLeafUrl = springImgModule.default || springImgModule
      springLeafTexture = await new THREE.TextureLoader().loadAsync(springLeafUrl)
      springLeafTexture.minFilter = THREE.LinearMipmapLinearFilter
      springLeafTexture.magFilter = THREE.LinearFilter
    } catch (error) {
      console.warn('Failed to load spring PNG, using fallback.', error)
      springLeafTexture = null
    }

    // Preload the hibiscus PNG from local assets (summer - 무궁화)
    try {
      const summerImgModule = await import('~/assets/image/hibiscus.png')
      const summerFlowerUrl = summerImgModule.default || summerImgModule
      summerFlowerTexture = await new THREE.TextureLoader().loadAsync(summerFlowerUrl)
      summerFlowerTexture.minFilter = THREE.LinearMipmapLinearFilter
      summerFlowerTexture.magFilter = THREE.LinearFilter
    } catch (error) {
      console.warn('Failed to load summer hibiscus PNG, using fallback.', error)
      summerFlowerTexture = null
    }

    initScene()
    animate()

    window.addEventListener('resize', handleResize)

    seasonCheckInterval = setInterval(checkSeasonChange, 3600000)
  }

  const stopAnimation = () => {

    cancelAnimationFrame(animationFrameId)

    clearInterval(seasonCheckInterval)

    window.removeEventListener("resize",handleResize)

    Object.values(elements).forEach(disposeObject)

    if (renderer) {

      renderer.renderLists.dispose()
      renderer.dispose()
      renderer.forceContextLoss()

    }

    scene = null
    camera = null
    renderer = null

  }

  /* -------------------------------------------------- */

  onMounted(startAnimation)
  onUnmounted(stopAnimation)

  return {
    currentSeason,
    setSeason
  }

}
