import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl">🙀</p>
      <h1 className="mt-4 text-2xl font-bold text-stone-800">找不到這一頁</h1>
      <p className="mt-2 text-stone-600">貓咪可能把這一頁藏起來了……</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-emerald-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700"
      >
        回首頁
      </Link>
    </div>
  )
}
