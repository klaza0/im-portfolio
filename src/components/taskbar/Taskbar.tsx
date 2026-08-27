import { useMemo, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktop } from '../../context/DesktopContext'
import { pinnedApps, appDefinitions } from '../../data/settings'
import { formatTime, formatDate } from '../../utils/helpers'
import { playSound, resumeAudioContext } from '../../utils/sounds'
import { Wifi, Volume2, VolumeX, Battery, Bell, Music } from 'lucide-react'
import type { AppId } from '../../types'
import { IconDisplay } from '../common/IconDisplay'
import { systemIcons } from '../../data/icons'

type FlyoutType = 'volume' | 'wifi' | 'battery' | null

export function Taskbar() {
  const {
    windows,
    toggleWindow,
    openWindow,
    setStartMenuOpen,
    startMenuOpen,
    setNotificationPanelOpen,
    notificationPanelOpen,
    notifications,
    setSearchOpen,
    settings,
    updateSettings,
  } = useDesktop()

  const [time, setTime] = useState(new Date())
  const [flyout, setFlyout] = useState<FlyoutType>(null)
  const trayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        setFlyout(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const taskbarApps = useMemo(() => {
    const ids = new Set<AppId>()
    pinnedApps.forEach(app => ids.add(app.id))
    windows.forEach(w => ids.add(w.appId))
    return [...ids]
      .map(id => appDefinitions.find(a => a.id === id))
      .filter(Boolean) as typeof appDefinitions
  }, [windows])

  const handleStartClick = () => {
    resumeAudioContext()
    playSound('startMenu')
    setStartMenuOpen(!startMenuOpen)
    setNotificationPanelOpen(false)
    setFlyout(null)
  }

  const handleAppClick = (appId: AppId) => {
    resumeAudioContext()
    setFlyout(null)
    toggleWindow(appId)
  }

  const toggleFlyout = (type: FlyoutType) => {
    setFlyout(prev => prev === type ? null : type)
    setStartMenuOpen(false)
    setNotificationPanelOpen(false)
  }

  const isAppActive = (appId: AppId) =>
    windows.some(w => w.appId === appId && w.isFocused && !w.isMinimized)

  const isAppRunning = (appId: AppId) =>
    windows.some(w => w.appId === appId && !w.isMinimized)

  const handleVolumeChange = (value: number) => {
    resumeAudioContext()
    updateSettings({ masterVolume: value, masterMuted: false })
  }

  const toggleMute = () => {
    resumeAudioContext()
    updateSettings({ masterMuted: !settings.masterMuted })
  }

  const openMediaPlayer = () => {
    openWindow('media')
    setFlyout(null)
  }

  return (
    <div
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[6500] flex items-center h-12 px-2 gap-1 rounded-xl shadow-lg"
      style={{ background: 'var(--taskbar-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--border)' }}
      role="toolbar"
      aria-label="Taskbar"
    >
      {/* Start button */}
      <button
        onClick={handleStartClick}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors focus-ring ${
          startMenuOpen ? 'accent-bg text-white' : 'hover:bg-white/10'
        }`}
        aria-label="Start Menu"
        title="Start"
      >
        <img src={systemIcons.start} alt="" className="w-5 h-5 object-contain" draggable={false} />
      </button>

      {/* Search */}
      <button
        onClick={() => { setSearchOpen(true); setFlyout(null) }}
        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors focus-ring"
        aria-label="Search"
        title="Search (Ctrl+K)"
      >
        <img src={systemIcons.search} alt="" className="w-4 h-4 object-contain opacity-90" draggable={false} />
      </button>

      <div className="w-px h-6 bg-[var(--border)] mx-1" />

      {/* Pinned / Running apps */}
      <div className="flex items-center gap-0.5 max-w-[40vw] overflow-x-auto">
        {taskbarApps.map(app => (
          <button
            key={app.id}
            onClick={() => handleAppClick(app.id)}
            className={`relative w-10 h-10 shrink-0 flex items-center justify-center rounded-lg transition-colors focus-ring ${
              isAppActive(app.id) ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
            aria-label={app.title}
            title={app.title}
          >
            <IconDisplay icon={app.icon} className="text-lg" imgClassName="w-6 h-6 object-contain" />
            {isAppRunning(app.id) && (
              <div className={`absolute bottom-0.5 w-4 h-[3px] rounded-full ${
                isAppActive(app.id) ? 'accent-bg' : 'bg-white/30'
              }`} />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-2" />

      {/* System tray */}
      <div ref={trayRef} className="relative flex items-center gap-1">
        {/* Wi-Fi */}
        <button
          onClick={() => toggleFlyout('wifi')}
          className={`p-1.5 rounded transition-colors focus-ring ${flyout === 'wifi' ? 'bg-white/15' : 'hover:bg-white/10'}`}
          aria-label="Wi-Fi"
          title="Network"
        >
          <Wifi size={14} />
        </button>

        {/* Volume */}
        <button
          onClick={() => toggleFlyout('volume')}
          className={`p-1.5 rounded transition-colors focus-ring ${flyout === 'volume' ? 'bg-white/15' : 'hover:bg-white/10'}`}
          aria-label="Volume"
          title="Volume"
        >
          {settings.masterMuted || settings.masterVolume === 0
            ? <VolumeX size={14} />
            : <Volume2 size={14} />}
        </button>

        {/* Battery */}
        <button
          onClick={() => toggleFlyout('battery')}
          className={`p-1.5 rounded transition-colors focus-ring ${flyout === 'battery' ? 'bg-white/15' : 'hover:bg-white/10'}`}
          aria-label="Battery"
          title="Battery"
        >
          <Battery size={14} />
        </button>

        {/* Notifications */}
        <button
          onClick={() => {
            setNotificationPanelOpen(!notificationPanelOpen)
            setStartMenuOpen(false)
            setFlyout(null)
          }}
          className={`relative p-1.5 rounded transition-colors focus-ring ${
            notificationPanelOpen ? 'bg-white/15' : 'hover:bg-white/10'
          }`}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={14} />
          {notifications.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full accent-bg text-[8px] flex items-center justify-center text-white font-bold">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Clock */}
        <button
          className="flex flex-col items-end px-2 py-1 rounded hover:bg-white/10 transition-colors focus-ring"
          aria-label="Date and time"
          title={time.toLocaleString()}
        >
          <span className="text-[11px] leading-none">{formatTime(time)}</span>
          <span className="text-[10px] text-[var(--text-muted)] leading-none mt-0.5">{formatDate(time)}</span>
        </button>

        {/* Flyouts */}
        <AnimatePresence>
          {flyout && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-64 rounded-xl shadow-2xl overflow-hidden"
              style={{ background: 'var(--window-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--border)' }}
            >
              {flyout === 'volume' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold">Volume</span>
                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg hover:bg-white/10 focus-ring"
                      aria-label={settings.masterMuted ? 'Unmute' : 'Mute'}
                    >
                      {settings.masterMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={settings.masterMuted ? 0 : settings.masterVolume}
                    onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-1 accent-[var(--accent)] cursor-pointer"
                    aria-label="Volume slider"
                  />
                  <div className="text-[10px] text-[var(--text-muted)] mt-2 text-center">
                    {Math.round((settings.masterMuted ? 0 : settings.masterVolume) * 100)}%
                  </div>
                  <button
                    onClick={openMediaPlayer}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-[var(--accent-subtle)] text-xs transition-colors focus-ring"
                  >
                    <Music size={14} />
                    Open Media Player
                  </button>
                </div>
              )}

              {flyout === 'wifi' && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi size={16} className="accent-text" />
                    <span className="text-xs font-semibold">Wi-Fi</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">Connected</p>
                  <p className="text-sm font-medium mt-1">Ibrahim_Network</p>
                  <p className="text-[10px] text-green-400 mt-2">● Internet access</p>
                </div>
              )}

              {flyout === 'battery' && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Battery size={16} className="accent-text" />
                    <span className="text-xs font-semibold">Battery</span>
                  </div>
                  <p className="text-2xl font-light">87%</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Plugged in, charging</p>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[87%] accent-bg rounded-full" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
