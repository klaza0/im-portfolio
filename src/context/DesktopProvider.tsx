import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { desktopIcons as defaultIcons, appDefinitions } from '../data/settings'
import { DesktopContext, type DesktopContextValue } from './DesktopContext'
import type { AppId, ContextMenuState, DesktopIcon, Notification, Settings, WindowState } from '../types'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import { normalizeDesktopIcons, normalizeRecentApps, normalizeSettings } from '../utils/normalizeState'
import { generateId, isMobileDevice } from '../utils/helpers'
import { playSound, setSoundEnabled, setMasterAudio, resumeAudioContext } from '../utils/sounds'
import { layoutDesktopIcons, sortDesktopIcons as sortIconsLayout } from '../utils/desktopIcons'
import type { IconSize, IconSortMode } from '../types'

const TASKBAR_HEIGHT = 48
const SNAP_THRESHOLD = 20

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() =>
    normalizeSettings(loadFromStorage<Partial<Settings>>('settings', {}))
  )
  const [windows, setWindows] = useState<WindowState[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>(() =>
    normalizeDesktopIcons(loadFromStorage('desktopIcons', defaultIcons), defaultIcons)
  )
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null)
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [contextMenu, setContextMenuState] = useState<ContextMenuState>({
    visible: false, x: 0, y: 0, items: [],
  })
  const [bootComplete, setBootComplete] = useState(false)
  const [isMobile, setIsMobile] = useState(isMobileDevice)
  const [recentApps, setRecentApps] = useState<AppId[]>(() =>
    normalizeRecentApps(loadFromStorage('recentApps', [] as AppId[]))
  )
  const zIndexRef = useRef(100)

  useEffect(() => {
    saveToStorage('settings', settings)
    setSoundEnabled(settings.soundEnabled)
    setMasterAudio(settings.masterVolume, settings.masterMuted)
    document.documentElement.setAttribute('data-theme', settings.theme)
    document.documentElement.setAttribute('data-accent', settings.accent)
    document.documentElement.setAttribute('data-performance', String(settings.performanceMode))
    document.documentElement.setAttribute('data-reduced-motion', String(settings.reducedMotion))
    document.documentElement.setAttribute('data-high-contrast', String(settings.highContrast))
  }, [settings])

  useEffect(() => {
    saveToStorage('desktopIcons', desktopIcons)
  }, [desktopIcons])

  useEffect(() => {
    saveToStorage('recentApps', recentApps)
  }, [recentApps])

  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileDevice())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getNextZIndex = () => ++zIndexRef.current

  const openWindow = useCallback((appId: AppId, payload?: Record<string, unknown>) => {
    resumeAudioContext()
    playSound('open')

    setWindows(prev => {
      const existing = prev.find(w =>
        w.appId === appId &&
        appId !== 'project-detail' &&
        appId !== 'file-viewer' &&
        !w.isMinimized
      )
      if (existing && appId !== 'project-detail' && appId !== 'file-viewer') {
        return prev.map(w => ({
          ...w,
          isFocused: w.id === existing.id,
          zIndex: w.id === existing.id ? getNextZIndex() : w.zIndex,
          isMinimized: w.id === existing.id ? false : w.isMinimized,
        }))
      }

      const app = appDefinitions.find(a => a.id === appId)
      if (!app) return prev

      const vw = window.innerWidth
      const vh = window.innerHeight - TASKBAR_HEIGHT
      const offset = prev.length * 30

      let title = app.title
      if (appId === 'project-detail' && payload?.projectTitle) {
        title = String(payload.projectTitle)
      }
      if (appId === 'file-viewer' && payload?.title) {
        title = String(payload.title)
      }

      const newWindow: WindowState = {
        id: generateId(),
        appId,
        title,
        icon: app.icon,
        x: isMobileDevice() ? 0 : Math.min(80 + offset, vw - app.defaultWidth - 40),
        y: isMobileDevice() ? 0 : Math.min(40 + offset, vh - app.defaultHeight - 40),
        width: isMobileDevice() ? vw : app.defaultWidth,
        height: isMobileDevice() ? vh : app.defaultHeight,
        minWidth: app.minWidth,
        minHeight: app.minHeight,
        zIndex: getNextZIndex(),
        isMinimized: false,
        isMaximized: isMobileDevice(),
        isFocused: true,
        payload,
      }

      return [
        ...prev.map(w => ({ ...w, isFocused: false })),
        newWindow,
      ]
    })

    setRecentApps(prev => {
      const filtered = prev.filter(id => id !== appId)
      return [appId, ...filtered].slice(0, 6)
    })

    setStartMenuOpen(false)
    setSearchOpen(false)
  }, [])

  const closeWindow = useCallback((windowId: string) => {
    playSound('close')
    setWindows(prev => prev.filter(w => w.id !== windowId))
  }, [])

  const minimizeWindow = useCallback((windowId: string) => {
    playSound('minimize')
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, isMinimized: true, isFocused: false } : w
    ))
  }, [])

  const maximizeWindow = useCallback((windowId: string) => {
    playSound('maximize')
    setWindows(prev => prev.map(w => {
      if (w.id !== windowId) return w
      const vw = window.innerWidth
      const vh = window.innerHeight - TASKBAR_HEIGHT
      return {
        ...w,
        isMaximized: true,
        isFocused: true,
        zIndex: getNextZIndex(),
        prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
        x: 0,
        y: 0,
        width: vw,
        height: vh,
      }
    }))
  }, [])

  const restoreWindow = useCallback((windowId: string) => {
    playSound('open')
    setWindows(prev => prev.map(w => {
      if (w.id !== windowId) return w
      if (w.prevBounds) {
        return {
          ...w,
          isMaximized: false,
          isFocused: true,
          zIndex: getNextZIndex(),
          x: w.prevBounds.x,
          y: w.prevBounds.y,
          width: w.prevBounds.width,
          height: w.prevBounds.height,
          prevBounds: undefined,
          snapZone: null,
        }
      }
      return { ...w, isMaximized: false, isFocused: true, zIndex: getNextZIndex() }
    }))
  }, [])

  const focusWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => ({
      ...w,
      isFocused: w.id === windowId,
      isMinimized: w.id === windowId ? false : w.isMinimized,
      zIndex: w.id === windowId ? getNextZIndex() : w.zIndex,
    })))
  }, [])

  const updateWindowBounds = useCallback((
    windowId: string,
    bounds: Partial<Pick<WindowState, 'x' | 'y' | 'width' | 'height' | 'snapZone'>>
  ) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, ...bounds, isMaximized: false } : w
    ))
  }, [])

  const toggleWindow = useCallback((appId: AppId) => {
    resumeAudioContext()
    setWindows(prev => {
      const appWindows = prev.filter(w => w.appId === appId)
      if (appWindows.length === 0) {
        queueMicrotask(() => openWindow(appId))
        return prev
      }

      const top = [...appWindows].sort((a, b) => b.zIndex - a.zIndex)[0]

      if (top.isFocused && !top.isMinimized) {
        playSound('minimize')
        return prev.map(w =>
          w.id === top.id ? { ...w, isMinimized: true, isFocused: false } : w
        )
      }

      playSound('open')
      return prev.map(w => ({
        ...w,
        isFocused: w.id === top.id,
        isMinimized: w.id === top.id ? false : w.isMinimized,
        zIndex: w.id === top.id ? getNextZIndex() : w.zIndex,
      }))
    })
  }, [openWindow])

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...partial }))
  }, [])

  const addNotification = useCallback((title: string, message: string) => {
    playSound('notification')
    setNotifications(prev => [{
      id: generateId(),
      title,
      message,
      timestamp: new Date(),
    }, ...prev])
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const setContextMenu = useCallback((menu: ContextMenuState) => {
    playSound('contextMenu')
    setContextMenuState(menu)
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenuState(prev => ({ ...prev, visible: false }))
  }, [])

  const selectIcon = useCallback((id: string | null) => {
    setSelectedIconId(id)
    if (id) playSound('click')
  }, [])

  const moveIcon = useCallback((id: string, x: number, y: number) => {
    setDesktopIcons(prev => prev.map(icon =>
      icon.id === id ? { ...icon, x, y } : icon
    ))
  }, [])

  const sortDesktopIcons = useCallback((mode: IconSortMode) => {
    updateSettings({ iconSort: mode })
    setDesktopIcons(icons => sortIconsLayout(icons, mode, settings.iconSize))
    playSound('click')
  }, [settings.iconSize, updateSettings])

  const setIconSize = useCallback((size: IconSize) => {
    updateSettings({ iconSize: size })
    setDesktopIcons(icons => layoutDesktopIcons(icons, size))
    playSound('click')
  }, [updateSettings])

  const completeOnboarding = useCallback(() => {
    updateSettings({ onboardingComplete: true })
  }, [updateSettings])

  const switchToNextWindow = useCallback(() => {
    setWindows(prev => {
      const visible = prev.filter(w => !w.isMinimized)
      if (visible.length <= 1) return prev
      const currentIdx = visible.findIndex(w => w.isFocused)
      const nextIdx = (currentIdx + 1) % visible.length
      const nextId = visible[nextIdx].id
      return prev.map(w => ({
        ...w,
        isFocused: w.id === nextId,
        zIndex: w.id === nextId ? getNextZIndex() : w.zIndex,
      }))
    })
  }, [])

  const closeActiveWindow = useCallback(() => {
    setWindows(prev => {
      const active = prev.find(w => w.isFocused)
      if (active) {
        playSound('close')
        return prev.filter(w => w.id !== active.id)
      }
      return prev
    })
  }, [])

  const value = useMemo<DesktopContextValue>(() => ({
    windows,
    settings,
    notifications,
    desktopIcons,
    selectedIconId,
    startMenuOpen,
    notificationPanelOpen,
    searchOpen,
    contextMenu,
    bootComplete,
    isMobile,
    recentApps,
    zIndexCounter: zIndexRef.current,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowBounds,
    toggleWindow,
    updateSettings,
    addNotification,
    dismissNotification,
    clearNotifications,
    setStartMenuOpen,
    setNotificationPanelOpen,
    setSearchOpen,
    setContextMenu,
    closeContextMenu,
    selectIcon,
    moveIcon,
    sortDesktopIcons,
    setIconSize,
    setBootComplete,
    completeOnboarding,
    switchToNextWindow,
    closeActiveWindow,
  }), [
    windows, settings, notifications, desktopIcons, selectedIconId,
    startMenuOpen, notificationPanelOpen, searchOpen, contextMenu,
    bootComplete, isMobile, recentApps,
    openWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow,
    focusWindow, updateWindowBounds, toggleWindow, updateSettings,
    addNotification, dismissNotification, clearNotifications,
    setContextMenu, closeContextMenu, selectIcon, moveIcon,
    sortDesktopIcons, setIconSize,
    completeOnboarding, switchToNextWindow, closeActiveWindow,
  ])

  return (
    <DesktopContext.Provider value={value}>
      {children}
    </DesktopContext.Provider>
  )
}

export { TASKBAR_HEIGHT, SNAP_THRESHOLD }
