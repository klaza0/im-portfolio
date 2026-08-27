import { motion } from 'framer-motion'
import { useCallback, useRef } from 'react'
import { useDesktop } from '../../context/DesktopContext'
import type { AppId } from '../../types'
import { playSound } from '../../utils/sounds'
import { iconSizeStyles } from '../../utils/desktopIcons'
import { IconDisplay } from '../common/IconDisplay'

interface DesktopIconProps {
  id: string
  appId: AppId
  label: string
  icon: string
  x: number
  y: number
  selected: boolean
}

const DRAG_THRESHOLD = 8

export function DesktopIconComponent({ id, appId, label, icon, x, y, selected }: DesktopIconProps) {
  const { openWindow, selectIcon, moveIcon, setContextMenu, isMobile, settings } = useDesktop()
  const sizeStyle = iconSizeStyles[settings.iconSize] ?? iconSizeStyles.medium
  const dragStart = useRef({ x: 0, y: 0, iconX: 0, iconY: 0 })
  const clickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const clickCount = useRef(0)
  const isPointerDown = useRef(false)
  const hasDragged = useRef(false)
  const activePointerId = useRef<number | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    selectIcon(id)
    isPointerDown.current = true
    hasDragged.current = false
    activePointerId.current = e.pointerId
    dragStart.current = { x: e.clientX, y: e.clientY, iconX: x, iconY: y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [id, x, y, selectIcon])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDown.current || isMobile || e.pointerId !== activePointerId.current) return
    if (e.buttons === 0) return

    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    if (!hasDragged.current && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      hasDragged.current = true
    }

    if (hasDragged.current) {
      moveIcon(id, dragStart.current.iconX + dx, dragStart.current.iconY + dy)
    }
  }, [id, isMobile, moveIcon])

  const finishPointer = useCallback((e: React.PointerEvent) => {
    if (e.pointerId !== activePointerId.current) return

    isPointerDown.current = false
    activePointerId.current = null

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }

    if (!hasDragged.current) {
      clickCount.current++
      if (clickCount.current === 1) {
        clickTimer.current = setTimeout(() => {
          clickCount.current = 0
        }, 300)
      } else if (clickCount.current === 2) {
        clearTimeout(clickTimer.current)
        clickCount.current = 0
        playSound('open')
        openWindow(appId)
      }
    }

    hasDragged.current = false
  }, [appId, openWindow])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    selectIcon(id)

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      items: [
        { id: 'open', label: 'Open', action: () => openWindow(appId) },
        { id: 'divider1', label: '', divider: true },
        { id: 'rename', label: 'Rename', disabled: true },
        { id: 'delete', label: 'Delete', disabled: true },
      ],
    })
  }, [id, appId, selectIcon, setContextMenu, openWindow])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      playSound('open')
      openWindow(appId)
    }
  }, [appId, openWindow])

  return (
    <motion.div
      className={`absolute flex flex-col items-center gap-1 p-2 rounded-lg cursor-default select-none group focus-ring touch-none ${
        selected ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'
      }`}
      style={{ left: x, top: y, width: sizeStyle.width }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${label} - double click to open`}
      whileTap={{ scale: 0.95 }}
      animate={selected ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.2 }}
    >
      <IconDisplay
        icon={icon}
        className={`${sizeStyle.image} drop-shadow-lg group-hover:scale-110 transition-transform duration-200 pointer-events-none`}
        imgClassName={`${sizeStyle.image} object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-200 pointer-events-none`}
      />
      <span className={`${sizeStyle.label} text-white text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium pointer-events-none`}>
        {label}
      </span>
    </motion.div>
  )
}
