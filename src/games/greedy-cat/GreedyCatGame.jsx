import { useEffect, useRef, useState } from 'react'
import ChinchillaCat from '../../components/ChinchillaCat'
import Joystick from '../../components/Joystick'
import { load, save } from '../../services/storageService'
import {
  GRID, GOLDEN_EVERY, GOLDEN_TICKS, MODES, MODE_ORDER, createSnake, isOpposite,
  nextHead, samePos, outOfBounds, hitsBody, advance, randomCell, tickInterval,
} from './engine'
import { initSound, setMuted, sfx } from './sound'

const CELL = 20
const BOARD = GRID * CELL // 內部繪圖解析度（畫面顯示大小由 CSS .greedycat-board 響應式控制）
const HEAD_SIZE_PCT = 9.6 // 頭部覆蓋層佔棋盤寬度的百分比
const DEFAULT_STORE = { highScores: { easy: 0, medium: 0, hard: 0 }, soundOn: true }

export default function GreedyCatGame() {
  const canvasRef = useRef(null)
  const g = useRef(null)
  const timerRef = useRef(null)

  const [phase, setPhase] = useState('ready') // ready | playing | over
  const [ui, setUi] = useState({ score: 0, head: { x: 9, y: 9 } })
  const [highScores, setHighScores] = useState(() => ({
    ...DEFAULT_STORE.highScores,
    ...load('greedyCat', DEFAULT_STORE).highScores,
  }))
  const [soundOn, setSoundOn] = useState(() => load('greedyCat', DEFAULT_STORE).soundOn ?? true)

  useEffect(() => {
    setMuted(!soundOn)
  }, [soundOn])

  function toggleSound() {
    const next = !soundOn
    setSoundOn(next)
    save('greedyCat', { ...load('greedyCat', DEFAULT_STORE), soundOn: next })
  }

  function initGame(mode) {
    const snake = createSnake()
    g.current = {
      mode,
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

  function start(modeId) {
    initSound()
    initGame(MODES[modeId] ?? MODES.medium)
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
    const modeId = g.current.mode.id
    setHighScores((prev) => {
      if (finalScore <= (prev[modeId] ?? 0)) return prev
      const next = { ...prev, [modeId]: finalScore }
      save('greedyCat', { ...load('greedyCat', DEFAULT_STORE), highScores: next })
      return next
    })
    setPhase('over')
  }

  // 速度隨分數提升；分數變化時才重新訂閱（不是每個 tick 都重訂）
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(tick, tickInterval(ui.score, g.current.mode))
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ui.score])

  /* ---------- 操作 ---------- */
  // 回傳是否真的轉向成功：搖桿用這個值判斷要不要顯示「此方向被拒絕」的回饋
  // （反向直接撞自己脖子是規則禁止的操作，不是輸入沒被偵測到）。
  function turn(dir) {
    if (phase !== 'playing') return false
    const st = g.current
    if (isOpposite(dir, st.dir)) return false
    st.queuedDir = dir
    return true
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
        <p className="mt-4 text-sm font-bold text-cocoa-700">選擇難度開始：</p>
        <div className="mx-auto mt-3 grid max-w-xs gap-2">
          {MODE_ORDER.map((modeId) => {
            const mode = MODES[modeId]
            const best = highScores[modeId] ?? 0
            return (
              <button
                key={modeId}
                onClick={() => start(modeId)}
                className="card-sticker card-sticker-hover flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="flex items-center gap-2 font-black text-cocoa-900">
                  <span className="text-2xl">{mode.emoji}</span>
                  {mode.label}
                </span>
                <span className="text-xs text-cocoa-500">{best > 0 ? `🏆 ${best}` : '尚未挑戰'}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const mode = g.current.mode
  const headPct = {
    left: ((ui.head.x + 0.5) / GRID) * 100,
    top: ((ui.head.y + 0.5) / GRID) * 100,
  }
  const glideMs = Math.max(50, tickInterval(ui.score, mode) - 20)

  return (
    <div className="flex flex-col items-center">
      <p className="mb-1 text-xs font-bold text-cocoa-500">
        {mode.emoji} {mode.label}模式
      </p>
      <div className="mb-2 flex w-full max-w-96 justify-center gap-2">
        <div className="card-sticker !rounded-xl min-w-0 flex-1 px-3 py-1.5 text-center">
          <p className="text-xs font-bold text-cocoa-500">分數</p>
          <p className="text-lg font-black text-honey-600">{ui.score}</p>
        </div>
        <div className="card-sticker !rounded-xl min-w-0 flex-1 px-3 py-1.5 text-center">
          <p className="text-xs font-bold text-cocoa-500">最高分</p>
          <p className="text-lg font-black text-cocoa-800">{highScores[mode.id] ?? 0}</p>
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
              <p className="text-xs text-cocoa-500">
                {mode.emoji} {mode.label}模式
              </p>
              <p className="mt-1 text-2xl font-black text-honey-600">{ui.score} 分</p>
              {ui.score >= (highScores[mode.id] ?? 0) && ui.score > 0 && (
                <p className="text-xs font-bold text-emerald-700">🏆 新紀錄！</p>
              )}
              <div className="mt-3 flex gap-2">
                <button onClick={() => start(mode.id)} className="btn-honey flex-1 !px-2 text-sm">
                  再玩一次
                </button>
                <button onClick={() => setPhase('ready')} className="btn-outline flex-1 !px-2 text-sm">
                  選模式
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 方向搖桿 */}
      <div className="mt-4">
        <Joystick onDirection={turn} />
      </div>
      <p className="mt-3 text-center text-xs text-cocoa-500">電腦用方向鍵操作；手機拖曳上面的搖桿</p>
    </div>
  )
}
