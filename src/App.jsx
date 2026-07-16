import { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import PageMeta from './components/PageMeta'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Knowledge from './pages/Knowledge'
import Article from './pages/Article'
import Games from './pages/Games'
import Tools from './pages/Tools'
import About from './pages/About'
import Privacy from './pages/Privacy'

const navItems = [
  { to: '/', label: '首頁' },
  { to: '/knowledge', label: '認識金吉拉' },
  { to: '/games', label: '遊戲樂園' },
  { to: '/tools', label: '互動工具' },
]

function NavLinks({ onNavigate, className }) {
  return navItems.map(({ to, label }) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${className} transition-colors ${
          isActive
            ? 'bg-emerald-100 font-medium text-emerald-800'
            : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
        }`
      }
    >
      {label}
    </NavLink>
  ))
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-cream-50 text-stone-800">
      <ScrollToTop />
      <PageMeta />
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="whitespace-nowrap text-lg font-bold text-emerald-700"
          >
            🐱 金吉拉樂園{' '}
            <span className="hidden text-sm font-normal text-stone-400 sm:inline">
              Chinchilla Cat Land
            </span>
          </NavLink>

          {/* 桌面版導覽 */}
          <nav className="hidden gap-1 text-sm sm:flex">
            <NavLinks className="rounded-full px-3 py-1.5" />
          </nav>

          {/* 手機版漢堡按鈕 */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? '關閉選單' : '開啟選單'}
            aria-expanded={menuOpen}
            className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 sm:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </>
              ) : (
                <>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* 手機版展開選單 */}
        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-stone-100 px-4 py-3 text-sm sm:hidden">
            <NavLinks
              onNavigate={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5"
            />
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/knowledge/:slug" element={<Article />} />
          <Route path="/games" element={<Games />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl space-y-2 px-4 py-6 text-xs text-stone-500">
          <p>
            本站內容為飼養知識參考，並非獸醫醫療建議。若貓咪有健康異狀，請諮詢獸醫師。
          </p>
          <div className="flex gap-4">
            <NavLink to="/about" className="hover:text-stone-800">
              關於本站／免責聲明
            </NavLink>
            <NavLink to="/privacy" className="hover:text-stone-800">
              隱私權政策
            </NavLink>
          </div>
          <p>© 2026 金吉拉樂園 Chinchilla Cat Land</p>
        </div>
      </footer>
    </div>
  )
}
