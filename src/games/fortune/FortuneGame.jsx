import { useEffect, useRef, useState } from 'react'
import ChinchillaCat from '../../components/ChinchillaCat'
import Modal from '../../components/Modal'
import { load, save } from '../../services/storageService'
import { levels, doList, dontList } from './data'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 骰子點數對應運勢等級（點數越大運勢越好）
const FACE_BY_LEVEL = { kyo: 1, suekichi: 2, shokichi: 3, kichi: 4, chukichi: 5, daikichi: 6 }

// 加權隨機抽等級，並隨機選籤詩與宜/忌
function draw() {
  const total = levels.reduce((s, l) => s + l.weight, 0)
  let roll = Math.random() * total
  const level = levels.find((l) => (roll -= l.weight) < 0) ?? levels[0]
  return {
    levelId: level.id,
    lineIndex: Math.floor(Math.random() * level.lines.length),
    doIndex: Math.floor(Math.random() * doList.length),
    dontIndex: Math.floor(Math.random() * dontList.length),
  }
}

// SVG 骰子面
function DiceFace({ n, size = 84, className = '' }) {
  const spots = {
    1: [[35, 35]],
    2: [[21, 21], [49, 49]],
    3: [[21, 21], [35, 35], [49, 49]],
    4: [[21, 21], [49, 21], [21, 49], [49, 49]],
    5: [[21, 21], [49, 21], [35, 35], [21, 49], [49, 49]],
    6: [[21, 18], [49, 18], [21, 35], [49, 35], [21, 52], [49, 52]],
  }
  return (
    <svg viewBox="0 0 70 70" width={size} height={size} className={className} aria-label={`骰子 ${n} 點`}>
      <rect x="3" y="3" width="64" height="64" rx="14" fill="#fff" stroke="#5f4a33" strokeWidth="3.5" />
      {spots[n].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill={n === 1 ? '#f0b429' : '#5f4a33'} />
      ))}
    </svg>
  )
}

// 文字換行：分享圖用
function wrapText(text, size) {
  const lines = []
  for (let i = 0; i < text.length; i += size) lines.push(text.slice(i, i + size))
  return lines
}

