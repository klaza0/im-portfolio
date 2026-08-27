import { Component, type ErrorInfo, type ReactNode } from 'react'
import { removeFromStorage } from '../utils/storage'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('IM/OS runtime error:', error, info)
  }

  handleReset = () => {
    removeFromStorage('settings')
    removeFromStorage('desktopIcons')
    removeFromStorage('recentApps')
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-[#0a0a0f] text-white p-6">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-xl font-semibold">IM/OS failed to start</h1>
            <p className="text-sm text-white/60">
              Saved desktop data may be corrupted. Reset local storage and reload the workspace.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-lg bg-[#0078d4] hover:opacity-90 text-sm font-medium"
            >
              Reset & Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
