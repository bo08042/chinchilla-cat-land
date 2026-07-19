import { useEffect, useRef, useState } from 'react'
import ChinchillaCat from '../../components/ChinchillaCat'
import { load, save } from '../../services/storageService'
import {
  COLS, ROWS, emptyBoard, refillBag, spawnPiece, cellsOf, collides,
  tryMove, tryRotate, merge, clearLines, ghostOf, scoreFor, levelFor,
  dropInterval, clearBottomRows,
} from './engine'
import { initSound, setMuted, sfx } from './sound'

const CELL = 24
const W = COLS * CELL
const H = ROWS * CELL

// 貓咪主題皮膚：每種方塊一個粉彩色 + 圖示
const SKINS = {
  I: { color: '#a8d8e8', emoji: '🐟' }, // 小魚乾
  O: { color: '#f5c9d4', emoji: '🧶' }, // 毛線球
  T: { color: '#ffd98a', emoji: '🐾' }, // 貓掌
  S: { color: '#b8dcb0', emoji: '🐭' }, // 老鼠玩具
  Z: { color: '#e8c5a8', emoji: '🪶' }, // 逗貓棒羽毛
  J: { color: '#c5c1e8', emoji: '🥫' }, // 罐罐
  L: { color: '#f2b8a0', emoji: '🍤' }, // 蝦蝦
}

const REACTIONS = { 1: '喵！', 2: '喵喵！', 3: '太厲害了喵！', 4: '金吉拉滿貫！！' }

// 充能式道具：消行累積能量（1 行 = 1 點），集滿花費才能使用
const ITEMS = [
  { id: 'wand', emoji: '🎣', name: '逗貓棒', cost: 5, desc: '把目前方塊換成下一個' },
  { id: 'can', emoji: '🥫', name: '罐罐時間', cost: 8, desc: '掉落減速 10 秒' },
  { id: 'brush', emoji: '🧹', name: '除毛神器', cost: 12, desc: '清除底部 3 行' },
]

