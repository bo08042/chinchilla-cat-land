import { useState } from 'react'
import { Link } from 'react-router-dom'
import { articles, CATEGORIES } from '../content/articles'

export default function Knowledge() {
  const [category, setCategory] = useState('all')

  const filtered =
    category === 'all' ? articles : articles.filter((a) => a.category === category)

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">認識金吉拉</h1>
      <p className="mt-2 text-stone-600">
        從品種故事到日常照護，這裡整理了金吉拉飼主最需要的知識。
      </p>

      {/* 分類篩選 */}
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {[{ id: 'all', label: '全部' }, ...CATEGORIES].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              category === id
                ? 'bg-emerald-600 font-medium text-white'
                : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          <p className="text-3xl">🐾</p>
          <p className="mt-3">這個分類的文章正在準備中，敬請期待！</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((article) => (
            <Link
              key={article.slug}
              to={`/knowledge/${article.slug}`}
              className="rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-medium text-emerald-700">
                {CATEGORIES.find((c) => c.id === article.category)?.label ?? ''}
              </p>
              <h2 className="mt-1 text-lg font-bold text-stone-800">{article.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
