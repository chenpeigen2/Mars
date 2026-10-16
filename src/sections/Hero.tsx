import { motion } from 'framer-motion'
import { useT } from '../lib/i18n'

const letterAnim = (i: number) => ({
  initial: { opacity: 0, y: 90, rotateX: 60 },
  animate: { opacity: 1, y: 0, rotateX: 0 },
  transition: { delay: 2.1 + i * 0.07, duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
})

export function Hero() {
  const t = useT()

  return (
    <section className="section hero" id="hero">
      <div className="hero-center">
        <motion.div className="hero-overline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0, duration: 1 }}>
          {t.hero.overline}
        </motion.div>
        <h1 className="hero-title" aria-label="MARS">
          {'MARS'.split('').map((c, i) => (
            <motion.span key={i} className="hero-letter" {...letterAnim(i)}>
              {c}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {t.hero.sub1}
          <br />
          {t.hero.sub2}
        </motion.p>
      </div>

      <motion.div
        className="hero-scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
      >
        <div className="hero-scroll-line" />
        <span>{t.hero.scroll}</span>
      </motion.div>

      <div className="hero-ticker">
        <div className="hero-ticker-track">
          {[...t.hero.ticker, ...t.hero.ticker].map((text, i) => (
            <span key={i} className="hero-ticker-item">
              {text} <em>◆</em>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
