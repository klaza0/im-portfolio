import { useState } from 'react'
import { RESUME_PDF_URL, RESUME_DOWNLOAD_NAME } from '../../../data/socials'
import { profile } from '../../../data/profile'
import { ZoomIn, ZoomOut, Download, Printer, ExternalLink } from 'lucide-react'

export function ResumeApp() {
  const [zoom, setZoom] = useState(100)

  const handlePrint = () => {
    const frame = document.getElementById('resume-pdf-frame') as HTMLIFrameElement | null
    frame?.contentWindow?.print()
  }

  return (
    <div className="h-full flex flex-col bg-[#525659]">
      <div className="flex items-center gap-1 px-3 py-2 bg-[#323639] border-b border-black/20 shrink-0">
        <span className="text-[11px] text-white/90 truncate flex-1 mr-2">
          {profile.name} — Resume
        </span>
        <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1.5 rounded hover:bg-white/10 focus-ring" aria-label="Zoom out">
          <ZoomOut size={16} className="text-white" />
        </button>
        <span className="text-[11px] text-white/70 w-10 text-center">{zoom}%</span>
        <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1.5 rounded hover:bg-white/10 focus-ring" aria-label="Zoom in">
          <ZoomIn size={16} className="text-white" />
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        <a
          href={RESUME_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded hover:bg-white/10 focus-ring"
          aria-label="Open in new tab"
          title="Open in new tab"
        >
          <ExternalLink size={16} className="text-white" />
        </a>
        <a
          href={RESUME_PDF_URL}
          download={RESUME_DOWNLOAD_NAME}
          className="p-1.5 rounded hover:bg-white/10 focus-ring"
          aria-label="Download CV"
          title="Download"
        >
          <Download size={16} className="text-white" />
        </a>
        <button onClick={handlePrint} className="p-1.5 rounded hover:bg-white/10 focus-ring" aria-label="Print">
          <Printer size={16} className="text-white" />
        </button>
        <a
          href={RESUME_PDF_URL}
          download={RESUME_DOWNLOAD_NAME}
          className="ml-1 px-3 py-1 rounded accent-bg text-white text-[11px] font-medium hover:opacity-90 focus-ring"
        >
          Download CV
        </a>
      </div>

      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <div
          className="w-full max-w-4xl h-full min-h-[480px] transition-transform origin-top"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          <iframe
            id="resume-pdf-frame"
            src={RESUME_PDF_URL}
            title={`${profile.name} Resume`}
            className="w-full h-full min-h-[600px] rounded bg-white shadow-2xl border-0"
          />
        </div>
      </div>
    </div>
  )
}
