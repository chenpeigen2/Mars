import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useT } from '../lib/i18n'
import { rig } from '../lib/rig'
import { gsap, scrollToSection, ScrollTrigger } from '../lib/scroll'

export function Outro() {
  const ref = useRef<HTMLElement>(null)
  const t = useT()

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 70%',
        onEnter: () => {
          gsap.to(rig, { surfaceT: 0, targetDistance: 6.4, targetCamX: 0, targetCamY: 0, duration: 1.8, ease: 'power2.inOut', overwrite: 'auto' })
          rig.autoRotate = true
        },
        onLeaveBack: () => {
          rig.autoRotate = false
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section outro" id="outro" ref={ref}>
      <motion.div
        className="outro-inner"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-25%' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="chapter-label center">{t.outro.chapter}</div>
        <blockquote>
          {t.outro.quote}
          <cite>{t.outro.cite}</cite>
        </blockquote>
        <p className="outro-copy">{t.outro.copy}</p>
        <button className="outro-btn" onClick={() => scrollToSection('#hero')}>
          ⟲ &nbsp;{t.outro.button}
        </button>
        <div className="outro-credits">{t.outro.credits}</div>
      </motion.div>
    </section>
  )
}
