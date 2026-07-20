import { useEffect, useRef, useState } from 'react'
import ChinchillaCat from '../../components/ChinchillaCat'
import { load, save } from '../../services/storageService'
import {
  GRID, GOLDEN_EVERY, GOLDEN_TICKS, createSnake, isOpposite, nextHead,
  samePos, outOfBounds, hitsBody, advance, randomCell, tickInterval,
} from './engine'
import { initSound, setMuted, sfx } from './sound'

const CELL = 20
const BOARD = GRID * CELL // 內部繪圖解析度（畫面顯示大小由 CSS .greedycat-board 響應式控制）
const HEAD_SIZE_PCT = 9.6 // 頭部覆蓋層佔棋盤寬度的百分比

export default function GreedyCatGame() {
  const canvasRef = useRef(null)
  const g = useRef(null)
  const timerRef = useRef(null)

  const [phase, setPhase] = useState('ready') // ready | playing | over
  const [ui, setUi] = useState({ score: 0, head: { x: 9, y: 9 } })
  const [highScore, setHighScore] = useState(() => load('greedyCat', { highScore: 0 }).highScore)
  const [soundOn, setSoundOn] = useState(() => load('greedyCat', { highScore: 0 }).soundOn ?? true)

  useEffect(() => {
    setMuted(!soundOn)
  }, [soundOn])

  function toggleSound() {
    const next = !soundOn
    setSoundOn(next)
    save('greedyCat', { ...load('greedyCat', { highScore: 0 }), soundOn: next })
  }

  function initGame() {
    const snake = createSnake()
    g.current = {
      snake,
      dir: 'right',
      queuedDir: 'right',
      food: randomCell(snake),
      golden: null,
      score: 0,
      fishEaten: 0,
      growPending: 0,
    }
    setUi({ score: 0, head: snake[0] })
  }

  function start() {
    initSound()
    initGame()
    setPhase('playing')
    setTimeout(draw, 0)
  }

  /* ---------- 繪圖（Canvas 畫身體與食物，頭由 SVG 覆蓋層負責） ---------- */
  function drawSegment(ctx, seg, i, total) {
    const cx = seg.x * CELL + CELL / 2
    const cy = seg.y * CELL + CELL / 2
    const r = CELL * (i === total - 1 ? 0.36 : 0.47)
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = i % 3 === 0 ? '#f3ecdf' : '#fdfaf4'
    ctx.fill()
    ctx.strokeStyle = '#cfc4b6'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  function drawFood(ctx, cell, glow) {
    const cx = cell.x * CELL + CELL / 2
    const cy = cell.y * CELL + CELL / 2
    ctx.beginPath()
    ctx.arc(cx, cy, CELL * 0.42, 0, Math.PI * 2)
    ctx.fillStyle = glow
    ctx.fill()
    ctx.font = `${CELL * 0.85}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🐟', cx, cy + 1)
  }

  // 金色魚乾：脈動光環 + 飽和金色底 + 閃爍星星，跟一般魚乾明顯區隔
  function drawGolden(ctx, cell, frame) {
    const cx = cell.x * CELL + CELL / 2
    const cy = cell.y * CELL + CELL / 2
    const ringR = CELL * (0.56 + 0.1 * Math.sin(frame * 0.9))
    ctx.beginPath()
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2)
    ctx.strokeStyle = '#f0b429'
    ctx.lineWidth = 2.5
    ctx.globalAlpha = 0.55
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(cx, cy, CELL * 0.45, 0, Math.PI * 2)
    ctx.fillStyle = '#ffd75e'
    ctx.fill()
    ctx.strokeStyle = '#d69511'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.font = `${CELL * 0.85}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🐟', cx, cy + 1)
    ctx.font = `${CELL * 0.4}px serif`
    ctx.fillText('✨', cx + CELL * 0.38, cy - CELL * 0.38)
  }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas || !g.current) return
    const ctx = canvas.getContext('2d')
    const st = g.current

    ctx.fillStyle = '#fffbf0'
    ctx.fillRect(0, 0, BOARD, BOARD)
    ctx.strokeStyle = '#f3e9d2'
    ctx.lineWidth = 1
    for (let i = 1; i < GRID; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL, 0)
      ctx.lineTo(i * CELL, BOARD)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL)
      ctx.lineTo(BOARD, i * CELL)
      ctx.stroke()
    }

    for (let i = st.snake.length - 1; i >= 1; i--) drawSegment(ctx, st.snake[i], i, st.snake.length)
    if (st.food) drawFood(ctx, st.food, '#dcefe6')
    if (st.golden) drawGolden(ctx, st.golden, st.frame ?? 0)
  }

  /* ---------- 遊戲流程 ---------- */
  function occupied(st, extra = []) {
    return [...st.snake, ...(st.food ? [st.food] : []), ...(st.golden ? [st.golden] : []), ...extra]
  }

  function tick() {
    const st = g.current
    st.frame = (st.frame ?? 0) + 1
    st.dir = st.queuedDir
    const head = nextHead(st.snake[0], st.dir)

    if (outOfBounds(head) || hitsBody(st.snake, head)) {
      gameOver()
      return
    }

    if (samePos(head, st.food)) {
      st.score += 1
      st.fishEaten += 1
      st.growPending += 1
      sfx.eat()
      st.food = randomCell(occupied(st, [head]))
      if (!st.golden && st.fishEaten % GOLDEN_EVERY === 0) {
        const cell = randomCell(occupied(st, [head]))
        if (cell) st.golden = { ...cell, ticksLeft: GOLDEN_TICKS }
      }
    } else if (samePos(head, st.golden)) {
      st.score += 5
      st.growPending += 3
      sfx.eatGolden()
      st.golden = null
    }

    const grew = st.growPending > 0
    if (grew) st.growPending -= 1
    st.snake = advance(st.snake, head, grew)

    if (st.golden) {
      st.golden.ticksLeft -= 1
      if (st.golden.ticksLeft <= 0) st.golden = null
    }

    setUi({ score: st.score, head })
    draw()
  }

  function gameOver() {
    clearInterval(timerRef.current)
    sfx.gameOver()
    const finalScore = g.current.score
    if (finalScore > highScore) {
      setHighScore(finalScore)
      save('greedyCat', { ...load('greedyCat', { highScore: 0 }), highScore: finalScore })
    }
    setPhase('over')
  }

  // 速度隨分數提升；分數變化時才重新訂閱（不是每個 tick 都重訂）
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(tick, tickInterval(ui.score))
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ui.score])

  /* ---------- 操作 ---------- */
  function turn(dir) {
    if (phase !== 'playing') return
    const st = g.current
    if (isOpposite(dir, st.dir)) return
    st.queuedDir = dir
  }

  useEffect(() => {
    function onKey(e) {
      const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
      const dir = map[e.key]
      if (dir) {
        e.preventDefault()
        turn(dir)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  /* ---------- 畫面 ---------- */
  if (phase === 'ready') {
    return (
      <div className="card-sticker p-8 text-center">
        <ChinchillaCat variant="fluffy" className="mx-auto h-24 w-24" />
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-cocoa-700">
          操控貪吃的金吉拉毛毛蟲，吃魚乾長大！小心別撞到牆壁或自己的身體。
          偶爾會出現閃閃發光的金色魚乾，手腳要快才吃得到！
        </p>
        {highScore > 0 && (
          <p className="mt-3 text-sm text-cocoa-500">
            最高分：<span className="font-black text-honey-600">{highScore}</span>
          </p>
        )}
        <button onClick={start} className="btn-honey mt-6">
          🐟 開始遊戲！
        </button>
      </div>
    )
  }

  const headPct = {
    left: ((ui.head.x + 0.5) / GRID) * 100,
    top: ((ui.head.y + 0.5) / GRID) * 100,
  }
  const glideMs = Math.max(50, tickInterval(ui.score) - 20)
  const ctrlBtn =
    'flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-cocoa-200 bg-white text-xl font-black text-cocoa-800 active:bg-honey-300 select-none'

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 flex w-full max-w-96 justify-center gap-2">
        <div className="card-sticker !rounded-xl min-w-0 flex-1 px-3 py-1.5 text-center">
          <p className="text-xs font-bold text-cocoa-500">分數</p>
          <p className="text-lg font-black text-honey-600">{ui.score}</p>
        </div>
        <div className="card-sticker !rounded-xl min-w-0 flex-1 px-3 py-1.5 text-center">
          <p className="text-xs font-bold text-cocoa-500">最高分</p>
          <p className="text-lg font-black text-cocoa-800">{highScore}</p>
        </div>
        <button
          onClick={toggleSound}
          className="card-sticker !rounded-xl shrink-0 px-3 text-lg"
          aria-label="音效開關"
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="greedycat-board relative">
        <canvas
          ref={canvasRef}
          width={BOARD}
          height={BOARD}
          className="card-sticker !rounded-2xl block h-full w-full"
        />
        <div
          className="pointer-events-none absolute"
          style={{
            left: `${headPct.left}%`,
            top: `${headPct.top}%`,
            width: `${HEAD_SIZE_PCT}%`,
            height: `${HEAD_SIZE_PCT}%`,
            transform: 'translate(-50%, -50%)',
            transition: `left ${glideMs}ms linear, top ${glideMs}ms linear`,
          }}
        >
          <ChinchillaCat variant="fluffy" className="h-full w-full" />
        </div>

        {phase === 'over' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-cocoa-900/45">
            <div className="card-sticker mx-4 w-full max-w-56 p-5 text-center">
              <ChinchillaCat variant="classic" expression="surprised" className="mx-auto h-20 w-20" />
              <p className="mt-2 font-black text-cocoa-900">遊戲結束！</p>
              <p className="mt-1 text-2xl font-black text-honey-600">{ui.score} 分</p>
              {ui.score >= highScore && ui.score > 0 && (
                <p className="text-xs font-bold text-emerald-700">🏆 新紀錄！</p>
              )}
              <button onClick={start} className="btn-honey mt-3 w-full">
                再玩一次
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 方向鈕 */}
      <div className="mt-4 grid grid-cols-3 grid-rows-3 gap-2">
        <div />
        <button className={ctrlBtn} onClick={() => turn('up')} aria-label="上">
          ▲
        </button>
        <div />
        <button className={ctrlBtn} onClick={() => turn('left')} aria-label="左">
          ◀
        </button>
        <div className="flex items-center justify-center text-2xl">🐟</div>
        <button className={ctrlBtn} onClick={() => turn('right')} aria-label="右">
          ▶
        </button>
        <div />
        <button className={ctrlBtn} onClick={() => turn('down')} aria-label="下">
          ▼
        </button>
        <div />
      </div>
      <p className="mt-3 text-center text-xs text-cocoa-500">電腦用方向鍵操作；手機用上面的方向鈕</p>
    </div>
  )
}
