import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// SPA 切換路由時瀏覽器不會自動回到頁面頂部，
// 這裡監聽路徑變化，在每次切頁時捲回最上方。
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return null
}
