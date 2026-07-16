import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl">🙀</p>
      <h1 className="mt-4 text-2xl font-black text-cocoa-900">找不到這一頁</h1>
      <p className="mt-2 text-cocoa-700">貓咪可能把這一頁藏起來了……</p>
      <Link to="/" className="btn-honey mt-6">
        回首頁
      </Link>
    </div>
  )
}
