import type { AppDefinition, Settings } from '../types'
import { appIcons } from './icons'

export const defaultSettings: Settings = {
  theme: 'dark',
  accent: 'blue',
  wallpaper: 'default',
  iconSize: 'medium',
  iconSort: 'date',
  soundEnabled: true,
  animationsEnabled: true,
  performanceMode: false,
  reducedMotion: false,
  highContrast: false,
  onboardingComplete: false,
  developerMode: false,
  masterVolume: 0.7,
  masterMuted: false,
}

export const appDefinitions: AppDefinition[] = [
  { id: 'about', title: 'About Me', icon: appIcons.about, defaultWidth: 680, defaultHeight: 560, pinned: true },
  { id: 'projects', title: 'Projects', icon: appIcons.projects, defaultWidth: 900, defaultHeight: 600, minWidth: 500, minHeight: 400, pinned: true },
  { id: 'skills', title: 'My Skills', icon: appIcons.skills, defaultWidth: 720, defaultHeight: 580, pinned: true },
  { id: 'experience', title: 'Experience', icon: appIcons.experience, defaultWidth: 700, defaultHeight: 550, pinned: true },
  { id: 'resume', title: 'Resume', icon: appIcons.resume, defaultWidth: 640, defaultHeight: 720, pinned: true },
  { id: 'contact', title: 'Contact', icon: appIcons.contact, defaultWidth: 520, defaultHeight: 480, pinned: true },
  { id: 'media', title: 'Media Player', icon: appIcons.media, defaultWidth: 480, defaultHeight: 520, pinned: true },
  { id: 'settings', title: 'Settings', icon: appIcons.settings, defaultWidth: 780, defaultHeight: 560, pinned: true },
  { id: 'terminal', title: 'Terminal', icon: appIcons.terminal, defaultWidth: 680, defaultHeight: 420, pinned: true },
  { id: 'browser', title: 'Browser', icon: appIcons.browser, defaultWidth: 1080, defaultHeight: 720, pinned: true },
  { id: 'file-explorer', title: 'File Explorer', icon: appIcons['file-explorer'], defaultWidth: 800, defaultHeight: 520, pinned: true },
  { id: 'file-viewer', title: 'Document', icon: appIcons['file-viewer'], defaultWidth: 720, defaultHeight: 640, minWidth: 400, minHeight: 300 },
  { id: 'recycle-bin', title: 'Recycle Bin', icon: appIcons['recycle-bin'], defaultWidth: 400, defaultHeight: 300 },
  { id: 'this-pc', title: 'This PC', icon: appIcons['this-pc'], defaultWidth: 700, defaultHeight: 480 },
  { id: 'project-detail', title: 'Project', icon: appIcons['project-detail'], defaultWidth: 820, defaultHeight: 640, minWidth: 500, minHeight: 400 },
]

export const pinnedApps = appDefinitions.filter(a => a.pinned)

export const desktopIcons = [
  { id: 'icon-this-pc', appId: 'this-pc' as const, label: 'This PC', icon: appIcons['this-pc'], x: 20, y: 20 },
  { id: 'icon-about', appId: 'about' as const, label: 'About Me', icon: appIcons.about, x: 20, y: 120 },
  { id: 'icon-projects', appId: 'projects' as const, label: 'Projects', icon: appIcons.projects, x: 20, y: 220 },
  { id: 'icon-resume', appId: 'resume' as const, label: 'Resume', icon: appIcons.resume, x: 20, y: 320 },
  { id: 'icon-skills', appId: 'skills' as const, label: 'My Skills', icon: appIcons.skills, x: 20, y: 420 },
  { id: 'icon-contact', appId: 'contact' as const, label: 'Contact', icon: appIcons.contact, x: 20, y: 520 },
  { id: 'icon-media', appId: 'media' as const, label: 'Media', icon: appIcons.media, x: 120, y: 20 },
  { id: 'icon-recycle', appId: 'recycle-bin' as const, label: 'Recycle Bin', icon: appIcons['recycle-bin'], x: 120, y: 520 },
]

export const wallpapers: Record<string, string> = {
  default: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 30%, #0d2137 60%, #1a0a2e 100%)',
  abstract: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  minimal: 'linear-gradient(180deg, #1e1e2e 0%, #2d2d44 100%)',
}

export const wallpapersLight: Record<string, string> = {
  default: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 30%, #bbdefb 60%, #e1bee7 100%)',
  abstract: 'linear-gradient(160deg, #e0e7ff 0%, #c7d2fe 50%, #ddd6fe 100%)',
  gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  minimal: 'linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)',
}
