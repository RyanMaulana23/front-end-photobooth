import React, { useState, useEffect, useRef } from 'react'
import layout1Image from './frame-layout/layout dsc 1.png'
import layout2Image from './frame-layout/layout dsc 2.png'
import layout3Image from './frame-layout/layout dsc 3.png'
import layout4Image from './frame-layout/layout dsc 4.png'
import layout5Image from './frame-layout/layout dsc 5.png'

const STEPS = {
  TEMPLATE: 1,
  PHOTO_CAPTURE: 2,
  PREVIEW: 3,
  EDIT_DECISION: 4,
  INPUT_DATA: 5,
  PROCESSING: 6,
  EMAIL_SUCCESS: 7,
  PRINT_HARDCOPY: 8,
  THANK_YOU: 9,
}

const LAYOUT_CONFIGS = {
  layout1: {
    name: 'Watercolor Owl (2x2)',
    image: layout1Image,
    width: 788,
    height: 1182,
    whitenessThreshold: 200,
    slots: [
      { x: 50,  y: 65,  w: 328, h: 452 },  // Top-Left
      { x: 410, y: 65,  w: 328, h: 452 },  // Top-Right
      { x: 50,  y: 559, w: 328, h: 452 },  // Bottom-Left
      { x: 410, y: 559, w: 328, h: 452 }   // Bottom-Right
    ]
  },
  layout2: {
    name: 'Cloud Kitty (1x4 Strip)',
    image: layout2Image,
    width: 473,
    height: 1340,
    whitenessThreshold: 253,
    slots: [
      { x: 49, y: 73,  w: 376, h: 255 },
      { x: 49, y: 359, w: 376, h: 255 },
      { x: 49, y: 645, w: 376, h: 255 },
      { x: 49, y: 931, w: 376, h: 255 }
    ]
  },
  layout3: {
    name: 'Space Astronaut (1x3 Strip)',
    image: layout3Image,
    width: 394,
    height: 1182,
    whitenessThreshold: 200,
    slots: [
      { x: 55, y: 103, w: 284, h: 284 },
      { x: 55, y: 467, w: 284, h: 284 },
      { x: 55, y: 831, w: 284, h: 284 }
    ]
  },
  layout4: {
    name: 'Good Vibes (1x3 Shapes)',
    image: layout4Image,
    width: 841,
    height: 1870,
    whitenessThreshold: 200,
    slots: [
      { x: 92,  y: 47,   w: 632, h: 478 },
      { x: 102, y: 560,  w: 638, h: 403 },
      { x: 99,  y: 1005, w: 648, h: 469 }
    ],
    protectionZones: [
      { x: 600, y: 860, w: 241, h: 140 }  // Daisy flower (expanded to protect all white petals)
    ]
  },
  layout5: {
    name: 'Moment Captured (1x2 Strip)',
    image: layout5Image,
    width: 724,
    height: 2172,
    whitenessThreshold: 200,
    slots: [
      { x: 80, y: 80,  w: 564, h: 705 },
      { x: 80, y: 839, w: 564, h: 705 }
    ]
  }
}

const FILTERS = [
  { id: 'vintage', label: 'Vintage', css: 'sepia(0.25) saturate(1.4) contrast(1.0) brightness(1.15) hue-rotate(-25deg)', canvasFilter: 'sepia(0.25) saturate(1.4) contrast(1.0) brightness(1.15) hue-rotate(-25deg)', previewType: 'color', previewBg: 'linear-gradient(to bottom, #f472b6, #fb7185)' },
  { id: 'grayscale', label: 'Grayscale', css: 'grayscale(1) contrast(1.05) brightness(1.05)', canvasFilter: 'grayscale(1) contrast(1.05) brightness(1.05)', previewType: 'color', previewBg: '#cbd5e1' },
  { id: 'smooth', label: 'Smooth', css: 'contrast(0.9) brightness(1.08) saturate(0.9) blur(0.2px)', canvasFilter: 'contrast(0.9) brightness(1.08) saturate(0.9)', previewType: 'color', previewBg: '#fbcfe8' },
  { id: 'bw', label: 'B&W', css: 'grayscale(1) contrast(1.5) brightness(0.85)', canvasFilter: 'grayscale(1) contrast(1.5) brightness(0.85)', previewType: 'color', previewBg: '#334155' },
  { id: 'cyber', label: 'Cyber', css: 'sepia(0.65) saturate(0.8) contrast(1.1) brightness(1.05) hue-rotate(5deg)', canvasFilter: 'sepia(0.65) saturate(0.8) contrast(1.1) brightness(1.05) hue-rotate(5deg)', previewType: 'color', previewBg: '#e2d3b4' },
  { id: 'none', label: 'Normal', css: 'none', canvasFilter: 'none', previewType: 'color', previewBg: '#ec4899' },
  { id: 'bittersweet', label: 'Bittersweet', css: 'contrast(1.15) sepia(0.2) saturate(0.95) brightness(0.96) hue-rotate(-10deg)', canvasFilter: 'contrast(1.15) sepia(0.2) saturate(0.95) brightness(0.96) hue-rotate(-10deg)', previewType: 'image' },
  { id: 'ogvintage', label: 'OG Vintage', css: 'grayscale(0.7) sepia(0.4) contrast(1.2) brightness(0.9)', canvasFilter: 'grayscale(0.7) sepia(0.4) contrast(1.2) brightness(0.9)', previewType: 'image' },
  { id: 'fresh', label: 'Fresh', css: 'contrast(1.1) saturate(1.2) hue-rotate(30deg) brightness(0.98)', canvasFilter: 'contrast(1.1) saturate(1.2) hue-rotate(30deg) brightness(0.98)', previewType: 'image' },
  { id: 'citrus', label: 'Citrus', css: 'saturate(1.6) hue-rotate(-10deg) contrast(1.05) sepia(0.15)', canvasFilter: 'saturate(1.6) hue-rotate(-10deg) contrast(1.05) sepia(0.15)', previewType: 'image' },
  { id: 'year2015', label: '2015', css: 'contrast(0.9) brightness(0.98) saturate(1.15) hue-rotate(-25deg) sepia(0.1)', canvasFilter: 'contrast(0.9) brightness(0.98) saturate(1.15) hue-rotate(-25deg) sepia(0.1)', previewType: 'image' },
  { id: 'focus', label: 'Focus', css: 'contrast(1.35) saturate(1.1) brightness(0.92)', canvasFilter: 'contrast(1.35) saturate(1.1) brightness(0.92)', previewType: 'image' },
  { id: 'candy', label: 'Candy', css: 'saturate(1.4) hue-rotate(330deg) contrast(1.08) brightness(1.02)', canvasFilter: 'saturate(1.4) hue-rotate(330deg) contrast(1.08) brightness(1.02)', previewType: 'image' },
  { id: 'eighties', label: '80s', css: 'sepia(0.55) saturate(1.45) contrast(0.95) brightness(0.95) hue-rotate(-15deg)', canvasFilter: 'sepia(0.55) saturate(1.45) contrast(0.95) brightness(0.95) hue-rotate(-15deg)', previewType: 'image' },
  { id: 'nostalgia', label: 'Nostalgia', css: 'sepia(0.35) saturate(0.7) contrast(0.95) brightness(1.02) hue-rotate(5deg)', canvasFilter: 'sepia(0.35) saturate(0.7) contrast(0.95) brightness(1.02) hue-rotate(5deg)', previewType: 'image' }
]

