import { useDesktop } from '../../../context/DesktopContext'
import { wallpapers, wallpapersLight } from '../../../data/settings'
import { SYSTEM_NAME, SYSTEM_VERSION, DEVELOPER_NAME } from '../../../data/branding'
import type { AccentColor, ThemeMode, WallpaperId } from '../../../types'
import { Monitor, Palette, Zap, Accessibility, Info } from 'lucide-react'
import { useState } from 'react'
import { playSound } from '../../../utils/sounds'

const accentColors: { id: AccentColor; color: string; label: string }[] = [
  { id: 'blue', color: '#0078d4', label: 'Blue' },
  { id: 'purple', color: '#881798', label: 'Purple' },
  { id: 'green', color: '#107c10', label: 'Green' },
  { id: 'orange', color: '#d83b01', label: 'Orange' },
  { id: 'pink', color: '#e3008c', label: 'Pink' },
  { id: 'red', color: '#e81123', label: 'Red' },
]

const wallpaperIds: WallpaperId[] = ['default', 'abstract', 'gradient', 'minimal']

const categories = [
  { id: 'personalization', label: 'Personalization', icon: Palette },
  { id: 'system', label: 'System', icon: Zap },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'about', label: 'About', icon: Info },
] as const

type SettingsCategory = (typeof categories)[number]['id']

interface SettingsAppProps {
  initialCategory?: SettingsCategory
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[var(--border)] last:border-b-0">
      <div className="min-w-0">
        <div className="text-xs font-medium">{label}</div>
        {description && (
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{description}</div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors focus-ring ${checked ? 'accent-bg' : 'bg-white/10'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export function SettingsApp({ initialCategory = 'personalization' }: SettingsAppProps) {
  const { settings, updateSettings } = useDesktop()
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>(initialCategory)

  const selectCategory = (category: SettingsCategory) => {
    setActiveCategory(category)
    playSound('click')
  }

  return (
    <div className="h-full min-h-0 flex">
      <div className="w-48 shrink-0 border-r border-[var(--border)] p-2 overflow-y-auto">
        <div className="flex items-center gap-2 px-2 py-3 mb-2">
          <Monitor size={16} className="accent-text" />
          <span className="text-sm font-semibold">Settings</span>
        </div>
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => selectCategory(cat.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors focus-ring ${
              activeCategory === cat.id ? 'accent-bg text-white' : 'hover:bg-white/5'
            }`}
          >
            <cat.icon size={14} />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        {activeCategory === 'personalization' && (
          <div className="space-y-6 max-w-lg">
            <section>
              <h3 className="text-sm font-semibold mb-3">Theme</h3>
              <div className="flex gap-2">
                {(['dark', 'light'] as ThemeMode[]).map(theme => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => updateSettings({ theme })}
                    className={`flex-1 py-3 rounded-lg border text-xs capitalize transition-colors focus-ring ${
                      settings.theme === theme ? 'border-[var(--accent)] accent-bg text-white' : 'border-[var(--border)] hover:bg-white/5'
                    }`}
                  >
                    {theme} mode
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold mb-3">Accent Color</h3>
              <div className="flex flex-wrap gap-3">
                {accentColors.map(ac => (
                  <button
                    key={ac.id}
                    type="button"
                    onClick={() => updateSettings({ accent: ac.id })}
                    className={`flex flex-col items-center gap-1 focus-ring ${settings.accent === ac.id ? 'ring-2 ring-offset-2 ring-offset-[var(--window-bg)] ring-[var(--accent)] rounded-lg p-1' : ''}`}
                    aria-label={ac.label}
                  >
                    <span className="w-8 h-8 rounded-full" style={{ background: ac.color }} />
                    <span className="text-[10px] text-[var(--text-muted)]">{ac.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold mb-3">Wallpaper</h3>
              <div className="grid grid-cols-2 gap-2">
                {wallpaperIds.map(id => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => updateSettings({ wallpaper: id })}
                    className={`h-16 rounded-lg border-2 overflow-hidden capitalize text-[10px] text-white font-medium focus-ring ${
                      settings.wallpaper === id ? 'border-[var(--accent)]' : 'border-transparent'
                    }`}
                    style={{ background: settings.theme === 'dark' ? wallpapers[id] : wallpapersLight[id] }}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeCategory === 'system' && (
          <div className="max-w-lg">
            <h3 className="text-sm font-semibold mb-1">System</h3>
            <p className="text-[11px] text-[var(--text-muted)] mb-4">
              Control sound, motion, and performance for {SYSTEM_NAME}.
            </p>
            <div className="rounded-xl border border-[var(--border)] bg-white/5 px-4">
              <Toggle
                checked={Boolean(settings.soundEnabled)}
                onChange={v => updateSettings({ soundEnabled: v })}
                label="Sound Effects"
                description="UI sounds for open, close, click, and notifications."
              />
              <Toggle
                checked={Boolean(settings.animationsEnabled)}
                onChange={v => updateSettings({ animationsEnabled: v })}
                label="Animations"
                description="Window open/close animations and motion effects."
              />
              <Toggle
                checked={Boolean(settings.performanceMode)}
                onChange={v => updateSettings({ performanceMode: v })}
                label="Performance Mode"
                description="Disables blur and shortens transitions for smoother performance."
              />
            </div>
          </div>
        )}

        {activeCategory === 'accessibility' && (
          <div className="max-w-lg">
            <h3 className="text-sm font-semibold mb-1">Accessibility</h3>
            <p className="text-[11px] text-[var(--text-muted)] mb-4">
              Adjust visual and motion preferences for a more comfortable experience.
            </p>
            <div className="rounded-xl border border-[var(--border)] bg-white/5 px-4">
              <Toggle
                checked={Boolean(settings.reducedMotion)}
                onChange={v => updateSettings({ reducedMotion: v })}
                label="Reduced Motion"
                description="Minimizes animations and transitions across the desktop."
              />
              <Toggle
                checked={Boolean(settings.highContrast)}
                onChange={v => updateSettings({ highContrast: v })}
                label="High Contrast"
                description="Increases contrast for text, borders, and window surfaces."
              />
            </div>
          </div>
        )}

        {activeCategory === 'about' && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-sm font-semibold">About {SYSTEM_NAME}</h3>
            <div className="p-4 rounded-xl bg-white/5 border border-[var(--border)] space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">System</span><span>{SYSTEM_NAME}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Version</span><span>{SYSTEM_VERSION}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Developer</span><span>{DEVELOPER_NAME}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Stack</span><span>React / TypeScript / Vite</span></div>
              {settings.developerMode && (
                <div className="pt-2 text-green-400 font-mono text-[10px]">Developer mode enabled via Konami code</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
