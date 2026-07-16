import { Link, useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getArticle, CATEGORIES } from '../content/articles'
import NotFound from './NotFound'

export default function Article() {
  const { slug } = useParams()
  const article = getArticle(slug)

  if (!article) return <NotFound />

  const categoryLabel = CATEGORIES.find((c) => c.id === article.category)?.label

  return (
    <article className="mx-auto max-w-2xl">
      <Link to="/knowledge" className="text-sm text-emerald-700 hover:underline">
        ← 回知識庫
      </Link>
      <header className="mt-4">
        {categoryLabel && (
          <p className="text-sm font-medium text-emerald-700">{categoryLabel}</p>
        )}
        <h1 className="mt-1 text-3xl font-bold text-stone-800">{article.title}</h1>
        {article.updated && (
          <p className="mt-2 text-sm text-stone-400">最後更新：{article.updated}</p>
        )}
      </header>
      <div className="prose prose-stone mt-8 max-w-none">
        <Markdown remarkPlugins={[remarkGfm]}>{article.body}</Markdown>
      </div>
      <footer className="mt-10 rounded-xl bg-stone-100 p-4 text-sm text-stone-500">
        本文為飼養知識參考，並非獸醫醫療建議。若貓咪有健康異狀，請諮詢獸醫師。
      </footer>
    </article>
  )
}
