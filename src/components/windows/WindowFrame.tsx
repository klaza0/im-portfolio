import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { Minus, Square, X, Copy } from 'lucide-react'
import { useDesktop } from '../../context/DesktopContext'
import { TASKBAR_HEIGHT, SNAP_THRESHOLD } from '../../context/DesktopProvider'
import { clamp } from '../../utils/helpers'
import { AppRenderer } from '../apps/AppRenderer'
import { IconDisplay } from '../common/IconDisplay'
import type { WindowState } from '../../types'

interface WindowFrameProps {
  window: WindowState
}

export function WindowFrame({ window: win }: WindowFrameProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowBounds,
    isMobile,
    settings,
  } = useDesktop()

  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null)
  const resizeRef = useRef<{ startX: number; startY: number; winW: number; winH: number; winX: number; winY: number; dir: string } | null>(null)
  const [snapPreview, setSnapPreview] = useState<'left' | 'right' | 'top' | null>(null)

  const handleTitleBarPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    focusWindow(win.id)
    if (win.isMaximized) return

    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [win.id, win.x, win.y, win.isMaximized, focusWindow])

  const handleTitleBarPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || win.isMaximized) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    const newX = clamp(dragRef.current.winX + dx, -win.width / 2, window.innerWidth - win.width / 2)
    const newY = clamp(dragRef.current.winY + dy, 0, window.innerHeight - TASKBAR_HEIGHT - 40)

    updateWindowBounds(win.id, { x: newX, y: newY })

    // Snap detection
    if (newX <= SNAP_THRESHOLD) setSnapPreview('left')
    else if (newX + win.width >= window.innerWidth - SNAP_THRESHOLD) setSnapPreview('right')
    else if (newY <= SNAP_THRESHOLD) setSnapPreview('top')
    else setSnapPreview(null)
  }, [win.id, win.width, win.isMaximized, updateWindowBounds])

  const handleTitleBarPointerUp = useCallback(() => {
    if (snapPreview && !isMobile) {
      const vw = window.innerWidth
      const vh = window.innerHeight - TASKBAR_HEIGHT
      if (snapPreview === 'left') {
        updateWindowBounds(win.id, { x: 0, y: 0, width: vw / 2, height: vh, snapZone: 'left' })
      } else if (snapPreview === 'right') {
        updateWindowBounds(win.id, { x: vw / 2, y: 0, width: vw / 2, height: vh, snapZone: 'right' })
      } else if (snapPreview === 'top') {
        maximizeWindow(win.id)
      }
    }
    setSnapPreview(null)
    dragRef.current = null
  }, [snapPreview, win.id, isMobile, updateWindowBounds, maximizeWindow])

  const handleTitleBarDoubleClick = useCallback(() => {
    if (win.isMaximized) restoreWindow(win.id)
    else maximizeWindow(win.id)
  }, [win.id, win.isMaximized, restoreWindow, maximizeWindow])

  const handleResizePointerDown = useCallback((e: React.PointerEvent, dir: string) => {
    e.stopPropagation()
    focusWindow(win.id)
    resizeRef.current = {
      startX: e.clientX, startY: e.clientY,
      winW: win.width, winH: win.height,
      winX: win.x, winY: win.y, dir,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [win.id, win.width, win.height, win.x, win.y, focusWindow])

  const handleResizePointerMove = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return
    const { startX, startY, winW, winH, winX, winY, dir } = resizeRef.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const minW = win.minWidth || 300
    const minH = win.minHeight || 200

    let newW = winW, newH = winH, newX = winX, newY = winY

    if (dir.includes('e')) newW = Math.max(minW, winW + dx)
    if (dir.includes('w')) { newW = Math.max(minW, winW - dx); newX = winX + (winW - newW) }
    if (dir.includes('s')) newH = Math.max(minH, winH + dy)
    if (dir.includes('n')) { newH = Math.max(minH, winH - dy); newY = winY + (winH - newH) }

    updateWindowBounds(win.id, { x: newX, y: newY, width: newW, height: newH })
  }, [win.id, win.minWidth, win.minHeight, updateWindowBounds])

  const handleResizePointerUp = useCallback(() => {
    resizeRef.current = null
  }, [])

  const animEnabled = settings.animationsEnabled && !settings.reducedMotion

  if (win.isMinimized) return null

  return (
    <>
      {/* Snap preview overlay */}
      <AnimatePresence>
        {snapPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-[5000] bg-[var(--accent-subtle)] border-2 border-[var(--accent)] rounded-lg pointer-events-none"
            style={{
              ...(snapPreview === 'left' ? { left: 0, top: 0, width: '50%', height: `calc(100% - ${TASKBAR_HEIGHT}px)` } : {}),
              ...(snapPreview === 'right' ? { right: 0, top: 0, width: '50%', height: `calc(100% - ${TASKBAR_HEIGHT}px)` } : {}),
              ...(snapPreview === 'top' ? { left: 0, top: 0, width: '100%', height: `calc(100% - ${TASKBAR_HEIGHT}px)` } : {}),
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed flex flex-col rounded-xl overflow-hidden ${
          win.isFocused ? 'shadow-2xl ring-1 ring-white/10' : 'shadow-lg opacity-95'
        }`}
        style={{
          left: win.x,
          top: win.y,
          width: win.width,
          height: win.height,
          zIndex: win.zIndex,
          background: 'var(--window-bg)',
          backdropFilter: settings.performanceMode ? 'none' : `blur(${settings.performanceMode ? 0 : 12}px)`,
        }}
        initial={animEnabled ? { opacity: 0, scale: 0.95, y: 10 } : false}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={animEnabled ? { opacity: 0, scale: 0.95, y: 10 } : undefined}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        onMouseDown={() => focusWindow(win.id)}
        role="dialog"
        aria-label={win.title}
      >
        {/* Title bar */}
        <div
          className="flex items-center h-9 px-3 shrink-0 cursor-default select-none"
          style={{ background: 'var(--titlebar-bg)' }}
          onPointerDown={handleTitleBarPointerDown}
          onPointerMove={handleTitleBarPointerMove}
          onPointerUp={handleTitleBarPointerUp}
          onDoubleClick={handleTitleBarDoubleClick}
        >
          <IconDisplay icon={win.icon} className="text-sm" imgClassName="w-4 h-4 object-contain mr-2" />
          <span className="text-xs font-medium flex-1 truncate">{win.title}</span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => minimizeWindow(win.id)}
              className="w-8 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors focus-ring"
              aria-label="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
              className="w-8 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors focus-ring"
              aria-label={win.isMaximized ? 'Restore' : 'Maximize'}
            >
              {win.isMaximized ? <Copy size={12} /> : <Square size={12} />}
            </button>
            <button
              onClick={() => closeWindow(win.id)}
              className="w-8 h-7 flex items-center justify-center rounded hover:bg-red-500 transition-colors focus-ring"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AppRenderer appId={win.appId} windowId={win.id} payload={win.payload} />
        </div>

        {/* Resize handles */}
        {!win.isMaximized && !isMobile && (
          <>
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onPointerDown={(e) => handleResizePointerDown(e, 'se')} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} />
            <div className="absolute bottom-0 left-0 right-4 h-1 cursor-s-resize" onPointerDown={(e) => handleResizePointerDown(e, 's')} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} />
            <div className="absolute top-9 right-0 bottom-4 w-1 cursor-e-resize" onPointerDown={(e) => handleResizePointerDown(e, 'e')} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} />
          </>
        )}
      </motion.div>
    </>
  )
}
