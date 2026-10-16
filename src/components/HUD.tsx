import { motion, useScroll, useSpring } from 'framer-motion'
import { useT } from '../lib/i18n'
import { resetView, zoomBy, type DayMode } from '../lib/rig'
import { scrollToSection } from '../lib/scroll'
import { useApp } from '../lib/store'

const SECTION_IDS = ['hero', 'overview', 'landmarks', 'missions', 'surface', 'outro'] as const

const DAY_MODES: { id: DayMode; key: 'day' | 'dusk' | 'night' }[] = [
  { id: 'day', key: 'day' },
  { id: 'dusk', key: 'dusk' },
  { id: 'night', key: 'night' },
]

export function HUD() {
  const t = useT()
  const section = useApp((s) => s.section)
  const dayMode = useApp((s) => s.dayMode)
  const atmosphere = useApp((s) => s.atmosphere)
  const lang = useApp((s) => s.lang)
  const setDayMode = useApp((s) => s.setDayMode)
  const toggleAtmosphere = useApp((s) => s.toggleAtmosphere)
  const setLang = useApp((s) => s.setLang)
  const selectLandmark = useApp((s) => s.selectLandmark)
  const selectMission = useApp((s) => s.selectMission)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })

  const reset = () => {
    selectLandmark(null)
    selectMission(null)
    resetView()
  }

  return (
    <>
      <header className="hud-top">
        <button className="hud-logo" onClick={() => scrollToSection('#hero')}>
          <span className="hud-logo-dot" />
          MARS
          <span className="hud-logo-sub">INTERACTIVE ATLAS</span>
        </button>

        <nav className="hud-nav">
          {SECTION_IDS.map((id) => (
            <button
              key={id}
              className={`hud-nav-item ${section === id ? 'active' : ''}`}
              onClick={() => scrollToSection(`#${id}`)}
            >
              {t.nav[id]}
            </button>
          ))}
        </nav>

        <div className="hud-controls">
          <div className="hud-seg">
            {DAY_MODES.map((m) => (
              <button
                key={m.id}
                className={`hud-seg-item ${dayMode === m.id ? 'active' : ''}`}
                onClick={() => setDayMode(m.id)}
              >
                {t.hud[m.key]}
              </button>
            ))}
          </div>
          <button className={`hud-pill ${atmosphere ? 'active' : ''}`} onClick={toggleAtmosphere}>
            {atmosphere ? t.hud.atmoOn : t.hud.atmoOff}
          </button>
          <div className="hud-seg">
            <button className="hud-seg-item" onClick={() => zoomBy(0.6)} title="Zoom out">
              −
            </button>
            <button className="hud-seg-item" onClick={reset} title="Reset view">
              ⌂
            </button>
            <button className="hud-seg-item" onClick={() => zoomBy(-0.6)} title="Zoom in">
              +
            </button>
          </div>
          <div className="hud-seg">
            <button className={`hud-seg-item ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>
              EN
            </button>
            <button className={`hud-seg-item ${lang === 'zh' ? 'active' : ''}`} onClick={() => setLang('zh')}>
              中
            </button>
          </div>
        </div>
      </header>

      <div className="hud-progress">
        <motion.div className="hud-progress-fill" style={{ scaleY: progress }} />
      </div>

      <div className="hud-badge">{t.hud.badge}</div>
    </>
  )
}
