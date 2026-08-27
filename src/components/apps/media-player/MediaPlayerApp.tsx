import { useState, useRef, useEffect, useCallback } from 'react'
import { mediaPlaylist } from '../../../data/media'
import type { MediaItem } from '../../../types'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Music } from 'lucide-react'
import { resumeAudioContext } from '../../../utils/sounds'
import { useDesktop } from '../../../context/DesktopContext'

interface MediaPlayerAppProps {
  mediaId?: string
  autoPlay?: boolean
}

export function MediaPlayerApp({ mediaId, autoPlay = false }: MediaPlayerAppProps) {
  const { settings, updateSettings } = useDesktop()
  const initialIndex = mediaId
    ? mediaPlaylist.findIndex(p => p.id === mediaId)
    : 0

  const [playlist] = useState(mediaPlaylist)
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const autoPlayAttempted = useRef(false)

  const current = playlist[currentIndex]

  useEffect(() => {
    if (!autoPlay || autoPlayAttempted.current) return
    autoPlayAttempted.current = true
    resumeAudioContext()
    const timer = setTimeout(() => setIsPlaying(true), 400)
    return () => clearTimeout(timer)
  }, [autoPlay])

  const playItem = useCallback(async (index: number) => {
    resumeAudioContext()
    setCurrentIndex(index)
    setError(false)
    setIsPlaying(true)
  }, [])

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    const onTimeUpdate = () => setCurrentTime(media.currentTime)
    const onLoadedMetadata = () => setDuration(media.duration || 0)
    const onEnded = () => {
      if (currentIndex < playlist.length - 1) {
        playItem(currentIndex + 1)
      } else {
        setIsPlaying(false)
      }
    }
    const onError = () => {
      setError(true)
      setIsPlaying(false)
    }

    media.addEventListener('timeupdate', onTimeUpdate)
    media.addEventListener('loadedmetadata', onLoadedMetadata)
    media.addEventListener('ended', onEnded)
    media.addEventListener('error', onError)

    return () => {
      media.removeEventListener('timeupdate', onTimeUpdate)
      media.removeEventListener('loadedmetadata', onLoadedMetadata)
      media.removeEventListener('ended', onEnded)
      media.removeEventListener('error', onError)
    }
  }, [currentIndex, playlist.length, playItem])

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return
    media.volume = settings.masterMuted ? 0 : settings.masterVolume
    if (isPlaying) {
      media.play().catch(() => setError(true))
    } else {
      media.pause()
    }
  }, [isPlaying, settings.masterVolume, settings.masterMuted, currentIndex])

  const togglePlay = () => {
    resumeAudioContext()
    setIsPlaying(p => !p)
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (mediaRef.current) {
      mediaRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (t: number) => {
    if (!isFinite(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const toggleFullscreen = () => {
    if (current.type !== 'video') return
    const el = videoContainerRef.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen()
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a]">
      {/* Now playing */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-0">
        {current.type === 'video' ? (
          <div ref={videoContainerRef} className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              key={current.id}
              src={current.src}
              className="w-full h-full object-contain"
              playsInline
            />
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-xs text-white/70">
                Video unavailable — demo file not found
              </div>
            )}
          </div>
        ) : (
          <div className="w-40 h-40 rounded-2xl accent-bg flex items-center justify-center shadow-2xl mb-6">
            {error ? (
              <Music size={48} className="text-white/80" />
            ) : (
              <span className="text-5xl">🎵</span>
            )}
            <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} key={current.id} src={current.src} preload="metadata" />
          </div>
        )}

        <h3 className="text-sm font-semibold mt-4 text-center">{current.title}</h3>
        <p className="text-[11px] text-[var(--text-muted)] capitalize">{current.type}</p>
        {error && current.type === 'audio' && (
          <p className="text-[10px] text-[var(--text-muted)] mt-2 text-center max-w-xs">
            Audio file not found. Add media files to /public/media/ or use the playlist controls.
          </p>
        )}

        {/* Progress */}
        <div className="w-full max-w-sm mt-4 px-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={seek}
            className="w-full h-1 accent-[var(--accent)] cursor-pointer"
            aria-label="Seek"
          />
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="shrink-0 p-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-center gap-4 mb-4">
          <button onClick={() => playItem(Math.max(0, currentIndex - 1))} className="p-2 rounded-full hover:bg-white/10 focus-ring" aria-label="Previous">
            <SkipBack size={18} />
          </button>
          <button onClick={togglePlay} className="p-3 rounded-full accent-bg text-white hover:opacity-90 focus-ring" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>
          <button onClick={() => playItem(Math.min(playlist.length - 1, currentIndex + 1))} className="p-2 rounded-full hover:bg-white/10 focus-ring" aria-label="Next">
            <SkipForward size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 max-w-sm mx-auto">
          <button
            onClick={() => updateSettings({ masterMuted: !settings.masterMuted })}
            className="p-1.5 rounded hover:bg-white/10 focus-ring"
            aria-label={settings.masterMuted ? 'Unmute' : 'Mute'}
          >
            {settings.masterMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={settings.masterMuted ? 0 : settings.masterVolume}
            onChange={e => updateSettings({ masterVolume: parseFloat(e.target.value), masterMuted: false })}
            className="flex-1 h-1 accent-[var(--accent)] cursor-pointer"
            aria-label="Volume"
          />
          {current.type === 'video' && (
            <button onClick={toggleFullscreen} className="p-1.5 rounded hover:bg-white/10 focus-ring" aria-label="Fullscreen">
              <Maximize size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Playlist */}
      <div className="shrink-0 max-h-32 overflow-y-auto border-t border-[var(--border)]">
        <div className="px-3 py-2 text-[10px] font-semibold text-[var(--text-muted)] uppercase">Playlist</div>
        {playlist.map((item, i) => (
          <PlaylistItem key={item.id} item={item} active={i === currentIndex} onClick={() => playItem(i)} />
        ))}
      </div>
    </div>
  )
}

function PlaylistItem({ item, active, onClick }: { item: MediaItem; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors focus-ring ${
        active ? 'bg-[var(--accent-subtle)]' : 'hover:bg-white/5'
      }`}
    >
      <span className="text-sm">{item.type === 'video' ? '🎬' : '🎵'}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs truncate">{item.title}</div>
        <div className="text-[10px] text-[var(--text-muted)]">{item.duration ?? item.type}</div>
      </div>
    </button>
  )
}
