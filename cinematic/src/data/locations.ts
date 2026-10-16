import * as THREE from 'three'

export const MARS_RADIUS = 1.7
export const CAM = { near: 1.78, far: 20, default: 5.6 }
/** descend-to-surface transition band */
export const SURFACE = { start: 2.7, end: 1.82, eyeHeight: 0.075 }

const D2R = Math.PI / 180

/**
 * lat/lon (degrees, East-positive) → unit normal.
 * Texture is 180°W-centered (verified): u = (lon + 180) / 360.
 */
export function latLonToNormal(lat: number, lon: number, out = new THREE.Vector3()): THREE.Vector3 {
  const phi = lat * D2R
  const lambda = (lon - 180) * D2R
  const cosPhi = Math.cos(phi)
  return out.set(-cosPhi * Math.cos(lambda), Math.sin(phi), cosPhi * Math.sin(lambda))
}

export interface Location {
  id: string
  /** camera distance for this shot */
  dist: number
  lat: number
  lon: number
}

export interface LocationCopy {
  name: string
  poetic: string
  facts: { label: string; value: string }[]
}

export const LOCATIONS: Location[] = [
  { id: 'olympus-mons', dist: 3.6, lat: 18.65, lon: 226.2 },
  { id: 'valles-marineris', dist: 4.2, lat: -13.9, lon: 300.8 },
  { id: 'jezero', dist: 3.4, lat: 18.44, lon: 77.45 },
  { id: 'gale', dist: 3.5, lat: -5.4, lon: 137.8 },
  { id: 'north-pole', dist: 4.2, lat: 82, lon: 0 },
  { id: 'noctis-labyrinthus', dist: 3.8, lat: -7.0, lon: 255.5 },
  { id: 'hellas', dist: 4.0, lat: -42.4, lon: 70.5 },
  { id: 'elysium', dist: 3.6, lat: 24.7, lon: 146.9 },
]

export const COPY: Record<'zh' | 'en', Record<string, LocationCopy>> = {
  zh: {
    'olympus-mons': {
      name: '奥林帕斯山',
      poetic: '太阳系最高的山，安静了两千万年',
      facts: [
        { label: '海拔', value: '21.9 km' },
        { label: '≈ 珠峰 × 3', value: '600 km 宽' },
      ],
    },
    'valles-marineris': {
      name: '水手号峡谷',
      poetic: '一道能装下整个美国的大裂谷',
      facts: [
        { label: '长度', value: '4,000 km' },
        { label: '深度', value: '7 km' },
      ],
    },
    jezero: {
      name: '耶泽罗撞击坑',
      poetic: '毅力号正在这里，翻找三十亿年前的河流',
      facts: [
        { label: '直径', value: '45 km' },
        { label: '着陆', value: '2021' },
      ],
    },
    gale: {
      name: '盖尔撞击坑',
      poetic: '一座写在石头里的气候博物馆',
      facts: [
        { label: '居民', value: '好奇号' },
        { label: '工作', value: '13 年' },
      ],
    },
    'north-pole': {
      name: '北极冰盖',
      poetic: '奶油色的冰，是火星藏起来的水',
      facts: [
        { label: '成分', value: '水冰 + 干冰' },
        { label: '厚度', value: '~3 km' },
      ],
    },
    'noctis-labyrinthus': {
      name: '夜迷宫',
      poetic: '断崖与深谷织成的黑暗迷宫',
      facts: [
        { label: '地貌', value: '网状裂谷' },
        { label: '成因', value: '塔西斯隆起' },
      ],
    },
    hellas: {
      name: '赫拉斯平原',
      poetic: '四十亿年前的一撞，撞出了火星的最低点',
      facts: [
        { label: '深度', value: '−7.2 km' },
        { label: '直径', value: '2,300 km' },
      ],
    },
    elysium: {
      name: '埃律西昂山',
      poetic: '火星上最年轻的火山——地质学上的“昨天”才喷发',
      facts: [
        { label: '海拔', value: '14.1 km' },
        { label: '年龄', value: '< 2 亿年' },
      ],
    },
  },
  en: {
    'olympus-mons': {
      name: 'Olympus Mons',
      poetic: 'The tallest mountain in the solar system, silent for 20 million years',
      facts: [
        { label: 'Elevation', value: '21.9 km' },
        { label: '≈ 3 × Everest', value: '600 km wide' },
      ],
    },
    'valles-marineris': {
      name: 'Valles Marineris',
      poetic: 'A rift vast enough to swallow the continental United States',
      facts: [
        { label: 'Length', value: '4,000 km' },
        { label: 'Depth', value: '7 km' },
      ],
    },
    jezero: {
      name: 'Jezero Crater',
      poetic: 'Perseverance is here, reading a 3-billion-year-old river delta',
      facts: [
        { label: 'Diameter', value: '45 km' },
        { label: 'Landed', value: '2021' },
      ],
    },
    gale: {
      name: 'Gale Crater',
      poetic: 'A museum of climate history written in stone',
      facts: [
        { label: 'Resident', value: 'Curiosity' },
        { label: 'On duty', value: '13 yrs' },
      ],
    },
    'north-pole': {
      name: 'North Polar Cap',
      poetic: 'Creamy ice — the water Mars keeps to itself',
      facts: [
        { label: 'Made of', value: 'Water & dry ice' },
        { label: 'Thickness', value: '~3 km' },
      ],
    },
    'noctis-labyrinthus': {
      name: 'Noctis Labyrinthus',
      poetic: 'A dark maze woven from cliffs and canyons',
      facts: [
        { label: 'Terrain', value: 'Fractured valleys' },
        { label: 'Origin', value: 'Tharsis bulge' },
      ],
    },
    hellas: {
      name: 'Hellas Planitia',
      poetic: 'One colossal impact carved the lowest point on Mars',
      facts: [
        { label: 'Depth', value: '−7.2 km' },
        { label: 'Diameter', value: '2,300 km' },
      ],
    },
    elysium: {
      name: 'Elysium Mons',
      poetic: "Mars' youngest volcano — erupted just 'yesterday', geologically",
      facts: [
        { label: 'Elevation', value: '14.1 km' },
        { label: 'Age', value: '< 200 Myr' },
      ],
    },
  },
}

/** spherical target for a camera looking at lat/lon from distance d */
export function sphericalFor(lat: number, lon: number): { theta: number; phi: number } {
  const n = latLonToNormal(lat, lon)
  return { phi: Math.acos(THREE.MathUtils.clamp(n.y, -1, 1)), theta: Math.atan2(n.x, n.z) }
}
