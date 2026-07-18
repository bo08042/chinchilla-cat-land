import { useState } from 'react'
import { Link } from 'react-router-dom'
import ChinchillaCat from '../../components/ChinchillaCat'
import { load, save } from '../../services/storageService'
import { buildRound, scoreOf, rankOf } from './engine'
import { banks } from './banks'
import { articles } from '../../content/articles'

// 共用測驗元件：bankId 決定題庫（master / careExam）
export default function QuizGame({ bankId }) {
  const bank = banks[bankId]
  const [phase, setPhase] = useState('intro') // intro | playing | result
  const [round, setRound] = useState([])
  const [current, setCurrent] = useState(0)
  const [picked, setPicked] = useState(null) // 本題已選的選項索引
  const [answers, setAnswers] = useState([]) // { question, pickedIndex, correct }
  const stats = load('quiz', {})[bankId] ?? { best: 0, attempts: 0 }

  function start() {
    setRound(buildRound(bank))
    setCurrent(0)
    setPicked(null)
    setAnswers([])
    setPhase('playing')
  }

  function pick(i) {
    if (picked !== null) return // 已作答，等待下一題
    setPicked(i)
    setAnswers((a) => [...a, { question: round[current], pickedIndex: i, correct: i === round[current].answer }])
  }

  function next() {
    if (current + 1 < round.length) {
      setCurrent(current + 1)
      setPicked(null)
    } else {
      // 結算並更新最佳成績
      const correctCount = answers.filter((a) => a.correct).length
      const score = scoreOf(correctCount, round.length)
      const all = load('quiz', {})
      const prev = all[bankId] ?? { best: 0, attempts: 0 }
      save('quiz', {
        ...all,
        [bankId]: { best: Math.max(prev.best, score), attempts: prev.attempts + 1 },
      })
      setPhase('result')
    }
  }

  if (phase === 'intro') {
    return (
      <div className="card-sticker p-8 text-center">
        <ChinchillaCat variant="fluffy" className="mx-auto h-28 w-28" />
        <p className="mt-4 text-cocoa-700">
          共 {bank.questionsPerRound} 題單選，每輪隨機出題。答完立即看解說，錯的題目會附上複習文章！
        </p>
        {stats.attempts > 0 && (
          <p className="mt-3 text-sm text-cocoa-500">
            歷史最佳：<span className="font-black text-honey-600">{stats.best} 分</span>（已挑戰 {stats.attempts} 次）
          </p>
        )}
        <button onClick={start} className="btn-honey mt-6">
          開始挑戰！
        </button>
      </div>
    )
  }

  if (phase === 'playing') {
    const q = round[current]
    return (
      <div className="card-sticker p-6">
        <div className="flex items-center justify-between text-sm text-cocoa-500">
          <span className="font-bold">
            第 {current + 1} / {round.length} 題
          </span>
          <span>答對 {answers.filter((a) => a.correct).length} 題</span>
        </div>
        {/* 進度條 */}
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-100">
          <div
            className="h-full rounded-full bg-honey-400 transition-all"
            style={{ width: `${((current + (picked !== null ? 1 : 0)) / round.length) * 100}%` }}
          />
        </div>

        <h2 className="mt-5 text-lg font-bold text-cocoa-900">{q.question}</h2>

        <div className="mt-4 space-y-2">
          {q.options.map((opt, i) => {
            let style = 'border-cocoa-200 bg-white hover:border-honey-400'
            if (picked !== null) {
              if (i === q.answer) style = 'border-emerald-500 bg-emerald-50'
              else if (i === picked) style = 'border-red-400 bg-red-50'
              else style = 'border-cocoa-100 bg-white opacity-60'
            }
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={`block w-full rounded-2xl border-2 px-4 py-3 text-left font-medium text-cocoa-800 transition-colors ${style}`}
              >
                {opt}
                {picked !== null && i === q.answer && ' ✅'}
                {picked !== null && i === picked && i !== q.answer && ' ❌'}
              </button>
            )
          })}
        </div>

        {/* 即時解說 */}
        {picked !== null && (
          <div className="mt-4 rounded-2xl bg-cream-100 p-4 text-sm leading-relaxed text-cocoa-700">
            <p className="font-bold text-cocoa-900">{picked === q.answer ? '答對了！🎉' : '答錯了 😿'}</p>
            <p className="mt-1">{q.explanation}</p>
          </div>
        )}

        {picked !== null && (
          <button onClick={next} className="btn-honey mt-4 w-full">
            {current + 1 < round.length ? '下一題 →' : '看成績！'}
          </button>
        )}
      </div>
    )
  }

  // result
  const correctCount = answers.filter((a) => a.correct).length
  const score = scoreOf(correctCount, round.length)
  const rank = rankOf(bank, score)
  const wrong = answers.filter((a) => !a.correct)
  const isNewBest = score >= load('quiz', {})[bankId]?.best

  return (
    <div className="space-y-5">
      <div className="card-sticker p-8 text-center">
        <p className="text-5xl">{rank.emoji}</p>
        <p className="mt-3 text-4xl font-black text-honey-600">{score} 分</p>
        {isNewBest && score > 0 && (
          <p className="mt-1 text-xs font-bold text-emerald-700">🏆 個人最佳紀錄！</p>
        )}
        <p className="mt-2 text-xl font-black text-cocoa-900">{rank.title}</p>
        <p className="mt-2 text-sm text-cocoa-700">{rank.comment}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={start} className="btn-honey">
            再挑戰一輪
          </button>
          <Link to="/knowledge" className="btn-outline">
            去知識庫進修
          </Link>
        </div>
      </div>

      {/* 錯題複習 */}
      {wrong.length > 0 && (
        <div className="card-sticker p-6">
          <h2 className="font-black text-cocoa-900">📝 錯題複習（{wrong.length} 題）</h2>
          <div className="mt-4 space-y-4">
            {wrong.map(({ question: q, pickedIndex }, i) => {
              const article = articles.find((a) => a.slug === q.articleSlug)
              return (
                <div key={i} className="rounded-2xl bg-cream-100 p-4 text-sm">
                  <p className="font-bold text-cocoa-900">{q.question}</p>
                  <p className="mt-1 text-red-500">你的答案：{q.options[pickedIndex]}</p>
                  <p className="text-emerald-700">正確答案：{q.options[q.answer]}</p>
                  <p className="mt-1 text-cocoa-700">{q.explanation}</p>
                  {article && (
                    <Link
                      to={`/knowledge/${article.slug}`}
                      className="mt-1 inline-block font-bold text-honey-600 hover:underline"
                    >
                      複習：{article.title} →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
