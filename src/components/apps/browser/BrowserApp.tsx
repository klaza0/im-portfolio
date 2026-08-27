import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Code2,
  ExternalLink,
  Globe,
  Home,
  LayoutGrid,
  Lock,
  MessageCircle,
  RotateCw,
  Settings,
  Share2,
  Shield,
  User,
  Users,
} from 'lucide-react'
import { contactInfo } from '../../../data/socials'
import { profile } from '../../../data/profile'
import { projects } from '../../../data/projects'
import { pinnedApps } from '../../../data/settings'
import { useDesktop } from '../../../context/DesktopContext'
import { IconDisplay } from '../../common/IconDisplay'
import { BlockedSite, GitHubPreview } from './GitHubPreview'
import { NewTabPage } from './NewTabPage'
import type { AppId } from '../../../types'

interface Tab {
  id: string
  title: string
  url: string
}

const ALLOWED_URLS = new Set([
  contactInfo.github,
  contactInfo.linkedin,
  `mailto:${contactInfo.email}`,
  ...projects.filter(p => p.demo).map(p => p.demo!),
  ...projects.filter(p => p.github).map(p => p.github!),
  'about:home',
])

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function isGitHubUrl(url: string) {
  return hostnameOf(url) === 'github.com'
}

function blocksEmbedding(url: string) {
  const host = hostnameOf(url)
  if (!host) return true
  return ['github.com', 'linkedin.com'].some(blocked => host === blocked || host.endsWith(`.${blocked}`))
}

function tabLabel(url: string) {
  if (url === 'about:home') return 'New Tab Page'
  try {
    return new URL(url.startsWith('mailto:') ? 'https://mail.example' : url).hostname.replace(/^www\./, '')
  } catch {
    return 'Tab'
  }
}

function isAllowedUrl(url: string) {
  if (url === 'about:home' || ALLOWED_URLS.has(url)) return true
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    const githubUser = new URL(contactInfo.github).pathname.split('/').filter(Boolean)[0]
    if (host === 'github.com') {
      return parsed.pathname.split('/').filter(Boolean)[0] === githubUser
    }
    if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) {
      return url.startsWith(contactInfo.linkedin.replace(/\/$/, ''))
    }
  } catch {
    return false
  }
  return false
}

const sidebarLinks = [
  { label: 'GitHub', url: contactInfo.github, Icon: Code2 },
  { label: 'LinkedIn', url: contactInfo.linkedin, Icon: User },
  { label: 'Home', url: 'about:home', Icon: Globe },
]

const APP_LAUNCHERS = pinnedApps.filter(app => app.id !== 'browser').slice(0, 8)

type MenuId = 'bookmarks' | 'apps' | 'privacy' | null

interface BrowserAppProps {
  url?: string
}

