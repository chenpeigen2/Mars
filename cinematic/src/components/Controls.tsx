import { LOCATIONS } from '../data/locations'
import { useUI } from '../lib/i18n'
import { resetView, rig, zoomBy, type DayMode } from '../lib/rig'
import { useApp } from '../lib/store'
import { gsap } from 'gsap'
import { CAM } from '../data/locations'

const DAY_MODES: { id: DayMode; key: 'day' | 'dusk' | 'night' }[] = [
  { id: 'day', key: 'day' },
  { id: 'dusk', key: 'dusk' },
  { id: 'night', key: 'night' },
]

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export function Controls() {
  const ui = useUI()
  const lang = useApp((s) => s.lang)
  const setLang = useApp((s) => s.setLang)
  const dayMode = useApp((s) => s.dayMode)
  const setDayMode = useApp((s) => s.setDayMode)
  const atmosphere = useApp((s) => s.atmosphere)
  const toggleAtmosphere = useApp((s) => s.toggleAtmosphere)
  const surface = useApp((s) => s.surface)
  const clear = useApp((s) => s.clear)

  const backToSpace = () => {
    clear()
    rig.radiusTarget = null
    gsap.to(rig, { radius: CAM.default, duration: 2.4, ease: 'power2.inOut', overwrite: 'auto' })
  }

  return (
    <>
      <header className="ctl-top">
        <div className="ctl-logo">
          <span className="ctl-logo-zh">火星</span>
          <span className="ctl-logo-sub">{ui.logoSub}</span>
        </div>
        <div className="ctl-group">
          <div className="ctl-seg">
            {DAY_MODES.map((m) => (
              <button key={m.id} className={`ctl-seg-item ${dayMode === m.id ? 'active' : ''}`} onClick={() => setDayMode(m.id)}>
                {ui[m.key]}
              </button>
            ))}
          </div>
          <button className={`ctl-pill ${atmosphere ? 'active' : ''}`} onClick={toggleAtmosphere}>
            {atmosphere ? ui.atmoOn : ui.atmoOff}
          </button>
          <div className="ctl-seg">
            <button className="ctl-seg-item" onClick={() => zoomBy(0.6)} title="Zoom out">
              <svg className="ctl-ico" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 7h8" />
              </svg>
            </button>
            <button className="ctl-seg-item" onClick={resetView} title="Overview">
              <svg className="ctl-ico" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="7" cy="7" r="4.4" />
                <path d="M2.6 7h8.8" strokeLinecap="round" />
              </svg>
            </button>
            <button className="ctl-seg-item" onClick={() => zoomBy(-0.6)} title="Zoom in">
              <svg className="ctl-ico" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 7h8M7 3v8" />
              </svg>
            </button>
          </div>
          <div className="ctl-seg">
            <button className={`ctl-seg-item ${lang === 'zh' ? 'active' : ''}`} onClick={() => setLang('zh')}>中</button>
            <button className={`ctl-seg-item ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
      </header>

      {/* surface-only: return to orbit */}
      <button className={`back-space ${surface ? 'show' : ''}`} onClick={backToSpace}>
        {ui.backToSpace}
      </button>

      <div className="ctl-hint">
        {isTouch ? ui.hintTouch : ui.hint} · {LOCATIONS.length} {ui.sites}
      </div>
    </>
  )
}
