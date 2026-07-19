import { useState } from 'react'
import ChinchillaCat from '../components/ChinchillaCat'

// 貓咪取名產生器：選風格 → 隨機產生三個名字，點名字複製

const STYLES = [
  {
    id: 'cute',
    label: '可愛系',
    emoji: '🎀',
    names: ['毛毛', '球球', '雪寶', '蓬蓬', '咪嚕', '圓圓', '乎乎', '絨絨', '泡泡', '妞妞', '噗噗', '咕咕', '蹦蹦', '軟軟', '嗚咪', '拉拉'],
  },
  {
    id: 'noble',
    label: '貴族系',
    emoji: '👑',
    names: ['路易', '安娜貝爾', '伯爵', '雪莉', '威廉', '夏洛特', '亞瑟', '蒂芬妮', '奧斯卡', '維多利亞', '賽巴斯汀', '艾蜜莉', '費歐娜', '瑪格麗特', '路西恩', '公爵'],
  },
  {
    id: 'food',
    label: '食物系',
    emoji: '🍮',
    names: ['布丁', '麻糬', '湯圓', '奶酪', '銀耳', '豆花', '雪糕', '餅乾', '糰子', '奶茶', '大福', '可頌', '優格', '米糕', '鮮奶油', '棉花糖'],
  },
  {
    id: 'nature',
    label: '自然系',
    emoji: '🌙',
    names: ['雪花', '月光', '雲朵', '銀河', '初雪', '霜霜', '白露', '風鈴', '晨曦', '彎月', '星塵', '山嵐', '羽毛', '微光', '小滿', '細雨'],
  },
  {
    id: 'chuuni',
    label: '中二系',
    emoji: '⚔️',
    names: ['暗影', '月牙', '疾風', '蒼焰', '絕影', '霜刃', '雷霆', '幻月', '天照', '羅剎', '緋夜', '冥月', '修羅', '銀爪', '滅蹭', '虛空'],
  },
  {
    id: 'retro',
    label: '復古系',
    emoji: '📻',
    names: ['阿花', '小白', '來福', '招財', '進寶', '阿財', '春嬌', '志明', '玉蘭', '阿滿', '旺來', '金水', '秀枝', '阿土', '罔腰', '萬得'],
  },
  {
    id: 'animal',
    label: '動物系',
    emoji: '🦁',
    names: ['小虎', '獅子', '熊熊', '兔兔', '鴨鴨', '企鵝', '海豹', '小鹿', '水獺', '松鼠', '鯨魚', '小豹', '狐狸', '羊咩', '倉鼠', '浣熊'],
  },
  {
    id: 'funny',
    label: '趣味系',
    emoji: '🤪',
    names: ['老闆', '貓皇', '課長', '襪子', '拖鞋', '遙控器', '鍵盤', '發票', '鬧鐘', '泡麵', '屁屁', '腳腳', '薪水', '乖乖', '饅頭', '歐米馬'],
  },
]

function pickThree(names) {
  const pool = [...names]
  const out = []
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }
  return out
}

export default function NameGenerator() {
  const [styleId, setStyleId] = useState('cute')
  const [candidates, setCandidates] = useState([])
  const [copied, setCopied] = useState(null)

  const style = STYLES.find((s) => s.id === styleId)

  function generate() {
    setCandidates(pickThree(style.names))
    setCopied(null)
  }

  async function copy(name) {
    try {
      await navigator.clipboard.writeText(name)
      setCopied(name)
    } catch {
      setCopied(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="card-sticker p-6 text-center">
        <ChinchillaCat variant="fluffy" className="mx-auto h-24 w-24" />
        <p className="mt-3 text-sm text-cocoa-700">先選一種風格，再讓金吉拉幫你抽名字！</p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setStyleId(s.id)
                setCandidates([])
                setCopied(null)
              }}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                styleId === s.id
                  ? 'bg-honey-400 font-bold text-cocoa-900 shadow-[2px_2px_0_0_var(--color-honey-600)]'
                  : 'border-2 border-cocoa-200 bg-white text-cocoa-600 hover:border-honey-400'
              }`}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>

        <button onClick={generate} className="btn-honey mt-5">
          ✨ {candidates.length > 0 ? '再抽一批！' : '抽名字！'}
        </button>
      </div>

      {candidates.length > 0 && (
        <div className="card-sticker bg-gradient-to-br from-cream-100 to-honey-300/30 p-6 text-center">
          <p className="text-sm font-bold text-cocoa-500">{style.emoji} 為你抽出這三個名字（點一下複製）</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {candidates.map((name) => (
              <button
                key={name}
                onClick={() => copy(name)}
                className="card-sticker card-sticker-hover min-w-24 px-6 py-4 text-xl font-black text-cocoa-900"
              >
                {name}
                {copied === name && (
                  <span className="mt-1 block text-xs font-bold text-emerald-700">已複製 ✓</span>
                )}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-cocoa-500">沒有喜歡的？換個風格或再抽一批，總會遇到命定的名字。</p>
        </div>
      )}
    </div>
  )
}
