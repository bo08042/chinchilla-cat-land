import { Link, useParams } from 'react-router-dom'
import NotFound from './NotFound'
import { tools } from '../tools'

export default function ToolPage() {
  const { toolId } = useParams()
  const tool = tools.find((t) => t.id === toolId)

  if (!tool) return <NotFound />

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/tools" className="text-sm font-bold text-honey-600 hover:underline">
        ← 回互動工具
      </Link>
      <h1 className="mt-4 text-center text-2xl font-black text-cocoa-900">
        {tool.emoji} {tool.title}
      </h1>
      <p className="mt-2 text-center text-sm text-cocoa-700">{tool.summary}</p>
      <div className="mt-6">{tool.element}</div>
    </div>
  )
}
