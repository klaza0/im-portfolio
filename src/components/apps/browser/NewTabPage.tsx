import { Camera, Lock, Mic, Plus, Search, Shield, Sparkles } from 'lucide-react'
import { contactInfo } from '../../../data/socials'
import { projects } from '../../../data/projects'
import { profile } from '../../../data/profile'
import { useDesktop } from '../../../context/DesktopContext'
import { useRef, useState } from 'react'

const STORY_FILTERS = ['All', 'Projects', 'Web', 'Android'] as const

type ShortcutTile = {
  label: string
  url: string
  color: string
  image?: string
  emoji?: string
  initials?: string
}

const shortcutTiles: ShortcutTile[] = [
  { label: 'GitHub', url: contactInfo.github, color: '#24292f', initials: 'GH' },
  { label: 'LinkedIn', url: contactInfo.linkedin, color: '#0a66c2', initials: 'in' },
  ...projects
    .filter(p => p.github && p.id !== 'other-experiments')
    .slice(0, 5)
    .map(p => ({
      label: p.title,
      url: p.github!,
      color: '#2a2a34',
      image: p.icon.startsWith('/') ? p.icon : undefined,
      emoji: p.icon.startsWith('/') ? undefined : p.icon,
    })),
]

interface NewTabPageProps {
  onNavigate: (url: string) => void
  onAddShortcut: () => void
}

type SpeechRec = {
  lang: string
  start: () => void
  onstart: (() => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
}

export function NewTabPage({ onNavigate, onAddShortcut }: NewTabPageProps) {
  const { addNotification, openWindow } = useDesktop()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<(typeof STORY_FILTERS)[number]>('All')
  const [listening, setListening] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const stories = projects.filter(p => {
    if (!p.screenshots?.[0]) return false
    if (filter === 'All' || filter === 'Projects') return true
    return p.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
  }).slice(0, 3)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const term = query.trim()
    if (!term) return
    const match = shortcutTiles.find(t => t.label.toLowerCase().includes(term.toLowerCase()))
    if (match) {
      onNavigate(match.url)
      return
    }
    let url = term
    if (!url.startsWith('http') && url !== 'about:home') url = `https://${url}`
    onNavigate(url)
  }

  const startVoiceSearch = () => {
    const SpeechAPI = window as typeof window & {
      SpeechRecognition?: new () => SpeechRec
      webkitSpeechRecognition?: new () => SpeechRec
    }
    const SpeechRecognition = SpeechAPI.SpeechRecognition ?? SpeechAPI.webkitSpeechRecognition
    if (!SpeechRecognition) {
      addNotification('Voice search', 'Voice search is not supported in this browser.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => {
      setListening(false)
      addNotification('Voice search', 'Could not hear that. Try again.')
    }
    recognition.onresult = event => {
      const text = event.results[0]?.[0]?.transcript ?? ''
      setQuery(text)
      addNotification('Voice search', text || 'No speech detected')
    }
    recognition.start()
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-8 text-white">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <button
          type="button"
          onClick={() => openWindow('about')}
          className="rounded-full focus-ring"
          aria-label={`Open ${profile.name} profile`}
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-[84px] h-[84px] rounded-full object-cover border-2 border-[#e11d2e] shadow-[0_12px_32px_rgba(225,29,46,0.4)]"
          />
        </button>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-5 mb-8 text-[11px] text-[#9a9aa6]">
          <span className="inline-flex items-center gap-1.5"><Search size={12} className="text-[#e11d2e]" /> Confidential Search</span>
          <span className="inline-flex items-center gap-1.5"><Shield size={12} className="text-[#e11d2e]" /> Tracker Blocking</span>
          <span className="inline-flex items-center gap-1.5"><Lock size={12} className="text-[#e11d2e]" /> Website encryption</span>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-2xl flex items-center gap-2 mb-10">
          <div className="flex-1 flex items-center gap-2 h-14 px-4 rounded-full bg-[#14141a] border border-white/5">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="What are you looking for today?"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6f6f7a]"
              aria-label="Search the web"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="p-2 rounded-full text-[#8b8b96] hover:bg-white/5"
              aria-label="Image search"
            >
              <Camera size={16} />
            </button>
            <button
              type="button"
              onClick={startVoiceSearch}
              className={`p-2 rounded-full hover:bg-white/5 ${listening ? 'text-[#e11d2e]' : 'text-[#8b8b96]'}`}
              aria-label="Voice search"
            >
              <Mic size={16} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) addNotification('Image search', `Selected ${file.name}. Search stays limited to portfolio links.`)
                e.target.value = ''
              }}
            />
          </div>
          <button
            type="submit"
            className="h-14 px-6 rounded-full bg-[#e11d2e] hover:bg-[#c41828] text-sm font-semibold whitespace-nowrap shadow-[0_8px_24px_rgba(225,29,46,0.35)]"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-4 gap-x-6 gap-y-6 w-full max-w-xl mb-10">
          {shortcutTiles.slice(0, 7).map(tile => (
            <button
              key={tile.url + tile.label}
              type="button"
              onClick={() => onNavigate(tile.url)}
              className="flex flex-col items-center gap-2 group"
            >
              <span
                className="w-14 h-14 rounded-[18px] flex items-center justify-center text-lg overflow-hidden border border-white/5 group-hover:scale-105 transition-transform"
                style={{ background: tile.color }}
              >
                {tile.image ? (
                  <img src={tile.image} alt="" className="w-8 h-8 object-contain" />
                ) : tile.emoji ? (
                  <span>{tile.emoji}</span>
                ) : (
                  <span className="text-xs font-bold">{tile.initials ?? tile.label.slice(0, 2).toUpperCase()}</span>
                )}
              </span>
              <span className="text-[11px] text-[#c8c8d0] truncate max-w-[72px]">{tile.label}</span>
            </button>
          ))}
          <button type="button" onClick={onAddShortcut} className="flex flex-col items-center gap-2 group">
            <span className="w-14 h-14 rounded-[18px] flex items-center justify-center bg-[#2a2a34] border border-white/5 text-[#9a9aa6] group-hover:scale-105 transition-transform">
              <Plus size={22} />
            </span>
            <span className="text-[11px] text-[#c8c8d0]">Add</span>
          </button>
        </div>

        <h2 className="text-sm font-medium text-white mb-3">Top Stories</h2>
        <div className="flex flex-wrap justify-center gap-1.5 mb-5">
          {STORY_FILTERS.map(chip => (
            <button
              key={chip}
              type="button"
              onClick={() => setFilter(chip)}
              className={`px-3 py-1 rounded-full text-[11px] ${
                filter === chip ? 'bg-[#3d7cff] text-white' : 'bg-[#2a2a34] text-[#c8c8d0] hover:bg-[#33333e]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pb-4">
          {stories.map(story => (
            <button
              key={story.id}
              type="button"
              onClick={() => story.github && onNavigate(story.github)}
              className="text-left rounded-2xl overflow-hidden bg-[#14141a] border border-white/5 hover:border-white/15 transition-colors"
            >
              <div className="h-24 bg-[#2a2a34] overflow-hidden">
                <img src={story.screenshots[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="text-xs font-medium truncate">{story.title}</div>
                <p className="text-[10px] text-[#8b8b96] mt-1 line-clamp-2">{story.description}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-[#5c5c66] mt-2 flex items-center gap-1">
          <Sparkles size={10} /> {profile.name} — curated links only
        </p>
      </div>
    </div>
  )
}
