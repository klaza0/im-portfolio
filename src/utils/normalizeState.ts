import { defaultSettings } from '../data/settings'
import { getAppIcon } from '../data/icons'
import type { AppId, DesktopIcon, IconSize, IconSortMode, Settings, ThemeMode, WallpaperId, AccentColor } from '../types'

const ICON_SIZES: IconSize[] = ['large', 'medium', 'small']
const ICON_SORTS: IconSortMode[] = ['name', 'date', 'type']
const THEMES: ThemeMode[] = ['dark', 'light']
const WALLPAPERS: WallpaperId[] = ['default', 'abstract', 'gradient', 'minimal']
const ACCENTS: AccentColor[] = ['blue', 'purple', 'green', 'orange', 'pink', 'red']

export function normalizeSettings(stored: Partial<Settings> | null | undefined): Settings {
  const merged = { ...defaultSettings, ...(stored ?? {}) }

  return {
    ...merged,
    theme: THEMES.includes(merged.theme) ? merged.theme : defaultSettings.theme,
    accent: ACCENTS.includes(merged.accent) ? merged.accent : defaultSettings.accent,
    wallpaper: WALLPAPERS.includes(merged.wallpaper) ? merged.wallpaper : defaultSettings.wallpaper,
    iconSize: ICON_SIZES.includes(merged.iconSize) ? merged.iconSize : defaultSettings.iconSize,
    iconSort: ICON_SORTS.includes(merged.iconSort) ? merged.iconSort : defaultSettings.iconSort,
    soundEnabled: Boolean(merged.soundEnabled),
    animationsEnabled: Boolean(merged.animationsEnabled),
    performanceMode: Boolean(merged.performanceMode),
    reducedMotion: Boolean(merged.reducedMotion),
    highContrast: Boolean(merged.highContrast),
    onboardingComplete: Boolean(merged.onboardingComplete),
    developerMode: Boolean(merged.developerMode),
    masterVolume: typeof merged.masterVolume === 'number' ? merged.masterVolume : defaultSettings.masterVolume,
    masterMuted: Boolean(merged.masterMuted),
  }
}

export function normalizeDesktopIcons(stored: unknown, fallback: DesktopIcon[]): DesktopIcon[] {
  const icons = Array.isArray(stored) ? stored : fallback

  return icons
    .filter((icon): icon is DesktopIcon => Boolean(icon && typeof icon === 'object' && 'appId' in icon))
    .map(icon => ({
      ...icon,
      icon: getAppIcon(icon.appId as AppId),
    }))
}

export function normalizeRecentApps(stored: unknown): AppId[] {
  if (!Array.isArray(stored)) return []
  return stored.filter((id): id is AppId => typeof id === 'string')
}
