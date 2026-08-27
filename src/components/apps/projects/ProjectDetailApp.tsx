import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../../../data/projects'
import { ExternalLink, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { IconDisplay } from '../../common/IconDisplay'

interface ProjectDetailAppProps {
  projectId?: string
}

export function ProjectDetailApp({ projectId }: ProjectDetailAppProps) {
  const [techExpanded, setTechExpanded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const project = projects.find(p => p.id === projectId)

  if (!project) {
    return <div className="p-6 text-sm text-[var(--text-muted)]">Project not found. Open a project from the Projects folder.</div>
  }

  const isMobile = project.screenshotLayout === 'mobile'
  const screenshots = project.screenshots

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))
  const nextImage = () => setLightboxIndex(i => (i !== null && i < screenshots.length - 1 ? i + 1 : i))

  return (
    <div className="h-full overflow-y-auto relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <IconDisplay
            icon={project.icon}
            className="text-4xl"
            imgClassName="w-14 h-14 object-contain"
          />
          <div className="flex-1">
            <h1 className="text-lg font-bold">{project.title}</h1>
            <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${
              project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
              project.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>{project.status}</span>
          </div>
        </div>

        <section className="mb-5">
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Overview</h2>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">{project.longDescription}</p>
        </section>

        <section className="mb-5">
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Tech Stack</h2>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map(tech => (
              <span key={tech} className="px-2 py-0.5 rounded-md text-[11px] bg-white/5 border border-[var(--border)]">{tech}</span>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Features</h2>
          <ul className="space-y-1">
            {project.features.map(f => (
              <li key={f} className="text-sm flex items-center gap-2">
                <span className="w-1 h-1 rounded-full accent-bg shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        {screenshots.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Screenshots</h2>
            {isMobile ? (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
                {screenshots.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => openLightbox(i)}
                    className="snap-center shrink-0 rounded-xl border border-[var(--border)] bg-black/30 p-1 hover:border-[var(--accent)] transition-colors focus-ring"
                    aria-label={`Screenshot ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt={`${project.title} screenshot ${i + 1}`}
                      className="h-[300px] w-auto object-contain rounded-lg"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {screenshots.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => openLightbox(i)}
                    className="rounded-xl border border-[var(--border)] bg-white/5 overflow-hidden hover:border-[var(--accent)] transition-colors focus-ring"
                  >
                    <img
                      src={src}
                      alt={`${project.title} screenshot ${i + 1}`}
                      className="w-full h-auto max-h-64 object-contain mx-auto"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
            <p className="text-[10px] text-[var(--text-muted)] mt-2">Click a screenshot to enlarge</p>
          </section>
        )}

        <section className="mb-5">
          <button
            onClick={() => setTechExpanded(!techExpanded)}
            className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text)] transition-colors focus-ring"
          >
            <ChevronDown size={14} className={`transition-transform ${techExpanded ? 'rotate-180' : ''}`} />
            Technical Details
          </button>
          {techExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 space-y-3"
            >
              <div>
                <h4 className="text-[11px] font-medium mb-1">Architecture</h4>
                <p className="text-xs text-[var(--text-muted)]">{project.architecture}</p>
              </div>
              <div>
                <h4 className="text-[11px] font-medium mb-1">Challenges</h4>
                <p className="text-xs text-[var(--text-muted)]">{project.challenges}</p>
              </div>
              <div>
                <h4 className="text-[11px] font-medium mb-1">Solutions</h4>
                <p className="text-xs text-[var(--text-muted)]">{project.solutions}</p>
              </div>
            </motion.div>
          )}
        </section>

        <div className="flex gap-2">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors focus-ring">
              <ExternalLink size={14} /> GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-lg accent-bg text-white text-xs font-medium hover:opacity-90 transition-opacity focus-ring">
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); closeLightbox() }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 focus-ring"
              aria-label="Close"
            >
              <X size={20} className="text-white" />
            </button>
            {lightboxIndex > 0 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevImage() }}
                className="absolute left-3 p-2 rounded-full bg-white/10 hover:bg-white/20 focus-ring"
                aria-label="Previous"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
            )}
            {lightboxIndex < screenshots.length - 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextImage() }}
                className="absolute right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 focus-ring"
                aria-label="Next"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            )}
            <img
              src={screenshots[lightboxIndex]}
              alt={`${project.title} screenshot ${lightboxIndex + 1}`}
              className="max-h-[90vh] max-w-full w-auto object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="absolute bottom-4 text-xs text-white/60">
              {lightboxIndex + 1} / {screenshots.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
