import type { DesktopIcon, IconSize, IconSortMode } from '../types'

const ICON_HEIGHT: Record<IconSize, number> = {
  large: 110,
  medium: 96,
  small: 80,
}

const ICON_WIDTH: Record<IconSize, number> = {
  large: 100,
  medium: 88,
  small: 72,
}

const DEFAULT_ORDER: Record<string, number> = {
  'icon-this-pc': 0,
  'icon-about': 1,
  'icon-projects': 2,
  'icon-resume': 3,
  'icon-skills': 4,
  'icon-contact': 5,
  'icon-media': 6,
  'icon-recycle': 7,
}

export function sortDesktopIcons(icons: DesktopIcon[], mode: IconSortMode, iconSize: IconSize): DesktopIcon[] {
  const sorted = [...icons]

  switch (mode) {
    case 'name':
      sorted.sort((a, b) => a.label.localeCompare(b.label))
      break
    case 'date':
      sorted.sort((a, b) => (DEFAULT_ORDER[a.id] ?? 99) - (DEFAULT_ORDER[b.id] ?? 99))
      break
    case 'type':
      sorted.sort((a, b) => a.appId.localeCompare(b.appId) || a.label.localeCompare(b.label))
      break
  }

  return layoutDesktopIcons(sorted, iconSize)
}

export function layoutDesktopIcons(icons: DesktopIcon[], iconSize: IconSize): DesktopIcon[] {
  const rowHeight = ICON_HEIGHT[iconSize]
  const colWidth = ICON_WIDTH[iconSize] + 20
  const maxRows = Math.max(4, Math.floor((window.innerHeight - 100) / rowHeight))

  return icons.map((icon, index) => {
    const col = Math.floor(index / maxRows)
    const row = index % maxRows
    return {
      ...icon,
      x: 20 + col * colWidth,
      y: 20 + row * rowHeight,
    }
  })
}

export const iconSizeStyles: Record<IconSize, { width: number; image: string; label: string }> = {
  large: { width: 96, image: 'w-12 h-12', label: 'text-xs' },
  medium: { width: 80, image: 'w-10 h-10', label: 'text-[11px]' },
  small: { width: 64, image: 'w-8 h-8', label: 'text-[10px]' },
}
