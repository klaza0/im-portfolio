import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { projects, projectFilters } from '../../../data/projects'
import { useDesktop } from '../../../context/DesktopContext'
import { Search, Folder } from 'lucide-react'
import { IconDisplay } from '../../common/IconDisplay'

export function ProjectsApp() {
  const { openWindow } = useDesktop()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'All' || p.tags.includes(filter)
      return matchesSearch && matchesFilter
    })
  }, [search, filter])

  const handleOpen = (projectId: string, title: string) => {
    openWindow('project-detail', { projectId, projectTitle: title })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-1.5 flex-1 px-2.5 py-1.5 rounded-md bg-white/5 border border-[var(--border)]">
          <Search size={14} className="text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 px-3 py-2 border-b border-[var(--border)] overflow-x-auto shrink-0">
        {projectFilters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors focus-ring ${
              filter === f ? 'accent-bg text-white' : 'hover:bg-white/5 text-[var(--text-muted)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filtered.map((project, i) => (
            <motion.button
              key={project.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onDoubleClick={() => handleOpen(project.id, project.title)}
              onClick={() => handleOpen(project.id, project.title)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-[var(--accent-subtle)] transition-colors focus-ring group"
            >
              <IconDisplay
                icon={project.icon}
                className="text-3xl group-hover:scale-110 transition-transform"
                imgClassName="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
              />
              <div className="text-center">
                <div className="text-xs font-medium flex items-center gap-1 justify-center">
                  <Folder size={10} className="text-[var(--text-muted)]" />
                  {project.title}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-0.5 line-clamp-2">{project.description}</div>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                project.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {project.status}
              </span>
            </motion.button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">No projects found</p>
        )}
      </div>
    </div>
  )
}
