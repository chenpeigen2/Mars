import { useProgress } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useT } from '../lib/i18n'
import { useApp } from '../lib/store'

export function Loader() {
  const t = useT()
  const { active, progress } = useProgress()
  const loaded = useApp((s) => s.loaded)
  const setLoaded = useApp((s) => s.setLoaded)

  useEffect(() => {
    if (!active && progress >= 100 && !loaded) {
      const t = setTimeout(() => setLoaded(true), 400)
      return () => clearTimeout(t)
    }
  }, [active, progress, loaded, setLoaded])

  // Fallback: never trap the visitor on the loader (slow GPU, blocked WebGL, etc.)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 12000)
    return () => clearTimeout(t)
  }, [setLoaded])

  return (
    <motion.div
      className="loader"
      initial={false}
      animate={{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? 'none' : 'auto' }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
    >
      <div className="loader-inner">
        <div className="loader-title">MARS</div>
        <div className="loader-bar">
          <motion.div className="loader-fill" animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut' }} />
        </div>
        <div className="loader-pct">{Math.floor(progress)}%</div>
        <div className="loader-hint">{t.loader.hint}</div>
      </div>
    </motion.div>
  )
}
