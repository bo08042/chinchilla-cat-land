import { useEffect, useRef, useState } from 'react'
import { load, save } from '../../services/storageService'
import { hideAndSeekLevels } from './levels'

export default function HideAndSeekGame() {
  const [progress, setProgress] = useState(() => load('hideAndSeek', { unlocked: 1, bestTimes: {} }))
  const [levelId, setLevelId] = useState(null) // null = 關卡選擇
  const [phase, setPhase] = useState('select') // select | playing | won | lost
  const [found, setFound] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(0)
  const [hintId, setHintId] = useState(null)
  const [hintUsed, setHintUsed] = useState(false)
  const [penaltyFlash, setPenaltyFlash] = useState(0)
  const timerRef = useRef(null)

  const level = hideAndSeekLevels.find((l) => l.id === levelId)

  // 支援 #/games/hide-and-seek?level=N 深連結直接開局（需已解鎖）
  useEffect(() => {
    const query = window.location.hash.split('?')[1]
    const wanted = Number(new URLSearchParams(query).get('level'))
    if (wanted && wanted <= progress.unlocked && hideAndSeekLevels.some((l) => l.id === wanted)) {
      start(wanted)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 倒數計時
  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setPhase('lost')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  function start(id) {
    const lv = hideAndSeekLevels.find((l) => l.id === id)
    setLevelId(id)
    setFound(new Set())
    setTimeLeft(lv.timeLimit)
    setHintId(null)
    setHintUsed(false)
    setPhase('playing')
  }

  function onCat(catId) {
    if (phase !== 'playing' || found.has(catId)) return
    const next = new Set(found)
    next.add(catId)
    setFound(next)
    if (catId === hintId) setHintId(null)
    if (next.size === level.cats.length) {
      clearInterval(timerRef.current)
      // 記錄用時與解鎖
      const used = level.timeLimit - timeLeft
      const best = progress.bestTimes[levelId]
      const newProgress = {
        unlocked: Math.max(progress.unlocked, levelId + 1),
        bestTimes: {
          ...progress.bestTimes,
          [levelId]: best === undefined ? used : Math.min(best, used),
        },
      }
      setProgress(newProgress)
      save('hideAndSeek', newProgress)
      setPhase('won')
    }
  }

  // 點到背景：扣 3 秒
  function onMiss() {
    if (phase !== 'playing') return
    setTimeLeft((t) => Math.max(1, t - 3))
    setPenaltyFlash(Date.now())
  }

  function useHint() {
    if (hintUsed || phase !== 'playing') return
    const unfound = level.cats.filter((c) => !found.has(c))
    if (unfound.length === 0) return
    setHintId(unfound[Math.floor(Math.random() * unfound.length)])
    setHintUsed(true)
  }

  /* ---------- 關卡選擇 ---------- */
  if (phase === 'select') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {hideAndSeekLevels.map((lv) => {
          const locked = lv.id > progress.unlocked
          const best = progress.bestTimes[lv.id]
          return (
            <button
              key={lv.id}
              disabled={locked}
              onClick={() => start(lv.id)}
              className={
                locked
                  ? 'rounded-3xl border-2 border-dashed border-cocoa-300 bg-white/70 p-6 text-left opacity-70'
                  : 'card-sticker card-sticker-hover p-6 text-left'
              }
            >
              <p className="text-3xl">{locked ? '🔒' : lv.emoji}</p>
              <h2 className="mt-2 text-lg font-black text-cocoa-900">
                第 {lv.id} 關：{lv.name}
              </h2>
              <p className="mt-1 text-sm text-cocoa-700">
                {locked
                  ? '完成上一關解鎖'
                  : `找出 ${lv.cats.length} 隻貓咪，限時 ${lv.timeLimit} 秒`}
              </p>
              {best !== undefined && (
                <p className="mt-1 text-xs font-bold text-honey-600">🏆 最快紀錄：{best} 秒</p>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  /* ---------- 遊戲中 / 結束 ---------- */
  const Scene = level.Scene
  return (
    <div>
      {/* 狀態列 */}
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-black text-cocoa-900 ring-2 ring-cocoa-200">
          🐱 {found.size} / {level.cats.length}
        </span>
        <span
          key={penaltyFlash}
          className={`rounded-full px-4 py-1.5 text-sm font-black ring-2 ${
            timeLeft <= 10
              ? 'animate-pulse bg-red-50 text-red-500 ring-red-300'
              : 'bg-white text-cocoa-900 ring-cocoa-200'
          }`}
        >
          ⏱️ {timeLeft} 秒
        </span>
        <button
          onClick={useHint}
          disabled={hintUsed}
          className="rounded-full border-2 border-cocoa-200 bg-white px-4 py-1.5 text-sm font-bold text-cocoa-700 hover:border-honey-400 disabled:opacity-50"
        >
          💡 提示{hintUsed ? '（已用）' : ''}
        </button>
      </div>

      {/* 場景（點到背景扣秒數） */}
      <div className="card-sticker overflow-hidden p-2" onClick={onMiss}>
        <Scene found={found} onCat={onCat} hintId={hintId} />
      </div>
      {hintId && (
        <p className="mt-2 text-center text-sm font-bold text-honey-600">
          💡 {level.hints[hintId]}
        </p>
      )}
      <p className="mt-2 text-center text-xs text-cocoa-500">點錯地方會扣 3 秒，睜大眼睛！</p>

      {/* 結果彈窗 */}
      {(phase === 'won' || phase === 'lost') && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-cocoa-900/40 p-4">
          <div className="card-sticker w-full max-w-sm p-8 text-center">
            {phase === 'won' ? (
              <>
                <p className="text-5xl">🎉</p>
                <h2 className="mt-3 text-2xl font-black text-cocoa-900">全部找到了！</h2>
                <p className="mt-2 text-cocoa-700">
                  用時 <span className="font-black text-honey-600">{level.timeLimit - timeLeft} 秒</span>
                  {progress.bestTimes[levelId] === level.timeLimit - timeLeft && ' 🏆 新紀錄！'}
                </p>
                {levelId < hideAndSeekLevels.length && (
                  <p className="mt-1 text-sm font-bold text-emerald-700">已解鎖下一關！</p>
                )}
              </>
            ) : (
              <>
                <p className="text-5xl">😿</p>
                <h2 className="mt-3 text-2xl font-black text-cocoa-900">時間到！</h2>
                <p className="mt-2 text-cocoa-700">
                  還有 {level.cats.length - found.size} 隻貓咪沒找到，再試一次吧！
                </p>
              </>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => start(levelId)} className="btn-honey">
                {phase === 'won' ? '再玩一次' : '重新挑戰'}
              </button>
              {phase === 'won' && levelId < hideAndSeekLevels.length ? (
                <button onClick={() => start(levelId + 1)} className="btn-outline">
                  下一關 →
                </button>
              ) : (
                <button onClick={() => setPhase('select')} className="btn-outline">
                  回關卡選擇
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
