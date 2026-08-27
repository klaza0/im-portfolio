import { useState } from 'react'
import { contactInfo, socials } from '../../../data/socials'
import { profile } from '../../../data/profile'
import { Mail, Send, CheckCircle, ExternalLink, User } from 'lucide-react'

export function ContactApp() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    }, 800)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row h-full min-h-0">
        {/* Sidebar */}
        <div className="sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-[var(--border)] p-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={profile.startMenuAvatar}
              alt={profile.name}
              className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold">{profile.name}</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">{contactInfo.email}</div>
            </div>
          </div>
          <div className="space-y-1">
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 px-3 py-2 rounded-lg accent-bg text-white text-xs focus-ring">
              <Mail size={14} /> New Message
            </a>
          </div>
          <div className="mt-6 space-y-2">
            <h4 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1">Direct Links</h4>
            {socials.map(s => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-xs transition-colors focus-ring"
              >
                {s.icon === 'github' ? <ExternalLink size={14} /> : s.icon === 'linkedin' ? <User size={14} /> : <Mail size={14} />}
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Compose */}
        <div className="flex-1 p-5">
          <h2 className="text-sm font-semibold mb-4">Send a Message</h2>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle size={40} className="text-green-400 mb-3" />
              <p className="text-sm font-medium">Message sent!</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Thanks for reaching out. I'll get back to you soon.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 px-4 py-2 rounded-lg accent-bg text-white text-xs focus-ring"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="contact-name" className="text-[11px] text-[var(--text-muted)] mb-1 block">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="text-[11px] text-[var(--text-muted)] mb-1 block">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border)] text-sm outline-none focus:border-[var(--accent)] transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="text-[11px] text-[var(--text-muted)] mb-1 block">Message</label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--border)] text-sm outline-none focus:border-[var(--accent)] transition-colors resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg accent-bg text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 focus-ring"
              >
                <Send size={14} />
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
