import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { LANDMARKS } from '../data/mars'
import { useT } from '../lib/i18n'
import { flyTo, rig } from '../lib/rig'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { useApp } from '../lib/store'

export function Explore() {
  const ref = useRef<HTMLElement>(null)
  const t = useT()
  const exploreIndex = useApp((s) => s.exploreIndex)
  const lang = useApp((s) => s.lang)
  const lm = LANDMARKS[exploreIndex]
  const lt = t.explore.items[lm.id as keyof typeof t.explore.items]

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: '+=340%',
        pin: true,
        onEnter: () => {
          gsap.to(rig, { targetCamX: 0, targetCamY: 0, targetDistance: LANDMARKS[0].camDist, duration: 1.4, ease: 'power2.inOut', overwrite: 'auto' })
          flyTo(LANDMARKS[0].lat, LANDMARKS[0].lon, LANDMARKS[0].camDist)
        },
        onUpdate: (self) => {
          const idx = Math.min(LANDMARKS.length - 1, Math.floor(self.progress * LANDMARKS.length))
          if (idx !== useApp.getState().exploreIndex) {
            useApp.getState().setExploreIndex(idx)
            const target = LANDMARKS[idx]
            flyTo(target.lat, target.lon, target.camDist)
          }
        },
        onLeaveBack: () => {
          gsap.to(rig, { targetDistance: 6.0, duration: 1.2, ease: 'power2.out', overwrite: 'auto' })
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section explore" id="landmarks" ref={ref}>
      <div className="explore-panel">
        <div className="chapter-label">{t.explore.chapter}</div>

        <div className="explore-head">
          <AnimatePresence mode="wait">
            <motion.div
              key={lm.id + lang}
              initial={{ opacity: 0, y: 34, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -34, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="explore-tag">{lt.tag}</div>
              <h2>{lt.name}</h2>
              <p>{lt.blurb}</p>
              <div className="explore-facts">
                {lt.facts.map((f) => (
                  <div key={f.label} className="fact">
                    <span>{f.label}</span>
                    <strong>{f.value}</strong>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="explore-dots">
          {LANDMARKS.map((l, i) => (
            <button
              key={l.id}
              className={`explore-dot ${i === exploreIndex ? 'active' : ''}`}
              onClick={() => {
                useApp.getState().setExploreIndex(i)
                flyTo(l.lat, l.lon, l.camDist)
              }}
            >
              <span>{String(i + 1).padStart(2, '0')}</span> {t.explore.items[l.id as keyof typeof t.explore.items].name}
            </button>
          ))}
        </div>

        <div className="explore-hint">{t.explore.hint}</div>
      </div>
    </section>
  )
}
