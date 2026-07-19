import { Link } from 'react-router-dom'
import { tools } from '../tools'

export default function Tools() {
  return (
    <div>
      <h1 className="text-2xl font-black text-cocoa-900">🧮 互動工具</h1>
      <p className="mt-2 text-cocoa-700">養貓路上的實用小工具，全部在瀏覽器裡完成。</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={`/tools/${tool.id}`}
            className="card-sticker card-sticker-hover group p-6"
          >
            <p className="inline-block rounded-2xl bg-cream-100 p-2.5 text-4xl">{tool.emoji}</p>
            <h2 className="mt-3 text-lg font-black text-cocoa-900">{tool.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cocoa-700">{tool.summary}</p>
            <p className="mt-4 text-sm font-bold text-honey-600 group-hover:underline">
              開始使用 →
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
