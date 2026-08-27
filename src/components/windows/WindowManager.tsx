import { AnimatePresence } from 'framer-motion'
import { useDesktop } from '../../context/DesktopContext'
import { WindowFrame } from './WindowFrame'

export function WindowManager() {
  const { windows } = useDesktop()

  return (
    <AnimatePresence>
      {windows.map(win => (
        <WindowFrame key={win.id} window={win} />
      ))}
    </AnimatePresence>
  )
}
