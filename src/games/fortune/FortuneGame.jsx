import { useState } from 'react'
import ChinchillaCat from '../../components/ChinchillaCat'
import { load, save } from '../../services/storageService'
import { levels, doList, dontList } from './data'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 加權隨機抽等級，並隨機選籤詩與宜/忌
function draw() {
  const total = levels.reduce((s, l) => s + l.weight, 0)
  let roll = Math.random() * total
  const level = levels.find((l) => (roll -= l.weight) < 0) ?? levels[0]
  const lineIndex = Math.floor(Math.random() * level.lines.length)
  const doIndex = Math.floor(Math.random() * doList.length)
  let dontIndex = Math.floor(Math.random() * dontList.length)
  return { levelId: level.id, lineIndex, doIndex, dontIndex }
}

export default function FortuneGame() {
  const [record, setRecord] = useState(() => {
    const saved = load('fortune', null)
    return saved?.date === todayStr() ? saved : null
  })
  const [rolling, setRolling] = useState(false)

  function handleDraw() {
    if (rolling || record) return
    setRolling(true)
    // 擲骰動畫跑 1.2 秒後揭曉
    setTimeout(() => {
      const result = { date: todayStr(), ...draw() }
      save('fortune', result)
      setRecord(result)
      setRolling(false)
    }, 1200)
  }

  async function share() {
    const { level, line } = resolve(record)
    const text = `🐱 金吉拉樂園・今日運勢 ${todayStr()}\n${level.emoji} ${level.name}：${line}\n宜：${doList[record.doIndex]}｜忌：${dontList[record.dontIndex]}`
    try {
      await navigator.clipboard.writeText(text)
      alert('已複製到剪貼簿，快分享給朋友！')
    } catch {
      alert(text)
    }
  }

  function resolve(rec) {
    const level = levels.find((l) => l.id === rec.levelId) ?? levels[0]
    return { level, line: level.lines[rec.lineIndex] ?? level.lines[0] }
  }

  // 未抽 → 擲骰畫面
  if (!record) {
    return (
      <div className="card-sticker p-8 text-center">
        <ChinchillaCat variant="sitting" className="mx-auto h-28 w-28" />
        <p className="mt-4 text-cocoa-700">每天限抽一次！讓金吉拉為你擲出今日運勢。</p>
        <button
          onClick={handleDraw}
          disabled={rolling}
          className="btn-honey mt-6 text-lg disabled:opacity-60"
        >
          <span className={`inline-block text-2xl ${rolling ? 'animate-bounce' : ''}`}>🎲</span>{' '}
          {rolling ? '骰子滾動中…' : '擲骰抽運勢！'}
        </button>
      </div>
    )
  }

  // 已抽 → 結果卡
  const { level, line } = resolve(record)
  return (
    <div className="card-sticker p-8 text-center">
      <p className="text-sm font-bold text-cocoa-500">{todayStr()} 的運勢</p>
      <ChinchillaCat
        variant={level.variant}
        expression={level.expression ?? 'happy'}
        className="mx-auto mt-3 h-28 w-28"
      />
      <p className={`mt-3 text-4xl font-black ${level.color}`}>
        {level.emoji} {level.name}
      </p>
      <p className="mx-auto mt-4 max-w-sm leading-relaxed text-cocoa-700">{line}</p>

      <div className="mx-auto mt-6 flex max-w-xs justify-center gap-3 text-sm">
        <div className="flex-1 rounded-2xl bg-emerald-50 px-3 py-2">
          <span className="font-black text-emerald-700">宜</span>
          <p className="mt-1 text-cocoa-800">{doList[record.doIndex]}</p>
        </div>
        <div className="flex-1 rounded-2xl bg-red-50 px-3 py-2">
          <span className="font-black text-red-500">忌</span>
          <p className="mt-1 text-cocoa-800">{dontList[record.dontIndex]}</p>
        </div>
      </div>

      <button onClick={share} className="btn-outline mt-6 text-sm">
        📋 複製結果分享
      </button>
      <p className="mt-4 text-xs text-cocoa-500">明天再來抽新的運勢吧！</p>
    </div>
  )
}
