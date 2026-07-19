// 城市漫步引擎：純函式。
import { events, endings } from './data'

export function eventById(id) {
  return events.find((e) => e.id === id)
}

// 抽下一個事件：優先指定 next；再依 goTo/目前區域從卡池隨機抽未看過的；
// 該區抽完就從其他區域遞補（劇情鏈事件不進隨機池）。
const CHAIN_ONLY = new Set(['kitten-rescue'])

export function pickNext({ choice, currentZone, seen }) {
  if (choice.next) return eventById(choice.next)
  const zone = choice.goTo ?? currentZone
  const fresh = (z) =>
    events.filter((e) => e.zone === z && !seen.has(e.id) && !CHAIN_ONLY.has(e.id) && e.id !== 'start')
  let pool = fresh(zone)
  if (pool.length === 0) {
    pool = events.filter(
      (e) => !seen.has(e.id) && !CHAIN_ONLY.has(e.id) && e.id !== 'start',
    )
  }
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

// 選項是否可選（屬性門檻）
export function canPick(choice, stats) {
  if (!choice.requires) return true
  return Object.entries(choice.requires).every(([k, v]) => (stats[k] ?? 0) >= v)
}

export function applyEffects(stats, effects = {}) {
  const next = { ...stats }
  for (const [k, v] of Object.entries(effects)) next[k] = (next[k] ?? 0) + v
  return next
}

// 結局判定：英雄旗標 > 達標的最高屬性 > 平靜結局
export function decideEnding(stats, flags) {
  if (flags.has('hero')) return endings.find((e) => e.id === 'hero')
  const ranked = [
    ['courage', 'sunset'],
    ['fullness', 'feast'],
    ['curiosity', 'friend'],
  ]
    .map(([attr, endingId]) => ({ attr, endingId, value: stats[attr] ?? 0 }))
    .sort((a, b) => b.value - a.value)
  const top = ranked[0]
  if (top.value >= 6 && top.value > ranked[1].value) {
    return endings.find((e) => e.id === top.endingId)
  }
  return endings.find((e) => e.id === 'chill')
}
