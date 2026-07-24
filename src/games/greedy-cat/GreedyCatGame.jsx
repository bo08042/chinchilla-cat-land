import { useEffect, useRef, useState } from 'react'
import ChinchillaCat from '../../components/ChinchillaCat'
import Joystick from '../../components/Joystick'
import { load, save } from '../../services/storageService'
import {
  GRID, GOLDEN_EVERY, GOLDEN_TICKS, POWERUP_EVERY, POWERUP_TICKS, POWERUP_META,
  EFFECT_TICKS, MAGNET_RADIUS, SLOW_MULTIPLIER, MODES, MODE_ORDER, createSnake,
  isOpposite, nextHead, samePos, outOfBounds, hitsBody, hitsCell, advance, randomCell,
  tickInterval, obstacleCountForScore, eligiblePowerupTypes, manhattan, stepToward,
} from './engine'
import { initSound, setMuted, sfx } from './sound'

const CELL = 20
const BOARD = GRID * CELL // 內部繪圖解析度（畫面顯示大小由 CSS .greedycat-board 響應式控制）
const HEAD_SIZE_PCT = 9.6 // 頭部覆蓋層佔棋盤寬度的百分比
const DEFAULT_STORE = { highScores: { easy: 0, medium: 0, hard: 0 }, soundOn: true }
const EMPTY_EFFECTS = { catnip: 0, magnet: 0, slow: 0 }

// 各模式在開始畫面顯示的特色圖示（障礙／道具），讓玩家選之前先知道差異
function modeFeatureIcons(mode) {
  const icons = []
  if (mode.obstacles) icons.push('🪴')
  if (mode.powerups.catnip) icons.push('🌿')
  if (mode.powerups.magnet) icons.push('🧲')
  if (mode.powerups.slow) icons.push('🐌')
  return icons
}

