import { Download, ExternalLink } from 'lucide-react'
import { certificateUrl } from '../../../data/certificates'

interface FileViewerAppProps {
  fileName?: string
  title?: string
  fileType?: 'pdf' | 'image' | 'document'
}

export function FileViewerApp({ fileName, title, fileType = 'pdf' }: FileViewerAppProps) {
  if (!fileName) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-sm text-[var(--text-muted)]">
        No file selected.
      </div>
    )
  }

  const src = certificateUrl(fileName)
  const displayTitle = title ?? fileName

  return (
    <div className="h-full flex flex-col bg-[#525659]">
      <div className="flex items-center justify-between px-3 py-2 bg-[#323639] border-b border-black/20 shrink-0">
        <span className="text-[11px] text-white truncate flex-1 mr-2">{displayTitle}</span>
        <div className="flex items-center gap-1">
          <a
            href={src}
            download={fileName}
            className="p-1.5 rounded hover:bg-white/10 focus-ring"
            aria-label="Download"
            title="Download"
          >
            <Download size={14} className="text-white" />
          </a>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-white/10 focus-ring"
            aria-label="Open in new tab"
            title="Open in new tab"
          >
            <ExternalLink size={14} className="text-white" />
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex items-center justify-center p-2">
        {fileType === 'pdf' && (
          <iframe
            src={src}
            title={displayTitle}
            className="w-full h-full rounded bg-white"
          />
        )}
        {fileType === 'image' && (
          <img
            src={src}
            alt={displayTitle}
            className="max-w-full max-h-full object-contain rounded shadow-lg"
          />
        )}
        {fileType === 'document' && (
          <div className="text-center p-8 max-w-sm">
            <span className="text-5xl mb-4 block">📝</span>
            <p className="text-sm text-white mb-2">{displayTitle}</p>
            <p className="text-xs text-white/60 mb-4">Preview is not available for Word documents.</p>
            <a
              href={src}
              download={fileName}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg accent-bg text-white text-xs font-medium hover:opacity-90 focus-ring"
            >
              <Download size={14} />
              Download file
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
