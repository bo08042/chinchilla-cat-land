import { Link } from 'react-router-dom'
import { games } from '../data/games'

function GameCard({ game }) {
  const isLive = game.status === 'live'

  if (!isLive) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-cocoa-300 bg-white/70 p-6">
        <div className="flex items-start justify-between">
          <p className="inline-block rounded-2xl bg-cream-100 p-2.5 text-4xl">{game.emoji}</p>
          <span className="rounded-full bg-honey-300 px-2.5 py-1 text-xs font-bold text-cocoa-900">
            即將登場
          </span>
        </div>
        <h2 className="mt-3 text-lg font-black text-cocoa-900">{game.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-cocoa-700">{game.summary}</p>
      </div>
    )
  }

  return (
    <Link to={`/games/${game.id}`} className="card-sticker card-sticker-hover group p-6">
      <p className="inline-block rounded-2xl bg-cream-100 p-2.5 text-4xl">{game.emoji}</p>
      <h2 className="mt-3 text-lg font-black text-cocoa-900">{game.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-cocoa-700">{game.summary}</p>
      <p className="mt-4 text-sm font-bold text-honey-600 group-hover:underline">開始遊戲 →</p>
    </Link>
  )
}

export default function Games() {
  return (
    <div>
      <h1 className="text-2xl font-black text-cocoa-900">🎮 遊戲樂園</h1>
      <p className="mt-2 text-cocoa-700">
        和金吉拉一起玩！所有遊戲免下載、免註冊，打開就能玩。
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
