import { motion, AnimatePresence } from 'framer-motion'
import { useDesktop } from '../../context/DesktopContext'
import { X } from 'lucide-react'
import { formatTime } from '../../utils/helpers'

export function NotificationPanel() {
  const { notificationPanelOpen, setNotificationPanelOpen, notifications, dismissNotification, clearNotifications } = useDesktop()

  return (
    <AnimatePresence>
      {notificationPanelOpen && (
        <>
          <div className="fixed inset-0 z-[6000]" onClick={() => setNotificationPanelOpen(false)} />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-14 right-4 z-[6001] w-[360px] max-w-[90vw] max-h-[480px] rounded-xl overflow-hidden shadow-2xl flex flex-col"
            style={{ background: 'var(--window-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--border)' }}
            role="dialog"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-xs accent-text hover:underline focus-ring"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {notifications.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-8">No new notifications</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg accent-bg flex items-center justify-center shrink-0 text-white text-xs font-bold">
                      IM
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium">{n.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{n.message}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-1">{formatTime(n.timestamp)}</div>
                    </div>
                    <button
                      onClick={() => dismissNotification(n.id)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all focus-ring"
                      aria-label="Dismiss notification"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
