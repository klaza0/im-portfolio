import { motion, AnimatePresence } from 'framer-motion'
import { useDesktop } from '../../context/DesktopContext'
import { pinnedApps } from '../../data/settings'
import { profile } from '../../data/profile'
import { socials } from '../../data/socials'
import { recommendedProjects } from '../../data/projects'
import { playSound, resumeAudioContext } from '../../utils/sounds'
import { Power, Search } from 'lucide-react'
import type { AppId } from '../../types'
import { IconDisplay } from '../common/IconDisplay'
import { systemIcons } from '../../data/icons'

export function StartMenu() {
  const { startMenuOpen, setStartMenuOpen, openWindow } = useDesktop()

  const handleOpen = (appId: AppId) => {
    resumeAudioContext()
    playSound('open')
    openWindow(appId)
    setStartMenuOpen(false)
  }

  return (
    <AnimatePresence>
      {startMenuOpen && (
        <>
          <div className="fixed inset-0 z-[6000]" onClick={() => setStartMenuOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[6001] w-[580px] max-w-[95vw] rounded-xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--window-bg)', backdropFilter: 'blur(24px)' }}
            role="dialog"
            aria-label="Start Menu"
          >
            {/* Search bar */}
            <div className="p-4 pb-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-[var(--border)]">
                <Search size={16} className="text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Type here to search"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                  readOnly
                  onClick={() => { setStartMenuOpen(false); }}
                />
              </div>
            </div>

            <div className="flex px-4 pb-4 gap-4">
              {/* Pinned */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Pinned</span>
                  <button className="text-xs accent-text hover:underline">All apps ▸</button>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {pinnedApps.map(app => (
                    <button
                      key={app.id}
                      onClick={() => handleOpen(app.id)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-[var(--accent-subtle)] transition-colors focus-ring"
                    >
                      <IconDisplay icon={app.icon} className="text-2xl" imgClassName="w-8 h-8 object-contain" />
                      <span className="text-[11px] text-center leading-tight">{app.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended */}
              <div className="w-[220px] border-l border-[var(--border)] pl-4">
                <span className="text-xs font-semibold text-[var(--text-muted)] mb-3 block">Recommended</span>
                <div className="space-y-1">
                  {recommendedProjects.map(name => (
                    <button
                      key={name}
                      onClick={() => handleOpen('projects')}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left focus-ring"
                    >
                      <img src={systemIcons.folder} alt="" className="w-5 h-5 object-contain" draggable={false} />
                      <div>
                        <div className="text-xs font-medium">{name}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">Recently added</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* User profile footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]" style={{ background: 'var(--titlebar-bg)' }}>
              <div className="flex items-center gap-3">
                <img
                  src={profile.startMenuAvatar}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full object-cover border border-[var(--border)]"
                />
                <div>
                  <div className="text-xs font-medium">{profile.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{profile.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {socials.map(s => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors focus-ring"
                    aria-label={s.name}
                  >
                    <span className="text-sm">{s.icon === 'github' ? '🐙' : s.icon === 'linkedin' ? '💼' : '📧'}</span>
                  </a>
                ))}
                <button
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors focus-ring"
                  aria-label="Power"
                  onClick={() => window.location.reload()}
                >
                  <Power size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
