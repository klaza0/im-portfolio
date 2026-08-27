const STORAGE_PREFIX = 'ibrahimos_'

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as T
    if (parsed === null || parsed === undefined) return fallback
    return parsed
  } catch {
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch { /* ignore */ }
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key)
}
