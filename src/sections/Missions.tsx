import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { MISSIONS } from '../data/mars'
import { useT } from '../lib/i18n'
import { rig } from '../lib/rig'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { useApp } from '../lib/store'
import type { Mission } from '../data/mars'

export function Missions() {
  const ref = useRef<HTMLElement>(null)
  const t = useT()
  const lang = useApp((s) => s.lang)
  const selectedMission = useApp((s) => s.selectedMission)
  const selectMission = useApp((s) => s.selectMission)
  const mission = MISSIONS.find((m) => m.id === selectedMission) ?? MISSIONS[4]
  const mt = t.missions.items[mission.id as keyof typeof t.missions.items]

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 60%',
        onEnter: () => {
          gsap.to(rig, { targetCamX: 1.35, targetCamY: 0, targetDistance: 5.2, duration: 1.6, ease: 'power2.inOut', overwrite: 'auto' })
        },
        onLeaveBack: () => {
          gsap.to(rig, { targetCamX: 0, targetDistance: 3.2, duration: 1.4, ease: 'power2.inOut', overwrite: 'auto' })
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section missions" id="missions" ref={ref}>
      <div className="missions-inner">
        <div className="missions-head">
          <div className="chapter-label">{t.missions.chapter}</div>
          <h2>
            {t.missions.titleA}
            <br />
            {t.missions.titleB}
          </h2>
          <p>{t.missions.copy}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mission.id + lang}
            className="mission-card"
            initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -26, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mission-card-top">
              <span className={`mission-status ${mission.status.toLowerCase()}`}>{t.missions.status[mission.status]}</span>
              <span className="mission-year">{mission.year}</span>
            </div>
            <h3>{mt.name}</h3>
            <div className="mission-craft">{mt.craft}</div>
            <p>{mt.blurb}</p>
            <div className="floating-card-facts">
              {mt.facts.map((f) => (
                <div key={f.label} className="fact">
                  <span>{f.label}</span>
                  <strong>{f.value}</strong>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mission-list">
          {MISSIONS.map((m: Mission) => (
            <button
              key={m.id}
              className={`mission-row ${mission.id === m.id ? 'active' : ''}`}
              onClick={() => selectMission(m.id)}
            >
              <span className="mission-row-year">{m.year}</span>
              <span className="mission-row-name">{t.missions.items[m.id as keyof typeof t.missions.items].name}</span>
              <span className={`mission-status ${m.status.toLowerCase()}`}>{t.missions.status[m.status]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
