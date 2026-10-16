import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** Smooth scrolling + GSAP integration. Call once. Returns cleanup. */
export function initSmoothScroll(): () => void {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToSection(selector: string) {
  if (lenis) lenis.scrollTo(selector, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
  else document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
}

export { gsap, ScrollTrigger }
