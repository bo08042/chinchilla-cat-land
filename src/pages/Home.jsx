import { Link } from 'react-router-dom'
import { articles } from '../content/articles'
import { games } from '../data/games'

const sections = [
  {
    to: '/knowledge',
    emoji: '📖',
    title: '認識金吉拉',
    text: '品種故事、飼養建議到健康管理，新手與資深飼主都能找到需要的知識。',
    cta: '進入知識庫',
  },
  {
    to: '/games',
    emoji: '🎮',
    title: '遊戲樂園',
    text: '知識測驗、每日運勢、躲貓貓……一邊玩一邊變成金吉拉專家。',
    cta: '去玩遊戲',
  },
  {
    to: '/tools',
    emoji: '🧮',
    title: '互動工具',
    text: '飼養花費試算、貓咪年齡換算、取名產生器，養貓大小事一鍵搞定。',
    cta: '使用工具',
  },
]

export default function Home() {
  const latestArticles = articles.slice(0, 3)
  const liveGames = games.filter((g) => g.status === 'live')

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-50 via-cream-100 to-amber-50 px-6 py-14 text-center sm:py-20">
        <p className="text-5xl sm:text-6xl">🐱</p>
        <h1 className="mt-4 text-3xl font-black text-stone-800 sm:text-4xl">
          歡迎來到<span className="text-emerald-700">金吉拉樂園</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-stone-600">
          這裡是專屬金吉拉貓的小天地——認識這位擁有銀白毛髮與綠寶石眼睛的優雅貴族，
          學會怎麼照顧牠，再到遊戲樂園陪牠玩一場。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/knowledge"
            className="rounded-full bg-emerald-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700"
          >
            開始認識金吉拉
          </Link>
          <Link
            to="/games"
            className="rounded-full border border-amber-300 bg-white px-6 py-2.5 font-medium text-amber-700 transition-colors hover:bg-amber-50"
          >
            🎮 遊戲樂園
          </Link>
        </div>
      </section>

      {/* 三大區塊導覽 */}
      <section className="grid gap-4 sm:grid-cols-3">
        {sections.map(({ to, emoji, title, text, cta }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <p className="text-3xl">{emoji}</p>
            <h2 className="mt-3 text-lg font-bold text-stone-800">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{text}</p>
            <p className="mt-4 text-sm font-medium text-emerald-700 group-hover:underline">
              {cta} →
            </p>
          </Link>
        ))}
      </section>

      {/* 最新文章 */}
      {latestArticles.length > 0 && (
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-stone-800">最新文章</h2>
            <Link to="/knowledge" className="text-sm text-emerald-700 hover:underline">
              全部文章 →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {latestArticles.map((article) => (
              <Link
                key={article.slug}
                to={`/knowledge/${article.slug}`}
                className="rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="font-bold text-stone-800">{article.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-stone-600">
                  {article.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 已上線遊戲；Wave 1 遊戲上線前顯示預告 */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-stone-800">
            {liveGames.length > 0 ? '熱門遊戲' : '遊戲搶先看'}
          </h2>
          <Link to="/games" className="text-sm text-emerald-700 hover:underline">
            所有遊戲 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          {(liveGames.length > 0 ? liveGames : games.filter((g) => g.wave === 1)).map(
            (game) => (
              <div
                key={game.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 text-center"
              >
                <p className="text-3xl">{game.emoji}</p>
                <h3 className="mt-2 font-bold text-stone-800">{game.title}</h3>
                {game.status !== 'live' && (
                  <p className="mt-1 text-xs text-amber-600">即將登場</p>
                )}
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  )
}
