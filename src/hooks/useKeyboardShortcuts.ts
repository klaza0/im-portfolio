import { useEffect, useCallback } from 'react'
import { useDesktop } from '../context/DesktopContext'
import { playSound, resumeAudioContext } from '../utils/sounds'

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function useKeyboardShortcuts() {
  const {
    setStartMenuOpen,
    startMenuOpen,
    setSearchOpen,
    searchOpen,
    closeContextMenu,
    closeActiveWindow,
    switchToNextWindow,
    updateSettings,
    settings,
  } = useDesktop()

  const konamiIndex = { current: 0 }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Meta' || e.key === 'Win') {
      e.preventDefault()
      resumeAudioContext()
      playSound('startMenu')
      setStartMenuOpen(!startMenuOpen)
      return
    }

    if (e.key === 'Escape') {
      if (searchOpen) { setSearchOpen(false); return }
      if (startMenuOpen) { setStartMenuOpen(false); return }
      closeContextMenu()
      return
    }

    if (e.altKey && e.key === 'F4') {
      e.preventDefault()
      closeActiveWindow()
      return
    }

    if (e.altKey && e.key === 'Tab') {
      e.preventDefault()
      switchToNextWindow()
      return
    }

    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault()
      setSearchOpen(true)
      return
    }

    // Konami code
    if (e.key === KONAMI_CODE[konamiIndex.current]) {
      konamiIndex.current++
      if (konamiIndex.current === KONAMI_CODE.length) {
        konamiIndex.current = 0
        updateSettings({ developerMode: !settings.developerMode })
        playSound('notification')
      }
    } else {
      konamiIndex.current = 0
    }
  }, [startMenuOpen, searchOpen, settings.developerMode, setStartMenuOpen, setSearchOpen, closeContextMenu, closeActiveWindow, switchToNextWindow, updateSettings])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
