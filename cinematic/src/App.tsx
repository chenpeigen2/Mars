import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controls } from './components/Controls'
import { IntroOverlay } from './components/IntroOverlay'
import { Loader } from './components/Loader'
import { LocationCard } from './components/LocationCard'
import { Scene } from './components/Scene'
import { introDolly, rig } from './lib/rig'
import { useApp } from './lib/store'

const IDLE_MS = 3200

export default function App() {
  const loaded = useApp((s) => s.loaded)
  const [uiVisible, setUiVisible] = useState(true)
  const idleTimer = useRef<ReturnType<typeof setTimeout>>()

  // cinematic intro: dolly in from deep space, then hand over to free flight.
  // ?r=<radius> jumps straight to a camera distance (debug/deep-link)
  useEffect(() => {
    if (!loaded) return
    const params = new URLSearchParams(window.location.search)
    const rParam = params.get('r')
    const locParam = params.get('loc')
    if (rParam) {
      rig.radius = parseFloat(rParam)
      rig.autoRotate = false
      useApp.getState().setPhase('done')
      if (locParam) useApp.getState().select(parseInt(locParam, 10))
      return
    }
    rig.autoRotate = true
    introDolly(() => useApp.getState().setPhase('done'))
  }, [loaded])

  // hide UI while idle for a clean fullscreen look
  const poke = useCallback(() => {
    setUiVisible(true)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setUiVisible(false), IDLE_MS)
  }, [])
  useEffect(() => {
    poke()
    window.addEventListener('pointermove', poke)
    window.addEventListener('pointerdown', poke)
    window.addEventListener('touchstart', poke, { passive: true })
    return () => {
      window.removeEventListener('pointermove', poke)
      window.removeEventListener('pointerdown', poke)
      window.removeEventListener('touchstart', poke)
      clearTimeout(idleTimer.current)
    }
  }, [poke])

  return (
    <>
      <Scene />

      <div className={`ui ${uiVisible ? '' : 'ui-hidden'}`}>
        <Controls />
        <LocationCard />
      </div>

      <AnimatePresence>
        <IntroOverlay key="intro" />
      </AnimatePresence>

      {/* cinematic dressing */}
      <div className="vignette" />
      <div className="grain" />

      <Loader />
    </>
  )
}
