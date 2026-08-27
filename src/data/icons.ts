import type { AppId } from '../types'

export const ICON_ROOT = '/icons'

export const appIcons: Record<AppId, string> = {
  about: `${ICON_ROOT}/about.png`,
  projects: `${ICON_ROOT}/projects.png`,
  skills: `${ICON_ROOT}/skills.png`,
  experience: `${ICON_ROOT}/experience.png`,
  resume: `${ICON_ROOT}/resume.png`,
  contact: `${ICON_ROOT}/contact.png`,
  media: `${ICON_ROOT}/media.png`,
  settings: `${ICON_ROOT}/settings.png`,
  terminal: `${ICON_ROOT}/terminal.png`,
  browser: `${ICON_ROOT}/browser.png`,
  'file-explorer': `${ICON_ROOT}/file-explorer.png`,
  'file-viewer': `${ICON_ROOT}/file-viewer.png`,
  'recycle-bin': `${ICON_ROOT}/recycle-bin.png`,
  'this-pc': `${ICON_ROOT}/this-pc.png`,
  'project-detail': `${ICON_ROOT}/project-detail.png`,
}

export const systemIcons = {
  start: `${ICON_ROOT}/start.png`,
  search: `${ICON_ROOT}/search.png`,
  network: `${ICON_ROOT}/network.png`,
  battery: `${ICON_ROOT}/battery.png`,
  volume: `${ICON_ROOT}/volume.png`,
  bell: `${ICON_ROOT}/bell.png`,
  folder: `${ICON_ROOT}/folder.png`,
  folderDocuments: `${ICON_ROOT}/folder-documents.png`,
  folderDownload: `${ICON_ROOT}/folder-download.png`,
  folderPictures: `${ICON_ROOT}/folder-pictures.png`,
  folderMusic: `${ICON_ROOT}/folder-music.png`,
  folderVideos: `${ICON_ROOT}/folder-videos.png`,
  folderDesktop: `${ICON_ROOT}/folder-desktop.png`,
  harddisk: `${ICON_ROOT}/harddisk.png`,
  pdf: `${ICON_ROOT}/pdf.png`,
  image: `${ICON_ROOT}/image.png`,
  document: `${ICON_ROOT}/document.png`,
} as const

export function getAppIcon(appId: AppId): string {
  return appIcons[appId] ?? systemIcons.folder
}
