import { useDesktop } from '../context/DesktopContext'
import { appDefinitions } from '../data/settings'
import { SYSTEM_NAME } from '../data/branding'
import type { AppId } from '../types'
import { IconDisplay } from './common/IconDisplay'

export function MobileLauncher() {
  const { openWindow } = useDesktop()

  const apps = appDefinitions.filter(a => a.pinned)

  return (
    <div className="fixed inset-0 z-[5000] flex flex-col" style={{ background: 'var(--win-bg-dark)' }}>
      <div className="flex-1 overflow-y-auto p-6 pt-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl accent-bg flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-2xl font-bold text-white">IM</span>
          </div>
          <h1 className="text-xl font-semibold">{SYSTEM_NAME}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Tap an app to open</p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {apps.map(app => (
            <button
              key={app.id}
              onClick={() => openWindow(app.id as AppId)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/5 active:scale-95 transition-all focus-ring"
            >
              <IconDisplay icon={app.icon} className="text-3xl" imgClassName="w-10 h-10 object-contain" />
              <span className="text-[11px] text-center leading-tight">{app.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
