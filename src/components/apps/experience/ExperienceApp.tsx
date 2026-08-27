import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { experience } from '../../../data/experience'
import { ChevronRight } from 'lucide-react'

export function ExperienceApp() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-sm font-semibold mb-6">Professional Experience</h2>
      <div className="relative pl-8 space-y-1">
        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/50 to-transparent" />

        {experience.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full text-left p-4 rounded-xl hover:bg-white/5 transition-colors focus-ring group"
            >
              <div className="flex items-start gap-3">
                <div className="absolute left-[5px] w-[13px] h-[13px] rounded-full accent-bg border-[3px] border-[var(--window-bg)] mt-1.5" />
                <div className="flex-1">
                  <div className="text-[10px] accent-text font-semibold">{item.period}</div>
                  <div className="text-sm font-semibold mt-0.5">{item.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{item.company}</div>
                  <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">{item.description}</p>
                </div>
                <ChevronRight size={16} className={`text-[var(--text-muted)] transition-transform mt-1 ${expandedId === item.id ? 'rotate-90' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden ml-8"
                >
                  <ul className="py-2 space-y-1.5">
                    {item.details.map(detail => (
                      <li key={detail} className="text-xs text-[var(--text-muted)] flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full accent-bg mt-1.5 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
