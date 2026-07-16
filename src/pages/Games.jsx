import { games } from '../data/games'

function GameCard({ game }) {
  const isLive = game.status === 'live'

  return (
    <div
      className={`rounded-2xl border bg-white p-6 ${
        isLive
          ? 'border-stone-200 transition-shadow hover:shadow-md'
          : 'border-dashed border-stone-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <p className="text-4xl">{game.emoji}</p>
        {!isLive && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
            即將登場
          </span>
        )}
      </div>
      <h2 className="mt-3 text-lg font-bold text-stone-800">{game.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{game.summary}</p>
      {/* 遊戲上線後：把這裡換成 <Link to={`/games/${game.id}`}> 開始遊戲按鈕 */}
    </div>
  )
}

export default function Games() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">遊戲樂園</h1>
      <p className="mt-2 text-stone-600">
        和金吉拉一起玩！所有遊戲免下載、免註冊，打開就能玩。
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