export default function CatBlocksGame() {
  const canvasRef = useRef(null)
  const nextRef = useRef(null)
  const nextRefMobile = useRef(null)
  // 遊戲狀態放 ref（高頻更新不觸發 re-render），UI 顯示值另外鏡射到 state
  const g = useRef(null)
  const timerRef = useRef(null)
  const slowTimer = useRef(null)
  const reactionTimer = useRef(null)

  const [phase, setPhase] = useState('ready') // ready | playing | paused | over
  const [ui, setUi] = useState({ score: 0, lines: 0, level: 1, next: null, energy: 0 })
  const [slowed, setSlowed] = useState(false)
  const [reaction, setReaction] = useState(null)
  const [highScore, setHighScore] = useState(() => load('catBlocks', { highScore: 0 }).highScore)
  const [soundOn, setSoundOn] = useState(() => load('catBlocks', { highScore: 0 }).soundOn ?? true)

  useEffect(() => {
    setMuted(!soundOn)
  }, [soundOn])

  function toggleSound() {
    const next = !soundOn
    setSoundOn(next)
    save('catBlocks', { ...load('catBlocks', { highScore: 0 }), soundOn: next })
  }

  function initGame() {
    const bag = refillBag()
    g.current = {
      board: emptyBoard(),
      piece: spawnPiece(bag.pop()),
      bag,
      score: 0,
      lines: 0,
      level: 1,
      energy: 0,
    }
    clearTimeout(slowTimer.current)
    setSlowed(false)
    syncUi()
  }

  function nextType() {
    if (g.current.bag.length === 0) g.current.bag = refillBag()
    return g.current.bag[g.current.bag.length - 1]
  }

  function syncUi() {
    const { score, lines, level, energy } = g.current
    setUi({ score, lines, level, energy, next: nextType() })
  }

  function showReaction(text) {
    clearTimeout(reactionTimer.current)
    setReaction({ text, key: Date.now() })
    reactionTimer.current = setTimeout(() => setReaction(null), 1400)
  }

  /* ---------- 繪圖 ---------- */
  function drawCell(ctx, x, y, type, ghost = false) {
    const px = x * CELL
    const py = y * CELL
    const skin = SKINS[type]
    if (ghost) {
      ctx.strokeStyle = skin.color
      ctx.lineWidth = 2
      ctx.strokeRect(px + 3, py + 3, CELL - 6, CELL - 6)
      return
    }
    ctx.fillStyle = skin.color
    ctx.beginPath()
    ctx.roundRect(px + 1, py + 1, CELL - 2, CELL - 2, 6)
    ctx.fill()
    ctx.font = '14px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(skin.emoji, px + CELL / 2, py + CELL / 2 + 1)
  }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas || !g.current) return
    const ctx = canvas.getContext('2d')
    const { board, piece } = g.current

    ctx.fillStyle = '#fffbf0'
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = '#f3e9d2'
    ctx.lineWidth = 1
    for (let x = 1; x < COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke()
    }
    for (let y = 1; y < ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke()
    }
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x]) drawCell(ctx, x, y, board[y][x])
      }
    }
    if (piece) {
      for (const [x, y] of cellsOf(ghostOf(board, piece))) {
        if (y >= 0) drawCell(ctx, x, y, piece.type, true)
      }
      for (const [x, y] of cellsOf(piece)) {
        if (y >= 0) drawCell(ctx, x, y, piece.type)
      }
    }
  }

  function drawNext() {
    if (!ui.next) return
    for (const canvas of [nextRef.current, nextRefMobile.current]) {
      if (!canvas) continue
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fffbf0'
      ctx.fillRect(0, 0, 96, 96)
      const probe = { type: ui.next, rot: 0, x: 0, y: 0 }
      const cells = cellsOf(probe)
      const minX = Math.min(...cells.map(([x]) => x))
      const maxX = Math.max(...cells.map(([x]) => x))
      const minY = Math.min(...cells.map(([, y]) => y))
      const maxY = Math.max(...cells.map(([, y]) => y))
      const offX = (96 - (maxX - minX + 1) * CELL) / 2 - minX * CELL
      const offY = (96 - (maxY - minY + 1) * CELL) / 2 - minY * CELL
      ctx.save()
      ctx.translate(offX, offY)
      for (const [x, y] of cells) drawCell(ctx, x, y, ui.next)
      ctx.restore()
    }
  }

  useEffect(drawNext, [ui.next])

  /* ---------- 遊戲流程 ---------- */
  function lockPiece() {
    const state = g.current
    state.board = merge(state.board, state.piece)
    const { board, cleared } = clearLines(state.board)
    state.board = board
    if (cleared > 0) {
      const prevLevel = state.level
      state.score += scoreFor(cleared, state.level)
      state.lines += cleared
      state.energy += cleared
      state.level = levelFor(state.lines)
      showReaction(REACTIONS[cleared])
      sfx.clear(cleared)
      if (state.level > prevLevel) sfx.levelUp()
    } else {
      sfx.lock()
    }
    const type = nextType()
    state.bag.pop()
    state.piece = spawnPiece(type)
    if (collides(state.board, state.piece)) {
      gameOver()
      return
    }
    syncUi()
  }

  function gameOver() {
    clearInterval(timerRef.current)
    clearTimeout(slowTimer.current)
    sfx.gameOver()
    const finalScore = g.current.score
    if (finalScore > highScore) {
      setHighScore(finalScore)
      save('catBlocks', { ...load('catBlocks', { highScore: 0 }), highScore: finalScore })
    }
    setPhase('over')
  }

  function tick() {
    const state = g.current
    const moved = tryMove(state.board, state.piece, 0, 1)
    if (moved) {
      state.piece = moved
    } else {
      lockPiece()
    }
    draw()
  }

  // 重力計時器：等級或減速狀態改變時重設速度
  useEffect(() => {
    if (phase !== 'playing') return
    const interval = dropInterval(ui.level) * (slowed ? 2 : 1)
    timerRef.current = setInterval(tick, interval)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ui.level, slowed])

  /* ---------- 操作 ---------- */
  function act(action) {
    if (phase !== 'playing') return
    const state = g.current
    let next = null
    if (action === 'left') next = tryMove(state.board, state.piece, -1, 0)
    if (action === 'right') next = tryMove(state.board, state.piece, 1, 0)
    if (action === 'down') {
      next = tryMove(state.board, state.piece, 0, 1)
      if (next) state.score += 1
      else { lockPiece(); draw(); return }
    }
    if (action === 'rotate') next = tryRotate(state.board, state.piece)
    if (action === 'drop') {
      const ghost = ghostOf(state.board, state.piece)
      state.score += (ghost.y - state.piece.y) * 2
      state.piece = ghost
      lockPiece()
      draw()
      syncUi()
      return
    }
    if (next) {
      state.piece = next
      if (action === 'rotate') sfx.rotate()
      else if (action !== 'down') sfx.move()
      draw()
    }
    if (action === 'down') syncUi()
  }

  /* ---------- 道具 ---------- */
  function useItem(itemId) {
    if (phase !== 'playing') return
    const state = g.current
    const item = ITEMS.find((i) => i.id === itemId)
    if (!item || state.energy < item.cost) return

    if (itemId === 'wand') {
      // 目前方塊 ↔ 下一個方塊
      const incoming = nextType()
      const candidate = spawnPiece(incoming)
      if (collides(state.board, candidate)) return
      state.bag[state.bag.length - 1] = state.piece.type
      state.piece = candidate
      showReaction('🎣 換一塊！')
    }
    if (itemId === 'can') {
      state.energy -= item.cost
      setSlowed(true)
      clearTimeout(slowTimer.current)
      slowTimer.current = setTimeout(() => setSlowed(false), 10000)
      showReaction('🥫 慢慢來～')
      sfx.purr()
      syncUi()
      return
    }
    if (itemId === 'brush') {
      state.board = clearBottomRows(state.board, 3)
      state.score += 250 * state.level // 約為正常消 3 行的一半分數
      showReaction('🧹 乾淨溜溜！')
    }
    state.energy -= item.cost
    sfx.item()
    draw()
    syncUi()
  }

  // 鍵盤操作
  useEffect(() => {
    function onKey(e) {
      const map = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowDown: 'down',
        ArrowUp: 'rotate',
        ' ': 'drop',
      }
      if (e.key === 'p' || e.key === 'P') {
        setPhase((p) => (p === 'playing' ? 'paused' : p === 'paused' ? 'playing' : p))
        return
      }
      if (e.key === '1') return useItem('wand')
      if (e.key === '2') return useItem('can')
      if (e.key === '3') return useItem('brush')
      const action = map[e.key]
      if (action) {
        e.preventDefault()
        act(action)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function start() {
    initSound()
    initGame()
    setPhase('playing')
    setTimeout(draw, 0)
  }

  /* ---------- UI ---------- */
  const ctrlBtn =
    'rounded-2xl border-2 border-cocoa-200 bg-white px-4 py-2.5 text-xl font-black text-cocoa-800 active:bg-honey-300 select-none'

  function ItemButtons({ compact = false }) {
    return (
      <div className={`flex ${compact ? 'gap-1.5' : 'flex-col gap-2'}`}>
        {ITEMS.map((item) => {
          const affordable = ui.energy >= item.cost && phase === 'playing'
          return (
            <button
              key={item.id}
              onClick={() => useItem(item.id)}
              disabled={!affordable}
              title={`${item.name}：${item.desc}（${item.cost} 能量）`}
              className={`rounded-xl border-2 px-2 py-1.5 text-center transition-colors ${
                affordable
                  ? 'border-honey-500 bg-honey-300 text-cocoa-900 shadow-[2px_2px_0_0_var(--color-honey-600)]'
                  : 'border-cocoa-100 bg-white opacity-55'
              } ${compact ? 'flex-1' : ''}`}
            >
              <span className={compact ? 'text-base' : 'text-lg'}>{item.emoji}</span>
              <span className={`ml-1 font-black ${compact ? 'text-[10px]' : 'text-xs'}`}>
                {compact ? item.cost : `${item.name} ${item.cost}⚡`}
              </span>
              {!compact && <p className="mt-0.5 text-[10px] text-cocoa-600">{item.desc}</p>}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* 資訊列（全尺寸）：分數 / 等級 / 能量；手機額外塞下一個與吉祥物 */}
      <div className="mb-2 flex w-full max-w-80 items-stretch justify-center gap-2 sm:mb-4 sm:max-w-xl">
        <div className="card-sticker flex-1 !rounded-xl px-2 py-1.5 text-center sm:px-4 sm:py-2.5">
          <p className="text-[10px] font-bold text-cocoa-500 sm:text-xs">分數</p>
          <p className="text-sm font-black text-honey-600 sm:text-2xl">{ui.score.toLocaleString()}</p>
          <p className="text-[10px] text-cocoa-500 sm:text-xs">🏆 {highScore.toLocaleString()}</p>
        </div>
        <div className="card-sticker flex-1 !rounded-xl px-2 py-1.5 text-center sm:px-4 sm:py-2.5">
          <p className="text-[10px] font-bold text-cocoa-500 sm:text-xs">等級 {ui.level}</p>
          <p className="text-sm font-black text-cocoa-800 sm:text-2xl">{ui.lines} 行</p>
        </div>
        <div className="card-sticker flex-1 !rounded-xl px-2 py-1.5 text-center sm:px-4 sm:py-2.5">
          <p className="text-[10px] font-bold text-cocoa-500 sm:text-xs">能量</p>
          <p className="text-sm font-black text-emerald-700 sm:text-2xl">⚡ {ui.energy}</p>
        </div>
        <div className="card-sticker !rounded-xl px-2 py-1.5 text-center sm:hidden">
          <p className="text-[10px] font-bold text-cocoa-500">下一個</p>
          <canvas ref={nextRefMobile} width="96" height="96" className="mx-auto h-9 w-9" />
        </div>
        <div className="relative flex items-end justify-center px-1 sm:hidden">
          <ChinchillaCat variant="sitting" size={44} />
          {reaction && (
            <p
              key={reaction.key}
              className="absolute -top-3 left-1/2 -translate-x-1/2 animate-bounce rounded-full bg-honey-300 px-2 py-0.5 text-[10px] font-black whitespace-nowrap text-cocoa-900"
            >
              {reaction.text}
            </p>
          )}
        </div>
      </div>

      {/* 手機版道具列 */}
      <div className="mb-2 w-full max-w-80 sm:hidden">
        <ItemButtons compact />
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center sm:gap-5">
        {/* 棋盤 */}
        <div className="relative">
          <canvas ref={canvasRef} width={W} height={H} className="card-sticker catblocks-board !rounded-2xl" />
          {/* 開始 / 暫停 / 結束 覆蓋層 */}
          {phase !== 'playing' && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-cocoa-900/45">
              <div className="card-sticker mx-3 w-full max-w-52 p-4 text-center">
                {phase === 'ready' && (
                  <>
                    <ChinchillaCat variant="fluffy" className="mx-auto h-20 w-20" />
                    <button onClick={start} className="btn-honey mt-3 w-full !px-2 whitespace-nowrap">
                      開始遊戲！
                    </button>
                  </>
                )}
                {phase === 'paused' && (
                  <>
                    <p className="text-3xl">⏸️</p>
                    <p className="mt-2 font-black text-cocoa-900">休息一下</p>
                    <button
                      onClick={() => setPhase('playing')}
                      className="btn-honey mt-3 w-full !px-2 whitespace-nowrap"
                    >
                      繼續
                    </button>
                  </>
                )}
                {phase === 'over' && (
                  <>
                    <ChinchillaCat variant="classic" expression="surprised" className="mx-auto h-20 w-20" />
                    <p className="mt-2 font-black text-cocoa-900">遊戲結束！</p>
                    <p className="mt-1 text-2xl font-black text-honey-600">{ui.score.toLocaleString()} 分</p>
                    {ui.score >= highScore && ui.score > 0 && (
                      <p className="text-xs font-bold text-emerald-700">🏆 新紀錄！</p>
                    )}
                    <button onClick={start} className="btn-honey mt-3 w-full !px-2 whitespace-nowrap">
                      再來一局
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {/* 罐罐時間標記 */}
          {slowed && phase === 'playing' && (
            <p className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-honey-300/95 px-3 py-1 text-xs font-black text-cocoa-900">
              🥫 罐罐時間中…
            </p>
          )}
        </div>

        {/* 桌面版側欄 */}
        <div className="hidden w-44 flex-col gap-3 sm:flex">
          <div className="card-sticker p-3 text-center">
            <p className="text-xs font-bold text-cocoa-500">下一個</p>
            <canvas ref={nextRef} width="96" height="96" className="mx-auto mt-1 h-20 w-20" />
          </div>
          <ItemButtons />
          <div className="relative p-2 text-center">
            <ChinchillaCat variant="sitting" className="mx-auto h-20 w-20" />
            {reaction && (
              <p
                key={reaction.key}
                className="absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce rounded-full bg-honey-300 px-3 py-1 text-xs font-black whitespace-nowrap text-cocoa-900"
              >
                {reaction.text}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {phase === 'playing' && (
              <button onClick={() => setPhase('paused')} className="btn-outline flex-1 !px-2 text-sm">
                ⏸ 暫停
              </button>
            )}
            <button onClick={toggleSound} className="btn-outline flex-1 !px-2 text-sm" aria-label="音效開關">
              {soundOn ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
      </div>

      {/* 觸控按鈕：緊貼棋盤下方 */}
      <div className="mt-3 flex items-center justify-center gap-2.5">
        <button className={ctrlBtn} onClick={() => act('left')} aria-label="左移">◀</button>
        <button className={ctrlBtn} onClick={() => act('rotate')} aria-label="旋轉">🔄</button>
        <button className={ctrlBtn} onClick={() => act('down')} aria-label="下移">▼</button>
        <button className={ctrlBtn} onClick={() => act('drop')} aria-label="直接落下">⤓</button>
        <button className={ctrlBtn} onClick={() => act('right')} aria-label="右移">▶</button>
        <div className="flex flex-col gap-1 sm:hidden">
          {phase === 'playing' && (
            <button
              onClick={() => setPhase('paused')}
              className="rounded-xl border-2 border-cocoa-200 bg-white px-2.5 py-0.5 text-sm font-black text-cocoa-800 select-none"
              aria-label="暫停"
            >
              ⏸
            </button>
          )}
          <button
            onClick={toggleSound}
            className="rounded-xl border-2 border-cocoa-200 bg-white px-2.5 py-0.5 text-sm select-none"
            aria-label="音效開關"
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-cocoa-500">
        電腦：方向鍵移動/旋轉、空白鍵直接落下、P 暫停、1/2/3 使用道具｜消行累積 ⚡ 能量施放道具
      </p>
    </div>
  )
}