export default function GreedyCatGame() {
  const canvasRef = useRef(null)
  const g = useRef(null)
  const timerRef = useRef(null)

  const [phase, setPhase] = useState('ready') // ready | playing | over
  const [ui, setUi] = useState({ score: 0, head: { x: 9, y: 9 }, effects: EMPTY_EFFECTS })
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
      powerup: null,
      obstacles: [],
      effects: { ...EMPTY_EFFECTS },
      score: 0,
      fishEaten: 0,
      growPending: 0,
    }
    if (mode.obstacles) {
      const target = obstacleCountForScore(mode, 0)
      for (let i = 0; i < target; i++) {
        const cell = randomCell(occupied(g.current))
        if (!cell) break
        g.current.obstacles.push(cell)
      }
    }
    setUi({ score: 0, head: snake[0], effects: { ...EMPTY_EFFECTS } })
  }

  function start(modeId) {
    initSound()
    initGame(MODES[modeId] ?? MODES.medium)
    setPhase('playing')
    setTimeout(draw, 0)
  }

  /* ---------- 繪圖（Canvas 畫身體與食物，頭由 SVG 覆蓋層負責） ---------- */
  function drawSegment(ctx, seg, i, total, invincible, frame) {
    const cx = seg.x * CELL + CELL / 2
    const cy = seg.y * CELL + CELL / 2
    const r = CELL * (i === total - 1 ? 0.36 : 0.47)
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    if (invincible) {
      ctx.fillStyle = frame % 2 === 0 ? '#eaffea' : '#d3f7d3'
      ctx.fill()
      ctx.strokeStyle = '#6fbf73'
    } else {
      ctx.fillStyle = i % 3 === 0 ? '#f3ecdf' : '#fdfaf4'
      ctx.fill()
      ctx.strokeStyle = '#cfc4b6'
    }
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

  // 家具障礙：素色方塊墊底 + 盆栽圖示，一眼就看得出「不能踩」
  function drawObstacle(ctx, cell) {
    const x = cell.x * CELL + 2
    const y = cell.y * CELL + 2
    const size = CELL - 4
    ctx.fillStyle = '#e2d0b8'
    ctx.strokeStyle = '#a98a5c'
    ctx.lineWidth = 1.5
    if (ctx.roundRect) {
      ctx.beginPath()
      ctx.roundRect(x, y, size, size, 4)
      ctx.fill()
      ctx.stroke()
    } else {
      ctx.fillRect(x, y, size, size)
      ctx.strokeRect(x, y, size, size)
    }
    ctx.font = `${CELL * 0.8}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🪴', cell.x * CELL + CELL / 2, cell.y * CELL + CELL / 2 + 1)
  }

  const POWERUP_RING_COLOR = { catnip: '#6fbf73', magnet: '#4c94e0', slow: '#a774d1' }

  // 道具：脈動色環（依種類變色）+ 白底 + emoji，跟金色魚乾同一套視覺語言但顏色區分種類
  function drawPowerup(ctx, powerup, frame) {
    const cx = powerup.x * CELL + CELL / 2
    const cy = powerup.y * CELL + CELL / 2
    const ringR = CELL * (0.5 + 0.08 * Math.sin(frame * 0.8))
    const color = POWERUP_RING_COLOR[powerup.type] ?? '#6fbf73'
    ctx.beginPath()
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2)
    ctx.strokeStyle = color
    ctx.lineWidth = 2.5
    ctx.globalAlpha = 0.6
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(cx, cy, CELL * 0.4, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.font = `${CELL * 0.75}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(POWERUP_META[powerup.type]?.emoji ?? '✨', cx, cy + 1)
  }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas || !g.current) return
    const ctx = canvas.getContext('2d')
    const st = g.current
    const invincible = st.effects.catnip > 0
    const frame = st.frame ?? 0

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

    st.obstacles.forEach((cell) => drawObstacle(ctx, cell))
    for (let i = st.snake.length - 1; i >= 1; i--) {
      drawSegment(ctx, st.snake[i], i, st.snake.length, invincible, frame)
    }
    if (st.food) drawFood(ctx, st.food, '#dcefe6')
    if (st.golden) drawGolden(ctx, st.golden, frame)
    if (st.powerup) drawPowerup(ctx, st.powerup, frame)
  }

  /* ---------- 遊戲流程 ---------- */
  function occupied(st, extra = []) {
    return [
      ...st.snake,
      ...(st.food ? [st.food] : []),
      ...(st.golden ? [st.golden] : []),
      ...(st.powerup ? [st.powerup] : []),
      ...(st.obstacles || []),
      ...extra,
    ]
  }

  function tick() {
    const st = g.current
    st.frame = (st.frame ?? 0) + 1
    st.dir = st.queuedDir
    const head = nextHead(st.snake[0], st.dir)
    const invincible = st.effects.catnip > 0

    if (outOfBounds(head)) {
      gameOver()
      return
    }
    if (!invincible && (hitsBody(st.snake, head) || hitsCell(st.obstacles, head))) {
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
      if (!st.powerup && st.fishEaten % POWERUP_EVERY === 0) {
        const types = eligiblePowerupTypes(st.mode)
        if (types.length) {
          const cell = randomCell(occupied(st, [head]))
          if (cell) {
            const type = types[Math.floor(Math.random() * types.length)]
            st.powerup = { ...cell, type, ticksLeft: POWERUP_TICKS }
          }
        }
      }
    } else if (samePos(head, st.golden)) {
      st.score += 5
      st.growPending += 3
      sfx.eatGolden()
      st.golden = null
    } else if (samePos(head, st.powerup)) {
      st.effects[st.powerup.type] = EFFECT_TICKS[st.powerup.type]
      sfx.powerUp()
      st.powerup = null
    }

    const grew = st.growPending > 0
    if (grew) st.growPending -= 1
    st.snake = advance(st.snake, head, grew)

    if (st.golden) {
      st.golden.ticksLeft -= 1
      if (st.golden.ticksLeft <= 0) st.golden = null
    }
    if (st.powerup) {
      st.powerup.ticksLeft -= 1
      if (st.powerup.ticksLeft <= 0) st.powerup = null
    }

    for (const key of Object.keys(st.effects)) {
      if (st.effects[key] > 0) st.effects[key] -= 1
    }

    // 魚乾磁鐵：範圍內的食物每 tick 往蛇頭滑一格，滑到的格子不能是蛇身或障礙
    if (st.effects.magnet > 0) {
      const blocked = [...st.snake.slice(1), ...st.obstacles]
      const isBlocked = (c) => blocked.some((b) => b.x === c.x && b.y === c.y)
      if (st.food && manhattan(head, st.food) <= MAGNET_RADIUS) {
        const moved = stepToward(st.food, head)
        if (!isBlocked(moved)) st.food = moved
      }
      if (st.golden && manhattan(head, st.golden) <= MAGNET_RADIUS) {
        const moved = stepToward(st.golden, head)
        if (!isBlocked(moved)) st.golden = { ...st.golden, ...moved }
      }
    }

    // 家具障礙隨分數增加，每次補到目標數量為止
    if (st.mode.obstacles) {
      const target = obstacleCountForScore(st.mode, st.score)
      while (st.obstacles.length < target) {
        const cell = randomCell(occupied(st, [head]))
        if (!cell) break
        st.obstacles.push(cell)
      }
    }

    setUi({ score: st.score, head, effects: { ...st.effects } })
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

  const slowActive = (ui.effects?.slow ?? 0) > 0

  // 速度隨分數提升，減速藥水生效時間隔乘上倍率；分數或減速狀態變化時才重新訂閱
  useEffect(() => {
    if (phase !== 'playing') return
    const base = tickInterval(ui.score, g.current.mode)
    const interval = slowActive ? base * SLOW_MULTIPLIER : base
    timerRef.current = setInterval(tick, interval)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ui.score, slowActive])

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
          操控貪吃的金吉拉毛毛蟲，吃魚乾長大！小心別撞到牆壁、自己的身體或家具障礙。
          偶爾會出現閃閃發光的金色魚乾與道具，手腳要快才吃得到！
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
                  <span>
                    {mode.label}
                    <span className="block text-xs font-normal text-cocoa-400">
                      {modeFeatureIcons(mode).join(' ')}
                    </span>
                  </span>
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
  const baseInterval = tickInterval(ui.score, mode)
  const effectiveInterval = slowActive ? baseInterval * SLOW_MULTIPLIER : baseInterval
  const glideMs = Math.max(50, effectiveInterval - 20)
  const invincibleActive = (ui.effects?.catnip ?? 0) > 0
  const magnetActive = (ui.effects?.magnet ?? 0) > 0

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

      {(invincibleActive || magnetActive || slowActive) && (
        <div className="mb-2 flex gap-1.5">
          {invincibleActive && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
              🌿 無敵中
            </span>
          )}
          {magnetActive && (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-700">
              🧲 磁力中
            </span>
          )}
          {slowActive && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
              🐌 減速中
            </span>
          )}
        </div>
      )}

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
            filter: invincibleActive ? 'drop-shadow(0 0 6px #6fbf73)' : 'none',
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
