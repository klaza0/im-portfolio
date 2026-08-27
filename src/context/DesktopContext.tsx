import { createContext, useContext } from 'react'
import type { AppId, ContextMenuState, DesktopIcon, IconSize, IconSortMode, Notification, Settings, WindowState } from '../types'

export interface DesktopContextValue {
  windows: WindowState[]
  settings: Settings
  notifications: Notification[]
  desktopIcons: DesktopIcon[]
  selectedIconId: string | null
  startMenuOpen: boolean
  notificationPanelOpen: boolean
  searchOpen: boolean
  contextMenu: ContextMenuState
  bootComplete: boolean
  isMobile: boolean
  recentApps: AppId[]
  zIndexCounter: number

  openWindow: (appId: AppId, payload?: Record<string, unknown>) => void
  closeWindow: (windowId: string) => void
  minimizeWindow: (windowId: string) => void
  maximizeWindow: (windowId: string) => void
  restoreWindow: (windowId: string) => void
  focusWindow: (windowId: string) => void
  updateWindowBounds: (windowId: string, bounds: Partial<Pick<WindowState, 'x' | 'y' | 'width' | 'height' | 'snapZone'>>) => void
  toggleWindow: (appId: AppId) => void

  updateSettings: (partial: Partial<Settings>) => void
  addNotification: (title: string, message: string) => void
  dismissNotification: (id: string) => void
  clearNotifications: () => void

  setStartMenuOpen: (open: boolean) => void
  setNotificationPanelOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setContextMenu: (menu: ContextMenuState) => void
  closeContextMenu: () => void

  selectIcon: (id: string | null) => void
  moveIcon: (id: string, x: number, y: number) => void
  sortDesktopIcons: (mode: IconSortMode) => void
  setIconSize: (size: IconSize) => void
  setBootComplete: (complete: boolean) => void
  completeOnboarding: () => void
  switchToNextWindow: () => void
  closeActiveWindow: () => void
}

export const DesktopContext = createContext<DesktopContextValue | null>(null)

export function useDesktop(): DesktopContextValue {
  const ctx = useContext(DesktopContext)
  if (!ctx) throw new Error('useDesktop must be used within DesktopProvider')
  return ctx
}