// Synth shutter sound using Web Audio API
const playShutterSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    
    // Noise source for the mechanical click
    const bufferSize = ctx.sampleRate * 0.1 // 100ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1000
    
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.5, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
    
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    // Add a high-pitch whistle for the flash charge/shutter snap
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1500, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1)
    
    oscGain.gain.setValueAtTime(0.15, ctx.currentTime)
    oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    
    osc.connect(oscGain)
    oscGain.connect(ctx.destination)
    
    noise.start()
    osc.start()
    noise.stop(ctx.currentTime + 0.1)
    osc.stop(ctx.currentTime + 0.1)
  } catch (e) {
    console.error('AudioContext shutter sound failed:', e)
  }
}

export default function Photobooth({ onHome }) {
  const [step, setStep] = useState(STEPS.TEMPLATE)
  const [template, setTemplate] = useState('layout1') // 'layout1' | 'layout2' | 'layout3'
  const getMaxPhotos = (t) => {
    if (t === 'layout3' || t === 'layout4') return 3
    if (t === 'layout5') return 2
    return 4
  }
  const getCameraAspectStyle = (t) => {
    if (t === 'layout1') return { aspectRatio: '328/452', maxWidth: '320px' }
    if (t === 'layout2') return { aspectRatio: '376/255', maxWidth: '440px' }
    if (t === 'layout3') return { aspectRatio: '284/284', maxWidth: '360px' }
    if (t === 'layout4') return { aspectRatio: '640/440', maxWidth: '440px' }
    return { aspectRatio: '564/705', maxWidth: '320px' } // layout5
  }
  const getSlotAspectClass = (t) => {
    if (t === 'layout1') return 'aspect-[328/452] w-40 object-cover'
    if (t === 'layout2') return 'aspect-[376/255] w-48 object-cover'
    if (t === 'layout3') return 'aspect-[284/284] w-40 object-cover'
    if (t === 'layout4') return 'aspect-[640/440] w-48 object-cover'
    return 'aspect-[564/705] w-40 object-cover' // layout5
  }
  const [compiledStrip, setCompiledStrip] = useState(null)
  const [photos, setPhotos] = useState([null, null, null, null])
  const [capturingIndex, setCapturingIndex] = useState(0)
  const [countdown, setCountdown] = useState(-1)
  const [flash, setFlash] = useState(false)
  const [retakeTarget, setRetakeTarget] = useState(null)
  
  // Custom camera controls
  const [mirror, setMirror] = useState(true)
  const [flashEnabled, setFlashEnabled] = useState(true)
  const [activeFilter, setActiveFilter] = useState('none')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState('')
  const [countdownTime, setCountdownTime] = useState(3) // 3 | 5 | 10
  
  // Camera state
  const [hasCamera, setHasCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const nextPhotoTimeoutRef = useRef(null)
  
  // Form input data
  const [formData, setFormData] = useState({
    nama: '',
    npm: '',
    email: '',
    nohp: '',
    jurusan: '',
    ig: '',
  })
  const [formErrors, setFormErrors] = useState({})
  
  // Simulation states
  const [processingProgress, setProcessingProgress] = useState(0)
  const [printingProgress, setPrintingProgress] = useState(0)
  const [thankYouCountdown, setThankYouCountdown] = useState(10)
  
  // Mock live avatar frame/timer for simulated webcam
  const [simulatedAvatarSeed, setSimulatedAvatarSeed] = useState(1)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      
      // Apply filters if selected
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        
        const currentFilter = FILTERS.find(f => f.id === activeFilter)
        if (currentFilter && currentFilter.canvasFilter !== 'none') {
          ctx.filter = currentFilter.canvasFilter
        }
        
        ctx.drawImage(img, 0, 0)
        const filteredDataUrl = canvas.toDataURL('image/png')
        savePhotoAtIndex(filteredDataUrl)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const savePhotoAtIndex = (photoData) => {
    setPhotos((prev) => {
      const next = [...prev]
      next[capturingIndex] = photoData
      return next
    })

    if (retakeTarget !== null) {
      setRetakeTarget(null)
      setStep(STEPS.PREVIEW)
    } else {
      const nextIndex = capturingIndex + 1
      if (nextIndex < getMaxPhotos(template)) {
        setCapturingIndex(nextIndex)
        setCountdown(-1)
      } else {
        setStep(STEPS.PREVIEW)
      }
    }
  }

  // Enumerate video devices on mount
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
        const videoDevices = deviceInfos.filter(d => d.kind === 'videoinput')
        setDevices(videoDevices)
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId)
        }
      }).catch(err => {
        console.warn('Could not list cameras:', err)
      })
    }
  }, [])

  // Start camera when on CAPTURE step and when camera device changes
  useEffect(() => {
    if (step === STEPS.PHOTO_CAPTURE) {
      startCamera(selectedDevice)
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [step, selectedDevice])

  // Countdown timer trigger
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      takeSnapshot()
    }
  }, [countdown])

  // Simulated live camera frame ticker
  useEffect(() => {
    if (step === STEPS.PHOTO_CAPTURE && !hasCamera) {
      const ticker = setInterval(() => {
        setSimulatedAvatarSeed(s => (s + 1) % 360)
      }, 150)
      return () => clearInterval(ticker)
    }
  }, [step, hasCamera])

  // Generate compiled preview strip dynamically for Step 4
  useEffect(() => {
    if (step === STEPS.PREVIEW || step === STEPS.EDIT_DECISION) {
      const config = LAYOUT_CONFIGS[template]
      if (!config) return
      
      const canvas = document.createElement('canvas')
      canvas.width = config.width
      canvas.height = config.height
      const ctx = canvas.getContext('2d')
      
      const frameImg = new Image()
      frameImg.crossOrigin = 'anonymous'
      frameImg.onload = () => {
        // 1. Process white slots to transparent smoothly
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = config.width
        tempCanvas.height = config.height
        const tempCtx = tempCanvas.getContext('2d')
        tempCtx.drawImage(frameImg, 0, 0)
        
        const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
        const data = imgData.data
        const slots = config.slots
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i+1]
          const b = data[i+2]
          const a = data[i+3]
          
          // Only process transparency for pixels strictly inside the slots
          const pixelIndex = i / 4
          const px = pixelIndex % config.width
          const py = Math.floor(pixelIndex / config.width)
          
          let insideSlot = false
          for (let s = 0; s < slots.length; s++) {
            const slot = slots[s]
            if (px >= slot.x && px < slot.x + slot.w && py >= slot.y && py < slot.y + slot.h) {
              insideSlot = true
              break
            }
          }
          
          let insideProtection = false
          const zones = config.protectionZones || []
          for (let z = 0; z < zones.length; z++) {
            const zone = zones[z]
            if (px >= zone.x && px < zone.x + zone.w && py >= zone.y && py < zone.y + zone.h) {
              insideProtection = true
              break
            }
          }
          
          if (insideSlot && !insideProtection) {
            const whiteness = Math.min(r, g, b)
            const threshold = config.whitenessThreshold || 253
            if (whiteness >= threshold && a > 0) {
              const factor = (whiteness - threshold) / (255 - threshold || 1) // dynamic linear fade
              data[i+3] = Math.round(a * (1 - factor))
            }
          }
        }
        tempCtx.putImageData(imgData, 0, 0)
        
        // 2. Draw user photos (with 3px bleed margin)
        const promises = photos.map((src, idx) => {
          if (!src || !config.slots[idx]) return Promise.resolve()
          const slot = config.slots[idx]
          return new Promise((resolve) => {
            const photoImg = new Image()
            photoImg.onload = () => {
              const bleedX = slot.x - 3
              const bleedY = slot.y - 3
              const bleedW = slot.w + 6
              const bleedH = slot.h + 6
              ctx.drawImage(photoImg, bleedX, bleedY, bleedW, bleedH)
              resolve()
            }
            photoImg.onerror = resolve
            photoImg.src = src
          })
        })
        
        Promise.all(promises).then(() => {
          // 3. Draw processed frame on top
          ctx.drawImage(tempCanvas, 0, 0)
          setCompiledStrip(canvas.toDataURL('image/png'))
        })
      }
      frameImg.src = config.image
    }
  }, [step, photos, template])

  // Auto-redirect on Thank You screen
  useEffect(() => {
    if (step === STEPS.THANK_YOU) {
      if (thankYouCountdown > 0) {
        const timer = setTimeout(() => {
          setThankYouCountdown(thankYouCountdown - 1)
        }, 1000)
        return () => clearTimeout(timer)
      } else {
        resetAll()
      }
    }
  }, [step, thankYouCountdown])

  const startCamera = async (deviceId) => {
    try {
      stopCamera()
      const constraints = {
        video: { 
          width: 640, 
          height: 480, 
          deviceId: deviceId ? { exact: deviceId } : undefined 
        },
        audio: false,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setCameraStream(stream)
      setHasCamera(true)
    } catch (e) {
      console.warn('Webcam not found or access denied, using simulated camera:', e)
      setHasCamera(false)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
  }

  // Bind cameraStream to video element when stream is ready or when step changes
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play().catch(err => {
        console.warn("Video playback blocked or failed:", err)
      })
    }
  }, [cameraStream, step])

  const triggerCaptureSequence = (index) => {
    setCapturingIndex(index)
    setCountdown(countdownTime) // Use selected countdown duration
  }

  const takeSnapshot = () => {
    if (flashEnabled) {
      setFlash(true)
      playShutterSound()
      setTimeout(() => setFlash(false), 200)
    } else {
      playShutterSound()
    }

    let photoData = ''
    const config = LAYOUT_CONFIGS[template]
    const slot = config.slots[capturingIndex]
    const currentFilter = FILTERS.find(f => f.id === activeFilter)
    const filterVal = currentFilter ? currentFilter.canvasFilter : 'none'

    if (hasCamera && videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = slot.w
      canvas.height = slot.h
      const ctx = canvas.getContext('2d')
      
      // Apply filters if selected
      ctx.filter = filterVal

      const video = videoRef.current
      const vWidth = video.videoWidth || 640
      const vHeight = video.videoHeight || 480
      const slotAspect = slot.w / slot.h
      const videoAspect = vWidth / vHeight
      
      let sx = 0, sy = 0, sw = vWidth, sh = vHeight
      if (videoAspect > slotAspect) {
        // Video is wider than slot aspect -> crop horizontal sides
        sw = vHeight * slotAspect
        sh = vHeight
        sx = (vWidth - sw) / 2
      } else {
        // Video is taller than slot aspect -> crop vertical sides
        sw = vWidth
        sh = vWidth / slotAspect
        sy = (vHeight - sh) / 2
      }

      // Handle Mirror Mode
      if (mirror) {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, slot.w, slot.h)
      
      photoData = canvas.toDataURL('image/png')
    } else {
      // Generate simulated photo with size matching the active slot
      const canvas = document.createElement('canvas')
      canvas.width = slot.w
      canvas.height = slot.h
      const ctx = canvas.getContext('2d')
      
      ctx.filter = filterVal

      // Nice background gradient
      const grad = ctx.createLinearGradient(0, 0, slot.w, slot.h)
      grad.addColorStop(0, '#fbcfe8')
      grad.addColorStop(1, '#fef08a')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, slot.w, slot.h)

      // Draw simulated user profile avatar
      ctx.beginPath()
      ctx.arc(slot.w / 2, slot.h * 0.45, Math.min(slot.w, slot.h) * 0.25, 0, Math.PI * 2)
      ctx.fillStyle = '#ec4899'
      ctx.fill()
      
      // Draw smiley eyes
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(slot.w * 0.43, slot.h * 0.42, Math.min(slot.w, slot.h) * 0.04, 0, Math.PI * 2)
      ctx.arc(slot.w * 0.57, slot.h * 0.42, Math.min(slot.w, slot.h) * 0.04, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(slot.w * 0.43 + Math.sin(simulatedAvatarSeed / 10) * 1.5, slot.h * 0.42, Math.min(slot.w, slot.h) * 0.015, 0, Math.PI * 2)
      ctx.arc(slot.w * 0.57 + Math.sin(simulatedAvatarSeed / 10) * 1.5, slot.h * 0.42, Math.min(slot.w, slot.h) * 0.015, 0, Math.PI * 2)
      ctx.fill()

      // Cute Smile
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = Math.max(3, Math.round(Math.min(slot.w, slot.h) * 0.025))
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(slot.w / 2, slot.h * 0.48, Math.min(slot.w, slot.h) * 0.09, 0, Math.PI)
      ctx.stroke()

      // Sparkles/Confetti doodles
      ctx.fillStyle = '#fff'
      ctx.font = `${Math.max(12, Math.round(slot.w * 0.07))}px sans-serif`
      ctx.fillText('✨', slot.w * 0.15, slot.h * 0.25)
      ctx.fillText('💫', slot.w * 0.78, slot.h * 0.3)
      ctx.fillText('✌️', slot.w * 0.18, slot.h * 0.8)
      ctx.fillText('🌸', slot.w * 0.75, slot.h * 0.75)
      
      // Frame index print
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.font = `bold ${Math.max(10, Math.round(slot.w * 0.045))}px monospace`
      ctx.textAlign = 'center'
      ctx.fillText(`SLOT #${capturingIndex + 1}`, slot.w / 2, slot.h * 0.92)

      photoData = canvas.toDataURL('image/png')
    }

    setPhotos((prev) => {
      const next = [...prev]
      next[capturingIndex] = photoData
      return next
    })

    // Advance flow
    if (retakeTarget !== null) {
      // We were retaking a specific image
      setRetakeTarget(null)
      setStep(STEPS.PREVIEW)
    } else {
      // Normal flow - take next image or advance
      const nextIndex = capturingIndex + 1
      if (nextIndex < getMaxPhotos(template)) {
        setCapturingIndex(nextIndex)
        setCountdown(-1) // Put in standby/wait state briefly
        
        // Clear active timeout if any
        if (nextPhotoTimeoutRef.current) clearTimeout(nextPhotoTimeoutRef.current)
        
        // Start next countdown automatically after 1.8 seconds (pose change break)
        nextPhotoTimeoutRef.current = setTimeout(() => {
          setCountdown(countdownTime)
        }, 1800)
      } else {
        setStep(STEPS.PREVIEW)
      }
    }
  }

  const handleStartCapture = () => {
    const max = getMaxPhotos(template)
    setPhotos(Array(max).fill(null))
    setRetakeTarget(null)
    setCapturingIndex(0)
    setStep(STEPS.PHOTO_CAPTURE)
    setCountdown(-1) // Do not auto-start countdown
  }

  const handleRetakeSelect = (index) => {
    setRetakeTarget(index)
    setCapturingIndex(index)
    setStep(STEPS.PHOTO_CAPTURE)
    setCountdown(-1) // Do not auto-start countdown
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.nama.trim()) errors.nama = 'Nama lengkap wajib diisi!'
    
    if (!formData.npm.trim()) {
      errors.npm = 'NPM wajib diisi!'
    } else if (!/^\d+$/.test(formData.npm)) {
      errors.npm = 'NPM hanya boleh berisi angka!'
    } else if (formData.npm.length < 8) {
      errors.npm = 'NPM minimal 8 karakter!'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email wajib diisi!'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email tidak valid!'
    }

    if (!formData.nohp.trim()) {
      errors.nohp = 'Nomor HP wajib diisi!'
    } else if (!/^\d+$/.test(formData.nohp)) {
      errors.nohp = 'Nomor HP hanya boleh berisi angka!'
    } else if (formData.nohp.length < 10 || formData.nohp.length > 13) {
      errors.nohp = 'Nomor HP harus 10 s.d 13 digit!'
    }

    if (!formData.jurusan.trim()) errors.jurusan = 'Jurusan wajib diisi!'
    
    if (!formData.ig.trim()) {
      errors.ig = 'Username Instagram wajib diisi!'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setStep(STEPS.PROCESSING)
      simulateProcessing()
    }
  }

  const simulateProcessing = () => {
    setProcessingProgress(0)
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Finished rendering canvas and packaging ZIP
          setTimeout(() => {
            setStep(STEPS.EMAIL_SUCCESS)
          }, 500)
          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  const handlePrintTrigger = () => {
    setStep(STEPS.PRINT_HARDCOPY)
    setPrintingProgress(0)
    const interval = setInterval(() => {
      setPrintingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setStep(STEPS.THANK_YOU)
          }, 800)
          return 100
        }
        return prev + 4
      })
    }, 120)
  }

  const resetAll = () => {
    if (nextPhotoTimeoutRef.current) {
      clearTimeout(nextPhotoTimeoutRef.current)
      nextPhotoTimeoutRef.current = null
    }
    setStep(STEPS.TEMPLATE)
    setTemplate('layout1')
    setCompiledStrip(null)
    setPhotos([null, null, null, null])
    setCountdown(-1)
    setRetakeTarget(null)
    setFormData({
      nama: '',
      npm: '',
      email: '',
      nohp: '',
      jurusan: '',
      ig: '',
    })
    setFormErrors({})
    setThankYouCountdown(10)
    onHome()
  }

  // Draw final compound photo strip on Canvas for high-res download
  const handleDownloadStrip = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    const config = LAYOUT_CONFIGS[template]
    canvas.width = config.width
    canvas.height = config.height
    
    const frameImg = new Image()
    frameImg.crossOrigin = 'anonymous'
    frameImg.onload = () => {
      // 1. Create a temp canvas to convert white pixels to transparent smoothly
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = config.width
      tempCanvas.height = config.height
      const tempCtx = tempCanvas.getContext('2d')
      tempCtx.drawImage(frameImg, 0, 0)
      
      const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
      const data = imgData.data
      const slots = config.slots
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i+1]
        const b = data[i+2]
        const a = data[i+3]
        
        // Only process transparency for pixels strictly inside the slots
        const pixelIndex = i / 4
        const px = pixelIndex % config.width
        const py = Math.floor(pixelIndex / config.width)
        
        let insideSlot = false
        for (let s = 0; s < slots.length; s++) {
          const slot = slots[s]
          if (px >= slot.x && px < slot.x + slot.w && py >= slot.y && py < slot.y + slot.h) {
            insideSlot = true
            break
          }
        }
        
        let insideProtection = false
        const zones = config.protectionZones || []
        for (let z = 0; z < zones.length; z++) {
          const zone = zones[z]
          if (px >= zone.x && px < zone.x + zone.w && py >= zone.y && py < zone.y + zone.h) {
            insideProtection = true
            break
          }
        }
        
        if (insideSlot && !insideProtection) {
          const whiteness = Math.min(r, g, b)
          const threshold = config.whitenessThreshold || 253
          if (whiteness >= threshold && a > 0) {
            const factor = (whiteness - threshold) / (255 - threshold || 1) // dynamic linear fade
            data[i+3] = Math.round(a * (1 - factor))
          }
        }
      }
      tempCtx.putImageData(imgData, 0, 0)
      
      // 2. Draw all user photos first on the main canvas with a tiny 3px bleed margin
      const drawAllPhotos = () => {
        const promises = photos.map((src, idx) => {
          if (!src || !config.slots[idx]) return Promise.resolve()
          const slot = config.slots[idx]
          return new Promise((resolve) => {
            const photoImg = new Image()
            photoImg.onload = () => {
              // Draw photo slightly larger (3px bleed) than slot to ensure no white edges are visible
              const bleedX = slot.x - 3
              const bleedY = slot.y - 3
              const bleedW = slot.w + 6
              const bleedH = slot.h + 6
              ctx.drawImage(photoImg, bleedX, bleedY, bleedW, bleedH)
              resolve()
            }
            photoImg.onerror = resolve
            photoImg.src = src
          })
        })
        return Promise.all(promises)
      }
      
      drawAllPhotos().then(() => {
        // 3. Draw the processed transparent-slot frame image ON TOP of the photos!
        // This puts the frame's background and stickers in front of the photos.
        ctx.drawImage(tempCanvas, 0, 0)
        
        // 4. Trigger download
        const link = document.createElement('a')
        link.download = `dscbooth_${template}_${formData.npm || 'session'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      })
    }
    frameImg.src = config.image
  }

  // Progress Bar Helper
  const getProgressPercent = () => {
    return Math.round((step / 9) * 100)
  }

  return (
    <section className="flex-1 bg-cream p-6 md:p-12 relative flex flex-col items-center justify-start min-h-[600px] overflow-hidden">
      
      {/* Hidden canvas for PNG stitching */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Progress Indicator */}
      {step < STEPS.THANK_YOU && (
        <div className="w-full max-w-xl mb-8 flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-medium text-maroon">
            <span>Alur Sesi Foto</span>
            <span>Langkah {step} dari 9 ({getProgressPercent()}%)</span>
          </div>
          <div className="w-full h-3 bg-line rounded-full overflow-hidden">
            <div 
              className="h-full bg-terracotta transition-all duration-300 rounded-full" 
              style={{ width: `${getProgressPercent()}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: CHOOSE TEMPLATE */}
      {step === STEPS.TEMPLATE && (
        <div className="w-full max-w-5xl text-center flex flex-col items-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-maroon mb-2 font-display">
            Pilih Templatemu ✨
          </h2>
          <p className="text-md text-[#7a7266] mb-8 max-w-md">
            Pilih gaya strip foto yang sesuai dengan vibe-mu hari ini! Info: 1 sesi = 3 menit.
          </p>

          {/* Scrollable layout cards container */}
          <div className="flex gap-6 overflow-x-auto w-full max-w-5xl pb-6 px-6 md:px-8 scroll-smooth justify-start select-none mb-10">
            {Object.keys(LAYOUT_CONFIGS).map((key) => {
              const config = LAYOUT_CONFIGS[key]
              const isSelected = template === key
              const maxPhotos = getMaxPhotos(key)
              
              return (
                <div 
                  key={key}
                  onClick={() => setTemplate(key)}
                  className={`w-[260px] shrink-0 cursor-pointer rounded-3xl border-3 p-5 flex flex-col items-center justify-between transition-all transform hover:scale-[1.03] ${
                    isSelected 
                      ? 'border-[#f43f5e] bg-pink-50/50 shadow-lg scale-[1.02]' 
                      : 'border-line bg-white hover:border-[#a79c8c]'
                  }`}
                >
                  {/* Miniature Image Preview */}
                  <div className="w-full bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/60 shadow-inner flex items-center justify-center p-2.5 h-64 select-none">
                    <img 
                      src={config.image} 
                      alt={config.name} 
                      className="max-h-full max-w-full object-contain rounded shadow-xs"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="font-bold text-md text-maroon font-display leading-tight">{config.name}</h3>
                    <p className="text-xs text-[#8a7f71] mt-1.5 leading-snug min-h-[48px] flex items-center justify-center">
                      {key === 'layout1' && '4 Foto dalam kisi 2x2 bertema burung hantu lucu 🌸'}
                      {key === 'layout2' && '4 Foto vertikal klasik bertema kucing & awan imut ☁️'}
                      {key === 'layout3' && '3 Foto vertikal bertema luar angkasa & astronaut 🚀'}
                      {key === 'layout4' && '3 Foto dengan bentuk slot unik & retro vibes 🌼'}
                      {key === 'layout5' && '2 Foto vertikal strip bertema manis & elegan 💖'}
                    </p>
                    <span className="inline-block mt-3 text-[10px] font-extrabold uppercase tracking-wider bg-terracotta/10 text-terracotta px-2.5 py-1 rounded-full">
                      {maxPhotos} Foto
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <button 
            onClick={handleStartCapture}
            className="rounded-pill bg-terracotta hover:bg-terracotta-dark px-12 py-4.5 text-lg font-bold tracking-wide text-white shadow-start transition-all"
          >
            Mulai Sesi Foto 🚀
          </button>
        </div>
      )}

      {/* STEP 2: PHOTO CAPTURE */}
      {step === STEPS.PHOTO_CAPTURE && (() => {
        const capturedCount = photos.filter(p => p !== null).length
        return (
          <div className="w-full max-w-xl text-center flex flex-col items-center relative animate-fade-in">
            {/* Header counter */}
            <div className="text-4xl md:text-5xl font-extrabold text-maroon mb-2 font-mono select-none">
              {capturedCount}/{getMaxPhotos(template)}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-maroon mb-1 font-display">
              {retakeTarget !== null ? `Retake Foto #${retakeTarget + 1} 📸` : `Sesi Foto #${capturingIndex + 1}`}
            </h2>
            <p className="text-xs text-[#7a7266] mb-4">
              Posisikan dirimu di depan kamera. Klik **START** untuk memulai hitung mundur!
            </p>

            {/* Top Controls Row */}
            <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
              {/* Camera Selector Dropdown */}
              {devices.length > 0 && (
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="px-3 py-2 border border-line bg-white rounded-lg text-xs font-semibold text-maroon focus:outline-none focus:border-terracotta cursor-pointer shadow-xs"
                >
                  {devices.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Camera ${d.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>
              )}

              {/* Countdown Time Dropdown */}
              <select
                value={countdownTime}
                onChange={(e) => setCountdownTime(parseInt(e.target.value))}
                className="px-3 py-2 border border-line bg-white rounded-lg text-xs font-semibold text-maroon focus:outline-none focus:border-terracotta cursor-pointer shadow-xs"
              >
                <option value={3}>3s Delay</option>
                <option value={5}>5s Delay</option>
                <option value={10}>10s Delay</option>
              </select>
            </div>

            {/* Camera Viewport Frame */}
            <div 
              style={getCameraAspectStyle(template)}
              className="relative w-full bg-slate-900 rounded-3xl overflow-hidden border-6 border-maroon shadow-2xl transition-all duration-300"
            >
              {/* Live Camera Feed (always mounted to prevent ref binding race conditions) */}
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className={`w-full h-full object-cover ${mirror ? 'transform scale-x-[-1]' : ''} ${hasCamera ? 'block' : 'hidden'}`}
                style={{ filter: FILTERS.find(f => f.id === activeFilter)?.css || 'none' }}
              />

              {/* Simulated Camera View (shown if camera not available or starting up) */}
              {!hasCamera && (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 to-slate-800 text-white absolute inset-0"
                  style={{ filter: FILTERS.find(f => f.id === activeFilter)?.css || 'none' }}
                >
                  
                  {/* Animated Simulated User Lens */}
                  <div className="w-44 h-44 rounded-full border-4 border-dashed border-sage flex items-center justify-center relative animate-spin [animation-duration:15s]">
                    <div className="w-36 h-36 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-4xl">📸</span>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 text-xs rounded-full font-mono font-bold tracking-widest animate-pulse flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white" /> REC (SIMULATOR)
                  </div>

                  <p className="mt-5 text-sm text-[#c9c1b4] font-medium tracking-wide">
                    Menggunakan fallback kamera virtual
                  </p>
                </div>
              )}

              {/* Countdown Overlay */}
              {countdown >= 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center animate-fade-in">
                  <div className="text-white text-8xl md:text-9xl font-bold font-display animate-ping [animation-duration:1s]">
                    {countdown === 0 ? '📸' : countdown}
                  </div>
                </div>
              )}

              {/* Camera flash overlay */}
              {flash && (
                <div className="absolute inset-0 bg-white transition-opacity duration-75 opacity-100" />
              )}
            </div>

            {/* Controls Row */}
            <div className="mt-6 flex gap-4 justify-center items-center w-full">
              {/* Mirror Toggle Button */}
              <button
                onClick={() => setMirror(!mirror)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all border-2 cursor-pointer ${
                  mirror 
                    ? 'bg-white text-maroon border-maroon hover:bg-[#faf5ec]' 
                    : 'bg-stone-300 text-stone-600 border-stone-400'
                }`}
              >
                Mirror: {mirror ? 'On' : 'Off'}
              </button>

              {/* Main Trigger Button */}
              {countdown === -1 ? (
                <button
                  onClick={() => triggerCaptureSequence(capturingIndex)}
                  className="rounded-full bg-[#f43f5e] hover:bg-[#e11d48] px-10 py-3 text-sm font-bold text-white shadow-md transition-all cursor-pointer transform hover:scale-[1.05]"
                >
                  START
                </button>
              ) : (
                <div className="px-10 py-3 text-sm font-bold text-maroon bg-white/50 rounded-full animate-pulse border border-line">
                  {countdown === 0 ? 'CHEESE! 📸' : `WAIT ${countdown}s`}
                </div>
              )}

              {/* Flash Toggle Button */}
              <button
                onClick={() => setFlashEnabled(!flashEnabled)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all border-2 cursor-pointer ${
                  flashEnabled 
                    ? 'bg-white text-maroon border-maroon hover:bg-[#faf5ec]' 
                    : 'bg-stone-300 text-stone-600 border-stone-400'
                }`}
              >
                Flash: {flashEnabled ? 'On' : 'Off'}
              </button>
            </div>

            {/* Filter Selector & Modal Trigger */}
            <div className="mt-8 w-full max-w-md bg-stone-50 border border-line rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-[#8a7f71] uppercase tracking-wider block">Filter Aktif</span>
                  <span className="text-sm font-extrabold text-maroon font-display">
                    {FILTERS.find(f => f.id === activeFilter)?.label || 'Normal'}
                  </span>
                </div>
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <span>Pilih Filter</span> 🎨
                </button>
              </div>

              {/* Fast-access mini row */}
              <div className="flex gap-2.5 justify-center items-center">
                {FILTERS.slice(0, 5).map(f => {
                  const isActive = activeFilter === f.id
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.05] relative flex-shrink-0 ${
                        isActive ? 'border-pink-500 scale-[1.08] shadow-xs' : 'border-stone-200'
                      }`}
                      title={f.label}
                    >
                      {f.previewType === 'color' ? (
                        <div style={{ background: f.previewBg }} className="w-full h-full" />
                      ) : (
                        <img 
                          src="https://picsum.photos/id/1060/40/40" 
                          style={{ filter: f.css }} 
                          className="w-full h-full object-cover" 
                          alt={f.label}
                        />
                      )}
                    </button>
                  )
                })}
                
                {/* More / Ellipsis Button to open full Modal */}
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="w-9 h-9 rounded-xl border-2 border-dashed border-stone-400 text-stone-600 hover:border-pink-500 hover:text-pink-600 flex items-center justify-center font-bold text-lg cursor-pointer transition-colors flex-shrink-0"
                  title="Lihat Semua Filter"
                >
                  •••
                </button>
              </div>
            </div>

            {/* CHOOSE A FILTER MODAL */}
            {isFilterModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 w-full max-w-[480px] shadow-2xl relative animate-scale-up flex flex-col max-h-[85vh]">
                  {/* Close button */}
                  <button
                    onClick={() => setIsFilterModalOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-pink-500 font-extrabold transition-colors cursor-pointer"
                  >
                    ✕
                  </button>

                  <h3 className="text-2xl font-bold text-[#ec4899] font-display text-center mb-6">
                    Choose a Filter
                  </h3>

                  {/* Filter grid scrollable */}
                  <div className="grid grid-cols-4 gap-x-3 gap-y-5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-200">
                    {FILTERS.map(f => {
                      const isActive = activeFilter === f.id
                      return (
                        <button
                          key={f.id}
                          onClick={() => {
                            setActiveFilter(f.id)
                            setIsFilterModalOpen(false)
                          }}
                          className="flex flex-col items-center group cursor-pointer focus:outline-none"
                        >
                          <div 
                            className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all group-hover:scale-[1.04] ${
                              isActive 
                                ? 'border-[#ec4899] ring-3 ring-pink-100 scale-[1.02]' 
                                : 'border-stone-200'
                            }`}
                          >
                            {f.previewType === 'color' ? (
                              <div style={{ background: f.previewBg }} className="w-full h-full" />
                            ) : (
                              <img 
                                src="https://picsum.photos/id/1060/80/80" 
                                style={{ filter: f.css }} 
                                className="w-full h-full object-cover" 
                                alt={f.label}
                                loading="lazy"
                              />
                            )}
                          </div>
                          <span className={`text-[10px] font-bold text-center mt-1.5 tracking-wide leading-tight ${
                            isActive ? 'text-[#ec4899] font-extrabold' : 'text-[#5c5449]'
                          }`}>
                            {f.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* STEP 3: PREVIEW ALL FRAME */}
      {step === STEPS.PREVIEW && (
        <div className="w-full max-w-5xl text-center flex flex-col items-center animate-fade-in">
          <h2 className="text-3xl font-bold text-maroon mb-2 font-display">
            Review Hasil Foto 🎞️
          </h2>
          <p className="text-sm text-[#7a7266] mb-8">
            Lihat semua frame fotomu sebelum kita lanjut ke proses pengiriman.
          </p>

          <div className={`grid gap-6 w-full mb-8 justify-center ${
            getMaxPhotos(template) === 2 
              ? 'grid-cols-1 sm:grid-cols-2 max-w-xl' 
              : getMaxPhotos(template) === 3 
                ? 'grid-cols-1 sm:grid-cols-3 max-w-3xl' 
                : 'grid-cols-2 md:grid-cols-4 max-w-4xl'
          }`}>
            {photos.slice(0, getMaxPhotos(template)).map((src, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className="relative group overflow-hidden rounded-2xl border-4 border-white shadow-md hover:shadow-lg transition-all">
                  {src ? (
                    <img src={src} alt={`captured ${idx}`} className={getSlotAspectClass(template)} />
                  ) : (
                    <div className={`bg-slate-200 flex items-center justify-center text-slate-400 font-semibold ${getSlotAspectClass(template)}`}>
                      Empty
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button 
                      onClick={() => handleRetakeSelect(idx)}
                      className="bg-white hover:bg-slate-100 text-maroon px-4 py-2 rounded-full font-bold text-xs shadow-md transition-all transform translate-y-2 group-hover:translate-y-0"
                    >
                      Ulangi Foto #{idx + 1} 🔄
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full px-2">
                  <span className="text-xs font-semibold text-[#8a7f71]">Foto #{idx + 1}</span>
                  <button
                    onClick={() => handleRetakeSelect(idx)}
                    className="text-xs font-bold text-terracotta hover:underline"
                  >
                    Retake
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setStep(STEPS.EDIT_DECISION)}
              className="rounded-pill bg-terracotta hover:bg-terracotta-dark px-12 py-4 text-md font-bold text-white shadow-md transition-all"
            >
              Lanjutkan 🚀
            </button>
            <button
              onClick={() => setStep(STEPS.TEMPLATE)}
              className="rounded-pill border-2 border-maroon text-maroon hover:bg-[#e9e0d2] px-8 py-3.5 text-md font-bold transition-all"
            >
              Ganti Template
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: EDIT DECISION (YES/NO) */}
      {step === STEPS.EDIT_DECISION && (
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 animate-fade-in py-6">
          {/* Left: Beautiful live compiled preview of the photo strip */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2.5">
            <span className="text-xs font-bold text-maroon/70 tracking-wider uppercase font-display select-none">Preview Strip Fotonu ✨</span>
            <div className="relative bg-white p-3.5 rounded-3xl shadow-xl hover:shadow-2xl border border-stone-200/60 transition-all duration-300 max-w-[240px] md:max-w-[260px]">
              {compiledStrip ? (
                <img 
                  src={compiledStrip} 
                  alt="Hasil Foto Strip" 
                  className="rounded-2xl w-full h-auto object-contain select-none" 
                />
              ) : (
                <div className="w-48 h-96 bg-stone-100 animate-pulse rounded-2xl flex items-center justify-center text-xs text-stone-400 font-semibold">
                  Menyusun preview...
                </div>
              )}
            </div>
          </div>

          {/* Right: The decision box */}
          <div className="w-full max-w-md text-center md:text-left flex flex-col items-center md:items-start">
            <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center text-3xl mb-5 mx-auto md:mx-0 select-none">
              🤔
            </div>
            <h2 className="text-3xl font-bold text-maroon mb-2 font-display">
              Mau Edit Foto?
            </h2>
            <p className="text-sm text-[#7a7266] mb-8 text-center md:text-left leading-relaxed">
              Apakah kamu ingin mengulang (retake) salah satu foto, atau hasil di atas sudah pas?
            </p>

            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => {
                  // Let user pick which photo to retake
                  setStep(STEPS.PREVIEW)
                }}
                className="rounded-2xl border-2 border-dashed border-terracotta bg-terracotta/5 hover:bg-terracotta/10 p-5 text-left transition-all cursor-pointer transform hover:scale-[1.01]"
              >
                <div className="font-bold text-terracotta text-lg flex items-center gap-2">
                  <span>Ya, Retake Foto</span> 🔄
                </div>
                <p className="text-xs text-[#8a7f71] mt-1 leading-snug">
                  Pilih dan ulangi salah satu dari {getMaxPhotos(template)} frame yang sudah diambil.
                </p>
              </button>

              <button
                onClick={() => setStep(STEPS.INPUT_DATA)}
                className="rounded-2xl border-2 border-line bg-white hover:border-[#a79c8c] p-5 text-left transition-all cursor-pointer transform hover:scale-[1.01]"
              >
                <div className="font-bold text-maroon text-lg flex items-center gap-2">
                  <span>Tidak, Lanjut Pengisian Data</span> ➡️
                </div>
                <p className="text-xs text-[#8a7f71] mt-1 leading-snug">
                  Simpan hasil jepretan ini dan lanjut ke form pengiriman email.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: INPUT DATA FORM */}
      {step === STEPS.INPUT_DATA && (
        <div className="w-full max-w-lg animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-maroon mb-2 font-display">
              Isi Data Diri 📝
            </h2>
            <p className="text-sm text-[#7a7266]">
              Masukkan datamu untuk menerima softcopy foto via email.
            </p>
            <div className="mt-2 text-xs bg-coral/10 border border-coral/30 text-maroon px-4 py-2 rounded-lg inline-block">
              ⚠️ Catatan: File ZIP & frame foto hanya akan dikirim 1 kali.
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl border border-line p-6 md:p-8 shadow-sm flex flex-col gap-4">
            
            {/* Nama Field */}
            <div>
              <label htmlFor="nama" className="block text-sm font-semibold text-[#5c5449] mb-1">
                Nama Lengkap
              </label>
              <input
                id="nama"
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  formErrors.nama ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-terracotta'
                }`}
                placeholder="cth: Ryan Maulana"
              />
              {formErrors.nama && <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.nama}</p>}
            </div>

            {/* NPM Field */}
            <div>
              <label htmlFor="npm" className="block text-sm font-semibold text-[#5c5449] mb-1">
                NPM (Nomor Pokok Mahasiswa)
              </label>
              <input
                id="npm"
                type="text"
                value={formData.npm}
                onChange={(e) => setFormData({ ...formData, npm: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  formErrors.npm ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-terracotta'
                }`}
                placeholder="cth: 50421888"
              />
              {formErrors.npm && <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.npm}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#5c5449] mb-1">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-terracotta'
                }`}
                placeholder="cth: ryan@student.univ.ac.id"
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.email}</p>}
            </div>

            {/* No HP Field */}
            <div>
              <label htmlFor="nohp" className="block text-sm font-semibold text-[#5c5449] mb-1">
                Nomor HP (WhatsApp)
              </label>
              <input
                id="nohp"
                type="text"
                value={formData.nohp}
                onChange={(e) => setFormData({ ...formData, nohp: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  formErrors.nohp ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-terracotta'
                }`}
                placeholder="cth: 081234567890"
              />
              {formErrors.nohp && <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.nohp}</p>}
            </div>

            {/* Jurusan Field */}
            <div>
              <label htmlFor="jurusan" className="block text-sm font-semibold text-[#5c5449] mb-1">
                Jurusan / Program Studi
              </label>
              <input
                id="jurusan"
                type="text"
                value={formData.jurusan}
                onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  formErrors.jurusan ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-terracotta'
                }`}
                placeholder="cth: Informatika"
              />
              {formErrors.jurusan && <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.jurusan}</p>}
            </div>

            {/* Instagram Field */}
            <div>
              <label htmlFor="ig" className="block text-sm font-semibold text-[#5c5449] mb-1">
                Username Instagram (IG)
              </label>
              <input
                id="ig"
                type="text"
                value={formData.ig}
                onChange={(e) => {
                  let val = e.target.value
                  if (val && !val.startsWith('@')) val = '@' + val
                  setFormData({ ...formData, ig: val })
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  formErrors.ig ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-terracotta'
                }`}
                placeholder="cth: @ryanmaulana"
              />
              {formErrors.ig && <p className="text-red-500 text-xs mt-1 font-semibold">{formErrors.ig}</p>}
            </div>

            <button
              type="submit"
              className="mt-4 rounded-pill bg-terracotta hover:bg-terracotta-dark py-4 text-md font-bold text-white shadow-md transition-all text-center"
            >
              Kirim Foto ke Email ✉️
            </button>
          </form>
        </div>
      )}

      {/* STEP 6: PROCESSING BACKGROUND */}
      {step === STEPS.PROCESSING && (
        <div className="w-full max-w-md text-center flex flex-col items-center justify-center animate-fade-in py-16">
          <div className="w-24 h-24 relative mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-[#e9e0d2] border-t-terracotta animate-spin" />
            <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center text-3xl shadow-inner">
              ⚙️
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-maroon mb-2 font-display">
            Sedang Memproses Foto...
          </h2>
          <p className="text-sm text-[#7a7266] mb-6 max-w-xs">
            Menyatukan potret, mengompres folder menjadi ZIP, dan menyambungkan ke server email.
          </p>

          <div className="w-full bg-line h-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-terracotta transition-all duration-150 rounded-full"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[#8a7f71] mt-2">
            Progress: {processingProgress}%
          </span>
        </div>
      )}

      {/* STEP 7: CONVERT & KIRIM SUCCESS */}
      {step === STEPS.EMAIL_SUCCESS && (
        <div className="w-full max-w-md text-center flex flex-col items-center justify-center animate-fade-in py-10">
          <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl mb-6 shadow-md border-2 border-green-200">
            ✓
          </div>

          <h2 className="text-3xl font-bold text-maroon mb-2 font-display">
            Sukses Terkirim! 📬
          </h2>
          <p className="text-sm text-[#7a7266] mb-4 max-w-xs">
            File ZIP berisi strip foto digital & foto-foto satuan berhasil dikirim ke:
            <br />
            <strong className="text-terracotta">{formData.email}</strong>
          </p>

          {/* Download CTA */}
          <div className="w-full bg-[#fcf8f2] border border-line rounded-2xl p-4 mb-8 text-left">
            <div className="text-xs font-bold text-maroon mb-2 flex items-center gap-1.5">
              <span>Unduh Langsung</span> 📥
            </div>
            <p className="text-xs text-[#8a7f71] mb-3">
              Kamu juga bisa mengunduh file strip foto langsung ke perangkat ini sekarang.
            </p>
            <button
              onClick={handleDownloadStrip}
              className="w-full text-xs font-bold rounded-lg border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white py-2 text-center transition-all"
            >
              Unduh Frame PNG 📸
            </button>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handlePrintTrigger}
              className="rounded-pill bg-terracotta hover:bg-terracotta-dark py-4 text-md font-bold text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Cetak Hardcopy Foto</span> 🖨️
            </button>
            
            <button
              onClick={() => setStep(STEPS.THANK_YOU)}
              className="text-sm text-[#8a7f71] hover:text-maroon font-semibold underline mt-2"
            >
              Lewati Cetak & Selesai
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: PRINT HARDCOPY ANIMATION */}
      {step === STEPS.PRINT_HARDCOPY && (
        <div className="w-full max-w-md text-center flex flex-col items-center justify-center animate-fade-in py-8">
          
          {/* Animated Printer */}
          <div className="w-48 h-48 relative flex items-end justify-center mb-8 border-b-8 border-slate-700">
            {/* Printer Body */}
            <div className="w-40 h-24 bg-slate-800 rounded-t-xl relative border-t-4 border-slate-600 flex items-center justify-center">
              {/* Paper slit */}
              <div className="absolute top-2 w-28 h-1.5 bg-black rounded" />
              <div className="absolute bottom-4 w-3 h-3 rounded-full bg-green-500 animate-ping" />
              <div className="absolute bottom-4 w-3 h-3 rounded-full bg-green-600" />
            </div>

            {/* Printing Photo Strip sliding down */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 bg-white border border-slate-300 w-14 overflow-hidden rounded shadow-md transition-all duration-100"
              style={{
                top: `${40 - (printingProgress * 0.4)}%`, // adjust vertical position
                height: `${printingProgress * 0.8}px`, // grows as progress bar moves
                clipPath: 'inset(0px 0px 0px 0px)',
                aspectRatio: template === 'layout1' ? '788/1182' : template === 'layout2' ? '473/1340' : '394/1182'
              }}
            >
              <img 
                src={LAYOUT_CONFIGS[template]?.image} 
                className="w-full h-full object-cover" 
                alt="printing mockup" 
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-maroon mb-2 font-display">
            Sedang Mencetak Strip Hardcopy...
          </h2>
          <p className="text-sm text-[#7a7266] mb-6 max-w-xs">
            Tinta sedang disemprotkan ke kertas glossy premium photobooth.
          </p>

          <div className="w-full bg-line h-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-terracotta transition-all duration-100 rounded-full"
              style={{ width: `${printingProgress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[#8a7f71] mt-2">
            Progress Cetak: {printingProgress}%
          </span>
        </div>
      )}

      {/* STEP 9: FINISH / THANK YOU SCREEN */}
      {step === STEPS.THANK_YOU && (
        <div className="w-full max-w-md text-center flex flex-col items-center justify-center animate-fade-in py-16">
          <div className="w-24 h-24 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-5xl mb-8 shadow-inner animate-bounce">
            🎉
          </div>

          <h2 className="text-4xl font-bold text-maroon mb-3 font-display">
            Terima Kasih!
          </h2>
          <p className="text-md text-[#7a7266] mb-8">
            Sesi fotomu telah selesai. Nikmati momen kebersamaanmu dengan **DSCBooth**!
          </p>

          <div className="bg-[#fcf8f2] border border-line rounded-2xl px-6 py-4 mb-10 w-full">
            <p className="text-xs text-[#8a7f71]">
              Halaman ini akan otomatis mereset kembali ke dashboard dalam:
            </p>
            <div className="text-3xl font-bold text-terracotta mt-1.5 font-mono">
              {thankYouCountdown} detik
            </div>
          </div>

          <button
            onClick={resetAll}
            className="rounded-pill bg-terracotta hover:bg-terracotta-dark px-12 py-4.5 text-md font-bold text-white shadow-start transition-all"
          >
            Mulai Sesi Baru Sekarang 🔄
          </button>
        </div>
      )}

    </section>
  )
}
