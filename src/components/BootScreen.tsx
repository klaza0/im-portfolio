import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useDesktop } from '../context/DesktopContext'
import { BOOT_MEDIA_ID } from '../data/media'
import { SYSTEM_NAME } from '../data/branding'
import { profile } from '../data/profile'

export function BootScreen() {
  const { setBootComplete, addNotification, openWindow } = useDesktop()

  useEffect(() => {
    const timer = setTimeout(() => {
      setBootComplete(true)
      openWindow('media', { mediaId: BOOT_MEDIA_ID, autoPlay: true })
      addNotification(`Welcome to ${SYSTEM_NAME}`, 'Feel free to explore the desktop. Double-click icons to open applications.')
    }, 2000)

    const n2 = setTimeout(() => addNotification('New project available', 'Vendly POS — Point-of-sale system for small businesses.'), 3500)
    const n3 = setTimeout(() => addNotification('IMNotesVoiceMemo updated', 'Check out the latest note-taking app in Projects.'), 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(n2)
      clearTimeout(n3)
    }
  }, [setBootComplete, addNotification, openWindow])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-[var(--surface-solid)]">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-light text-white tracking-wide">{SYSTEM_NAME}</h1>
          <p className="text-sm text-white/50 mt-2">Loading personal workspace...</p>
        </div>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
          <motion.div
            className="h-full accent-bg rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
