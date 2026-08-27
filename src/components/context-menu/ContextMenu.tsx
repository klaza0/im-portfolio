import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useDesktop } from '../../context/DesktopContext'
import type { ContextMenuItem } from '../../types'

export function ContextMenu() {
  const { contextMenu, closeContextMenu } = useDesktop()
  const [submenu, setSubmenu] = useState<{ items: ContextMenuItem[]; x: number; y: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contextMenu.visible) setSubmenu(null)
  }, [contextMenu.visible])

  if (!contextMenu.visible) return null

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.divider || item.disabled) return
    if (item.submenu) return
    item.action?.()
    closeContextMenu()
    setSubmenu(null)
  }

  const handleSubmenuEnter = (item: ContextMenuItem, e: React.MouseEvent) => {
    if (!item.submenu) {
      setSubmenu(null)
      return
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setSubmenu({ items: item.submenu, x: rect.right + 2, y: rect.top })
  }

  const handleClose = () => {
    setSubmenu(null)
    closeContextMenu()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[7000]"
        onClick={handleClose}
        onContextMenu={(e) => { e.preventDefault(); handleClose() }}
      />
      <div
        ref={menuRef}
        onMouseLeave={() => setSubmenu(null)}
        className="fixed z-[7001]"
        style={{ left: contextMenu.x, top: contextMenu.y }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="main-menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="glass rounded-lg py-1 min-w-[200px] shadow-xl"
            role="menu"
          >
            {contextMenu.items.map(item => {
              if (item.divider) {
                return <div key={item.id} className="my-1 border-t border-[var(--border)]" />
              }
              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-sm transition-colors text-left focus-ring ${
                    item.disabled ? 'opacity-40 cursor-default' : 'hover:bg-[var(--accent-subtle)]'
                  }`}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={(e) => handleSubmenuEnter(item, e)}
                  disabled={item.disabled}
                  role="menuitem"
                >
                  <span>{item.label}</span>
                  {item.shortcut && <span className="text-xs text-[var(--text-muted)] ml-4">{item.shortcut}</span>}
                  {item.submenu && <span className="text-xs text-[var(--text-muted)] ml-2">▸</span>}
                </button>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {submenu && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed glass rounded-lg py-1 min-w-[160px] shadow-xl z-[7002]"
            style={{ left: submenu.x, top: submenu.y }}
            role="menu"
            onMouseEnter={() => setSubmenu(submenu)}
          >
            {submenu.items.map(item => (
              <button
                key={item.id}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-sm hover:bg-[var(--accent-subtle)] transition-colors text-left focus-ring ${
                  item.disabled ? 'opacity-40 cursor-default' : ''
                }`}
                onClick={() => {
                  if (item.disabled) return
                  item.action?.()
                  handleClose()
                }}
                disabled={item.disabled}
                role="menuitem"
              >
                <span className="flex items-center gap-2">
                  {item.checked && <span className="text-[var(--accent)] text-xs">✓</span>}
                  {!item.checked && <span className="w-3" />}
                  {item.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </>
  )
}
