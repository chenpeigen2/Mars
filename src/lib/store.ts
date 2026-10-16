import { create } from 'zustand'
import { gsap } from 'gsap'
import { LANDMARKS, MISSIONS } from '../data/mars'
import type { DayMode } from './rig'
import { DAY_PRESETS, flyTo, rig } from './rig'

export type Lang = 'en' | 'zh'

interface AppState {
  loaded: boolean
  lang: Lang
  selectedLandmark: string | null
  selectedMission: string | null
  exploreIndex: number
  dayMode: DayMode
  atmosphere: boolean
  section: string
  setLoaded: (v: boolean) => void
  selectLandmark: (id: string | null) => void
  selectMission: (id: string | null) => void
  setExploreIndex: (i: number) => void
  setDayMode: (m: DayMode) => void
  toggleAtmosphere: () => void
  setSection: (s: string) => void
  setLang: (l: Lang) => void
}

const urlLang = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : null
const storedLang = (typeof localStorage !== 'undefined' && localStorage.getItem('mars-lang')) as Lang | null

export const useApp = create<AppState>((set, get) => ({
  loaded: false,
  lang: urlLang === 'zh' || storedLang === 'zh' ? 'zh' : 'en',
  selectedLandmark: null,
  selectedMission: null,
  exploreIndex: 0,
  dayMode: 'day',
  atmosphere: true,
  section: 'hero',
  setLoaded: (v) => set({ loaded: v }),
  selectLandmark: (id) => {
    set({ selectedLandmark: id })
    if (id) {
      const lm = LANDMARKS.find((l) => l.id === id)
      if (lm) {
        set({ exploreIndex: LANDMARKS.indexOf(lm) })
        flyTo(lm.lat, lm.lon, lm.camDist)
      }
    }
  },
  selectMission: (id) => {
    set({ selectedMission: id })
    if (id) {
      const m = MISSIONS.find((x) => x.id === id)
      if (m) {
        set({ selectedLandmark: null })
        flyTo(m.lat, m.lon, 2.5)
      }
    }
  },
  setExploreIndex: (i) => set({ exploreIndex: i }),
  setDayMode: (mode) => {
    const p = DAY_PRESETS[mode]
    set({ dayMode: mode })
    rig.dayMode = mode
    gsap.to(rig, { sunIntensity: p.sun, ambientIntensity: p.amb, duration: 1.4, ease: 'power2.inOut', overwrite: 'auto' })
    gsap.to(rig.sunColor, { ...hexToRgb(p.sunColor), duration: 1.4, overwrite: 'auto' })
    gsap.to(rig.ambientColor, { ...hexToRgb(p.ambColor), duration: 1.4, overwrite: 'auto' })
  },
  toggleAtmosphere: () => {
    const next = !get().atmosphere
    set({ atmosphere: next })
    rig.atmosphere = next
  },
  setSection: (s) => set({ section: s }),
  setLang: (l) => {
    set({ lang: l })
    try {
      localStorage.setItem('mars-lang', l)
    } catch {
      /* private mode */
    }
    if (typeof document !== 'undefined') document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en'
  },
}))

function hexToRgb(hex: string) {
  const c = parseInt(hex.slice(1), 16)
  return { r: ((c >> 16) & 255) / 255, g: ((c >> 8) & 255) / 255, b: (c & 255) / 255 }
}
