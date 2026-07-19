import { useState } from 'react'

// 飼養花費試算機：勾選項目即時估算每月與首年花費（新台幣，僅供參考）

const MONTHLY_GROUPS = [
  {
    id: 'food',
    label: '主食乾糧',
    type: 'radio',
    options: [
      { id: 'basic', label: '一般品牌', cost: 600 },
      { id: 'mid', label: '中階（長毛貓配方）', cost: 1000 },
      { id: 'premium', label: '高階／處方等級', cost: 1600 },
    ],
  },
  {
    id: 'wet',
    label: '濕食罐頭',
    type: 'radio',
    options: [
      { id: 'none', label: '不吃濕食', cost: 0 },
      { id: 'some', label: '每週 2–3 罐', cost: 300 },
      { id: 'daily', label: '每天一罐', cost: 900 },
    ],
  },
  {
    id: 'litter',
    label: '貓砂',
    type: 'radio',
    options: [
      { id: 'mineral', label: '礦砂', cost: 300 },
      { id: 'tofu', label: '豆腐砂', cost: 450 },
      { id: 'mixed', label: '混合砂', cost: 400 },
    ],
  },
  {
    id: 'grooming',
    label: '毛髮美容',
    type: 'radio',
    options: [
      { id: 'self', label: '自己梳洗（工具攤提）', cost: 100 },
      { id: 'salon', label: '偶爾送寵物美容', cost: 400 },
    ],
  },
]

const MONTHLY_EXTRAS = [
  { id: 'supplement', label: '化毛膏／保健品', cost: 200 },
  { id: 'toys', label: '玩具與耗材', cost: 150 },
  { id: 'insurance', label: '寵物保險', cost: 300 },
]

const FIRST_YEAR_ITEMS = [
  { id: 'starter', label: '新手用品購置（碗、砂盆、提籠、梳具…）', cost: 5000, defaultOn: true },
  { id: 'vaccine', label: '疫苗＋首次健檢＋晶片', cost: 4000, defaultOn: true },
  { id: 'neuter', label: '絕育手術', cost: 3500, defaultOn: true },
]

export default function CostCalculator() {
  const [picks, setPicks] = useState({ food: 'mid', wet: 'some', litter: 'tofu', grooming: 'self' })
  const [extras, setExtras] = useState(new Set(['supplement']))
  const [firstYear, setFirstYear] = useState(new Set(FIRST_YEAR_ITEMS.filter((i) => i.defaultOn).map((i) => i.id)))

  const monthly =
    MONTHLY_GROUPS.reduce((sum, g) => sum + (g.options.find((o) => o.id === picks[g.id])?.cost ?? 0), 0) +
    MONTHLY_EXTRAS.reduce((sum, e) => sum + (extras.has(e.id) ? e.cost : 0), 0)
  const oneTime = FIRST_YEAR_ITEMS.reduce((sum, i) => sum + (firstYear.has(i.id) ? i.cost : 0), 0)
  const yearTotal = monthly * 12 + oneTime

  function toggle(set, setter, id) {
    const next = new Set(set)
    next.has(id) ? next.delete(id) : next.add(id)
    setter(next)
  }

  return (
    <div className="space-y-5">
      {/* 每月固定花費 */}
      <div className="card-sticker p-6">
        <h2 className="font-black text-cocoa-900">每月固定花費</h2>
        <div className="mt-4 space-y-4">
          {MONTHLY_GROUPS.map((group) => (
            <div key={group.id}>
              <p className="text-sm font-bold text-cocoa-700">{group.label}</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {group.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPicks({ ...picks, [group.id]: opt.id })}
                    className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                      picks[group.id] === opt.id
                        ? 'bg-honey-400 font-bold text-cocoa-900 shadow-[2px_2px_0_0_var(--color-honey-600)]'
                        : 'border-2 border-cocoa-200 bg-white text-cocoa-600 hover:border-honey-400'
                    }`}
                  >
                    {opt.label}
                    <span className="ml-1 text-xs opacity-70">${opt.cost}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <p className="text-sm font-bold text-cocoa-700">加購項目</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {MONTHLY_EXTRAS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => toggle(extras, setExtras, e.id)}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                    extras.has(e.id)
                      ? 'bg-honey-400 font-bold text-cocoa-900 shadow-[2px_2px_0_0_var(--color-honey-600)]'
                      : 'border-2 border-cocoa-200 bg-white text-cocoa-600 hover:border-honey-400'
                  }`}
                >
                  {extras.has(e.id) ? '✓ ' : ''}
                  {e.label}
                  <span className="ml-1 text-xs opacity-70">${e.cost}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 首年一次性花費 */}
      <div className="card-sticker p-6">
        <h2 className="font-black text-cocoa-900">首年一次性花費</h2>
        <div className="mt-3 space-y-2">
          {FIRST_YEAR_ITEMS.map((item) => (
            <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-cocoa-100 bg-white px-4 py-2.5 text-sm text-cocoa-800 hover:border-honey-400">
              <input
                type="checkbox"
                checked={firstYear.has(item.id)}
                onChange={() => toggle(firstYear, setFirstYear, item.id)}
                className="h-4 w-4 accent-[#f0b429]"
              />
              <span className="flex-1">{item.label}</span>
              <span className="font-bold text-cocoa-500">NT$ {item.cost.toLocaleString()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 結果 */}
      <div className="card-sticker bg-gradient-to-br from-cream-100 to-honey-300/30 p-6 text-center">
        <div className="flex flex-wrap justify-center gap-6">
          <div>
            <p className="text-sm font-bold text-cocoa-500">每月約</p>
            <p className="text-3xl font-black text-honey-600">NT$ {monthly.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-cocoa-500">首年合計約</p>
            <p className="text-3xl font-black text-emerald-700">NT$ {yearTotal.toLocaleString()}</p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-cocoa-500">
          金額為市場行情概估，實際依品牌與地區而異。<br />
          建議另外預留 1–3 萬元的緊急醫療準備金，或評估寵物保險。
        </p>
      </div>
    </div>
  )
}
