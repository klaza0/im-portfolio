export type AppId =
  | 'about'
  | 'projects'
  | 'project-detail'
  | 'skills'
  | 'experience'
  | 'resume'
  | 'media'
  | 'settings'
  | 'terminal'
  | 'browser'
  | 'contact'
  | 'recycle-bin'
  | 'file-explorer'
  | 'file-viewer'
  | 'this-pc'

export type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'red'
export type ThemeMode = 'dark' | 'light'
export type WallpaperId = 'default' | 'abstract' | 'gradient' | 'minimal'
export type IconSize = 'large' | 'medium' | 'small'
export type IconSortMode = 'name' | 'date' | 'type'

export interface WindowState {
  id: string
  appId: AppId
  title: string
  icon: string
  x: number
  y: number
  width: number
  height: number
  minWidth?: number
  minHeight?: number
  zIndex: number
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
  prevBounds?: { x: number; y: number; width: number; height: number }
  snapZone?: 'left' | 'right' | 'top' | null
  payload?: Record<string, unknown>
}

export interface DesktopIcon {
  id: string
  appId: AppId
  label: string
  icon: string
  x: number
  y: number
}

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  dismissed?: boolean
}

export interface Settings {
  theme: ThemeMode
  accent: AccentColor
  wallpaper: WallpaperId
  iconSize: IconSize
  iconSort: IconSortMode
  soundEnabled: boolean
  animationsEnabled: boolean
  performanceMode: boolean
  reducedMotion: boolean
  highContrast: boolean
  onboardingComplete: boolean
  developerMode: boolean
  masterVolume: number
  masterMuted: boolean
}

export interface AppDefinition {
  id: AppId
  title: string
  icon: string
  defaultWidth: number
  defaultHeight: number
  minWidth?: number
  minHeight?: number
  pinned?: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  technologies: string[]
  features: string[]
  architecture: string
  challenges: string
  solutions: string
  tags: string[]
  status: 'completed' | 'in-progress' | 'archived'
  github?: string
  demo?: string
  screenshots: string[]
  icon: string
  screenshotLayout?: 'mobile' | 'desktop'
}

export interface SkillCategory {
  name: string
  skills: { name: string; level: 'beginner' | 'intermediate' | 'advanced' | 'expert' }[]
}

export interface ExperienceItem {
  id: string
  period: string
  title: string
  company: string
  description: string
  details: string[]
}

export interface Profile {
  name: string
  title: string
  bio: string
  location: string
  experience: string
  currentFocus: string
  technologies: string[]
  avatar: string
  startMenuAvatar: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface MediaItem {
  id: string
  title: string
  type: 'audio' | 'video'
  src: string
  thumbnail?: string
  duration?: string
}

export interface ContextMenuItem {
  id: string
  label: string
  icon?: string
  shortcut?: string
  divider?: boolean
  disabled?: boolean
  checked?: boolean
  submenu?: ContextMenuItem[]
  action?: () => void
}

export interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  items: ContextMenuItem[]
}
