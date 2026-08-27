import { profile } from '../../../data/profile'
import { MapPin, Briefcase, Code } from 'lucide-react'

export function AboutApp() {
  return (
    <div className="h-full overflow-y-auto">
      {/* Thin accent strip — no overlap with content below */}
      <div className="h-10 shrink-0 bg-gradient-to-r from-[var(--accent)] via-blue-600 to-purple-600" />

      <div className="px-6 pt-5 pb-6">
        {/* Profile row — fully below the banner */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-[var(--border)] shadow-md shrink-0 bg-[var(--surface-solid)]">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 pt-0.5">
            <h1 className="text-base font-bold tracking-wide leading-snug text-[var(--text)]">
              {profile.name.toUpperCase()}
            </h1>
            <p className="text-sm accent-text mt-1">{profile.title}</p>
          </div>
        </div>

        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5">{profile.bio}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
            <MapPin size={16} className="accent-text shrink-0" />
            <div>
              <div className="text-[10px] text-[var(--text-muted)]">Location</div>
              <div className="text-xs font-medium">{profile.location}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
            <Briefcase size={16} className="accent-text shrink-0" />
            <div>
              <div className="text-[10px] text-[var(--text-muted)]">Experience</div>
              <div className="text-xs font-medium">{profile.experience}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
            <Code size={16} className="accent-text shrink-0" />
            <div>
              <div className="text-[10px] text-[var(--text-muted)]">Current Focus</div>
              <div className="text-xs font-medium">{profile.currentFocus}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Technologies</h3>
          <div className="flex flex-wrap gap-1.5">
            {profile.technologies.map(tech => (
              <span key={tech} className="px-2.5 py-1 rounded-full text-[11px] bg-[var(--accent-subtle)] accent-text border border-[var(--accent)]/20">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
