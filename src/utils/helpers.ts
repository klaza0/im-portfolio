export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024)
}

export function getViewportSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}
