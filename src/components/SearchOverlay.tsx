import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useDesktop } from '../context/DesktopContext'
import { appDefinitions } from '../data/settings'
import { projects } from '../data/projects'
import { Search, X } from 'lucide-react'
import { IconDisplay } from './common/IconDisplay'
import type { AppId } from '../types'

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, openWindow } = useDesktop()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const appResults = appDefinitions
      .filter(a => a.title.toLowerCase().includes(q))
      .map(a => ({ type: 'app' as const, id: a.id, title: a.title, icon: a.icon }))
    const projectResults = projects
      .filter(p => p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)))
      .map(p => ({ type: 'project' as const, id: p.id, title: p.title, icon: p.icon }))
    return [...appResults, ...projectResults].slice(0, 8)
  }, [query])

  const handleSelect = (item: { type: string; id: string; title: string }) => {
    if (item.type === 'app') {
      openWindow(item.id as AppId)
    } else {
      openWindow('project-detail', { projectId: item.id, projectTitle: item.title })
    }
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <div className="fixed inset-0 z-[7000] bg-black/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[7001] w-[560px] max-w-[90vw] rounded-xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--window-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--border)' }}
            role="dialog"
            aria-label="Search"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <Search size={18} className="text-[var(--text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search apps, projects..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="p-1 rounded hover:bg-white/10 focus-ring" aria-label="Close search">
                <X size={16} />
              </button>
            </div>
            {results.length > 0 && (
              <div className="p-2">
                {results.map(item => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--accent-subtle)] transition-colors text-left focus-ring"
                  >
                    <IconDisplay
                      icon={item.icon}
                      className="text-lg"
                      imgClassName="w-7 h-7 object-contain"
                    />
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)] capitalize">{item.type}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {query && results.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-6">No results found</p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
