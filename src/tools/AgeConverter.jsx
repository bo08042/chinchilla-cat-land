import { useState } from 'react'
import ChinchillaCat from '../components/ChinchillaCat'

// 貓咪年齡換算器：貓齡 → 人類年齡 + 該階段照顧重點
// 換算採常見獸醫參考公式：第 1 年 ≈ 15 歲、第 2 年累計 ≈ 24 歲、之後每年 +4 歲

function toHumanAge(years, months) {
  const total = years + months / 12
  if (total <= 0) return 0
  if (total <= 1) return Math.round(total * 15)
  if (total <= 2) return Math.round(15 + (total - 1) * 9)
  return Math.round(24 + (total - 2) * 4)
}

const STAGES = [
  {
    max: 0.5,
    name: '幼貓期',
    emoji: '🍼',
    variant: 'fluffy',
    tips: ['一日多餐的幼貓飼料，成長期營養最重要', '完成疫苗與驅蟲計畫', '多陪玩建立社會化，習慣梳毛與剪指甲的觸碰'],
  },
  {
    max: 2,
    name: '少年期',
    emoji: '🌱',
    variant: 'sitting',
    tips: ['約 6 個月大可與獸醫討論絕育時機', '逐步換成成貓飼料', '建立每週梳毛的固定習慣，長毛照護從小養成'],
  },
  {
    max: 6,
    name: '壯年期',
    emoji: '💪',
    variant: 'ruff',
    tips: ['控制體重——金吉拉動態偏靜，容易發胖', '每年一次基礎健檢', '維持濕食與飲水量，護腎從年輕開始'],
  },
  {
    max: 10,
    name: '熟齡期',
    emoji: '🍵',
    variant: 'gentle',
    tips: ['7 歲起建議健檢加做腎臟指數與超音波（波斯家族 PKD 風險）', '留意飲水量與尿量變化', '調整為熟齡配方，關節與腎臟保健'],
  },
  {
    max: 99,
    name: '高齡期',
    emoji: '👑',
    variant: 'lying',
    tips: ['每半年健檢一次更安心', '提供好上下的矮處休息點，減少跳躍', '體重、食慾、如廁習慣的任何改變都值得跟獸醫聊聊'],
  },
]

export default function AgeConverter() {
  const [years, setYears] = useState(3)
  const [months, setMonths] = useState(0)

  const humanAge = toHumanAge(years, months)
  const total = years + months / 12
  const stage = STAGES.find((s) => total <= s.max) ?? STAGES[STAGES.length - 1]

  return (
    <div className="space-y-5">
      <div className="card-sticker p-6">
        <h2 className="font-black text-cocoa-900">你家貓咪幾歲？</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-bold text-cocoa-700">
            <input
              type="number"
              min="0"
              max="30"
              value={years}
              onChange={(e) => setYears(Math.max(0, Math.min(30, Number(e.target.value))))}
              className="w-20 rounded-xl border-2 border-cocoa-200 bg-white px-3 py-2 text-center text-lg font-black text-cocoa-900 focus:border-honey-400 focus:outline-none"
            />
            歲
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-cocoa-700">
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="rounded-xl border-2 border-cocoa-200 bg-white px-3 py-2 text-lg font-black text-cocoa-900 focus:border-honey-400 focus:outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            個月
          </label>
        </div>
      </div>

      <div className="card-sticker bg-gradient-to-br from-cream-100 to-honey-300/30 p-6 text-center">
        <ChinchillaCat variant={stage.variant} className="mx-auto h-24 w-24" />
        <p className="mt-3 text-sm font-bold text-cocoa-500">換算成人類年齡大約是</p>
        <p className="mt-1 text-5xl font-black text-honey-600">{humanAge} 歲</p>
        <p className="mt-2 inline-block rounded-full bg-white px-4 py-1 text-sm font-black text-cocoa-900 ring-2 ring-cocoa-200">
          {stage.emoji} {stage.name}
        </p>
      </div>

      <div className="card-sticker p-6">
        <h2 className="font-black text-cocoa-900">{stage.emoji} {stage.name}的照顧重點</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-cocoa-700">
          {stage.tips.map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span>🐾</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-cocoa-500">
          換算為一般參考公式，實際生理狀態依個體而異；健康疑問請諮詢獸醫師。
        </p>
      </div>
    </div>
  )
}