export function BrowserApp({ url }: BrowserAppProps) {
  const { openWindow, addNotification, setStartMenuOpen } = useDesktop()
  const initialUrl = url && isAllowedUrl(url) ? url : 'about:home'
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: tabLabel(initialUrl), url: initialUrl },
  ])
  const [activeTabId, setActiveTabId] = useState('1')
  const [addressBar, setAddressBar] = useState(initialUrl === 'about:home' ? '' : initialUrl)
  const [history, setHistory] = useState<string[]>([initialUrl])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [bookmarks, setBookmarks] = useState<{ title: string; url: string }[]>([
    { title: 'GitHub', url: contactInfo.github },
    { title: 'LinkedIn', url: contactInfo.linkedin },
  ])
  const [menu, setMenu] = useState<MenuId>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const [trackerBlocking, setTrackerBlocking] = useState(true)
  const chromeRef = useRef<HTMLDivElement>(null)

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0]
  const shareUrl = activeTab.url === 'about:home' ? window.location.origin : activeTab.url
  const isBookmarked = bookmarks.some(b => b.url === activeTab.url)

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!chromeRef.current?.contains(e.target as Node)) setMenu(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const navigate = useCallback((newUrl: string) => {
    if (!isAllowedUrl(newUrl)) {
      addNotification('Browser', 'Only portfolio links can be opened here.')
      return
    }
    setMenu(null)
    setAddressBar(newUrl === 'about:home' ? '' : newUrl)
    setTabs(prev => prev.map(t => t.id === activeTabId ? {
      ...t,
      url: newUrl,
      title: tabLabel(newUrl),
    } : t))
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newUrl])
    setHistoryIndex(i => i + 1)
  }, [activeTabId, historyIndex, addNotification])

  const goBack = () => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    const nextUrl = history[newIndex]
    setHistoryIndex(newIndex)
    setAddressBar(nextUrl === 'about:home' ? '' : nextUrl)
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: nextUrl, title: tabLabel(nextUrl) } : t))
  }

  const goForward = () => {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    const nextUrl = history[newIndex]
    setHistoryIndex(newIndex)
    setAddressBar(nextUrl === 'about:home' ? '' : nextUrl)
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: nextUrl, title: tabLabel(nextUrl) } : t))
  }

  const addTab = () => {
    const id = Date.now().toString()
    setTabs(prev => [...prev, { id, title: 'New Tab Page', url: 'about:home' }])
    setActiveTabId(id)
    setAddressBar('')
    setMenu(null)
  }

  const closeTab = (id: string) => {
    if (tabs.length === 1) return
    setTabs(prev => prev.filter(t => t.id !== id))
    if (activeTabId === id) {
      const remaining = tabs.filter(t => t.id !== id)
      const next = remaining[remaining.length - 1]
      setActiveTabId(next.id)
      setAddressBar(next.url === 'about:home' ? '' : next.url)
    }
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let next = addressBar.trim()
    if (!next) {
      navigate('about:home')
      return
    }
    if (!next.startsWith('http') && !next.startsWith('mailto:') && next !== 'about:home') {
      next = `https://${next}`
    }
    navigate(next)
  }

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(b => b.url !== activeTab.url))
      addNotification('Bookmark removed', activeTab.title)
    } else {
      setBookmarks(prev => [...prev, { title: activeTab.title, url: activeTab.url }])
      addNotification('Bookmarked', activeTab.title)
    }
  }

  const sharePage = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      addNotification('Link copied', shareUrl)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      addNotification('Share failed', 'Could not copy the link.')
    }
  }

  const launchApp = (appId: AppId) => {
    setMenu(null)
    openWindow(appId)
  }

  const chromeBtn = 'w-8 h-8 flex items-center justify-center rounded-full text-[#b8b8c2] hover:bg-white/10 disabled:opacity-25 focus-ring'

  return (
    <div className="h-full flex flex-col bg-[#16161c] text-white">
      <div className="flex items-center gap-2 px-4 pt-3 pb-1 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTabId(tab.id); setAddressBar(tab.url === 'about:home' ? '' : tab.url); setMenu(null) }}
            className={`flex items-center gap-2 h-8 px-3.5 rounded-full text-[11px] max-w-[180px] ${
              tab.id === activeTabId ? 'bg-[#2c2c36] text-white' : 'text-[#9a9aa6] hover:bg-white/5'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#e11d2e] shrink-0" />
            <span className="truncate">{tab.title}</span>
            {tabs.length > 1 && (
              <span
                role="button"
                tabIndex={0}
                onClick={e => { e.stopPropagation(); closeTab(tab.id) }}
                onKeyDown={e => { if (e.key === 'Enter') closeTab(tab.id) }}
                className="ml-0.5 text-[#8b8b96] hover:text-white"
                aria-label="Close tab"
              >
                ×
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={addTab}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#9a9aa6] hover:bg-white/10 text-lg leading-none"
          aria-label="New tab"
        >
          +
        </button>
      </div>

      <div ref={chromeRef} className="relative flex items-center gap-1.5 px-3 pb-3 shrink-0">
        <button type="button" onClick={goBack} disabled={historyIndex === 0} className={chromeBtn} aria-label="Back">
          <ArrowLeft size={15} />
        </button>
        <button type="button" onClick={goForward} disabled={historyIndex >= history.length - 1} className={chromeBtn} aria-label="Forward">
          <ArrowRight size={15} />
        </button>
        <button
          type="button"
          onClick={() => { setReloadKey(k => k + 1); addNotification('Reloaded', activeTab.title) }}
          className={chromeBtn}
          aria-label="Refresh"
        >
          <RotateCw size={14} />
        </button>
        <button type="button" onClick={() => navigate('about:home')} className={chromeBtn} aria-label="Home">
          <Home size={15} />
        </button>

        <form onSubmit={handleAddressSubmit} className="flex-1">
          <div className="flex items-center gap-2 h-10 px-3 rounded-full bg-[#101016] border border-white/10">
            <Lock size={12} className="text-[#e11d2e] shrink-0" />
            <input
              type="text"
              value={addressBar}
              onChange={e => setAddressBar(e.target.value)}
              placeholder="Search or enter address"
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-[#5c5c66]"
              aria-label="Address bar"
            />
            <button
              type="button"
              onClick={toggleBookmark}
              className={`p-1 ${isBookmarked ? 'text-[#e11d2e]' : 'text-[#8b8b96] hover:text-white'}`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <Bookmark size={13} className={isBookmarked ? 'fill-current' : ''} />
            </button>
            <button
              type="button"
              onClick={() => setMenu(m => m === 'bookmarks' ? null : 'bookmarks')}
              className="p-1 text-[#8b8b96] hover:text-white text-[10px]"
              aria-label="Bookmarks"
            >
              ▾
            </button>
            <button type="button" onClick={sharePage} className="p-1 text-[#8b8b96] hover:text-white" aria-label="Share">
              {copied ? <Check size={13} className="text-green-400" /> : <Share2 size={13} />}
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={() => setMenu(m => m === 'privacy' ? null : 'privacy')}
          className={`${chromeBtn} ${trackerBlocking ? 'text-[#e11d2e]' : ''}`}
          aria-label="Privacy"
        >
          <Shield size={15} />
        </button>
        <button
          type="button"
          onClick={() => setMenu(m => m === 'apps' ? null : 'apps')}
          className={chromeBtn}
          aria-label="Apps"
        >
          <LayoutGrid size={15} />
        </button>
        {activeTab.url.startsWith('http') && (
          <button
            type="button"
            onClick={() => window.open(activeTab.url, '_blank', 'noopener,noreferrer')}
            className={chromeBtn}
            aria-label="Open in new tab"
          >
            <ExternalLink size={14} />
          </button>
        )}
        <button
          type="button"
          onClick={() => launchApp('about')}
          className="rounded-full focus-ring"
          aria-label="Open About Me"
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover border border-white/10"
          />
        </button>

        {menu === 'bookmarks' && (
          <div className="absolute right-28 top-12 z-30 w-64 rounded-2xl bg-[#22222c] border border-white/10 shadow-2xl p-2">
            <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-[#8b8b96]">Bookmarks</div>
            {bookmarks.length === 0 && <p className="px-2 py-3 text-xs text-[#8b8b96]">No bookmarks yet.</p>}
            {bookmarks.map(item => (
              <button
                key={item.url}
                type="button"
                onClick={() => navigate(item.url)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/5 truncate"
              >
                {item.title}
              </button>
            ))}
          </div>
        )}

        {menu === 'privacy' && (
          <div className="absolute right-16 top-12 z-30 w-64 rounded-2xl bg-[#22222c] border border-white/10 shadow-2xl p-3">
            <div className="text-xs font-medium mb-2">Privacy protection</div>
            <button
              type="button"
              onClick={() => {
                setTrackerBlocking(v => !v)
                addNotification('Tracker blocking', trackerBlocking ? 'Turned off' : 'Turned on')
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-white/5"
            >
              <span>Tracker blocking</span>
              <span className={trackerBlocking ? 'text-[#e11d2e]' : 'text-[#8b8b96]'}>{trackerBlocking ? 'On' : 'Off'}</span>
            </button>
            <p className="mt-2 px-1 text-[10px] text-[#8b8b96]">Search stays limited to GitHub, LinkedIn, and project links.</p>
          </div>
        )}

        {menu === 'apps' && (
          <div className="absolute right-4 top-12 z-30 w-72 rounded-2xl bg-[#22222c] border border-white/10 shadow-2xl p-3">
            <div className="text-xs font-medium mb-2">Apps</div>
            <div className="grid grid-cols-4 gap-2">
              {APP_LAUNCHERS.map(app => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => launchApp(app.id)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/5"
                >
                  <IconDisplay icon={app.icon} imgClassName="w-7 h-7 object-contain" />
                  <span className="text-[9px] text-[#c8c8d0] truncate w-full text-center">{app.title}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => { setMenu(null); setStartMenuOpen(true) }}
              className="mt-2 w-full py-2 rounded-xl text-[11px] bg-white/5 hover:bg-white/10"
            >
              Open Start Menu
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 min-h-0 px-2 pb-2 gap-2">
        <div className="w-14 shrink-0 flex flex-col items-center gap-3 py-2">
          {sidebarLinks.map(link => (
            <button
              key={link.label}
              type="button"
              title={link.label}
              onClick={() => navigate(link.url)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 ${
                activeTab.url === link.url ? 'bg-[#e11d2e] text-white' : 'bg-[#22222c] text-[#c8c8d0] hover:bg-[#2c2c36]'
              }`}
              aria-label={link.label}
            >
              <link.Icon size={16} />
            </button>
          ))}
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => launchApp('settings')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e11d2e] text-white shadow-[0_8px_20px_rgba(225,29,46,0.35)]"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
        </div>

        <div className="relative flex-1 min-w-0 rounded-[28px] overflow-hidden bg-[#1c1c24]">
          {activeTab.url === 'about:home' ? (
            <NewTabPage key={reloadKey} onNavigate={navigate} onAddShortcut={addTab} />
          ) : activeTab.url.startsWith('mailto:') ? (
            <div className="h-full flex items-center justify-center p-8 text-[#c8c8d0]">
              <a href={activeTab.url} className="text-[#e11d2e] underline text-sm">{activeTab.url}</a>
            </div>
          ) : isGitHubUrl(activeTab.url) ? (
            <GitHubPreview key={`${activeTab.url}-${reloadKey}`} url={activeTab.url} />
          ) : blocksEmbedding(activeTab.url) ? (
            <BlockedSite
              key={reloadKey}
              host={hostnameOf(activeTab.url) ?? 'this site'}
              url={activeTab.url}
              onOpen={() => window.open(activeTab.url, '_blank', 'noopener,noreferrer')}
            />
          ) : (
            <iframe
              key={`${activeTab.url}-${reloadKey}`}
              src={activeTab.url}
              title={activeTab.title}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          )}

          {activeTab.url === 'about:home' && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => launchApp('contact')}
                className="w-9 h-9 rounded-full bg-[#2a2a34]/90 border border-white/10 flex items-center justify-center text-[#c8c8d0] hover:text-white"
                aria-label="Chat"
              >
                <MessageCircle size={15} />
              </button>
              <button
                type="button"
                onClick={() => navigate(contactInfo.linkedin)}
                className="w-9 h-9 rounded-full bg-[#2a2a34]/90 border border-white/10 flex items-center justify-center text-[#c8c8d0] hover:text-white"
                aria-label="People"
              >
                <Users size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
