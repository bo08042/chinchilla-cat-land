import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getMeta } from '../seo'

// 切換路由時更新 title 與 meta description
export default function PageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = getMeta(pathname)
    document.title = meta.title

    let el = document.querySelector('meta[name="description"]')
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', 'description')
      document.head.appendChild(el)
    }
    el.setAttribute('content', meta.description)
  }, [pathname])

  return null
}