export default function FortuneGame() {
  const [record, setRecord] = useState(() => {
    const saved = load('fortune', null)
    return saved?.date === todayStr() ? saved : null
  })
  const [rolling, setRolling] = useState(false)
  const [diceFace, setDiceFace] = useState(6)
  const [modal, setModal] = useState(null) // { icon, title, body }
  const shareRef = useRef(null)

  // 擲骰中：骰面快速輪替
  useEffect(() => {
    if (!rolling) return
    const spin = setInterval(() => setDiceFace(Math.ceil(Math.random() * 6)), 120)
    return () => clearInterval(spin)
  }, [rolling])

  function handleDraw() {
    if (rolling || record) return
    setRolling(true)
    setTimeout(() => {
      const result = { date: todayStr(), ...draw() }
      save('fortune', result)
      setDiceFace(FACE_BY_LEVEL[result.levelId] ?? 4)
      setRecord(result)
      setRolling(false)
    }, 1500)
  }

  function resolve(rec) {
    const level = levels.find((l) => l.id === rec.levelId) ?? levels[0]
    return { level, line: level.lines[rec.lineIndex] ?? level.lines[0] }
  }

  async function copyShare() {
    const { level, line } = resolve(record)
    const text = `🐱 金吉拉樂園・今日運勢 ${todayStr()}\n${level.emoji} ${level.name}：${line}\n宜：${doList[record.doIndex]}｜忌：${dontList[record.dontIndex]}`
    try {
      await navigator.clipboard.writeText(text)
      setModal({ icon: '📋', title: '複製成功！', body: '運勢已複製到剪貼簿，快分享給朋友吧！' })
    } catch {
      setModal({ icon: '😿', title: '複製失敗', body: text })
    }
  }

  // 把隱藏的分享卡 SVG 轉成 PNG 下載
  function saveImage() {
    const svgNode = shareRef.current
    if (!svgNode) return
    const xml = new XMLSerializer().serializeToString(svgNode)
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 720
      canvas.height = 960
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 720, 960)
      canvas.toBlob((blob) => {
        if (!blob) {
          setModal({ icon: '😿', title: '存圖失敗', body: '你的瀏覽器不支援圖片輸出，改用複製分享吧！' })
          return
        }
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `金吉拉運勢-${todayStr()}.png`
        a.click()
        URL.revokeObjectURL(a.href)
        setModal({ icon: '🖼️', title: '圖片已下載！', body: '運勢卡已存到你的下載資料夾。' })
      }, 'image/png')
    }
    img.onerror = () =>
      setModal({ icon: '😿', title: '存圖失敗', body: '圖片產生失敗，改用複製分享吧！' })
    img.src = svgUrl
  }

  /* ---------- 未抽：擲骰畫面 ---------- */
  if (!record) {
    return (
      <div className="card-sticker p-8 text-center">
        {rolling ? (
          <>
            <div className="flex h-40 items-center justify-center">
              <div className="animate-dice-shake">
                <DiceFace n={diceFace} size={96} />
              </div>
            </div>
            <p className="mt-4 font-bold text-cocoa-700">骰子滾動中…</p>
            <p className="mt-1 text-sm text-cocoa-500">金吉拉正在為你祈福 🐾</p>
          </>
        ) : (
          <>
            <ChinchillaCat variant="sitting" className="mx-auto h-28 w-28" />
            <p className="mt-4 text-cocoa-700">每天限抽一次！點數越大運勢越好，讓金吉拉為你擲出今日運勢。</p>
            <button onClick={handleDraw} className="btn-honey mt-6 text-lg">
              🎲 擲骰抽運勢！
            </button>
          </>
        )}
      </div>
    )
  }

  /* ---------- 已抽：結果卡 ---------- */
  const { level, line } = resolve(record)
  const lineRows = wrapText(line, 14)

  return (
    <>
      <div className="card-sticker p-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <p className="text-sm font-bold text-cocoa-500">{todayStr()} 的運勢</p>
          <DiceFace n={FACE_BY_LEVEL[level.id] ?? 4} size={34} />
        </div>
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

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={copyShare} className="btn-outline text-sm">
            📋 複製文字
          </button>
          <button onClick={saveImage} className="btn-outline text-sm">
            🖼️ 儲存圖片
          </button>
        </div>
        <p className="mt-4 text-xs text-cocoa-500">明天再來抽新的運勢吧！</p>
      </div>

      {/* 分享卡（隱藏）：儲存圖片時序列化成 PNG。內嵌吉祥物與骰子，不引用外部資源 */}
      <svg
        ref={shareRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 360 480"
        width="360"
        height="480"
        className="hidden"
      >
        <rect width="360" height="480" fill="#fffbf0" />
        <rect x="14" y="14" width="332" height="452" rx="24" fill="#fff" stroke="#e2d0b8" strokeWidth="3" />
        <text x="180" y="52" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#8a6d4e" fontFamily="'Noto Sans TC', sans-serif">
          {todayStr()} 的今日運勢
        </text>
        <g transform="translate(116 66)">
          <ChinchillaCat variant={level.variant} expression={level.expression ?? 'happy'} size={128} />
        </g>
        <text x="180" y="238" textAnchor="middle" fontSize="42" fontWeight="900" fill="#5f4a33" fontFamily="'Noto Sans TC', sans-serif">
          {level.emoji} {level.name}
        </text>
        {lineRows.map((row, i) => (
          <text key={i} x="180" y={272 + i * 24} textAnchor="middle" fontSize="15" fill="#5f4a33" fontFamily="'Noto Sans TC', sans-serif">
            {row}
          </text>
        ))}
        <g transform="translate(52 330)">
          <rect width="120" height="64" rx="14" fill="#ecfdf5" />
          <text x="60" y="27" textAnchor="middle" fontSize="15" fontWeight="900" fill="#047857" fontFamily="'Noto Sans TC', sans-serif">宜</text>
          <text x="60" y="50" textAnchor="middle" fontSize="14" fill="#3e2f1f" fontFamily="'Noto Sans TC', sans-serif">{doList[record.doIndex]}</text>
        </g>
        <g transform="translate(188 330)">
          <rect width="120" height="64" rx="14" fill="#fef2f2" />
          <text x="60" y="27" textAnchor="middle" fontSize="15" fontWeight="900" fill="#ef4444" fontFamily="'Noto Sans TC', sans-serif">忌</text>
          <text x="60" y="50" textAnchor="middle" fontSize="14" fill="#3e2f1f" fontFamily="'Noto Sans TC', sans-serif">{dontList[record.dontIndex]}</text>
        </g>
        <g transform="translate(163 408)">
          <DiceFace n={FACE_BY_LEVEL[level.id] ?? 4} size={34} />
        </g>
        <text x="180" y="460" textAnchor="middle" fontSize="12" fill="#c9ae8c" fontFamily="'Noto Sans TC', sans-serif">
          🐱 金吉拉樂園 Chinchilla Cat Land
        </text>
      </svg>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        icon={modal?.icon}
        title={modal?.title}
      >
        <p className="whitespace-pre-wrap">{modal?.body}</p>
      </Modal>
    </>
  )
}
