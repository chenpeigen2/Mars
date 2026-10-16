import { useEffect } from 'react'
import { HUD } from './components/HUD'
import { LandmarkCard } from './components/LandmarkCard'
import { Loader } from './components/Loader'
import { Scene } from './components/Scene'
import { gsap, scrollToSection, ScrollTrigger, initSmoothScroll } from './lib/scroll'
import { useApp } from './lib/store'
import { Explore } from './sections/Explore'
import { Hero } from './sections/Hero'
import { Missions } from './sections/Missions'
import { Outro } from './sections/Outro'
import { Stats } from './sections/Stats'
import { Surface } from './sections/Surface'

/** Tracks which chapter is on screen and mirrors it into the store. */
function useSectionTracking() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('.section[id]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) useApp.getState().setSection(el.id)
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])
}

export default function App() {
  useEffect(() => {
    document.documentElement.lang = useApp.getState().lang === 'zh' ? 'zh-CN' : 'en'
    const cleanup = initSmoothScroll()
    // deep-link support: /?goto=landmarks jumps straight to a chapter
    const goto = new URLSearchParams(window.location.search).get('goto')
    if (goto) {
      const t = setTimeout(() => scrollToSection(`#${goto}`), 3800)
      return () => {
        clearTimeout(t)
        cleanup()
      }
    }
    return cleanup
  }, [])
  useSectionTracking()

  return (
    <>
      <Scene />
      <HUD />
      <LandmarkCard />
      <main>
        <Hero />
        <Stats />
        <Explore />
        <Missions />
        <Surface />
        <Outro />
      </main>
      <Loader />
    </>
  )
}
