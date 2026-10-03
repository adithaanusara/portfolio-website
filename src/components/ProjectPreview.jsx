import { motion } from 'motion/react'

const tokenClass = {
  kw: 'text-violet-300',
  fn: 'text-accent',
  st: 'text-amber-300',
  tx: 'text-fg/85',
  cm: 'text-subtle',
  ok: 'text-accent',
}

// Group the flat token list into lines.
function toLines(tokens) {
  const lines = [[]]
  for (const [type, text] of tokens) {
    if (type === 'nl') lines.push([])
    else lines[lines.length - 1].push([type, text])
  }
  return lines.filter((l) => l.length)
}

// A designed, code-style cover for projects without a screenshot. The
// snippet is illustrative — it sums up what the project does.
export default function ProjectPreview({ project, hue, active }) {
  const lines = toLines(project.preview.lines)

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#070a09]">
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 70% 60% at 80% 0%, ${hue}33, transparent 70%), radial-gradient(ellipse 50% 50% at 0% 100%, ${hue}22, transparent 70%)` }}
      />
      <div className="absolute inset-0 bg-grid opacity-70" />
      <span
        className="absolute -right-4 -bottom-6 text-[clamp(3rem,10vw,7.5rem)] leading-none font-extrabold tracking-tighter whitespace-nowrap text-white/[0.04] select-none"
        aria-hidden="true"
      >
        {project.name.split(' ')[0]}
      </span>

      <div className="relative flex h-full flex-col justify-center p-5 sm:p-10">
        <p className="text-[10px] tracking-[0.3em] uppercase sm:text-xs" style={{ color: hue }}>
          {project.category}
        </p>
        <p className="mt-2 text-2xl font-extrabold tracking-tight text-fg sm:text-4xl">{project.name}</p>

        <div className="mt-5 max-w-lg overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur sm:mt-7">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="ml-2 truncate text-[10px] text-subtle">{project.preview.file}</span>
          </div>
          <pre className="overflow-hidden px-4 py-3 text-[10px] leading-[1.7] sm:text-xs">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={active ? { opacity: 1, x: 0 } : { opacity: 0.4, x: 0 }}
                transition={{ delay: active ? 0.15 + i * 0.08 : 0, duration: 0.4 }}
                className="whitespace-pre"
              >
                <span className="mr-4 inline-block w-3 text-right text-white/20 select-none">{i + 1}</span>
                {line.map(([type, text], j) => (
                  <span key={j} className={tokenClass[type]}>
                    {text}
                  </span>
                ))}
              </motion.div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  )
}
