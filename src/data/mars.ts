import * as THREE from 'three'

/** Radius of the Mars globe in scene units */
export const MARS_RADIUS = 1.7
/** Camera distances */
export const CAM = { home: 6.0, min: 2.15, max: 11 }

/**
 * Convert planetographic lat/lon (degrees, East-positive) to a unit-sphere normal.
 *
 * Mapping assumption (verified against the texture): the equirect map is
 * centered on the 180°W meridian — Olympus Mons (226.2°E) sits at u ≈ 0.128,
 * Elysium (147°E, 25°N) at u ≈ 0.9, Valles Marineris (~301°E) wraps near the
 * seam. So u = (lon + 180)/360, matching SphereGeometry with u = 0 at −X.
 */
export const LON_OFFSET = -180

const D2R = Math.PI / 180

export function latLonToNormal(lat: number, lon: number, out = new THREE.Vector3()): THREE.Vector3 {
  const phi = lat * D2R
  const lambda = (lon + LON_OFFSET) * D2R
  const cosPhi = Math.cos(phi)
  return out.set(-cosPhi * Math.cos(lambda), Math.sin(phi), cosPhi * Math.sin(lambda))
}

/** Quaternion that rotates the globe so the given site faces the camera (+Z). */
export function quatFacingSite(lat: number, lon: number, out = new THREE.Quaternion()): THREE.Quaternion {
  const n = latLonToNormal(lat, lon)
  return out.setFromUnitVectors(n, new THREE.Vector3(0, 0, 1))
}

export interface Landmark {
  id: string
  name: string
  tag: string
  lat: number
  lon: number
  camDist: number
  blurb: string
  facts: { label: string; value: string }[]
}

export const LANDMARKS: Landmark[] = [
  {
    id: 'olympus-mons',
    name: 'Olympus Mons',
    tag: 'Tallest volcano in the solar system',
    lat: 18.65, lon: 226.2, camDist: 2.6,
    blurb:
      'A shield volcano nearly three times the height of Mount Everest. Its summit caldera complex is over 60 km wide, and its base would cover the whole of France.',
    facts: [
      { label: 'Elevation', value: '21.9 km' },
      { label: 'Diameter', value: '≈ 600 km' },
      { label: 'Age', value: '< 100 Myr' },
    ],
  },
  {
    id: 'valles-marineris',
    name: 'Valles Marineris',
    tag: 'The great canyon system',
    lat: -13.9, lon: 300.8, camDist: 3.4,
    blurb:
      'A rift canyon stretching over 4,000 km — it would span the entire continental United States. In places the walls plunge 7 km below the surrounding plateau.',
    facts: [
      { label: 'Length', value: '4,000 km' },
      { label: 'Depth', value: 'up to 7 km' },
      { label: 'Width', value: 'up to 200 km' },
    ],
  },
  {
    id: 'gale-crater',
    name: 'Gale Crater',
    tag: 'Home of the Curiosity rover',
    lat: -5.4, lon: 137.8, camDist: 2.6,
    blurb:
      'A 154 km impact crater holding Mount Sharp, a 5 km mountain of layered sediment that records billions of years of Martian climate history.',
    facts: [
      { label: 'Diameter', value: '154 km' },
      { label: 'Rover', value: 'Curiosity' },
      { label: 'Landed', value: '2012' },
    ],
  },
  {
    id: 'hellas-planitia',
    name: 'Hellas Planitia',
    tag: 'Deepest impact basin',
    lat: -42.4, lon: 70.5, camDist: 3.2,
    blurb:
      'Formed by a colossal impact ~4 billion years ago, this basin is the lowest place on Mars. Air pressure at its floor is high enough for liquid water to briefly exist.',
    facts: [
      { label: 'Depth', value: '−7.2 km' },
      { label: 'Diameter', value: '2,300 km' },
      { label: 'Pressure', value: '1.4 kPa' },
    ],
  },
]

export interface Mission {
  id: string
  name: string
  craft: string
  year: number
  status: 'Active' | 'Complete' | 'Lost'
  lat: number
  lon: number
  blurb: string
  facts: { label: string; value: string }[]
}

