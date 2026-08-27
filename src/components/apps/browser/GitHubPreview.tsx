import { useEffect, useState } from 'react'
import { ExternalLink, GitFork, MapPin, Star } from 'lucide-react'

interface GithubUser {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  followers: number
  following: number
  public_repos: number
  location: string | null
}

interface GithubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  fork: boolean
}

function parseGitHubPath(url: string): { user: string; repo?: string } | null {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    if (host !== 'github.com') return null
    const parts = parsed.pathname.split('/').filter(Boolean)
    if (!parts[0]) return null
    return { user: parts[0], repo: parts[1] }
  } catch {
    return null
  }
}

export function GitHubPreview({ url }: { url: string }) {
  const path = parseGitHubPath(url)
  const [user, setUser] = useState<GithubUser | null>(null)
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [repo, setRepo] = useState<GithubRepo | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const parsed = parseGitHubPath(url)
    if (!parsed) {
      setError(true)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(false)
    setUser(null)
    setRepo(null)
    setRepos([])

    const load = async () => {
      try {
        if (parsed.repo) {
          const res = await fetch(`https://api.github.com/repos/${parsed.user}/${parsed.repo}`)
          if (!res.ok) throw new Error('repo')
          const data = await res.json() as GithubRepo
          if (!cancelled) setRepo(data)
        } else {
          const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${parsed.user}`),
            fetch(`https://api.github.com/users/${parsed.user}/repos?sort=updated&per_page=8`),
          ])
          if (!userRes.ok) throw new Error('user')
          const userData = await userRes.json() as GithubUser
          const repoData = reposRes.ok ? await reposRes.json() as GithubRepo[] : []
          if (!cancelled) {
            setUser(userData)
            setRepos(repoData.filter(r => !r.fork).slice(0, 6))
          }
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [url])

  const openExternal = () => window.open(url, '_blank', 'noopener,noreferrer')

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1c1c24] text-[#8b8b96] text-sm">
        Loading GitHub…
      </div>
    )
  }

  if (error || !path) {
    return (
      <BlockedSite
        host="github.com"
        url={url}
        onOpen={openExternal}
      />
    )
  }

  if (repo) {
    return (
      <div className="h-full overflow-y-auto bg-[#1c1c24] text-white p-8">
        <div className="max-w-lg mx-auto">
          <p className="text-xs text-[#8b8b96] mb-2">{path.user} /</p>
          <h1 className="text-xl font-semibold mb-2">{repo.name}</h1>
          {repo.description && <p className="text-sm text-[#c8c8d0] mb-4">{repo.description}</p>}
          <div className="flex items-center gap-4 text-xs text-[#8b8b96] mb-6">
            {repo.language && <span>{repo.language}</span>}
            <span className="inline-flex items-center gap-1"><Star size={12} /> {repo.stargazers_count}</span>
            <span className="inline-flex items-center gap-1"><GitFork size={12} /> {repo.forks_count}</span>
          </div>
          <OpenButton onClick={openExternal} label="Open repository on GitHub" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <BlockedSite host="github.com" url={url} onOpen={openExternal} />
  }

  return (
    <div className="h-full overflow-y-auto bg-[#1c1c24] text-white p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-5">
          <img src={user.avatar_url} alt={user.login} className="w-16 h-16 rounded-full border border-white/10" />
          <div className="min-w-0">
            <h1 className="text-lg font-semibold leading-tight">{user.name || user.login}</h1>
            <p className="text-sm text-[#8b8b96]">@{user.login}</p>
            {user.location && (
              <p className="text-xs text-[#8b8b96] mt-1 inline-flex items-center gap-1">
                <MapPin size={12} /> {user.location}
              </p>
            )}
          </div>
        </div>
        {user.bio && <p className="text-sm text-[#c8c8d0] mb-4">{user.bio}</p>}
        <p className="text-xs text-[#8b8b96] mb-5">
          {user.followers} followers · {user.following} following · {user.public_repos} repositories
        </p>
        <OpenButton onClick={openExternal} label="Open profile on GitHub" />
        {repos.length > 0 && (
          <div className="mt-6 space-y-2">
            <h2 className="text-xs font-semibold text-[#8b8b96] uppercase tracking-wider">Recent repositories</h2>
            {repos.map(item => (
              <a
                key={item.id}
                href={item.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-2xl bg-[#14141a] border border-white/10 hover:border-white/20 text-left"
              >
                <div className="text-sm font-medium text-[#7eb6ff]">{item.name}</div>
                {item.description && <p className="text-xs text-[#8b8b96] mt-1 line-clamp-2">{item.description}</p>}
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[#8b8b96]">
                  {item.language && <span>{item.language}</span>}
                  <span className="inline-flex items-center gap-1"><Star size={11} /> {item.stargazers_count}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function BlockedSite({ host, url, onOpen }: { host: string; url: string; onOpen: () => void }) {
  return (
    <div className="h-full flex items-center justify-center bg-[#1c1c24] text-white p-8">
      <div className="max-w-md text-center">
        <h1 className="text-lg font-semibold mb-2">{host} can&apos;t be displayed here</h1>
        <p className="text-sm text-[#c8c8d0] mb-5">
          This site blocks embedding in other apps. Open it in a new browser tab instead.
        </p>
        <p className="text-[11px] text-[#6f6f7a] mb-5 break-all">{url}</p>
        <OpenButton onClick={onOpen} label={`Open ${host}`} />
      </div>
    </div>
  )
}

function OpenButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e11d2e] hover:bg-[#c41828] text-white text-sm focus-ring"
    >
      <ExternalLink size={14} />
      {label}
    </button>
  )
}
