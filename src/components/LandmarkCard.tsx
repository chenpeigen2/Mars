import { AnimatePresence, motion } from 'framer-motion'
import { LANDMARKS } from '../data/mars'
import { useT } from '../lib/i18n'
import { useApp } from '../lib/store'

/** Floating detail card shown when a landmark marker is clicked (outside the Landmarks chapter). */
export function LandmarkCard() {
  const t = useT()
  const lang = useApp((s) => s.lang)
  const section = useApp((s) => s.section)
  const id = useApp((s) => s.selectedLandmark)
  const close = useApp((s) => s.selectLandmark)
  const lm = LANDMARKS.find((l) => l.id === id)
  const lt = lm ? t.explore.items[lm.id as keyof typeof t.explore.items] : null
  const visible = !!lm && !!lt && section !== 'landmarks' && section !== 'hero'

  return (
    <AnimatePresence>
      {visible && lm && lt && (
        <motion.aside
          key={lm.id + lang}
          className="floating-card"
          initial={{ opacity: 0, x: -40, filter: 'blur(6px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -40, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <button className="floating-card-close" onClick={() => close(null)}>
            ✕
          </button>
          <div className="floating-card-tag">{lt.tag}</div>
          <h3>{lt.name}</h3>
          <p>{lt.blurb}</p>
          <div className="floating-card-facts">
            {lt.facts.map((f) => (
              <div key={f.label} className="fact">
                <span>{f.label}</span>
                <strong>{f.value}</strong>
              </div>
            ))}
          </div>
          <div className="floating-card-coords">
            {t.coords.lat(lm.lat)} · {t.coords.lon(lm.lon)}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
