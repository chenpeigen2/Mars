import { useApp } from './store'

export const UI = {
  zh: {
    day: '昼', dusk: '暮', night: '夜',
    atmoOn: '大气 开', atmoOff: '大气 关',
    logoSub: 'MARS · A CINEMATIC TOUR',
    introHint: '拖住它，或者把滚轮推到底',
    hint: '拖动旋转 · 滚轮推近直至降落 · 点击标记',
    hintTouch: '单指转动 · 双指捏合缩放 · 点名字飞行 · 推近可降落',
    backToSpace: '⟰ 返回太空',
    sites: '个地标',
    play: '▶', pause: '❚❚',
    loaderHint: '正在穿越 2.25 亿千米',
  },
  en: {
    day: 'Day', dusk: 'Dusk', night: 'Night',
    atmoOn: 'Atmo ON', atmoOff: 'Atmo OFF',
    logoSub: 'MARS · A CINEMATIC TOUR',
    introHint: 'Grab it — or scroll all the way down',
    hint: 'Drag to orbit · Scroll down to land · Click a marker',
    hintTouch: 'Drag to orbit · Pinch to zoom · Tap a name to fly · Push in to land',
    backToSpace: '⟰ BACK TO SPACE',
    sites: 'sites',
    play: '▶', pause: '❚❚',
    loaderHint: 'TRAVERSING 225 MILLION KILOMETERS',
  },
} as const

export type UiDict = (typeof UI)['zh']

export function useUI(): UiDict {
  const lang = useApp((s) => s.lang)
  return UI[lang] as unknown as UiDict
}
