import { Link } from 'react-router-dom'
import ChinchillaCat from '../components/ChinchillaCat'
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
    <div className="space-y-14">
      {/* Hero：插畫樂園感 */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-cocoa-200 bg-gradient-to-br from-cream-100 via-honey-300/35 to-cream-200 px-6 py-16 text-center shadow-[6px_6px_0_0_var(--color-honey-300)] sm:py-20">
        {/* 裝飾圓點與貓掌 */}
        <div aria-hidden="true">
          <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-honey-300/50" />
          <div className="absolute -right-16 -bottom-16 h-52 w-52 rounded-full bg-honey-400/30" />
          <div className="absolute top-8 right-10 hidden rotate-12 text-3xl sm:block">🐾</div>
          <div className="absolute bottom-10 left-10 hidden -rotate-12 text-2xl sm:block">🐾</div>
          <div className="absolute top-1/2 left-6 hidden text-xl opacity-60 sm:block">✨</div>
        </div>

        <div className="relative">
          <ChinchillaCat className="mx-auto h-28 w-28 drop-shadow-sm sm:h-36 sm:w-36" />
          <h1 className="mt-5 text-3xl font-black text-cocoa-900 sm:text-5xl">
            歡迎來到金吉拉樂園
          </h1>
          <p className="mt-3 text-sm font-bold tracking-widest text-cocoa-500 uppercase">
            Chinchilla Cat Land
          </p>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cocoa-700">
            這裡是專屬金吉拉貓的小天地——認識這位擁有銀白毛髮與綠寶石眼睛的優雅貴族，
            學會怎麼照顧牠，再到遊戲樂園陪牠玩一場。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/knowledge" className="btn-honey">
              開始認識金吉拉
            </Link>
            <Link to="/games" className="btn-outline">
              🎮 遊戲樂園
            </Link>
          </div>
        </div>
      </section>

      {/* 三大區塊導覽 */}
      <section className="grid gap-5 sm:grid-cols-3">
        {sections.map(({ to, emoji, title, text, cta }) => (
          <Link key={to} to={to} className="card-sticker card-sticker-hover group p-6">
            <p className="inline-block rounded-2xl bg-cream-100 p-3 text-3xl">{emoji}</p>
            <h2 className="mt-3 text-lg font-black text-cocoa-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cocoa-700">{text}</p>
            <p className="mt-4 text-sm font-bold text-honey-600 group-hover:underline">
              {cta} →
            </p>
          </Link>
        ))}
      </section>

      {/* 最新文章 */}
      {latestArticles.length > 0 && (
        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-xl font-black text-cocoa-900">📰 最新文章</h2>
            <Link
              to="/knowledge"
              className="text-sm font-bold text-honey-600 hover:underline"
            >
              全部文章 →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {latestArticles.map((article) => (
              <Link
                key={article.slug}
                to={`/knowledge/${article.slug}`}
                className="card-sticker card-sticker-hover p-5"
              >
                <h3 className="font-bold text-cocoa-900">{article.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-cocoa-700">
                  {article.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 已上線遊戲；Wave 1 遊戲上線前顯示預告 */}
      <section>
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-xl font-black text-cocoa-900">
            {liveGames.length > 0 ? '🔥 熱門遊戲' : '🎪 遊戲搶先看'}
          </h2>
          <Link to="/games" className="text-sm font-bold text-honey-600 hover:underline">
            所有遊戲 →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-4">
          {(liveGames.length > 0 ? liveGames : games.filter((g) => g.wave === 1)).map(
            (game) => (
              <div key={game.id} className="card-sticker p-5 text-center">
                <p className="text-3xl">{game.emoji}</p>
                <h3 className="mt-2 font-bold text-cocoa-900">{game.title}</h3>
                {game.status !== 'live' && (
                  <p className="mt-2 inline-block rounded-full bg-honey-300 px-2.5 py-0.5 text-xs font-bold text-cocoa-900">
                    即將登場
                  </p>
                )}
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  )
}
