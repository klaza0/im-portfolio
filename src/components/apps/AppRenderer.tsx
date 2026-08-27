import type { AppId } from '../../types'
import { AboutApp } from './about/AboutApp'
import { ProjectsApp } from './projects/ProjectsApp'
import { ProjectDetailApp } from './projects/ProjectDetailApp'
import { SkillsApp } from './skills/SkillsApp'
import { ExperienceApp } from './experience/ExperienceApp'
import { ResumeApp } from './resume/ResumeApp'
import { MediaPlayerApp } from './media-player/MediaPlayerApp'
import { SettingsApp } from './settings/SettingsApp'
import { TerminalApp } from './terminal/TerminalApp'
import { BrowserApp } from './browser/BrowserApp'
import { ContactApp } from './contact/ContactApp'
import { RecycleBinApp } from './recycle-bin/RecycleBinApp'
import { FileExplorerApp } from './file-explorer/FileExplorerApp'
import { FileViewerApp } from './file-viewer/FileViewerApp'
import { ThisPCApp } from './this-pc/ThisPCApp'

interface AppRendererProps {
  appId: AppId
  windowId: string
  payload?: Record<string, unknown>
}

export function AppRenderer({ appId, payload }: AppRendererProps) {
  const renderApp = () => {
    switch (appId) {
      case 'about': return <AboutApp />
      case 'projects': return <ProjectsApp />
      case 'project-detail': return <ProjectDetailApp projectId={payload?.projectId as string} />
      case 'skills': return <SkillsApp />
      case 'experience': return <ExperienceApp />
      case 'resume': return <ResumeApp />
      case 'media':
        return (
          <MediaPlayerApp
            mediaId={payload?.mediaId as string | undefined}
            autoPlay={Boolean(payload?.autoPlay)}
          />
        )
      case 'settings':
        return (
          <SettingsApp
            initialCategory={payload?.settingsCategory as 'personalization' | 'system' | 'accessibility' | 'about' | undefined}
          />
        )
      case 'terminal': return <TerminalApp />
      case 'browser': return <BrowserApp url={payload?.url as string} />
      case 'contact': return <ContactApp />
      case 'recycle-bin': return <RecycleBinApp />
      case 'file-explorer': return <FileExplorerApp initialPath={payload?.initialPath as string[] | undefined} />
      case 'file-viewer':
        return (
          <FileViewerApp
            fileName={payload?.fileName as string | undefined}
            title={payload?.title as string | undefined}
            fileType={payload?.fileType as 'pdf' | 'image' | 'document' | undefined}
          />
        )
      case 'this-pc': return <ThisPCApp />
      default: return <div className="p-4 text-sm text-[var(--text-muted)]">Application not found</div>
    }
  }

  return <div className="h-full min-h-0">{renderApp()}</div>
}
