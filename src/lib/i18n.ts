import { useApp } from './store'

/**
 * Central copy dictionary. UI components consume it via useT();
 * the active language lives in the store and persists to localStorage.
 */
export const STR = {
  en: {
    nav: { hero: 'Home', overview: 'Overview', landmarks: 'Landmarks', missions: 'Missions', surface: 'Surface', outro: 'Finale' },
    hud: { day: 'Day', dusk: 'Dusk', night: 'Night', atmoOn: 'Atmo ON', atmoOff: 'Atmo OFF', badge: '8K TEXTURE · WEBGL · REAL-TIME' },
    loader: { hint: 'ACQUIRING 8K PLANETARY DATA' },
    hero: {
      overline: 'THE RED PLANET · 4TH ROCK FROM THE SUN',
      sub1: 'An interactive atlas rendered in real time.',
      sub2: 'Drag the planet. Scroll to begin the descent.',
      scroll: 'SCROLL',
      ticker: [
        'SOL 1 STARTS SOON',
        'DIAMETER 6,779 KM',
        'GRAVITY 38% OF EARTH',
        'ONE YEAR = 687 DAYS',
        'TALLEST VOLCANO IN THE SOLAR SYSTEM',
        'MEAN TEMPERATURE −63°C',
        'TWO MOONS: PHOBOS & DEIMOS',
        'DISTANCE 225M KM FROM EARTH',
      ],
    },
    stats: {
      chapter: '01 / OVERVIEW',
      titleA: 'A colder,',
      titleB: 'smaller,',
      titleC: 'drier',
      titleCEnd: ' Earth.',
      copy: 'Mars is half the width of Earth, yet it hosts the tallest volcano and the deepest canyon in the solar system. Its iron-oxide dust paints everything the color of rust — and its ancient riverbeds prove that water once flowed under open skies.',
      cards: [
        { label: 'Diameter', unit: 'km' },
        { label: 'Gravity', unit: 'm/s²' },
        { label: 'Length of Day', unit: 'hours' },
        { label: 'Length of Year', unit: 'days' },
        { label: 'Mean Temperature', unit: '°C' },
        { label: 'Distance from Sun', unit: 'M km' },
      ],
    },
    explore: {
      chapter: '02 / LANDMARKS',
      hint: 'Markers are clickable — drag the planet to inspect freely.',
      items: {
        'olympus-mons': {
          name: 'Olympus Mons',
          tag: 'Tallest volcano in the solar system',
          blurb:
            'A shield volcano nearly three times the height of Mount Everest. Its summit caldera complex is over 60 km wide, and its base would cover the whole of France.',
          facts: [
            { label: 'Elevation', value: '21.9 km' },
            { label: 'Diameter', value: '≈ 600 km' },
            { label: 'Age', value: '< 100 Myr' },
          ],
        },
        'valles-marineris': {
          name: 'Valles Marineris',
          tag: 'The great canyon system',
          blurb:
            'A rift canyon stretching over 4,000 km — it would span the entire continental United States. In places the walls plunge 7 km below the surrounding plateau.',
          facts: [
            { label: 'Length', value: '4,000 km' },
            { label: 'Depth', value: 'up to 7 km' },
            { label: 'Width', value: 'up to 200 km' },
          ],
        },
        'gale-crater': {
          name: 'Gale Crater',
          tag: 'Home of the Curiosity rover',
          blurb:
            'A 154 km impact crater holding Mount Sharp, a 5 km mountain of layered sediment that records billions of years of Martian climate history.',
          facts: [
            { label: 'Diameter', value: '154 km' },
            { label: 'Rover', value: 'Curiosity' },
            { label: 'Landed', value: '2012' },
          ],
        },
        'hellas-planitia': {
          name: 'Hellas Planitia',
          tag: 'Deepest impact basin',
          blurb:
            'Formed by a colossal impact ~4 billion years ago, this basin is the lowest place on Mars. Air pressure at its floor is high enough for liquid water to briefly exist.',
          facts: [
            { label: 'Depth', value: '−7.2 km' },
            { label: 'Diameter', value: '2,300 km' },
            { label: 'Pressure', value: '1.4 kPa' },
          ],
        },
      },
    },
    missions: {
      chapter: '03 / MISSIONS',
      titleA: 'Eight landings.',
      titleB: 'One frontier.',
      copy: 'Select a mission — the camera flies to its landing site on the globe.',
      status: { Active: 'Active', Complete: 'Complete', Lost: 'Lost' },
      items: {
        'viking-1': {
          name: 'Viking 1',
          craft: 'NASA Lander',
          blurb: 'The first spacecraft ever to land successfully on Mars and return data — operated for over six years.',
          facts: [
            { label: 'Landing site', value: 'Chryse Planitia' },
            { label: 'Mission length', value: '2,307 sols' },
            { label: 'Firsts', value: 'First Mars landing' },
          ],
        },
        pathfinder: {
          name: 'Mars Pathfinder',
          craft: 'NASA Lander + Sojourner',
          blurb: 'Proved low-cost landing with airbags and deployed the first rover on another planet — the microwave-sized Sojourner.',
          facts: [
            { label: 'Rover', value: 'Sojourner (10.6 kg)' },
            { label: 'Rovers on Mars', value: '83 sols driven' },
            { label: 'Site', value: 'Ares Vallis' },
          ],
        },
        spirit: {
          name: 'Spirit (MER-A)',
          craft: 'NASA Rover',
          blurb: 'Landed in Gusev Crater and searched for signs of ancient water for six years before getting stuck in soft soil.',
          facts: [
            { label: 'Lifetime', value: '2,208 sols' },
            { label: 'Distance', value: '7.73 km' },
            { label: 'Site', value: 'Gusev Crater' },
          ],
        },
        opportunity: {
          name: 'Opportunity (MER-B)',
          craft: 'NASA Rover',
          blurb: 'A 90-sol mission that lasted nearly 15 years, finding definitive evidence that Meridiani Planum was once soaked in liquid water.',
          facts: [
            { label: 'Lifetime', value: '5,111 sols' },
            { label: 'Distance', value: '45.16 km' },
            { label: 'End', value: '2018 dust storm' },
          ],
        },
        curiosity: {
          name: 'Curiosity (MSL)',
          craft: 'NASA Rover',
          blurb: 'A nuclear-powered mobile laboratory, lowered to the surface by a rocket-powered sky crane. Still climbing Mount Sharp today.',
          facts: [
            { label: 'Mass', value: '899 kg' },
            { label: 'Distance', value: '32+ km' },
            { label: 'Power', value: 'MMRTG nuclear' },
          ],
        },
        insight: {
          name: 'InSight',
          craft: 'NASA Lander',
          blurb: "The first Mars mission dedicated to the planet's interior — it recorded over 1,300 marsquakes before dust ended its power.",
          facts: [
            { label: 'Goal', value: 'Mars seismology' },
            { label: 'Marsquakes', value: '1,319 detected' },
            { label: 'Ended', value: '2022' },
          ],
        },
        perseverance: {
          name: 'Perseverance',
          craft: 'NASA Rover',
          blurb: 'Caching samples of an ancient river delta for a future return to Earth — and deploying the Ingenuity helicopter, which flew 72 times.',
          facts: [
            { label: 'Samples cached', value: '30 tubes' },
            { label: 'Helicopter', value: 'Ingenuity ×72 flights' },
            { label: 'Site', value: 'Jezero Delta' },
          ],
        },
        zhurong: {
          name: 'Tianwen-1 / Zhurong',
          craft: 'CNSA Rover',
          blurb: "China's first Mars mission orbited, landed and roved in a single attempt — only the second nation to drive on the Red Planet.",
          facts: [
            { label: 'Nation', value: 'China (CNSA)' },
            { label: 'Distance', value: '1.92 km' },
            { label: 'Site', value: 'Utopia Planitia' },
          ],
        },
      },
    },
    surface: {
      chapter: '04 / SURFACE',
      title: 'You are standing on Mars.',
      quote:
        '“The surface of Mars is a world of wonders — ochre dunes under a butterscotch sky, where every rock is older than any mountain on Earth.”',
      siteLabel: 'Valles Marineris Rim',
    },
    outro: {
      chapter: '05 / FINALE',
      quote: '“Mars is there, waiting to be known.”',
      cite: '— CARL SAGAN',
      copy: 'Eight successful landings. Forty-five kilometers driven by a rover meant to last ninety days. And the next bootprint on this globe may be human.',
      button: 'BACK TO ORBIT',
      credits: 'TEXTURE · SOLAR SYSTEM SCOPE / RENDERED IN REAL TIME WITH WEBGL / MARS INTERACTIVE ATLAS',
    },
    coords: { lat: (v: number) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? 'N' : 'S'}`, lon: (v: number) => `${v.toFixed(2)}° E` },
  },

  zh: {
    nav: { hero: '首页', overview: '概览', landmarks: '地标', missions: '任务', surface: '表面', outro: '终章' },
    hud: { day: '白昼', dusk: '黄昏', night: '夜晚', atmoOn: '大气 开', atmoOff: '大气 关', badge: '8K 贴图 · WEBGL · 实时渲染' },
    loader: { hint: '正在获取 8K 行星数据' },
    hero: {
      overline: '红色星球 · 太阳系第四颗岩石行星',
      sub1: '一部实时渲染的互动图集。',
      sub2: '拖动星球，滚动页面，开始降落。',
      scroll: '向下滚动',
      ticker: [
        '第一个太阳日即将开始',
        '直径 6,779 千米',
        '重力仅为地球的 38%',
        '一年等于 687 天',
        '太阳系最高的火山',
        '平均温度 −63°C',
        '两颗卫星：火卫一与火卫二',
        '距地球 2.25 亿千米',
      ],
    },
    stats: {
      chapter: '01 / 概览',
      titleA: '一个更寒冷、',
      titleB: '更渺小、',
      titleC: '更干旱',
      titleCEnd: '的地球。',
      copy: '火星的直径只有地球的一半，却拥有太阳系最高的火山和最深的峡谷。氧化铁尘埃把一切染成铁锈的颜色——而那些古老的河床证明，这里曾经有过在开阔天空下流淌的水。',
      cards: [
        { label: '直径', unit: '千米' },
        { label: '重力', unit: 'm/s²' },
        { label: '一天时长', unit: '小时' },
        { label: '一年时长', unit: '天' },
        { label: '平均温度', unit: '°C' },
        { label: '与太阳距离', unit: '百万千米' },
      ],
    },
    explore: {
      chapter: '02 / 地标',
      hint: '标记可点击——拖动星球可自由查看。',
      items: {
        'olympus-mons': {
          name: '奥林帕斯山',
          tag: '太阳系最高的火山',
          blurb: '一座盾状火山，高度接近珠穆朗玛峰的三倍。山顶的破火山口群宽逾 60 千米，它的底部足以覆盖整个法国。',
          facts: [
            { label: '海拔', value: '21.9 千米' },
            { label: '直径', value: '≈ 600 千米' },
            { label: '年龄', value: '< 1 亿年' },
          ],
        },
        'valles-marineris': {
          name: '水手号峡谷',
          tag: '巨大的峡谷系统',
          blurb: '绵延 4,000 多公里的断裂峡谷——足以横贯整个美国本土。峡谷壁某些地方比周围高原低陷 7 千米。',
          facts: [
            { label: '长度', value: '4,000 千米' },
            { label: '深度', value: '最深 7 千米' },
            { label: '宽度', value: '最宽 200 千米' },
          ],
        },
        'gale-crater': {
          name: '盖尔撞击坑',
          tag: '好奇号火星车的家园',
          blurb: '直径 154 千米的撞击坑内矗立着夏普山——一座 5 千米高的层状沉积山，记录着火星数十亿年的气候历史。',
          facts: [
            { label: '直径', value: '154 千米' },
            { label: '火星车', value: '好奇号' },
            { label: '着陆年份', value: '2012' },
          ],
        },
        'hellas-planitia': {
          name: '赫拉斯平原',
          tag: '最深的撞击盆地',
          blurb: '约 40 亿年前由一次巨大撞击形成，是火星表面的最低点。坑底气压高到足以让液态水短暂存在。',
          facts: [
            { label: '深度', value: '−7.2 千米' },
            { label: '直径', value: '2,300 千米' },
            { label: '气压', value: '1.4 kPa' },
          ],
        },
      },
    },
    missions: {
      chapter: '03 / 任务',
      titleA: '八次着陆。',
      titleB: '一片新疆域。',
      copy: '选择一个任务——镜头将飞向它在火星上的着陆点。',
      status: { Active: '运行中', Complete: '已完成', Lost: '已失联' },
      items: {
        'viking-1': {
          name: '海盗 1 号',
          craft: 'NASA 着陆器',
          blurb: '人类历史上第一个在火星成功着陆并传回数据的航天器——持续工作了六年多。',
          facts: [
            { label: '着陆点', value: '克律塞平原' },
            { label: '任务时长', value: '2,307 个太阳日' },
            { label: '创举', value: '首次火星着陆' },
          ],
        },
        pathfinder: {
          name: '火星探路者号',
          craft: 'NASA 着陆器 + 索杰纳号',
          blurb: '用气囊证明了低成本着陆方案，并部署了第一台外星球的火星车——微波炉大小的索杰纳号。',
          facts: [
            { label: '火星车', value: '索杰纳号（10.6 kg）' },
            { label: '行驶', value: '83 个太阳日' },
            { label: '着陆点', value: '阿瑞斯谷' },
          ],
        },
        spirit: {
          name: '勇气号 (MER-A)',
          craft: 'NASA 火星车',
          blurb: '着陆于古谢夫撞击坑，六年间持续搜寻远古水的踪迹，最终陷进松软的土壤。',
          facts: [
            { label: '工作时长', value: '2,208 个太阳日' },
            { label: '行驶距离', value: '7.73 千米' },
            { label: '着陆点', value: '古谢夫撞击坑' },
          ],
        },
        opportunity: {
          name: '机遇号 (MER-B)',
          craft: 'NASA 火星车',
          blurb: '原计划工作 90 个太阳日，却坚持了将近 15 年，并找到了决定性证据：子午线高原曾被液态水浸透。',
          facts: [
            { label: '工作时长', value: '5,111 个太阳日' },
            { label: '行驶距离', value: '45.16 千米' },
            { label: '结局', value: '2018 年沙尘暴' },
          ],
        },
        curiosity: {
          name: '好奇号 (MSL)',
          craft: 'NASA 火星车',
          blurb: '一台核动力移动实验室，由火箭动力的“天空起重机”吊放到火星表面。至今仍在攀登夏普山。',
          facts: [
            { label: '重量', value: '899 千克' },
            { label: '行驶距离', value: '32+ 千米' },
            { label: '能源', value: 'MMRTG 核电池' },
          ],
        },
        insight: {
          name: '洞察号',
          craft: 'NASA 着陆器',
          blurb: '第一个专研火星内部的探测器——记录了 1,300 多次火星震，直到尘埃终结了它的电力。',
          facts: [
            { label: '目标', value: '火星地震学' },
            { label: '火星震', value: '探测到 1,319 次' },
            { label: '结束', value: '2022 年' },
          ],
        },
        perseverance: {
          name: '毅力号',
          craft: 'NASA 火星车',
          blurb: '正在采集古老河流三角洲的样本，等待未来带回地球——它还部署了机智号直升机，完成了 72 次飞行。',
          facts: [
            { label: '样本管', value: '已封存 30 支' },
            { label: '直升机', value: '机智号 ×72 次飞行' },
            { label: '着陆点', value: '耶泽罗三角洲' },
          ],
        },
        zhurong: {
          name: '天问一号 / 祝融号',
          craft: '国家航天局 (CNSA) 火星车',
          blurb: '中国首次火星任务一次完成环绕、着陆与巡视——成为第二个在这颗红色星球上开车的国家。',
          facts: [
            { label: '国家', value: '中国 (CNSA)' },
            { label: '行驶距离', value: '1.92 千米' },
            { label: '着陆点', value: '乌托邦平原' },
          ],
        },
      },
    },
    surface: {
      chapter: '04 / 表面',
      title: '你正站在火星上。',
      quote: '“火星表面是一个充满奇观的世界——奶油糖果色的天空下是赭红色的沙丘，这里的每一块岩石都比地球上的任何一座山更古老。”',
      siteLabel: '水手号峡谷边缘',
    },
    outro: {
      chapter: '05 / 终章',
      quote: '“火星就在那里，等待着我们去认识。”',
      cite: '—— 卡尔·萨根',
      copy: '八次成功着陆。一辆设计寿命九十天的火星车，行驶了四十五公里。而下一个留在这颗星球上的脚印，也许属于人类。',
      button: '返回轨道',
      credits: '贴图 · SOLAR SYSTEM SCOPE / WEBGL 实时渲染 / 火星互动图集',
    },
    coords: { lat: (v: number) => `${v >= 0 ? '北纬' : '南纬'} ${Math.abs(v).toFixed(2)}°`, lon: (v: number) => `东经 ${v.toFixed(2)}°` },
  },
} as const

export type Dict = (typeof STR)['en']

export function useT(): Dict {
  const lang = useApp((s) => s.lang)
  return STR[lang] as Dict
}
