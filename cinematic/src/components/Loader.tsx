import { useProgress } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useUI } from '../lib/i18n'
import { useApp } from '../lib/store'

export function Loader() {
  const ui = useUI()
  const { active, progress } = useProgress()
  const loaded = useApp((s) => s.loaded)
  const setLoaded = useApp((s) => s.setLoaded)

  useEffect(() => {
    if (!active && progress >= 100 && !loaded) {
      const t = setTimeout(() => setLoaded(true), 400)
      return () => clearTimeout(t)
    }
  }, [active, progress, loaded, setLoaded])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 12000)
    return () => clearTimeout(t)
  }, [setLoaded])

  return (
    <motion.div
      className="loader"
      initial={false}
      animate={{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? 'none' : 'auto' }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <div className="loader-inner">
        <motion.div
          className="loader-mark"
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, letterSpacing: '0.55em' }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          火星
        </motion.div>
        <div className="loader-sub">MARS</div>
        <div className="loader-bar">
          <motion.div className="loader-fill" animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut' }} />
        </div>
        <div className="loader-pct">{Math.floor(progress)}%</div>
        <div className="loader-hint">{ui.loaderHint}</div>
      </div>
    </motion.div>
  )
}
