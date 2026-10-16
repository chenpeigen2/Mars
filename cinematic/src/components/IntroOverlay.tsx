import { motion } from 'framer-motion'
import { useUI } from '../lib/i18n'
import { useApp } from '../lib/store'

const ease = [0.22, 1, 0.36, 1] as const

/** Opening title card. Ambient only — fades out by itself after the dolly. */
export function IntroOverlay() {
  const ui = useUI()
  const phase = useApp((s) => s.phase)

  if (phase !== 'intro') return null

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.1, ease: 'easeInOut' } }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="intro-zh"
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.4, duration: 1.6, ease }}
      >
        火星
      </motion.div>
      <motion.div
        className="intro-en"
        initial={{ opacity: 0, letterSpacing: '0.6em' }}
        animate={{ opacity: 1, letterSpacing: '0.9em' }}
        transition={{ delay: 1.0, duration: 2, ease }}
      >
        MARS
      </motion.div>
      <motion.div
        className="intro-line"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.4, duration: 1.4, ease }}
      />
      <motion.div
        className="intro-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.35, 1] }}
        transition={{ delay: 2.2, duration: 2.4 }}
      >
        {ui.introHint}
      </motion.div>
    </motion.div>
  )
}
