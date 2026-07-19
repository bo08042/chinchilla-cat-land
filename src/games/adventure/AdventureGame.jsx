import { useEffect, useRef, useState } from 'react'
import ChinchillaCat from '../../components/ChinchillaCat'
import { load, save } from '../../services/storageService'
import { TILES, PLAYERS, LAPS_TO_FINISH, PASS_START_BONUS } from './data'
import {
  TILE_COUNT, tileCoord, rollDice, pickEventCard, pickQuizQuestion,
  nextSnackIndex, richestOpponent,
} from './engine'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 格子底色
const TILE_COLORS = {
  start: '#ffde7a',
  snack: '#d8f0d0',
  event: '#fbe3c8',
  quiz: '#cfe6f5',
  rest: '#e8e0f2',
  dash: '#ffd6cc',
}

// 迷你骰子
function MiniDice({ n }) {
  const spots = {
    1: [[35, 35]],
    2: [[21, 21], [49, 49]],
    3: [[21, 21], [35, 35], [49, 49]],
    4: [[21, 21], [49, 21], [21, 49], [49, 49]],
    5: [[21, 21], [49, 21], [35, 35], [21, 49], [49, 49]],
    6: [[21, 18], [49, 18], [21, 35], [49, 35], [21, 52], [49, 52]],
  }
  return (
    <svg viewBox="0 0 70 70" width="40" height="40" aria-label={n ? `骰子 ${n} 點` : '骰子'}>
      <rect x="3" y="3" width="64" height="64" rx="14" fill="#fff" stroke="#5f4a33" strokeWidth="4" />
      {n &&
        spots[n].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6.5" fill={n === 1 ? '#f0b429' : '#5f4a33'} />
        ))}
    </svg>
  )
}

