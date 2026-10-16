import { motion } from 'framer-motion'
import { STATS } from '../data/mars'
import { useCountUp } from '../hooks/useCountUp'
import { useT } from '../lib/i18n'

function StatCard({ label, value, decimals, unit, index }: { label: string; value: number; decimals: number; unit: string; index: number }) {
  const { ref, value: v, inView } = useCountUp(value, decimals)
  return (
    <motion.div
      ref={ref}
      className="stat-card"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, borderColor: 'rgba(255, 150, 90, 0.5)' }}
    >
      <div className="stat-value">
        {v.toFixed(decimals)}
        <span className="stat-unit">{unit}</span>
      </div>
      <div className="stat-label">{label}</div>
    </motion.div>
  )
}

export function Stats() {
  const t = useT()

  return (
    <section className="section stats" id="overview">
      <div className="stats-grid">
        <div className="stats-copy">
          <motion.div className="chapter-label" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-20%' }} transition={{ duration: 0.8 }}>
            {t.stats.chapter}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {t.stats.titleA}
            <br />
            {t.stats.titleB}
            <br />
            <em>{t.stats.titleC}</em>
            {t.stats.titleCEnd}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.9, delay: 0.25 }}
          >
            {t.stats.copy}
          </motion.p>
        </div>
        <div className="stats-cards">
          {STATS.map((s, i) => (
            <StatCard
              key={s.label}
              label={t.stats.cards[i].label}
              value={s.value}
              decimals={s.decimals}
              unit={t.stats.cards[i].unit}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
