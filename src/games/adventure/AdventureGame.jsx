import { useEffect, useRef, useState } from 'react'
import ChinchillaCat from '../../components/ChinchillaCat'
import { load, save } from '../../services/storageService'
import { TILES, PLAYERS, LAPS_TO_FINISH, PASS_START_BONUS, ENCOUNTERS, WAGER, QUIZ_BASE } from './data'
import {
  TILE_COUNT, tileCoord, rollDice, pickQuizQuestion,
  nextSnackIndex, richestOpponent, shuffledEventDeck, findEncounter,
} from './engine'
import { initSound, setMuted, sfx } from './sound'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 節奏時間表（毫秒）：統一放慢，讓每一步都看得清楚
const T = {
  diceSpinCount: 7, // 骰子動畫格數
  diceSpinStep: 130, // 每格顯示時間
  postRoll: 600, // 擲出點數後的停頓
  moveStep: 260, // 每格移動時間
  outcomePause: 1300, // 點心／起點／午睡格結算後的停頓
  cardShow: 2600, // 一般事件卡（無選擇）展示時間
  choiceThink: 1100, // AI 思考選擇卡的時間
  choiceReveal: 1500, // 選擇卡結果展示時間
  postEffect: 600, // 事件卡效果套用後的收尾停頓
  restAnnounce: 1400, // 睡覺跳過回合的提示停頓
  turnGap: 1000, // 換人行動前的停頓
  quizAIThink: 1300, // AI 答題思考時間
  encounterFlavor: 1200, // 相遇事件開場停頓
  encounterReveal: 2000, // 相遇事件結果展示時間
  preMove: 550, // 觸發額外移動前的停頓（衝刺格、事件卡移動效果）
}

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
  const logIdRef = useRef(0)
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
  const [card, setCard] = useState(null) // 事件卡展示（含選擇卡）
  const [quiz, setQuiz] = useState(null) // { stage: 'wager'|'question', q, wagered, canWager, answered, resolver }
  const [encounter, setEncounter] = useState(null)
  const [celebrate, setCelebrate] = useState(null)
  const [results, setResults] = useState(null)
  const [stats, setStats] = useState(() => load('adventure', { games: 0, wins: 0, soundOn: true }))
  const [soundOn, setSoundOn] = useState(() => load('adventure', { games: 0, wins: 0, soundOn: true }).soundOn ?? true)

  useEffect(() => {
    setMuted(!soundOn)
  }, [soundOn])

  function toggleSound() {
    const next = !soundOn
    setSoundOn(next)
    save('adventure', { ...load('adventure', { games: 0, wins: 0 }), soundOn: next })
  }

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
    logIdRef.current += 1
    const id = logIdRef.current
    setLog((prev) => [{ id, text: msg }, ...prev].slice(0, 4))
  }

  function showCelebrate(text) {
    setCelebrate({ text, key: Date.now() })
    setTimeout(() => setCelebrate(null), 1700)
  }

  function drawEventCard() {
    const st = S.current
    if (!st.eventDeck || st.eventDeck.length === 0) st.eventDeck = shuffledEventDeck()
    return st.eventDeck.pop()
  }

  function start() {
    initSound()
    S.current = {
      positions: [0, 0, 0],
      fish: [3, 3, 3],
      laps: [0, 0, 0],
      resting: [false, false, false],
      eventDeck: shuffledEventDeck(),
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
      await sleep(T.restAnnounce)
      endTurn(p)
      return
    }

    const value = await animateRoll()
    addLog(`${me.name} 擲出 ${value} 點`)
    await sleep(T.postRoll)
    await move(p, value)
    await resolveTile(p, true)
    endTurn(p)
  }

  async function animateRoll() {
    setRolling(true)
    for (let i = 0; i < T.diceSpinCount; i++) {
      setDice(rollDice())
      sfx.diceTick()
      await sleep(T.diceSpinStep)
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
      sfx.step()
      if (dir === 1 && st.positions[p] === 0) {
        st.laps[p] += 1
        st.fish[p] += PASS_START_BONUS
        addLog(
          `${PLAYERS[p].name} 回到起點！+${PASS_START_BONUS} 🐟（第 ${Math.min(st.laps[p] + 1, LAPS_TO_FINISH)} 圈）`,
        )
        sfx.lap()
        showCelebrate(`${PLAYERS[p].name} 完成一圈！🎉`)
      }
      sync()
      await sleep(T.moveStep)
    }
  }

  async function resolveTile(p, allowChain) {
    const st = S.current
    const me = PLAYERS[p]

    // 兩位棋子停在同一格（起點除外）→ 觸發相遇事件，取代該格原本效果
    const target = findEncounter(st.positions, p)
    if (target !== -1) {
      await handleEncounter(p, target)
      return
    }

    const tile = TILES[st.positions[p]]

    if (tile.type === 'snack') {
      st.fish[p] += tile.gain
      sfx.snack()
      addLog(`${me.name} 吃到${tile.label}！+${tile.gain} 🐟`)
      sync()
      await sleep(T.outcomePause)
      return
    }
    if (tile.type === 'start') {
      st.fish[p] += 3
      addLog(`${me.name} 正好停在起點，加碼 +3 🐟`)
      sync()
      await sleep(T.outcomePause)
      return
    }
    if (tile.type === 'rest') {
      st.resting[p] = true
      addLog(`${me.name} 躺進午睡格，下回合休息 😴`)
      sync()
      await sleep(T.outcomePause)
      return
    }
    if (tile.type === 'dash') {
      addLog(`${me.name} 踩到衝刺格，往前衝 3 格！💨`)
      await sleep(T.preMove)
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

  /* ---------- 相遇事件（B3） ---------- */
  async function handleEncounter(p, target) {
    const st = S.current
    const enc = ENCOUNTERS[Math.floor(Math.random() * ENCOUNTERS.length)]
    const a = PLAYERS[p].name
    const b = PLAYERS[target].name
    const title = `${a} 遇到 ${b}，${enc.flavor}！`

    sfx.encounter()
    setEncounter({ emoji: enc.emoji, title })
    await sleep(T.encounterFlavor)

    const message = enc.resolve(st, p, target)
    setEncounter({ emoji: enc.emoji, title, message })
    addLog(`🐾 ${a} 與 ${b} 相遇：${message}`)
    sync()
    await sleep(T.encounterReveal)
    setEncounter(null)
  }

  /* ---------- 機會格答題（B1 加注） ---------- */
  async function handleQuiz(p) {
    const st = S.current
    const me = PLAYERS[p]
    const q = pickQuizQuestion()
    let correct
    let wagered = false

    if (me.isAI) {
      addLog(`${me.name} 抽到金吉拉知識題……`)
      await sleep(T.quizAIThink)
      correct = Math.random() < me.accuracy
    } else {
      const canWager = st.fish[p] >= WAGER.cost
      wagered = await new Promise((resolver) => setQuiz({ stage: 'wager', q, canWager, resolver }))
      correct = await new Promise((resolver) => setQuiz({ stage: 'question', q, wagered, answered: null, resolver }))
    }

    const delta = wagered
      ? correct
        ? WAGER.correctFish
        : -WAGER.wrongLoss
      : correct
        ? QUIZ_BASE.correctFish
        : QUIZ_BASE.wrongFish
    st.fish[p] = Math.max(0, st.fish[p] + delta)
    sfx[correct ? 'correct' : 'wrong']()
    addLog(
      correct
        ? `${me.name} 答對了！${wagered ? '加注成功 ' : ''}+${delta} 🐟`
        : `${me.name} 答錯了……${wagered ? `賭注沒了 ${delta} 🐟` : `安慰獎 +${delta} 🐟`}`,
    )
    sync()
    await sleep(T.postEffect)
  }

  function answerWager(wagered) {
    if (!quiz || quiz.stage !== 'wager') return
    if (wagered && !quiz.canWager) return
    quiz.resolver(wagered)
  }

  function answerQuiz(i) {
    if (!quiz || quiz.stage !== 'question' || quiz.answered !== null) return
    setQuiz({ ...quiz, answered: i })
    setTimeout(() => {
      quiz.resolver(i === quiz.q.answer)
      setQuiz(null)
    }, 1400)
  }

  /* ---------- 事件卡（含 B2 選擇卡） ---------- */
  async function handleEvent(p, allowChain) {
    const drawn = drawEventCard()
    sfx.card()
    const effect = await presentEventCard(p, drawn)
    setCard(null)
    await applyCardEffect(p, effect, allowChain)
  }

  async function presentEventCard(p, drawn) {
    const me = PLAYERS[p]
    if (!drawn.choices) {
      setCard({ emoji: drawn.emoji, text: drawn.text, player: me })
      await sleep(T.cardShow)
      return drawn.effect
    }
    if (me.isAI) {
      setCard({ emoji: drawn.emoji, text: drawn.text, player: me, thinking: true })
      await sleep(T.choiceThink)
      const best = drawn.choices.reduce((a, b) => ((b.effect.fish ?? 0) > (a.effect.fish ?? 0) ? b : a))
      setCard({ emoji: drawn.emoji, text: drawn.text, player: me, resultText: best.resultText, chosenLabel: best.label })
      await sleep(T.choiceReveal)
      return best.effect
    }
    const picked = await new Promise((resolver) => {
      setCard({ emoji: drawn.emoji, text: drawn.text, player: me, choices: drawn.choices, resolver })
    })
    setCard({ emoji: drawn.emoji, text: drawn.text, player: me, resultText: picked.resultText, chosenLabel: picked.label })
    await sleep(T.choiceReveal)
    return picked.effect
  }

  async function applyCardEffect(p, e, allowChain) {
    const st = S.current
    const me = PLAYERS[p]
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
      const t = richestOpponent(st.fish, p)
      const taken = Math.min(e.steal, st.fish[t])
      st.fish[t] -= taken
      st.fish[p] += taken
      addLog(`${me.name} 從 ${PLAYERS[t].name} 那裡叼走 ${taken} 🐟`)
    }
    sync()

    if (e.move) {
      await sleep(T.preMove)
      await move(p, e.move)
      if (allowChain) await resolveTile(p, false)
      return
    }
    if (e.toSnack) {
      const targetIdx = nextSnackIndex(st.positions[p])
      const steps = (targetIdx - st.positions[p] + TILE_COUNT) % TILE_COUNT
      await sleep(T.preMove)
      await move(p, steps)
      if (allowChain) await resolveTile(p, false)
      return
    }
    if (e.again) {
      addLog(`${me.name} 獲得再擲一次的機會！`)
      await sleep(T.preMove)
      const value = await animateRoll()
      addLog(`${me.name} 再擲出 ${value} 點`)
      await move(p, value)
      if (allowChain) await resolveTile(p, false)
      return
    }
    await sleep(T.postEffect)
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
    const next = { games: stats.games + 1, wins: stats.wins + (playerWon ? 1 : 0), soundOn }
    setStats(next)
    save('adventure', next)
    setResults({ ranking, playerWon })
    setBusy(false)
    setPhase('result')
    sfx[playerWon ? 'win' : 'lose']()
  }

  // AI 回合自動進行；換人時先停頓一下再開始，避免上一位結果被立刻蓋掉
  useEffect(() => {
    if (phase !== 'playing' || busy) return
    if (!PLAYERS[turn].isAI) return
    let cancelled = false
    ;(async () => {
      await sleep(T.turnGap)
      if (!cancelled) takeTurn(turn)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turn, busy])

  /* ---------- 畫面 ---------- */
  if (phase === 'ready') {
    return (
      <div className="card-sticker p-8 text-center">
        <ChinchillaCat variant="fluffy" className="mx-auto h-24 w-24" />
        <p className="mx-auto mt-4 max-w-sm leading-relaxed text-cocoa-700">
          和布偶貓妞妞、柴犬旺旺來場桌遊大冒險！擲骰前進、抽事件卡、回答金吉拉知識題，
          搶在 {LAPS_TO_FINISH} 圈內收集最多小魚乾 🐟 就獲勝！路上偶爾會遇到好朋友，
          發生意想不到的插曲……
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
      <div className="mb-1 flex w-full max-w-md justify-end">
        <button
          onClick={toggleSound}
          className="rounded-full border-2 border-cocoa-200 bg-white px-3 py-1 text-xs font-bold text-cocoa-700"
          aria-label="音效開關"
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
      </div>

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

        {/* 完成一圈慶祝徽章 */}
        {celebrate && (
          <p
            key={celebrate.key}
            className="absolute top-2 left-1/2 -translate-x-1/2 animate-bounce rounded-full bg-honey-300 px-3 py-1 text-xs font-black whitespace-nowrap text-cocoa-900 shadow"
          >
            {celebrate.text}
          </p>
        )}

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
          <div className="mt-2 min-h-16 space-y-0.5">
            {log.map((entry, i) => (
              <p
                key={entry.id}
                className={`text-[11px] leading-tight ${
                  i === 0 ? 'font-bold text-cocoa-800' : i === 1 ? 'text-cocoa-500' : 'text-cocoa-400'
                }`}
              >
                {entry.text}
              </p>
            ))}
          </div>
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

      {/* 事件卡彈窗（含選擇卡） */}
      {card && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-cocoa-900/40 p-4">
          <div className="card-sticker w-full max-w-xs p-6 text-center">
            <p className="text-xs font-bold text-cocoa-500">
              {card.player.emoji} {card.player.name} 抽到事件卡
            </p>
            <p className="mt-2 text-5xl">{card.emoji}</p>
            <p className="mt-3 leading-relaxed text-cocoa-800">{card.text}</p>
            {card.choices && !card.resultText && (
              <div className="mt-4 space-y-2">
                {card.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => card.resolver(choice)}
                    className="block w-full rounded-2xl border-2 border-cocoa-200 bg-white px-4 py-2.5 text-sm font-medium text-cocoa-800 hover:border-honey-400"
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            )}
            {card.thinking && <p className="mt-3 text-sm text-cocoa-500">思考中…</p>}
            {card.resultText && (
              <p className="mt-3 rounded-2xl bg-cream-100 px-3 py-2 text-sm font-bold text-cocoa-800">
                {card.chosenLabel ? `選擇了「${card.chosenLabel}」→ ` : ''}
                {card.resultText}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 相遇事件彈窗 */}
      {encounter && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-cocoa-900/40 p-4">
          <div className="card-sticker w-full max-w-xs p-6 text-center">
            <p className="text-5xl">{encounter.emoji}</p>
            <p className="mt-3 leading-relaxed text-cocoa-800">{encounter.title}</p>
            {encounter.message && (
              <p className="mt-3 rounded-2xl bg-cream-100 px-3 py-2 text-sm font-bold text-cocoa-800">
                {encounter.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 答題彈窗（玩家專用，含 B1 加注） */}
      {quiz && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-cocoa-900/40 p-4">
          <div className="card-sticker w-full max-w-sm p-6">
            {quiz.stage === 'wager' ? (
              <div className="text-center">
                <p className="text-3xl">💡</p>
                <h2 className="mt-2 font-bold text-cocoa-900">機會來了！要不要加注挑戰？</h2>
                <p className="mt-2 text-sm text-cocoa-600">
                  一般作答：答對 +{QUIZ_BASE.correctFish}、答錯安慰獎 +{QUIZ_BASE.wrongFish}
                </p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => answerWager(false)}
                    className="block w-full rounded-2xl border-2 border-cocoa-200 bg-white px-4 py-2.5 text-sm font-bold text-cocoa-800 hover:border-honey-400"
                  >
                    ☑️ 一般作答
                  </button>
                  <button
                    onClick={() => answerWager(true)}
                    disabled={!quiz.canWager}
                    className="block w-full rounded-2xl border-2 border-honey-500 bg-honey-300 px-4 py-2.5 text-sm font-black text-cocoa-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    🎲 押注挑戰！押 {WAGER.cost} 🐟，對了 +{WAGER.correctFish}、錯了 -{WAGER.wrongLoss}
                  </button>
                  {!quiz.canWager && <p className="text-xs text-cocoa-400">小魚乾不夠，無法押注</p>}
                </div>
              </div>
            ) : (
              <>
                <p className="text-center text-xs font-bold text-cocoa-500">
                  {quiz.wagered
                    ? `🎲 加注中：答對 +${WAGER.correctFish}、答錯 -${WAGER.wrongLoss}`
                    : `💡 一般作答：答對 +${QUIZ_BASE.correctFish}、答錯 +${QUIZ_BASE.wrongFish}`}
                </p>
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
                    {quiz.answered === quiz.q.answer ? '答對了！🎉' : '答錯了 😿'}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