export const MISSIONS: Mission[] = [
  {
    id: 'viking-1', name: 'Viking 1', craft: 'NASA Lander', year: 1976, status: 'Complete',
    lat: 22.27, lon: 312.05,
    blurb: 'The first spacecraft ever to land successfully on Mars and return data — operated for over six years.',
    facts: [
      { label: 'Landing site', value: 'Chryse Planitia' },
      { label: 'Mission length', value: '2,307 sols' },
      { label: 'Firsts', value: 'First Mars landing' },
    ],
  },
  {
    id: 'pathfinder', name: 'Mars Pathfinder', craft: 'NASA Lander + Sojourner', year: 1997, status: 'Complete',
    lat: 19.13, lon: 326.78,
    blurb: 'Proved low-cost landing with airbags and deployed the first rover on another planet — the microwave-sized Sojourner.',
    facts: [
      { label: 'Rover', value: 'Sojourner (10.6 kg)' },
      { label: 'Rovers on Mars', value: '83 sols driven' },
      { label: 'Site', value: 'Ares Vallis' },
    ],
  },
  {
    id: 'spirit', name: 'Spirit (MER-A)', craft: 'NASA Rover', year: 2004, status: 'Lost',
    lat: -14.57, lon: 175.47,
    blurb: 'Landed in Gusev Crater and searched for signs of ancient water for six years before getting stuck in soft soil.',
    facts: [
      { label: 'Lifetime', value: '2,208 sols' },
      { label: 'Distance', value: '7.73 km' },
      { label: 'Site', value: 'Gusev Crater' },
    ],
  },
  {
    id: 'opportunity', name: 'Opportunity (MER-B)', craft: 'NASA Rover', year: 2004, status: 'Lost',
    lat: -1.95, lon: 354.47,
    blurb: 'A 90-sol mission that lasted nearly 15 years, finding definitive evidence that Meridiani Planum was once soaked in liquid water.',
    facts: [
      { label: 'Lifetime', value: '5,111 sols' },
      { label: 'Distance', value: '45.16 km' },
      { label: 'End', value: '2018 dust storm' },
    ],
  },
  {
    id: 'curiosity', name: 'Curiosity (MSL)', craft: 'NASA Rover', year: 2012, status: 'Active',
    lat: -4.59, lon: 137.44,
    blurb: 'A nuclear-powered mobile laboratory, lowered to the surface by a rocket-powered sky crane. Still climbing Mount Sharp today.',
    facts: [
      { label: 'Mass', value: '899 kg' },
      { label: 'Distance', value: '32+ km' },
      { label: 'Power', value: 'MMRTG nuclear' },
    ],
  },
  {
    id: 'insight', name: 'InSight', craft: 'NASA Lander', year: 2018, status: 'Complete',
    lat: 4.5, lon: 135.62,
    blurb: 'The first Mars mission dedicated to the planet\'s interior — it recorded over 1,300 marsquakes before dust ended its power.',
    facts: [
      { label: 'Goal', value: 'Mars seismology' },
      { label: 'Marsquakes', value: '1,319 detected' },
      { label: 'Ended', value: '2022' },
    ],
  },
  {
    id: 'perseverance', name: 'Perseverance', craft: 'NASA Rover', year: 2021, status: 'Active',
    lat: 18.44, lon: 77.45,
    blurb: 'Caching samples of an ancient river delta for a future return to Earth — and deploying the Ingenuity helicopter, which flew 72 times.',
    facts: [
      { label: 'Samples cached', value: '30 tubes' },
      { label: 'Helicopter', value: 'Ingenuity ×72 flights' },
      { label: 'Site', value: 'Jezero Delta' },
    ],
  },
  {
    id: 'zhurong', name: 'Tianwen-1 / Zhurong', craft: 'CNSA Rover', year: 2021, status: 'Complete',
    lat: 25.1, lon: 109.9,
    blurb: 'China\'s first Mars mission orbited, landed and roved in a single attempt — only the second nation to drive on the Red Planet.',
    facts: [
      { label: 'Nation', value: 'China (CNSA)' },
      { label: 'Distance', value: '1.92 km' },
      { label: 'Site', value: 'Utopia Planitia' },
    ],
  },
]

export interface Stat {
  label: string
  value: number
  decimals: number
  unit: string
  display?: string
}

export const STATS: Stat[] = [
  { label: 'Diameter', value: 6779, decimals: 0, unit: 'km' },
  { label: 'Gravity', value: 3.71, decimals: 2, unit: 'm/s²' },
  { label: 'Length of Day', value: 24.6, decimals: 1, unit: 'hours' },
  { label: 'Length of Year', value: 687, decimals: 0, unit: 'days' },
  { label: 'Mean Temperature', value: -63, decimals: 0, unit: '°C' },
  { label: 'Distance from Sun', value: 227.9, decimals: 1, unit: 'M km' },
]

/** The site the camera descends to in the Surface chapter */
export const SURFACE_SITE = { lat: -8, lon: 302, label: 'Valles Marineris Rim' }

/** Camera-side home view: face Olympus Mons */
export const HOME_VIEW = { lat: 14, lon: 226.2 }
