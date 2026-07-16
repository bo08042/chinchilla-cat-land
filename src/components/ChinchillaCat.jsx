// 金吉拉吉祥物 SVG：銀白蓬鬆毛（雲朵狀輪廓＋銀色毛尖描邊）、
// 綠寶石大眼睛、天生黑眼線、磚紅小鼻，全站共用以維持視覺一致。
// expression: 'happy'（預設）| 'surprised'（404 等驚訝場景用）

export default function ChinchillaCat({ className = '', expression = 'happy' }) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="金吉拉貓"
      className={className}
    >
      {/* 耳朵 */}
      <g stroke="#cfc4b6" strokeWidth="3" strokeLinejoin="round">
        <polygon points="24,46 31,9 54,27" fill="#fff" />
        <polygon points="96,46 89,9 66,27" fill="#fff" />
      </g>
      <polygon points="31,38 34,19 46,28" fill="#f4c7c3" />
      <polygon points="89,38 86,19 74,28" fill="#f4c7c3" />

      {/* 蓬鬆臉頰：外圈毛球 + 主圓蓋住內側線條 */}
      <g fill="#fff" stroke="#cfc4b6" strokeWidth="3">
        <circle cx="95" cy="64" r="14" />
        <circle cx="88" cy="88" r="14" />
        <circle cx="68" cy="99" r="14" />
        <circle cx="46" cy="98" r="14" />
        <circle cx="30" cy="83" r="14" />
        <circle cx="25" cy="60" r="14" />
        <circle cx="36" cy="41" r="14" />
        <circle cx="60" cy="33" r="15" />
        <circle cx="84" cy="41" r="14" />
      </g>
      <circle cx="60" cy="66" r="37" fill="#fff" />

      {/* 銀色毛尖：臉緣幾筆淡灰短線 */}
      <g stroke="#ded5c8" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M40 36 q2 -4 5 -5" />
        <path d="M76 34 q3 1 5 4" />
        <path d="M27 72 q-2 3 -1 6" />
        <path d="M93 70 q2 3 1 6" />
      </g>

      {/* 腮紅 */}
      <circle cx="36" cy="76" r="5.5" fill="#f7d4c4" opacity="0.85" />
      <circle cx="84" cy="76" r="5.5" fill="#f7d4c4" opacity="0.85" />

      {/* 眼睛：綠寶石色 + 黑眼線 */}
      {expression === 'surprised' ? (
        <g>
          <circle cx="45" cy="62" r="9.5" fill="#2f9e77" stroke="#2b2018" strokeWidth="2.5" />
          <circle cx="75" cy="62" r="9.5" fill="#2f9e77" stroke="#2b2018" strokeWidth="2.5" />
          <circle cx="45" cy="62" r="4" fill="#1f1710" />
          <circle cx="75" cy="62" r="4" fill="#1f1710" />
        </g>
      ) : (
        <g>
          <ellipse cx="45" cy="62" rx="8.5" ry="9.5" fill="#2f9e77" stroke="#2b2018" strokeWidth="2.5" />
          <ellipse cx="75" cy="62" rx="8.5" ry="9.5" fill="#2f9e77" stroke="#2b2018" strokeWidth="2.5" />
          <ellipse cx="45" cy="63" rx="3.2" ry="5.2" fill="#1f1710" />
          <ellipse cx="75" cy="63" rx="3.2" ry="5.2" fill="#1f1710" />
        </g>
      )}
      <circle cx="42.5" cy="59" r="2" fill="#fff" />
      <circle cx="72.5" cy="59" r="2" fill="#fff" />

      {/* 鼻子與嘴 */}
      <path d="M56.5 76.5 h7 l-3.5 4.5 z" fill="#b8574a" stroke="#a34a3e" strokeWidth="1" strokeLinejoin="round" />
      {expression === 'surprised' ? (
        <ellipse cx="60" cy="87" rx="3.5" ry="4.5" fill="#6b5747" />
      ) : (
        <g stroke="#6b5747" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M60 81 v4" />
          <path d="M60 85 q-4 4 -8 1" />
          <path d="M60 85 q4 4 8 1" />
        </g>
      )}

      {/* 鬍鬚 */}
      <g stroke="#c9bfae" strokeWidth="1.5" strokeLinecap="round">
        <line x1="26" y1="68" x2="9" y2="64" />
        <line x1="26" y1="76" x2="10" y2="78" />
        <line x1="94" y1="68" x2="111" y2="64" />
        <line x1="94" y1="76" x2="110" y2="78" />
      </g>
    </svg>
  )
}
