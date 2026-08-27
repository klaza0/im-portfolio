type SoundType = 'click' | 'open' | 'close' | 'maximize' | 'minimize' | 'startMenu' | 'notification' | 'contextMenu' | 'error'

const soundPaths: Record<SoundType, string> = {
  click: '/sounds/click.wav',
  open: '/sounds/open.wav',
  close: '/sounds/close.wav',
  maximize: '/sounds/maximize.wav',
  minimize: '/sounds/minimize.wav',
  startMenu: '/sounds/start-menu.wav',
  notification: '/sounds/notification.wav',
  contextMenu: '/sounds/context-menu.wav',
  error: '/sounds/error.wav',
}

const audioCache = new Map<string, HTMLAudioElement>()
let soundEnabled = true
let masterVolume = 0.7
let masterMuted = false
let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContext
}

function playSyntheticSound(type: SoundType): void {
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const configs: Record<SoundType, { freq: number; duration: number; volume: number; type: OscillatorType }> = {
      click: { freq: 800, duration: 0.05, volume: 0.08, type: 'sine' },
      open: { freq: 600, duration: 0.12, volume: 0.1, type: 'sine' },
      close: { freq: 400, duration: 0.1, volume: 0.08, type: 'sine' },
      maximize: { freq: 500, duration: 0.15, volume: 0.08, type: 'triangle' },
      minimize: { freq: 350, duration: 0.12, volume: 0.08, type: 'triangle' },
      startMenu: { freq: 700, duration: 0.08, volume: 0.06, type: 'sine' },
      notification: { freq: 880, duration: 0.2, volume: 0.1, type: 'sine' },
      contextMenu: { freq: 650, duration: 0.04, volume: 0.05, type: 'sine' },
      error: { freq: 200, duration: 0.15, volume: 0.1, type: 'square' },
    }

    const config = configs[type]
    osc.type = config.type
    osc.frequency.setValueAtTime(config.freq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(config.freq * 1.5, ctx.currentTime + config.duration * 0.3)
    gain.gain.setValueAtTime(config.volume * getEffectiveVolume(), ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + config.duration)
  } catch { /* audio not available */ }
}

function getEffectiveVolume(): number {
  if (masterMuted) return 0
  return masterVolume
}

function getAudio(src: string): HTMLAudioElement {
  if (!audioCache.has(src)) {
    const audio = new Audio(src)
    audioCache.set(src, audio)
  }
  const audio = audioCache.get(src)!
  audio.volume = 0.15 * getEffectiveVolume()
  return audio
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled
}

export function setMasterAudio(volume: number, muted: boolean): void {
  masterVolume = volume
  masterMuted = muted
  audioCache.forEach(audio => {
    audio.volume = 0.15 * getEffectiveVolume()
  })
}

export function playSound(type: SoundType): void {
  if (!soundEnabled) return

  const src = soundPaths[type]
  const audio = getAudio(src)

  if (audio.canPlayType('audio/wav')) {
    audio.currentTime = 0
    audio.play().catch(() => playSyntheticSound(type))
  } else {
    playSyntheticSound(type)
  }
}

export function resumeAudioContext(): void {
  if (audioContext?.state === 'suspended') {
    audioContext.resume()
  }
}
