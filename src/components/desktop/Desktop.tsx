import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDesktop } from '../../context/DesktopContext'
import { DesktopIconComponent } from './DesktopIcon'
import { wallpapers, wallpapersLight } from '../../data/settings'
import type { ContextMenuItem } from '../../types'
import { playSound } from '../../utils/sounds'

export function Desktop() {
  const {
    desktopIcons,
    selectedIconId,
    selectIcon,
    settings,
    setContextMenu,
    closeContextMenu,
    openWindow,
    sortDesktopIcons,
    setIconSize,
  } = useDesktop()
  const clickRipple = useRef<{ x: number; y: number; id: number } | null>(null)
  const rippleId = useRef(0)

  const wallpaperStyle = settings.theme === 'dark'
    ? wallpapers[settings.wallpaper]
    : wallpapersLight[settings.wallpaper]

  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectIcon(null)
      closeContextMenu()
      playSound('click')
      rippleId.current++
      clickRipple.current = { x: e.clientX, y: e.clientY, id: rippleId.current }
    }
  }, [selectIcon, closeContextMenu])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return
    e.preventDefault()
    selectIcon(null)

    const items: ContextMenuItem[] = [
      { id: 'view', label: 'View', submenu: [
        { id: 'large', label: 'Large icons', checked: settings.iconSize === 'large', action: () => setIconSize('large') },
        { id: 'medium', label: 'Medium icons', checked: settings.iconSize === 'medium', action: () => setIconSize('medium') },
        { id: 'small', label: 'Small icons', checked: settings.iconSize === 'small', action: () => setIconSize('small') },
      ]},
      { id: 'sort', label: 'Sort by', submenu: [
        { id: 'name', label: 'Name', checked: settings.iconSort === 'name', action: () => sortDesktopIcons('name') },
        { id: 'date', label: 'Date modified', checked: settings.iconSort === 'date', action: () => sortDesktopIcons('date') },
        { id: 'type', label: 'Type', checked: settings.iconSort === 'type', action: () => sortDesktopIcons('type') },
      ]},
      { id: 'refresh', label: 'Refresh', action: () => window.location.reload() },
      { id: 'divider1', label: '', divider: true },
      { id: 'new', label: 'New', submenu: [
        { id: 'folder', label: 'Folder', disabled: true },
        { id: 'shortcut', label: 'Shortcut', disabled: true },
      ]},
      { id: 'divider2', label: '', divider: true },
      { id: 'personalize', label: 'Personalize', action: () => openWindow('settings') },
      { id: 'divider3', label: '', divider: true },
      { id: 'terminal', label: 'Open Terminal', action: () => openWindow('terminal') },
    ]

    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, items })
  }, [selectIcon, setContextMenu, openWindow, settings.iconSize, settings.iconSort, setIconSize, sortDesktopIcons])

  return (
    <div
      className="absolute inset-0 bottom-12 overflow-hidden"
      style={{ background: wallpaperStyle }}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      role="main"
      aria-label="Desktop"
    >
      {/* Subtle wallpaper overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

      {/* Desktop icons */}
      {desktopIcons.map(icon => (
        <DesktopIconComponent
          key={icon.id}
          {...icon}
          selected={selectedIconId === icon.id}
        />
      ))}

      {/* Click ripple effect */}
      {clickRipple.current && (
        <motion.div
          key={clickRipple.current.id}
          className="absolute pointer-events-none rounded-full border border-white/20"
          style={{
            left: clickRipple.current.x - 20,
            top: clickRipple.current.y - 20,
            width: 40,
            height: 40,
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Developer mode indicator */}
      {settings.developerMode && (
        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-mono">
          DEV MODE
        </div>
      )}

      {/* Hidden easter egg file */}
      <button
        className="absolute bottom-16 right-4 opacity-[0.03] hover:opacity-30 transition-opacity text-[10px] text-white cursor-pointer"
        onDoubleClick={() => {
          playSound('notification')
          const el = document.createElement('div')
          el.className = 'fixed inset-0 z-[9000] pointer-events-none'
          el.innerHTML = '<div style="position:absolute;inset:0;background:radial-gradient(circle,rgba(0,120,212,0.3),transparent);animation:pulse 2s ease-out"></div>'
          document.body.appendChild(el)
          setTimeout(() => el.remove(), 2000)
        }}
        aria-hidden="true"
        tabIndex={-1}
      >
        .secret
      </button>
    </div>
  )
}
