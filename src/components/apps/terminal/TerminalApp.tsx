import { useState, useRef, useEffect, useCallback } from 'react'
import { profile } from '../../../data/profile'
import { SYSTEM_NAME, SYSTEM_VERSION, DEVELOPER_NAME } from '../../../data/branding'
import { projects } from '../../../data/projects'
import { skillCategories } from '../../../data/skills'
import { experience } from '../../../data/experience'
import { contactInfo } from '../../../data/socials'

interface TerminalLine {
  type: 'input' | 'output' | 'error'
  text: string
}

const BANNER = `${SYSTEM_NAME} v${SYSTEM_VERSION}
Developer: ${DEVELOPER_NAME}
Type 'help' for available commands.`

function processCommand(input: string): string[] {
  const cmd = input.trim().toLowerCase()
  const parts = cmd.split(/\s+/)
  const command = parts[0]

  switch (command) {
    case 'help':
      return [
        'Available commands:',
        '  help        — Show this help message',
        '  about       — About the developer',
        '  projects    — List portfolio projects',
        '  skills      — Show technical skills',
        '  experience  — Work experience summary',
        '  contact     — Contact information',
        '  github      — Open GitHub profile',
        '  clear       — Clear terminal',
        '  neofetch    — System information',
        '  whoami      — Current user',
        '  date        — Current date and time',
        '  echo [text] — Echo text back',
      ]
    case 'about':
      return [
        DEVELOPER_NAME,
        profile.title,
        '',
        profile.bio,
        '',
        `Location: ${profile.location}`,
        `Focus: ${profile.currentFocus}`,
      ]
    case 'projects':
      return projects.map(p => `  ${p.icon} ${p.title} [${p.status}] — ${p.description}`)
    case 'skills':
      return skillCategories.flatMap(cat => [
        `[${cat.name}]`,
        ...cat.skills.map(s => `  • ${s.name}`),
        '',
      ])
    case 'experience':
      return experience.map(e => `  ${e.period} — ${e.title} @ ${e.company}`)
    case 'contact':
      return [
        `Email: ${contactInfo.email}`,
        `LinkedIn: ${contactInfo.linkedin}`,
        `GitHub: ${contactInfo.github}`,
      ]
    case 'github':
      return [`GitHub: ${contactInfo.github}`, 'Open in Browser app for full experience.']
    case 'clear':
      return ['__CLEAR__']
    case 'neofetch':
      return [
        '       ██████████',
        '     ██          ██    ' + SYSTEM_NAME,
        '    ██   IM   ██  ██   ─────────────────────',
        '    ██          ██    OS: ' + SYSTEM_NAME + ' ' + SYSTEM_VERSION,
        '     ██        ██      Developer: ' + DEVELOPER_NAME,
        '       ████████        Stack: React / TS / Vite',
        '                       Mobile: Kotlin / Android',
        '                       Backend: Node.js / Firebase',
        '                       Shell: ibrahim-portfolio',
      ]
    case 'whoami':
      return [profile.name.toLowerCase().replace(' ', '-')]
    case 'date':
      return [new Date().toString()]
    case 'echo':
      return [parts.slice(1).join(' ') || '']
    case 'sudo':
      if (parts[1] === 'hire' && parts[2] === 'ibrahim') {
        return [
          '[sudo] password for visitor: ********',
          '',
          '✓ Access granted.',
          'Ibrahim Montaser has been added to your team.',
          'Skills loaded: React, Kotlin, Firebase, Node.js',
          'Status: Ready to build amazing things 🚀',
        ]
      }
      return ['sudo: command not found or insufficient permissions']
    case '':
      return []
    default:
      return [`Command not found: ${command}. Type 'help' for available commands.`]
  }
}

export function TerminalApp() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', text: BANNER },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const execute = useCallback((value: string) => {
    const output = processCommand(value)

    if (output[0] === '__CLEAR__') {
      setLines([{ type: 'output', text: BANNER }])
      return
    }

    setLines(prev => [
      ...prev,
      { type: 'input', text: `$ ${value}` },
      ...output.map(text => ({ type: 'output' as const, text })),
    ])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setHistory(prev => [...prev, input])
    setHistoryIndex(-1)
    execute(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(newIndex)
      setInput(history[newIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const newIndex = historyIndex + 1
      if (newIndex >= history.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    }
  }

  return (
    <div
      className="h-full flex flex-col bg-[#0c0c0c] font-mono text-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-0.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'input' ? 'text-green-400' :
              line.type === 'error' ? 'text-red-400' :
              'text-gray-300'
            }
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-white/10 shrink-0">
        <span className="text-green-400 shrink-0">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-gray-100 caret-green-400"
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal input"
        />
      </form>
    </div>
  )
}
