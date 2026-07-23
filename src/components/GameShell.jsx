import { useState } from 'react'
import { Link } from 'react-router-dom'

// 所有遊戲共用的外框：返回列表、標題、玩法說明彈窗。
// 遊戲內容（含重玩、計分）由 children 自行管理。
export default function GameShell({ title, emoji, instructions, children }) {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <Link to="/games" className="text-sm font-bold text-honey-600 hover:underline">
          ← 回遊戲樂園
        </Link>
        <button
          onClick={() => setShowHelp(true)}
          className="rounded-full border-2 border-cocoa-200 bg-white px-3 py-1 text-sm font-bold text-cocoa-700 hover:border-honey-400"
        >
          ❓ 玩法說明
        </button>
      </div>

      <h1 className="mt-2 text-center text-xl font-black text-cocoa-900 sm:mt-4 sm:text-2xl">
        {emoji} {title}
      </h1>

      <div className="mt-3 game-no-callout sm:mt-6">{children}</div>

      {/* 玩法說明彈窗 */}
      {showHelp && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-cocoa-900/40 p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="card-sticker w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-black text-cocoa-900">玩法說明</h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-cocoa-700">
              {instructions}
            </div>
            <button onClick={() => setShowHelp(false)} className="btn-honey mt-5 w-full">
              知道了！
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
