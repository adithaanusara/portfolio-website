import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export default function Intro() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 0.7], ['blur(0px)', 'blur(12px)'])

  return (
    <section ref={ref} id="top" className="relative isolate h-svh min-h-[560px] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[120px]" />

      <motion.div
        style={{ scale, opacity, filter: blur }}
        className="flex h-full flex-col items-center justify-center px-5 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-[11px] tracking-[0.35em] text-subtle uppercase"
        >
          <span className="text-accent">$</span> ./aditha --portfolio
        </motion.p>
        <p className="text-[clamp(2.5rem,9vw,7.5rem)] leading-[0.95] font-extrabold tracking-tighter">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            className="block bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            Code. Build. Ship.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="text-gradient text-glow block"
          >
            Systems that scale<span className="animate-blink text-accent" aria-hidden="true">_</span>
          </motion.span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] tracking-[0.35em] text-subtle uppercase"
        aria-hidden="true"
      >
        scroll
        <span className="relative h-10 w-px overflow-hidden bg-border">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
