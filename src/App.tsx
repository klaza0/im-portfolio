import { AnimatePresence } from 'framer-motion'
import { DesktopProvider } from './context/DesktopProvider'
import { useDesktop } from './context/DesktopContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Desktop } from './components/desktop/Desktop'
import { WindowManager } from './components/windows/WindowManager'
import { Taskbar } from './components/taskbar/Taskbar'
import { StartMenu } from './components/start-menu/StartMenu'
import { ContextMenu } from './components/context-menu/ContextMenu'
import { NotificationPanel } from './components/notifications/NotificationPanel'
import { SearchOverlay } from './components/SearchOverlay'
import { Onboarding } from './components/Onboarding'
import { BootScreen } from './components/BootScreen'
import { MobileLauncher } from './components/MobileLauncher'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { profile } from './data/profile'

function DesktopShell() {
  const { bootComplete, isMobile, windows } = useDesktop()
  useKeyboardShortcuts()

  const hasVisibleWindows = windows.some(w => !w.isMinimized)

  return (
    <div className="h-full w-full overflow-hidden relative bg-[#0a0a0f]">
      <AnimatePresence mode="wait">
        {!bootComplete && <BootScreen key="boot" />}
      </AnimatePresence>

      {bootComplete && (
        <>
          {!isMobile ? (
            <Desktop />
          ) : (
            !hasVisibleWindows && <MobileLauncher />
          )}
          <WindowManager />
          <Taskbar />
          <StartMenu />
          <NotificationPanel />
          <ContextMenu />
          <SearchOverlay />
          <Onboarding />
        </>
      )}

      {/* SEO-friendly hidden content for search engines */}
      <div className="sr-only" aria-hidden="false">
        <h1>{profile.name} — {profile.title}</h1>
        <p>{profile.bio}</p>
        <p>Interactive developer portfolio featuring web and mobile projects built with React, Kotlin, Android, Node.js, and Firebase.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <DesktopProvider>
        <DesktopShell />
      </DesktopProvider>
    </ErrorBoundary>
  )
}
