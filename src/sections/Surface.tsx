import { useEffect, useRef, useState } from 'react'
import { SURFACE_SITE, quatFacingSite } from '../data/mars'
import { useT } from '../lib/i18n'
import { rig } from '../lib/rig'
import { gsap, ScrollTrigger } from '../lib/scroll'

export function Surface() {
  const ref = useRef<HTMLElement>(null)
  const t = useT()
  const [p, setP] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        onEnter: () => {
          rig.autoRotate = false
          rig.vel.set(0, 0, 0)
          rig.flyTarget = quatFacingSite(SURFACE_SITE.lat, SURFACE_SITE.lon)
        },
        onUpdate: (self) => {
          rig.surfaceT = self.progress
          setP((prev) => (Math.abs(prev - self.progress) > 0.02 ? self.progress : prev))
        },
        onLeaveBack: () => {
          rig.surfaceT = 0
          rig.autoRotate = true
          gsap.to(rig, { targetDistance: 5.2, duration: 1.2, overwrite: 'auto' })
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const fade = Math.min(Math.max((p - 0.45) / 0.45, 0), 1)

  return (
    <section className="section surface" id="surface" ref={ref}>
      <div className="surface-copy" style={{ opacity: fade, transform: `translateY(${(1 - fade) * 40}px)` }}>
        <div className="chapter-label light">{t.surface.chapter}</div>
        <h2>{t.surface.title}</h2>
        <p className="surface-quote">{t.surface.quote}</p>
        <div className="surface-site">
          {t.surface.siteLabel} · {SURFACE_SITE.lat}° {SURFACE_SITE.lat >= 0 ? 'N' : 'S'} · {SURFACE_SITE.lon}° E
        </div>
      </div>
    </section>
  )
}
