import { useEffect, useMemo, useRef, useState } from 'react'
import { navLinks, profile } from '../data/portfolio.js'
import { resumeFileName, resumeUrl } from '../data/resume.js'
import { lockScroll, scrollToId } from '../lib/scroll.js'

export const shortcutLabel = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K'

const commands = [
  ...[...navLinks, { id: 'contact', label: 'contact' }].map((link) => ({
    id: `go-${link.id}`,
    label: `cd ${link.label}`,
    hint: 'navigate',
    run: () => scrollToId(link.id),
    // Scrolling is locked while the palette is open, so run after it closes.
    afterClose: true,
  })),
  {
    id: 'copy-email',
    label: 'copy email',
    hint: profile.email,
    run: () => navigator.clipboard?.writeText(profile.email),
    feedback: 'copied to clipboard ✓',
  },
  {
    id: 'send-email',
    label: 'send email',
    hint: 'mailto',
    run: () => {
      window.location.href = `mailto:${profile.email}`
    },
  },
  ...(resumeUrl
    ? [
        {
          id: 'download-resume',
          label: 'download résumé',
          hint: 'pdf',
          run: () => {
            const a = document.createElement('a')
            a.href = resumeUrl
            a.download = resumeFileName
            a.click()
          },
        },
      ]
    : []),
  {
    id: 'open-github',
    label: 'open github',
    hint: 'github.com/adithaanusara',
    run: () => window.open(profile.github, '_blank', 'noopener'),
  },
  {
    id: 'open-linkedin',
    label: 'open linkedin',
    hint: 'linkedin.com',
    run: () => window.open(profile.linkedin, '_blank', 'noopener'),
  },
]

export default function CommandPalette({ open, onOpenChange }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const [flash, setFlash] = useState(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(q))
  }, [query])

  // Global shortcut: ⌘K / Ctrl+K toggles the palette.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onOpenChange])

  // Reset state, lock page scroll and manage focus while open.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    setQuery('')
    setIndex(0)
    setFlash(null)
    lockScroll(true)
    inputRef.current?.focus()
    return () => {
      lockScroll(false)
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [index])

  if (!open) return null

  const close = () => onOpenChange(false)

  const execute = (command) => {
    if (!command) return
    if (command.afterClose) {
      close()
      setTimeout(command.run, 0)
      return
    }
    command.run()
    if (command.feedback) {
      setFlash(command.feedback)
      setTimeout(close, 700)
    } else {
      close()
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (i + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      execute(results[index])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }

  const activeId = results[index] ? `cmd-${results[index].id}` : undefined

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface shadow-2xl shadow-black/60"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <span className="text-accent" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIndex(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="type a command…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={activeId}
            autoComplete="off"
            spellCheck="false"
            className="h-12 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-subtle"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-subtle">esc</kbd>
        </div>

        {flash ? (
          <p className="px-4 py-6 text-center text-sm text-accent" role="status">
            {flash}
          </p>
        ) : (
          <ul
            ref={listRef}
            id="command-list"
            role="listbox"
            data-lenis-prevent
            className="max-h-80 overflow-y-auto py-2"
          >
            {results.length === 0 && <li className="px-4 py-3 text-sm text-subtle">no matching commands</li>}
            {results.map((c, i) => (
              <li
                key={c.id}
                id={`cmd-${c.id}`}
                role="option"
                aria-selected={i === index}
                onMouseMove={() => setIndex(i)}
                onClick={() => execute(c)}
                className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-sm ${
                  i === index ? 'bg-border/60 text-fg' : 'text-muted'
                }`}
              >
                <span>
                  <span className={i === index ? 'text-accent' : 'text-subtle'}>$ </span>
                  {c.label}
                </span>
                <span className="truncate text-xs text-subtle">{c.hint}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-subtle">
          <span>↑↓ navigate</span>
          <span>↵ run</span>
          <span className="ml-auto">{shortcutLabel} toggle</span>
        </div>
      </div>
    </div>
  )
}
