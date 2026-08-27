import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktop } from '../../../context/DesktopContext'
import { HardDrive, Folder, Monitor, Cpu, ShieldAlert, X } from 'lucide-react'
import type { AppId } from '../../../types'
import { SYSTEM_NAME, SYSTEM_VERSION, DEVELOPER_NAME, DRIVE_3M } from '../../../data/branding'
import { systemIcons } from '../../../data/icons'
import { playSound } from '../../../utils/sounds'
import { IconDisplay } from '../../common/IconDisplay'

const drives = [
  {
    id: 'drive-c',
    name: 'Local Disk (C:)',
    label: 'System',
    free: '128 GB free of 256 GB',
    icon: systemIcons.harddisk,
    authorized: false,
  },
  {
    id: 'drive-a',
    name: DRIVE_3M,
    label: 'Portfolio',
    free: '64 GB free of 128 GB',
    icon: systemIcons.folder,
    authorized: true,
  },
]

const folders: { label: string; appId: AppId; icon: string }[] = [
  { label: 'Desktop', appId: 'about', icon: systemIcons.folderDesktop },
  { label: 'Documents', appId: 'resume', icon: systemIcons.folderDocuments },
  { label: 'Downloads', appId: 'projects', icon: systemIcons.folderDownload },
  { label: 'Pictures', appId: 'projects', icon: systemIcons.folderPictures },
  { label: 'Music', appId: 'media', icon: systemIcons.folderMusic },
  { label: 'Videos', appId: 'media', icon: systemIcons.folderVideos },
]

export function ThisPCApp() {
  const { openWindow } = useDesktop()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [selectedDriveId, setSelectedDriveId] = useState<string | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

  const handleDriveDoubleClick = (drive: typeof drives[number]) => {
    if (!drive.authorized) {
      playSound('error')
      setAuthDialogOpen(true)
      return
    }
    playSound('open')
    openWindow('file-explorer', {
      initialPath: [DRIVE_3M],
    })
  }

  const handleFolderDoubleClick = (appId: AppId) => {
    playSound('open')
    openWindow(appId)
  }

  return (
    <div className="h-full overflow-y-auto p-4 relative">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
        <Monitor size={16} className="accent-text" />
        <span className="text-xs font-medium">This PC</span>
      </div>

      <section className="mb-6">
        <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1">
          <HardDrive size={12} /> Devices and drives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {drives.map(drive => (
            <button
              key={drive.id}
              onClick={() => setSelectedDriveId(drive.id)}
              onDoubleClick={() => handleDriveDoubleClick(drive)}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--accent-subtle)] transition-colors text-left focus-ring ${
                selectedDriveId === drive.id ? 'bg-white/10 ring-1 ring-white/15' : ''
              }`}
              aria-label={`${drive.name} — double-click to open`}
            >
              <IconDisplay icon={drive.icon} className="text-2xl" imgClassName="w-8 h-8 object-contain" />
              <div>
                <div className="text-xs font-medium">{drive.name}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{drive.free}</div>
                <div className="mt-1.5 h-1 w-full max-w-[120px] rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full accent-bg rounded-full"
                    style={{ width: drive.id === 'drive-c' ? '50%' : '65%' }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1">
          <Folder size={12} /> Folders
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {folders.map(folder => (
            <button
              key={folder.label}
              onClick={() => setSelectedFolder(folder.label)}
              onDoubleClick={() => handleFolderDoubleClick(folder.appId)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/5 transition-colors focus-ring ${
                selectedFolder === folder.label ? 'bg-white/10 ring-1 ring-white/15' : ''
              }`}
              aria-label={`${folder.label} — double-click to open`}
            >
              <IconDisplay icon={folder.icon} className="text-2xl" imgClassName="w-8 h-8 object-contain" />
              <span className="text-[11px]">{folder.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1">
          <Cpu size={12} /> System
        </h3>
        <div className="p-3 rounded-lg bg-white/5 text-xs space-y-1">
          <div className="flex justify-between"><span className="text-[var(--text-muted)]">OS</span><span>{SYSTEM_NAME} {SYSTEM_VERSION}</span></div>
          <div className="flex justify-between"><span className="text-[var(--text-muted)]">Developer</span><span>{DEVELOPER_NAME}</span></div>
          <div className="flex justify-between"><span className="text-[var(--text-muted)]">Processor</span><span>React Virtual DOM</span></div>
          <div className="flex justify-between"><span className="text-[var(--text-muted)]">Memory</span><span>∞ RAM (Cloud)</span></div>
        </div>
      </section>

      <AnimatePresence>
        {authDialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
              onClick={() => setAuthDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[320px] max-w-[90vw] rounded-xl shadow-2xl overflow-hidden"
              style={{ background: 'var(--window-bg)', border: '1px solid var(--border)' }}
              role="alertdialog"
              aria-labelledby="auth-dialog-title"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]" style={{ background: 'var(--titlebar-bg)' }}>
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-red-400" />
                  <span id="auth-dialog-title" className="text-xs font-semibold">Access Denied</span>
                </div>
                <button
                  onClick={() => setAuthDialogOpen(false)}
                  className="p-1 rounded hover:bg-white/10 focus-ring"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-3">
                  <ShieldAlert size={24} className="text-red-400" />
                </div>
                <p className="text-sm font-medium mb-1">You are not authorized</p>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Access to Local Disk (C:) is restricted. Please use {DRIVE_3M} to browse portfolio files.
                </p>
                <button
                  onClick={() => setAuthDialogOpen(false)}
                  className="mt-4 w-full py-2 rounded-lg accent-bg text-white text-xs font-medium hover:opacity-90 focus-ring"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
