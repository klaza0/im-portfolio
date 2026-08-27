import { useState, useMemo, useEffect } from 'react'
import { projects } from '../../../data/projects'
import { certificateFiles, CERTIFICATES_FOLDER } from '../../../data/certificates'
import { knowledgeItems, KNOWLEDGE_FOLDER } from '../../../data/knowledge'
import { useDesktop } from '../../../context/DesktopContext'
import { ChevronRight, Folder, File, Home, Search } from 'lucide-react'
import { IconDisplay } from '../../common/IconDisplay'
import { DRIVE_3M } from '../../../data/branding'
import { systemIcons } from '../../../data/icons'
import type { CertificateFileType } from '../../../data/certificates'

interface FileExplorerAppProps {
  initialPath?: string[]
}

type ExplorerItem =
  | { kind: 'folder'; id: string; name: string; icon: string; path: string[] }
  | { kind: 'project'; id: string; name: string; icon: string }
  | { kind: 'certificate'; id: string; name: string; icon: string; fileName: string; fileType: CertificateFileType }
  | { kind: 'knowledge'; id: string; name: string; icon: string }

export function FileExplorerApp({ initialPath }: FileExplorerAppProps) {
  const { openWindow } = useDesktop()
  const [path, setPath] = useState<string[]>(initialPath ?? [DRIVE_3M])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (initialPath?.length) {
      setPath(initialPath)
    }
  }, [initialPath])

  const currentFolder = path[path.length - 1]

  const items = useMemo((): ExplorerItem[] => {
    if (currentFolder === 'Projects') {
      return projects.map(p => ({
        kind: 'project' as const,
        id: p.id,
        name: p.title,
        icon: p.icon,
      }))
    }
    if (currentFolder === CERTIFICATES_FOLDER) {
      return certificateFiles.map(c => ({
        kind: 'certificate' as const,
        id: c.id,
        name: c.name,
        icon: c.icon,
        fileName: c.fileName,
        fileType: c.type,
      }))
    }
    if (currentFolder === KNOWLEDGE_FOLDER) {
      return knowledgeItems.map(k => ({
        kind: 'knowledge' as const,
        id: k.id,
        name: k.name,
        icon: k.icon,
      }))
    }
    return []
  }, [currentFolder])

  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))

  const handleOpenProject = (id: string, name: string) => {
    openWindow('project-detail', { projectId: id, projectTitle: name })
  }

  const handleOpenCertificate = (file: Extract<ExplorerItem, { kind: 'certificate' }>) => {
    openWindow('file-viewer', {
      fileName: file.fileName,
      title: file.name,
      fileType: file.fileType,
    })
  }

  const isDriveRoot = path.length === 1 && path[0] === DRIVE_3M
  const isThisPC = path.length === 1 && path[0] === 'This PC'

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] shrink-0">
        <button
          onClick={() => setPath(['This PC'])}
          className="p-1.5 rounded hover:bg-white/10 focus-ring"
          aria-label="Home"
        >
          <Home size={14} />
        </button>
        <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] flex-1 min-w-0 overflow-x-auto">
          {path.map((segment, i) => (
            <span key={i} className="flex items-center gap-1 shrink-0">
              {i > 0 && <ChevronRight size={10} />}
              <button
                onClick={() => setPath(path.slice(0, i + 1))}
                className="hover:accent-text transition-colors focus-ring rounded px-0.5"
              >
                {segment}
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-[var(--border)] w-36">
          <Search size={12} className="text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-[11px] outline-none min-w-0"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isThisPC ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onDoubleClick={() => setPath([DRIVE_3M])}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-[var(--accent-subtle)] transition-colors focus-ring"
              aria-label={`${DRIVE_3M} — double-click to open`}
            >
              <img src={systemIcons.folder} alt="" className="w-8 h-8 object-contain" draggable={false} />
              <span className="text-xs text-center">{DRIVE_3M}</span>
            </button>
            <button
              onDoubleClick={() => openWindow('resume')}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/5 transition-colors focus-ring"
              aria-label="Documents — double-click to open"
            >
              <img src={systemIcons.folderDocuments} alt="" className="w-8 h-8 object-contain" draggable={false} />
              <span className="text-xs">Documents</span>
            </button>
          </div>
        ) : isDriveRoot ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onDoubleClick={() => setPath([DRIVE_3M, 'Projects'])}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-[var(--accent-subtle)] transition-colors focus-ring"
              aria-label="Projects — double-click to open"
            >
              <img src={systemIcons.folder} alt="" className="w-8 h-8 object-contain" draggable={false} />
              <span className="text-xs">Projects</span>
            </button>
            <button
              onDoubleClick={() => setPath([DRIVE_3M, CERTIFICATES_FOLDER])}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-[var(--accent-subtle)] transition-colors focus-ring"
              aria-label="certificates — double-click to open"
            >
              <img src={systemIcons.folderDocuments} alt="" className="w-8 h-8 object-contain" draggable={false} />
              <span className="text-xs">certificates</span>
            </button>
            <button
              onDoubleClick={() => setPath([DRIVE_3M, KNOWLEDGE_FOLDER])}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-[var(--accent-subtle)] transition-colors focus-ring"
              aria-label="Knowledge — double-click to open"
            >
              <img src={systemIcons.folderDownload} alt="" className="w-8 h-8 object-contain" draggable={false} />
              <span className="text-xs">Knowledge</span>
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                onDoubleClick={() => {
                  if (item.kind === 'project') handleOpenProject(item.id, item.name)
                  if (item.kind === 'certificate') handleOpenCertificate(item)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--accent-subtle)] transition-colors text-left focus-ring group ${
                  selectedId === item.id ? 'bg-white/10 ring-1 ring-white/15' : ''
                }`}
              >
                <IconDisplay
                  icon={item.icon}
                  className="text-xl"
                  imgClassName="w-8 h-8 object-contain"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{item.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {item.kind === 'project' ? 'File folder' : item.kind === 'certificate' ? item.fileType.toUpperCase() + ' file' : item.kind === 'knowledge' ? 'Knowledge item' : 'Folder'}
                  </div>
                </div>
                {item.kind === 'project' ? (
                  <Folder size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100" />
                ) : (
                  <File size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100" />
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-[var(--text-muted)] text-center py-8">This folder is empty.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
