import { AnimatePresence, motion } from 'framer-motion'
import { COPY, LOCATIONS } from '../data/locations'
import { useApp } from '../lib/store'

const ease = [0.22, 1, 0.36, 1] as const

/** Landmark lower-third card, shown after clicking a marker (hidden on the surface). */
export function LocationCard() {
  const lang = useApp((s) => s.lang)
  const index = useApp((s) => s.index)
  const surface = useApp((s) => s.surface)
  const clear = useApp((s) => s.clear)
  const visible = index >= 0 && !surface

  const loc = visible ? LOCATIONS[index] : null
  const copy = loc ? COPY[lang][loc.id] : null

  return (
    <div className="card-slot">
      <AnimatePresence mode="wait">
        {visible && loc && copy && (
          <motion.div key={`${loc.id}-${lang}`} className="loc-card">
            <div className="loc-card-top">
              <span className="loc-index">
                {String(index + 1).padStart(2, '0')} / {String(LOCATIONS.length).padStart(2, '0')}
              </span>
              <span className="loc-progress" />
              <button className="loc-close" onClick={clear}>
                ✕
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.h2
                key={lang}
                className="loc-name"
                initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.7, ease }}
              >
                {copy.name}
              </motion.h2>
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease }}
            >
              <p className="loc-poetic">{copy.poetic}</p>
              <div className="loc-facts">
                {copy.facts.map((f) => (
                  <div key={f.label} className="loc-fact">
                    <span>{f.label}</span>
                    <strong>{f.value}</strong>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
