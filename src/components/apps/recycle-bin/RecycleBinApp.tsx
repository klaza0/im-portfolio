import { useState } from 'react'
import { Trash2 } from 'lucide-react'

export function RecycleBinApp() {
  const [easterEgg, setEasterEgg] = useState(false)

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <Trash2 size={48} className="text-[var(--text-muted)] mb-4 opacity-50" />
      <p className="text-sm text-[var(--text-muted)]">This folder is empty.</p>
      <p className="text-[11px] text-[var(--text-muted)] mt-2 opacity-60">
        Items you delete appear here.
      </p>

      <button
        onClick={() => setEasterEgg(true)}
        className="mt-8 text-[10px] text-[var(--text-muted)] opacity-30 hover:opacity-70 transition-opacity focus-ring rounded px-2 py-1"
        aria-label="Hidden action"
      >
        Empty Recycle Bin
      </button>

      {easterEgg && (
        <div className="mt-4 p-4 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent)]/20 max-w-xs animate-in fade-in">
          <p className="text-xs accent-text font-medium">Nothing to recover...</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            But hey — every great developer knows: git reflog is the real recycle bin. 🗑️✨
          </p>
        </div>
      )}
    </div>
  )
}
