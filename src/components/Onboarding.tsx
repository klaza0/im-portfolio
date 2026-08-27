import { motion, AnimatePresence } from 'framer-motion'
import { useDesktop } from '../context/DesktopContext'
import { SYSTEM_NAME } from '../data/branding'
import { X } from 'lucide-react'

export function Onboarding() {
  const { settings, completeOnboarding } = useDesktop()

  if (settings.onboardingComplete) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl accent-bg flex items-center justify-center">
              <span className="text-lg font-bold text-white">IM</span>
            </div>
            <button
              onClick={completeOnboarding}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors focus-ring"
              aria-label="Skip tutorial"
            >
              <X size={18} className="text-[var(--text-muted)]" />
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-2">Welcome to {SYSTEM_NAME}</h2>
          <div className="space-y-3 text-sm text-[var(--text-muted)] mb-6">
            <p>👋 You've entered an interactive portfolio that works like a real desktop.</p>
            <p>🖱️ <strong className="text-[var(--text)]">Double-click</strong> an icon to open an application.</p>
            <p>🖱️ <strong className="text-[var(--text)]">Right-click</strong> the desktop for more options.</p>
            <p>⌨️ Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-xs">Win</kbd> to open the Start Menu.</p>
          </div>
          <button
            onClick={completeOnboarding}
            className="w-full py-2.5 rounded-lg accent-bg text-white font-medium hover:opacity-90 transition-opacity focus-ring"
          >
            Get Started
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
