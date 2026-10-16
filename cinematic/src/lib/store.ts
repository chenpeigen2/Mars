import { create } from 'zustand'
import { gsap } from 'gsap'
import { LOCATIONS } from '../data/locations'
import { flyTo, rig, type DayMode } from './rig'

export type Lang = 'zh' | 'en'

interface AppState {
  loaded: boolean
  lang: Lang
  /** selected landmark index, -1 = none */
  index: number
  /** true while standing on the surface */
  surface: boolean
  phase: 'intro' | 'done'
  dayMode: DayMode
  atmosphere: boolean
  setLoaded: (v: boolean) => void
  setLang: (l: Lang) => void
  setSurface: (v: boolean) => void
  setPhase: (p: 'intro' | 'done') => void
  setDayMode: (m: DayMode) => void
  toggleAtmosphere: () => void
  /** click a marker: select + fly there + open card */
  select: (i: number) => void
  clear: () => void
}

const urlLang = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : null
const stored = typeof localStorage !== 'undefined' ? (localStorage.getItem('mars-lang') as Lang | null) : null

export const useApp = create<AppState>((set, get) => ({
  loaded: false,
  lang: urlLang === 'en' || stored === 'en' ? 'en' : 'zh',
  index: -1,
  surface: false,
  phase: 'intro',
  dayMode: 'dusk',
  atmosphere: true,
  setLoaded: (v) => set({ loaded: v }),
  setLang: (l) => {
    set({ lang: l })
    try {
      localStorage.setItem('mars-lang', l)
    } catch { /* ignore */ }
  },
  setSurface: (v) => set({ surface: v }),
  setPhase: (p) => set({ phase: p }),
  setDayMode: (mode) => {
    const presets: Record<DayMode, { sun: number; sunColor: string; amb: number; ambColor: string }> = {
      day: { sun: 2.3, sunColor: '#fff2e2', amb: 0.32, ambColor: '#ffffff' },
      dusk: { sun: 1.25, sunColor: '#ff6a35', amb: 0.24, ambColor: '#5a3644' },
      night: { sun: 0.07, sunColor: '#88aaff', amb: 0.16, ambColor: '#22304f' },
    }
    const p = presets[mode]
    set({ dayMode: mode })
    rig.dayMode = mode
    gsap.to(rig, { sunIntensity: p.sun, ambientIntensity: p.amb, duration: 1.6, ease: 'power2.inOut', overwrite: 'auto' })
    gsap.to(rig.sunColor, { ...hexToRgb(p.sunColor), duration: 1.6, overwrite: 'auto' })
    gsap.to(rig.ambientColor, { ...hexToRgb(p.ambColor), duration: 1.6, overwrite: 'auto' })
  },
  toggleAtmosphere: () => {
    rig.atmosphere = !get().atmosphere
    set({ atmosphere: rig.atmosphere })
  },
  select: (i) => {
    const loc = LOCATIONS[i]
    if (!loc) return
    set({ index: i })
    flyTo(loc.lat, loc.lon, loc.dist, 3.4)
  },
  clear: () => set({ index: -1 }),
}))

function hexToRgb(hex: string) {
  const c = parseInt(hex.slice(1), 16)
  return { r: ((c >> 16) & 255) / 255, g: ((c >> 8) & 255) / 255, b: (c & 255) / 255 }
}
