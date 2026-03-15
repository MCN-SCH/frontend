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
    clouds: null
  }

  // Preloaded PNG texture for spring (cherry blossom leaf)
  let springLeafTexture = null

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
      primary: 0x4caf50,
      secondary: 0x81c784,
      accent: 0xffd54f,
      bg: 0xe8f5e9
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
  /* LEAF COLORS (for particles)                        */
  /* -------------------------------------------------- */

  const leafColors = {
    spring: 0xffb6c1,      // cherry blossom pink
    summer: 0x66bb6a,      // lotus leaf green
    fall: 0xff7043,        // maple orange
    winter: 0xe0f0ff       // icy blue-white
  }

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

    const texture = new THREE.CanvasTexture(canvas)

    const geometry = new THREE.PlaneGeometry(120,120)

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      depthWrite:false
    })

    const mesh = new THREE.Mesh(geometry,material)
    mesh.position.z = -20

    return mesh
  }

  /* -------------------------------------------------- */
  /* LEAF TEXTURE GENERATOR – with PNG for spring       */
  /* -------------------------------------------------- */

  const createLeafTexture = (season) => {
    // For spring, return the preloaded PNG texture if available
    if (season === "spring" && springLeafTexture) {
      return springLeafTexture
    }

    // Otherwise generate canvas textures for all seasons (including fallback for spring)
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
        // Lotus leaf (연잎) – large round leaf with stem and veins
        ctx.save()
        ctx.translate(cx, cy)

        // Main leaf (broad, slightly irregular circle)
        ctx.beginPath()
        ctx.ellipse(0, -10, 45, 40, 0, 0, Math.PI * 2)
        ctx.fill()

        // Stem (curved)
        ctx.beginPath()
        ctx.moveTo(-5, 30)
        ctx.quadraticCurveTo(10, 50, 20, 70)
        ctx.lineWidth = 8
        ctx.strokeStyle = "#ffffff"
        ctx.stroke()

        // Veins (radiating lines)
        ctx.globalAlpha = 0.4
        ctx.beginPath()
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI / 4) - 0.5
          const x = 30 * Math.cos(angle)
          const y = 20 + 30 * Math.sin(angle)
          ctx.moveTo(0, -10)
          ctx.lineTo(x, y)
        }
        ctx.stroke()
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
    const count = 500
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const leafBaseColor = new THREE.Color(leafColors[currentSeason.value])

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20

      const colorVar = 0.15
      const r = Math.max(0, Math.min(1, leafBaseColor.r + (Math.random() - 0.5) * colorVar))
      const g = Math.max(0, Math.min(1, leafBaseColor.g + (Math.random() - 0.5) * colorVar))
      const b = Math.max(0, Math.min(1, leafBaseColor.b + (Math.random() - 0.5) * colorVar))

      colors[i * 3] = r
      colors[i * 3 + 1] = g
      colors[i * 3 + 2] = b
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.attributes.position.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const texture = createLeafTexture(currentSeason.value)
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter

    // 👇 Set opacity to 0.5 for spring, otherwise 1.0
    const material = new THREE.PointsMaterial({
      size: 2.0,
      map: texture,
      transparent: true,
      opacity: currentSeason.value === 'spring' ? 0.5 : 1.0,
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

    for (let i=0;i<5;i++) {

      const geo = new THREE.CircleGeometry(1,20)

      const mat = new THREE.MeshBasicMaterial({
        color:0xffffff,
        opacity:0.08,
        transparent:true
      })

      const mesh = new THREE.Mesh(geo,mat)

      mesh.position.set(
        (Math.random()-0.5)*30,
        Math.random()*10,
        -10
      )

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
      antialias:true,
      powerPreference:"high-performance",
      precision:"mediump"
    })

    renderer.setSize(window.innerWidth,window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

    buildScene()

  }

  /* -------------------------------------------------- */
  /* BUILD SCENE                                        */
  /* -------------------------------------------------- */

  const buildScene = () => {

    elements.background = createBackground()
    // elements.ribbons = createRibbons()
    elements.particles = createParticles()
    elements.clouds = createClouds()

    scene.add(
      elements.background,
      elements.particles,
      elements.clouds
    )

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

    camera.position.x = Math.sin(time*0.2)*2

    if (elements.ribbons)
      elements.ribbons.rotation.y += 0.0008

    if (elements.clouds) {
      elements.clouds.children.forEach((c)=>{
        c.position.x += 0.01
        if (c.position.x>20) c.position.x = -20
      })
    }

    if (elements.particles) {

      const positions =
        elements.particles.geometry.attributes.position.array

      for (let i=0;i<positions.length;i+=9) {
        positions[i+1] += Math.sin(time)*0.01
      }

      elements.particles.geometry.attributes.position.needsUpdate=true

    }

    renderer.render(scene,camera)

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

    // Preload the cherry blossom PNG from local assets
    const loader = new THREE.TextureLoader()
    // Dynamically import the image to get its public URL (Nuxt 3)
    try {
      const imgModule = await import('~/assets/image/cherry-blossom.png')
      const springLeafUrl = imgModule.default || imgModule
      //opacity is handled in the material, so we just load the PNG as a texture without modification
      springLeafTexture = await new THREE.TextureLoader().loadAsync(springLeafUrl)
      springLeafTexture.minFilter = THREE.LinearMipmapLinearFilter
      springLeafTexture.magFilter = THREE.LinearFilter
    } catch (error) {
      console.warn('Failed to load spring PNG via import, using fallback.', error)
      springLeafTexture = null
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
