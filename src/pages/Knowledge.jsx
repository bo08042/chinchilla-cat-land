import { useState } from 'react'
import { Link } from 'react-router-dom'
import { articles, CATEGORIES } from '../content/articles'

export default function Knowledge() {
  const [category, setCategory] = useState('all')

  const filtered =
    category === 'all' ? articles : articles.filter((a) => a.category === category)

  return (
    <div>
      <h1 className="text-2xl font-black text-cocoa-900">📖 認識金吉拉</h1>
      <p className="mt-2 text-cocoa-700">
        從品種故事到日常照護，這裡整理了金吉拉飼主最需要的知識。
      </p>

      {/* 分類篩選 */}
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {[{ id: 'all', label: '全部' }, ...CATEGORIES].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
              category === id
                ? 'bg-honey-400 font-bold text-cocoa-900 shadow-[2px_2px_0_0_var(--color-honey-600)]'
                : 'border-2 border-cocoa-200 bg-white text-cocoa-500 hover:bg-cream-100 hover:text-cocoa-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-cocoa-300 bg-white/70 p-10 text-center text-cocoa-500">
          <p className="text-3xl">🐾</p>
          <p className="mt-3">這個分類的文章正在準備中，敬請期待！</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {filtered.map((article) => (
            <Link
              key={article.slug}
              to={`/knowledge/${article.slug}`}
              className="card-sticker card-sticker-hover p-5"
            >
              <p className="text-xs font-bold text-emerald-700">
                {CATEGORIES.find((c) => c.id === article.category)?.label ?? ''}
              </p>
              <h2 className="mt-1 text-lg font-bold text-cocoa-900">{article.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-cocoa-700">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
