import Container from './Container.jsx'

export default function Section({ id, index, title, children }) {
  return (
    <section id={id} className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <h2 className="mb-8 flex items-center gap-3 text-sm font-medium tracking-wide text-muted">
          <span className="text-accent">{String(index).padStart(2, '0')}.</span>
          <span className="text-fg">{title}</span>
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
        </h2>
        {children}
      </Container>
    </section>
  )
}