export default function AdventureGame() {
  // 權威狀態放 ref（回合流程是 async，避免讀到過期 state），UI 另外鏡射
  const S = useRef(null)
  const [phase, setPhase] = useState('ready') // ready | playing | result
  const [ui, setUi] = useState({
    positions: [0, 0, 0],
    fish: [0, 0, 0],
    laps: [0, 0, 0],
    resting: [false, false, false],
  })
  const [turn, setTurn] = useState(0)
  const [dice, setDice] = useState(null)
  const [rolling, setRolling] = useState(false)
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState([])
  const [card, setCard] = useState(null) // 事件卡展示
  const [quiz, setQuiz] = useState(null) // { q, answered, resolver }
  const [results, setResults] = useState(null)
  const [stats, setStats] = useState(() => load('adventure', { games: 0, wins: 0 }))

  function sync() {
    const { positions, fish, laps, resting } = S.current
    setUi({
      positions: [...positions],
      fish: [...fish],
      laps: [...laps],
      resting: [...resting],
    })
  }

  function addLog(msg) {
    setLog((prev) => [msg, ...prev].slice(0, 3))
  }

  function start() {
    S.current = {
      positions: [0, 0, 0],
      fish: [3, 3, 3],
      laps: [0, 0, 0],
      resting: [false, false, false],
    }
    setLog([])
    setDice(null)
    setResults(null)
    setTurn(0)
    sync()
    setPhase('playing')
    addLog('大冒險開始！先擲骰的是金吉拉。')
  }

  /* ---------- 回合流程 ---------- */
  async function takeTurn(p) {
    setBusy(true)
    const st = S.current
    const me = PLAYERS[p]

    if (st.resting[p]) {
      st.resting[p] = false
      sync()
      addLog(`${me.name} 睡得正香，跳過這回合 😴`)
      await sleep(1000)
      endTurn(p)
      return
    }

    const value = await animateRoll()
    addLog(`${me.name} 擲出 ${value} 點`)
    await sleep(350)
    await move(p, value)
    await resolveTile(p, true)
    endTurn(p)
  }

  async function animateRoll() {
    setRolling(true)
    for (let i = 0; i < 6; i++) {
      setDice(rollDice())
      await sleep(90)
    }
    const value = rollDice()
    setDice(value)
    setRolling(false)
    return value
  }

  // 逐格移動（steps 可為負）；順向經過起點時加圈數與獎勵
  async function move(p, steps) {
    const st = S.current
    const dir = steps >= 0 ? 1 : -1
    for (let i = 0; i < Math.abs(steps); i++) {
      st.positions[p] = (st.positions[p] + dir + TILE_COUNT) % TILE_COUNT
      if (dir === 1 && st.positions[p] === 0) {
        st.laps[p] += 1
        st.fish[p] += PASS_START_BONUS
        addLog(
          `${PLAYERS[p].name} 回到起點！+${PASS_START_BONUS} 🐟（第 ${Math.min(st.laps[p] + 1, LAPS_TO_FINISH)} 圈）`,
        )
      }
      sync()
      await sleep(190)
    }
  }

  async function resolveTile(p, allowChain) {
    const st = S.current
    const me = PLAYERS[p]
    const tile = TILES[st.positions[p]]

    if (tile.type === 'snack') {
      st.fish[p] += tile.gain
      addLog(`${me.name} 吃到${tile.label}！+${tile.gain} 🐟`)
      sync()
      await sleep(750)
      return
    }
    if (tile.type === 'start') {
      st.fish[p] += 3
      addLog(`${me.name} 正好停在起點，加碼 +3 🐟`)
      sync()
      await sleep(750)
      return
    }
    if (tile.type === 'rest') {
      st.resting[p] = true
      addLog(`${me.name} 躺進午睡格，下回合休息 😴`)
      sync()
      await sleep(750)
      return
    }
    if (tile.type === 'dash') {
      addLog(`${me.name} 踩到衝刺格，往前衝 3 格！💨`)
      await sleep(500)
      await move(p, 3)
      if (allowChain) await resolveTile(p, false)
      return
    }
    if (tile.type === 'quiz') {
      await handleQuiz(p)
      return
    }
    if (tile.type === 'event') {
      await handleEvent(p, allowChain)
    }
  }

  async function handleQuiz(p) {
    const st = S.current
    const me = PLAYERS[p]
    const q = pickQuizQuestion()

    let correct
    if (me.isAI) {
      addLog(`${me.name} 抽到金吉拉知識題……`)
      await sleep(1100)
      correct = Math.random() < me.accuracy
    } else {
      correct = await new Promise((resolver) => setQuiz({ q, answered: null, resolver }))
    }
    st.fish[p] += correct ? 6 : 1
    addLog(correct ? `${me.name} 答對了！+6 🐟` : `${me.name} 答錯了，安慰獎 +1 🐟`)
    sync()
    await sleep(700)
  }

  async function handleEvent(p, allowChain) {
    const st = S.current
    const me = PLAYERS[p]
    const drawn = pickEventCard()
    setCard({ ...drawn, player: me })
    await sleep(2000)
    setCard(null)

    const e = drawn.effect
    if (e.fish) {
      st.fish[p] = Math.max(0, st.fish[p] + e.fish)
      addLog(`${me.name} ${e.fish > 0 ? '+' : ''}${e.fish} 🐟`)
    }
    if (e.rest) {
      st.resting[p] = true
      addLog(`${me.name} 下回合休息 😴`)
    }
    if (e.collect) {
      let got = 0
      for (let i = 0; i < PLAYERS.length; i++) {
        if (i === p) continue
        const paid = Math.min(e.collect, st.fish[i])
        st.fish[i] -= paid
        got += paid
      }
      st.fish[p] += got
      addLog(`${me.name} 收到大家的 ${got} 🐟`)
    }
    if (e.give) {
      for (let i = 0; i < PLAYERS.length; i++) {
        if (i === p) continue
        const paid = Math.min(e.give, st.fish[p])
        st.fish[p] -= paid
        st.fish[i] += paid
      }
      addLog(`${me.name} 大方請客了 🍽️`)
    }
    if (e.steal) {
      const target = richestOpponent(st.fish, p)
      const taken = Math.min(e.steal, st.fish[target])
      st.fish[target] -= taken
      st.fish[p] += taken
      addLog(`${me.name} 從 ${PLAYERS[target].name} 那裡叼走 ${taken} 🐟`)
    }
    sync()

    if (e.move) {
      await sleep(500)
      await move(p, e.move)
      if (allowChain) await resolveTile(p, false)
    }
    if (e.toSnack) {
      const target = nextSnackIndex(st.positions[p])
      const steps = (target - st.positions[p] + TILE_COUNT) % TILE_COUNT
      await sleep(500)
      await move(p, steps)
      if (allowChain) await resolveTile(p, false)
    }
    if (e.again) {
      addLog(`${me.name} 獲得再擲一次的機會！`)
      await sleep(600)
      const value = await animateRoll()
      addLog(`${me.name} 再擲出 ${value} 點`)
      await move(p, value)
      if (allowChain) await resolveTile(p, false)
    }
    if (!e.move && !e.toSnack && !e.again) await sleep(400)
  }

  function endTurn(p) {
    const st = S.current
    // 一輪結束（最後一位玩家行動完）且有人跑完指定圈數 → 結算
    if (p === PLAYERS.length - 1 && st.laps.some((l) => l >= LAPS_TO_FINISH)) {
      finish()
      return
    }
    setTurn((p + 1) % PLAYERS.length)
    setBusy(false)
  }

  function finish() {
    const st = S.current
    const ranking = PLAYERS.map((player, i) => ({ player, fish: st.fish[i], index: i })).sort(
      (a, b) => b.fish - a.fish,
    )
    const playerWon = ranking[0].index === 0
    const next = { games: stats.games + 1, wins: stats.wins + (playerWon ? 1 : 0) }
    setStats(next)
    save('adventure', next)
    setResults({ ranking, playerWon })
    setBusy(false)
    setPhase('result')
  }

  // AI 回合自動進行
  useEffect(() => {
    if (phase !== 'playing' || busy) return
    if (PLAYERS[turn].isAI) takeTurn(turn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turn, busy])

  function answerQuiz(i) {
    if (!quiz || quiz.answered !== null) return
    setQuiz({ ...quiz, answered: i })
    setTimeout(() => {
      quiz.resolver(i === quiz.q.answer)
      setQuiz(null)
    }, 1400)
  }

  /* ---------- 畫面 ---------- */
  if (phase === 'ready') {
    return (
      <div className="card-sticker p-8 text-center">
        <ChinchillaCat variant="fluffy" className="mx-auto h-24 w-24" />
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-cocoa-700">
          和布偶貓妞妞、柴犬旺旺來場桌遊大冒險！擲骰前進、抽事件卡、回答金吉拉知識題，
          搶在 {LAPS_TO_FINISH} 圈內收集最多小魚乾 🐟 就獲勝！
        </p>
        {stats.games > 0 && (
          <p className="mt-3 text-sm text-cocoa-500">
            戰績：{stats.games} 場中贏了 <span className="font-black text-honey-600">{stats.wins}</span> 場
          </p>
        )}
        <button onClick={start} className="btn-honey mt-6">
          🎲 開始大冒險！
        </button>
      </div>
    )
  }

  if (phase === 'result') {
    return (
      <div className="card-sticker p-8 text-center">
        <ChinchillaCat
          variant={results.playerWon ? 'ruff' : 'classic'}
          expression={results.playerWon ? 'happy' : 'surprised'}
          className="mx-auto h-24 w-24"
        />
        <p className="mt-3 text-2xl font-black text-cocoa-900">
          {results.playerWon ? '🏆 金吉拉獲勝！' : '差一點就贏了！'}
        </p>
        <div className="mx-auto mt-5 max-w-xs space-y-2">
          {results.ranking.map((r, i) => (
            <div
              key={r.player.id}
              className={`flex items-center justify-between rounded-2xl px-4 py-2.5 ${
                i === 0 ? 'bg-honey-300 font-black' : 'bg-cream-100'
              }`}
            >
              <span>
                {['🥇', '🥈', '🥉'][i]} {r.player.emoji} {r.player.name}
              </span>
              <span className="font-black text-cocoa-900">{r.fish} 🐟</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-cocoa-500">
          戰績：{stats.games} 場中贏了 {stats.wins} 場
        </p>
        <button onClick={start} className="btn-honey mt-5">
          再來一場！
        </button>
      </div>
    )
  }

  /* ---------- 遊戲中 ---------- */
  const current = PLAYERS[turn]
  return (
    <div className="flex flex-col items-center">
      {/* 棋盤 */}
      <div className="relative w-full max-w-md">
        <svg viewBox="0 0 390 390" className="h-auto w-full">
          <rect x="0" y="0" width="390" height="390" rx="20" fill="#fdf6e3" stroke="#e2d0b8" strokeWidth="3" />
          {TILES.map((tile, i) => {
            const { x, y } = tileCoord(i)
            return (
              <g key={i}>
                <rect
                  x={x + 2}
                  y={y + 2}
                  width="56"
                  height="56"
                  rx="10"
                  fill={TILE_COLORS[tile.type]}
                  stroke="#c9ae8c"
                  strokeWidth="1.5"
                />
                <text x={x + 30} y={y + 26} textAnchor="middle" fontSize="17">
                  {tile.emoji}
                </text>
                <text x={x + 30} y={y + 46} textAnchor="middle" fontSize="9.5" fill="#5f4a33" fontWeight="bold">
                  {tile.label}
                  {tile.gain ? ` +${tile.gain}` : ''}
                </text>
              </g>
            )
          })}
          {/* 棋子 */}
          {PLAYERS.map((player, i) => {
            const { x, y } = tileCoord(ui.positions[i])
            const offsets = [
              [17, 43],
              [43, 43],
              [30, 17],
            ]
            const [ox, oy] = offsets[i]
            return (
              <g
                key={player.id}
                style={{ transform: `translate(${x + ox}px, ${y + oy}px)`, transition: 'transform 180ms ease' }}
              >
                <circle r="12" fill={player.color} stroke="#fff" strokeWidth="2.5" />
                <text textAnchor="middle" y="4.5" fontSize="13">
                  {player.emoji}
                </text>
              </g>
            )
          })}
        </svg>

        {/* 中央面板 */}
        <div className="absolute top-1/2 left-1/2 w-[54%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="flex items-center justify-center gap-2">
            <MiniDice n={dice} />
            <div className="text-left text-xs leading-tight">
              <p className="font-black text-cocoa-900">
                {current.emoji} {current.name}
              </p>
              <p className="text-cocoa-500">第 {Math.min((ui.laps[turn] ?? 0) + 1, LAPS_TO_FINISH)} / {LAPS_TO_FINISH} 圈</p>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {PLAYERS.map((player, i) => (
              <div
                key={player.id}
                className={`flex items-center justify-between rounded-full px-2.5 py-0.5 text-[11px] ${
                  i === turn ? 'bg-honey-300 font-black text-cocoa-900' : 'bg-white/70 text-cocoa-700'
                }`}
              >
                <span>
                  {player.emoji} {player.name}
                  {ui.resting[i] ? ' 💤' : ''}
                </span>
                <span className="font-black">{ui.fish[i]} 🐟</span>
              </div>
            ))}
          </div>
          {log[0] && <p className="mt-2 min-h-8 text-[11px] leading-tight text-cocoa-600">{log[0]}</p>}
        </div>
      </div>

      {/* 操作區 */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => takeTurn(0)}
          disabled={busy || rolling || turn !== 0}
          className="btn-honey disabled:opacity-50"
        >
          🎲 {turn === 0 ? '擲骰子！' : '好朋友行動中…'}
        </button>
      </div>

      {/* 事件卡彈窗 */}
      {card && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-cocoa-900/40 p-4">
          <div className="card-sticker w-full max-w-xs p-6 text-center">
            <p className="text-xs font-bold text-cocoa-500">
              {card.player.emoji} {card.player.name} 抽到事件卡
            </p>
            <p className="mt-2 text-5xl">{card.emoji}</p>
            <p className="mt-3 leading-relaxed text-cocoa-800">{card.text}</p>
          </div>
        </div>
      )}

      {/* 答題彈窗（玩家專用） */}
      {quiz && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-cocoa-900/40 p-4">
          <div className="card-sticker w-full max-w-sm p-6">
            <p className="text-center text-xs font-bold text-cocoa-500">💡 機會格：答對 +6 🐟、答錯 +1 🐟</p>
            <h2 className="mt-2 font-bold text-cocoa-900">{quiz.q.question}</h2>
            <div className="mt-4 space-y-2">
              {quiz.q.options.map((opt, i) => {
                let style = 'border-cocoa-200 bg-white hover:border-honey-400'
                if (quiz.answered !== null) {
                  if (i === quiz.q.answer) style = 'border-emerald-500 bg-emerald-50'
                  else if (i === quiz.answered) style = 'border-red-400 bg-red-50'
                  else style = 'border-cocoa-100 opacity-60'
                }
                return (
                  <button
                    key={i}
                    onClick={() => answerQuiz(i)}
                    disabled={quiz.answered !== null}
                    className={`block w-full rounded-2xl border-2 px-4 py-2.5 text-left text-sm font-medium text-cocoa-800 transition-colors ${style}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {quiz.answered !== null && (
              <p className="mt-3 text-center text-sm font-bold text-cocoa-700">
                {quiz.answered === quiz.q.answer ? '答對了！+6 🐟 🎉' : '答錯了，安慰獎 +1 🐟'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
