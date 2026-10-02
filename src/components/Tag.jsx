export default function Tag({ children }) {
  return (
    <span className="rounded border border-border bg-surface px-2 py-1 text-xs text-muted transition-colors hover:border-accent/60 hover:text-fg">
      {children}
    </span>
  )
}
