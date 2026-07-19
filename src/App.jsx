import { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import ChinchillaCat from './components/ChinchillaCat'
import ScrollToTop from './components/ScrollToTop'
import PageMeta from './components/PageMeta'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Knowledge from './pages/Knowledge'
import Article from './pages/Article'
import Games from './pages/Games'
import GamePage from './pages/GamePage'
import Tools from './pages/Tools'
import ToolPage from './pages/ToolPage'
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
            ? 'bg-honey-300 font-bold text-cocoa-900'
            : 'text-cocoa-500 hover:bg-cream-100 hover:text-cocoa-900'
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
    <div className="flex min-h-screen flex-col bg-cream-50 text-cocoa-700">
      <ScrollToTop />
      <PageMeta />

      {/* 懸浮膠囊式導覽島 */}
      <header className="sticky top-0 z-20 px-4 pt-3 pb-1">
        <div className="mx-auto flex max-w-3xl items-center justify-between rounded-full border-2 border-cocoa-200 bg-white/95 py-2 pr-2 pl-5 shadow-[3px_3px_0_0_var(--color-cocoa-100)] backdrop-blur">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-1.5 whitespace-nowrap text-lg font-black text-cocoa-900"
          >
            <ChinchillaCat variant="fluffy" className="h-8 w-8" />
            金吉拉樂園
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
            className="rounded-full p-2 text-cocoa-700 hover:bg-cream-100 sm:hidden"
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
          <nav className="mx-auto mt-2 flex max-w-3xl flex-col gap-1 rounded-3xl border-2 border-cocoa-200 bg-white p-3 text-sm shadow-[3px_3px_0_0_var(--color-cocoa-100)] sm:hidden">
            <NavLinks
              onNavigate={() => setMenuOpen(false)}
              className="rounded-2xl px-3 py-2.5"
            />
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/knowledge/:slug" element={<Article />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:gameId" element={<GamePage />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:toolId" element={<ToolPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="border-t-2 border-cocoa-200 bg-cream-200">
        <div className="mx-auto max-w-5xl space-y-2 px-4 py-6 text-xs text-cocoa-700">
          <p>
            本站內容為飼養知識參考，並非獸醫醫療建議。若貓咪有健康異狀，請諮詢獸醫師。
          </p>
          <div className="flex gap-4">
            <NavLink to="/about" className="font-medium hover:text-cocoa-900 hover:underline">
              關於本站／免責聲明
            </NavLink>
            <NavLink to="/privacy" className="font-medium hover:text-cocoa-900 hover:underline">
              隱私權政策
            </NavLink>
          </div>
          <p>© 2026 金吉拉樂園 Chinchilla Cat Land · Made with 🐾 by Lily Chen</p>
        </div>
      </footer>
    </div>
  )
}
