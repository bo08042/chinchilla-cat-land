import { useState } from 'react'
import ChinchillaCat from '../../components/ChinchillaCat'
import { load, save } from '../../services/storageService'
import { STEPS, ATTRS, ZONES, START_EVENT, endings } from './data'
import { eventById, pickNext, canPick, applyEffects, decideEnding } from './engine'

// 效果徽章文字：+1 🔍 之類
function effectBadges(effects = {}) {
  return ATTRS.filter((a) => effects[a.id]).map((a) => `${a.emoji}+${effects[a.id]}`)
}

export default function CityWalkGame() {
  const [phase, setPhase] = useState('intro') // intro | playing | ending
  const [event, setEvent] = useState(null)
  const [stats, setStats] = useState({ curiosity: 0, fullness: 0, courage: 0 })
  const [step, setStep] = useState(0)
  const [seen, setSeen] = useState(new Set())
  const [flags, setFlags] = useState(new Set())
  const [ending, setEnding] = useState(null)
  const [unlocked, setUnlocked] = useState(() => new Set(load('cityWalk', { endings: [] }).endings))

  function start() {
    setStats({ curiosity: 0, fullness: 0, courage: 0 })
    setStep(0)
    setSeen(new Set([START_EVENT]))
    setFlags(new Set())
    setEvent(eventById(START_EVENT))
    setEnding(null)
    setPhase('playing')
  }

  function choose(choice) {
    if (!canPick(choice, stats)) return
    const nextStats = applyEffects(stats, choice.effects)
    const nextFlags = new Set(flags)
    if (choice.flag) nextFlags.add(choice.flag)
    const nextStep = step + 1
    setStats(nextStats)
    setFlags(nextFlags)
    setStep(nextStep)

    if (nextStep >= STEPS) {
      finish(nextStats, nextFlags)
      return
    }
    const nextEvent = pickNext({ choice, currentZone: event.zone, seen })
    if (!nextEvent) {
      finish(nextStats, nextFlags)
      return
    }
    const nextSeen = new Set(seen)
    nextSeen.add(nextEvent.id)
    setSeen(nextSeen)
    setEvent(nextEvent)
  }

  function finish(finalStats, finalFlags) {
    const result = decideEnding(finalStats, finalFlags)
    setEnding(result)
    const nextUnlocked = new Set(unlocked)
    nextUnlocked.add(result.id)
    setUnlocked(nextUnlocked)
    save('cityWalk', { endings: [...nextUnlocked] })
    setPhase('ending')
  }

  /* ---------- 結局圖鑑 ---------- */
  function EndingCollection() {
    return (
      <div className="mt-5">
        <p className="text-sm font-bold text-cocoa-500">
          結局圖鑑（{unlocked.size} / {endings.length}）
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {endings.map((e) =>
            unlocked.has(e.id) ? (
              <span
                key={e.id}
                title={e.condition}
                className="rounded-full bg-honey-300 px-3 py-1 text-xs font-bold text-cocoa-900"
              >
                {e.emoji} {e.name}
              </span>
            ) : (
              <span
                key={e.id}
                className="rounded-full border-2 border-dashed border-cocoa-200 px-3 py-1 text-xs font-bold text-cocoa-400"
              >
                ❓ ？？？
              </span>
            ),
          )}
        </div>
      </div>
    )
  }

  /* ---------- 開始畫面 ---------- */
  if (phase === 'intro') {
    return (
      <div className="card-sticker p-8 text-center">
        <ChinchillaCat variant="fluffy" className="mx-auto h-24 w-24" />
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-cocoa-700">
          陪金吉拉溜出門散步！{STEPS} 個路口、每個選擇都會累積不同的屬性，
          走出屬於你們的結局。聽說救助弱小還有隱藏結局……
        </p>
        <button onClick={start} className="btn-honey mt-6">
          🐾 出發散步！
        </button>
        <EndingCollection />
      </div>
    )
  }

  /* ---------- 結局畫面 ---------- */
  if (phase === 'ending') {
    return (
      <div className="card-sticker p-8 text-center">
        <p className="text-sm font-bold text-cocoa-500">今天的散步結局</p>
        <ChinchillaCat variant={ending.variant} className="mx-auto mt-3 h-24 w-24" />
        <p className="mt-3 text-2xl font-black text-honey-600">
          {ending.emoji} {ending.name}
        </p>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-cocoa-700">{ending.text}</p>
        <div className="mt-4 flex justify-center gap-4 text-sm text-cocoa-700">
          {ATTRS.map((a) => (
            <span key={a.id}>
              {a.emoji} {stats[a.id]}
            </span>
          ))}
        </div>
        <button onClick={start} className="btn-honey mt-6">
          再散步一次
        </button>
        <EndingCollection />
      </div>
    )
  }

  /* ---------- 遊戲中 ---------- */
  const zone = ZONES[event.zone]
  return (
    <div>
      {/* 進度與屬性 */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-white px-3 py-1.5 text-sm font-black text-cocoa-900 ring-2 ring-cocoa-200">
          {zone.emoji} {zone.name}
        </span>
        <span className="text-sm tracking-wider">
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={i < step ? '' : 'opacity-25'}>
              🐾
            </span>
          ))}
        </span>
        <span className="flex gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-cocoa-800 ring-2 ring-cocoa-200">
          {ATTRS.map((a) => (
            <span key={a.id}>
              {a.emoji}
              {stats[a.id]}
            </span>
          ))}
        </span>
      </div>

      {/* 事件卡 */}
      <div className="card-sticker p-6">
        <p className="text-center text-5xl">{event.emoji}</p>
        <p className="mt-4 leading-relaxed text-cocoa-800">{event.text}</p>
        <div className="mt-5 space-y-2">
          {event.choices.map((choice, i) => {
            const ok = canPick(choice, stats)
            const badges = effectBadges(choice.effects)
            return (
              <button
                key={i}
                onClick={() => choose(choice)}
                disabled={!ok}
                className={`block w-full rounded-2xl border-2 px-4 py-3 text-left font-medium transition-colors ${
                  ok
                    ? 'border-cocoa-200 bg-white text-cocoa-800 hover:border-honey-400'
                    : 'cursor-not-allowed border-cocoa-100 bg-white text-cocoa-400 opacity-70'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span>
                    {!ok && '🔒 '}
                    {choice.text}
                  </span>
                  <span className="shrink-0 text-xs text-cocoa-500">
                    {!ok && choice.requires
                      ? `需要 ${ATTRS.filter((a) => choice.requires[a.id])
                          .map((a) => `${a.emoji}${choice.requires[a.id]}`)
                          .join(' ')}`
                      : badges.join(' ')}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-cocoa-500">
        選項右側是屬性變化；🔒 表示屬性不足，累積後就能解鎖。
      </p>
    </div>
  )
}
