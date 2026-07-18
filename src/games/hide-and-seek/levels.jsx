import ChinchillaCat from '../../components/ChinchillaCat'

// 躲貓貓關卡：每關一個 SVG 場景元件 + 藏貓清單。
// 場景元件收 { found, onCat, hintId }：
//   found: Set（已找到的貓 id）
//   onCat(id): 點到貓
//   hintId: 提示中的貓 id（畫閃爍圈）
// 藏貓做法：先畫完整/局部貓咪，再畫家具遮擋，最後放透明加大點擊圈（蓋在遮擋物上，
// 所以露出的耳朵尾巴附近都點得到）。

// 點擊圈 + 找到/提示標記
function CatHit({ id, cx, cy, r, found, onCat, hintId }) {
  return (
    <g>
      {hintId === id && !found.has(id) && (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0b429" strokeWidth="3" className="animate-ping" style={{ transformOrigin: `${cx}px ${cy}px` }} />
      )}
      {found.has(id) && (
        <g>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#10b981" strokeWidth="3" />
          <text x={cx + r - 6} y={cy - r + 10} fontSize="14">✅</text>
        </g>
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="transparent"
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation()
          onCat(id)
        }}
      />
    </g>
  )
}

// 蓬鬆尾巴（從上往下垂）
function Tail({ x, y }) {
  return (
    <g fill="#fff" stroke="#cfc4b6" strokeWidth="2">
      <circle cx={x} cy={y} r="7" />
      <circle cx={x + 1} cy={y + 11} r="6" />
      <circle cx={x - 1} cy={y + 20} r="5" />
    </g>
  )
}

// 一對露出來的耳朵
function Ears({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g stroke="#cfc4b6" strokeWidth="2.5" strokeLinejoin="round">
        <polygon points="0,18 5,0 16,10" fill="#fff" />
        <polygon points="34,18 29,0 18,10" fill="#fff" />
      </g>
      <polygon points="5,14 8,5 13,10" fill="#f4c7c3" />
      <polygon points="29,14 26,5 21,10" fill="#f4c7c3" />
      {/* 耳朵間的頭頂毛 */}
      <path d="M2 18 Q17 10 32 18 L32 20 L2 20 z" fill="#fff" />
    </g>
  )
}

/* ---------------- 第 1 關：溫馨客廳 ---------------- */
function LivingRoomScene({ found, onCat, hintId }) {
  const hit = { found, onCat, hintId }
  return (
    <svg viewBox="0 0 400 280" className="h-auto w-full rounded-2xl">
      {/* 牆與地板 */}
      <rect x="0" y="0" width="400" height="190" fill="#f7eedd" />
      <rect x="0" y="190" width="400" height="90" fill="#e3c9a0" />
      <g stroke="#d4b488" strokeWidth="2">
        <line x1="0" y1="215" x2="400" y2="215" />
        <line x1="0" y1="245" x2="400" y2="245" />
        <line x1="80" y1="190" x2="70" y2="280" />
        <line x1="200" y1="190" x2="195" y2="280" />
        <line x1="320" y1="190" x2="325" y2="280" />
      </g>

      {/* 窗戶 */}
      <rect x="252" y="30" width="106" height="88" rx="4" fill="#bfe3ec" stroke="#fff" strokeWidth="6" />
      <line x1="305" y1="34" x2="305" y2="114" stroke="#fff" strokeWidth="4" />
      <line x1="256" y1="74" x2="354" y2="74" stroke="#fff" strokeWidth="4" />
      <circle cx="285" cy="52" r="9" fill="#fff" opacity="0.8" />
      <ellipse cx="330" cy="60" rx="14" ry="7" fill="#fff" opacity="0.7" />

      {/* 貓 B：尾巴垂在窗邊（貼著窗玻璃，藍底對比才看得見） */}
      <Tail x={268} y={92} />
      {/* 窗簾 */}
      <path d="M244 24 q14 30 4 55 q12 30 2 62 L232 141 q8 -35 0 -60 q8 -30 0 -57 z" fill="#ffd98a" stroke="#f0b429" strokeWidth="2" />
      <line x1="225" y1="24" x2="365" y2="24" stroke="#a9744a" strokeWidth="5" strokeLinecap="round" />

      {/* 書櫃 + 貓 C 臉夾在書中間 */}
      <rect x="300" y="128" width="88" height="62" rx="3" fill="#a9744a" stroke="#8a5a3a" strokeWidth="3" />
      <rect x="306" y="134" width="76" height="22" fill="#7c5233" />
      <rect x="306" y="162" width="76" height="22" fill="#7c5233" />
      {/* 上層書 */}
      <g>
        <rect x="308" y="136" width="8" height="20" fill="#d98f6f" />
        <rect x="317" y="138" width="7" height="18" fill="#6da864" />
        <rect x="325" y="136" width="8" height="20" fill="#f0b429" />
        {/* 貓 C 的臉 */}
        <g transform="translate(334 134) scale(0.2)">
          <ChinchillaCat variant="fluffy" size={120} />
        </g>
        <rect x="359" y="137" width="8" height="19" fill="#8ec9ab" />
        <rect x="368" y="136" width="9" height="20" fill="#c96f5e" />
      </g>
      {/* 下層書 */}
      <g>
        <rect x="308" y="166" width="9" height="18" fill="#8ec9ab" />
        <rect x="318" y="164" width="7" height="20" fill="#f0b429" />
        <rect x="326" y="166" width="8" height="18" fill="#6da864" />
        <rect x="335" y="165" width="7" height="19" fill="#d98f6f" />
        <rect x="343" y="166" width="9" height="18" fill="#c96f5e" />
        <rect x="353" y="164" width="7" height="20" fill="#8ec9ab" />
        <rect x="361" y="166" width="8" height="18" fill="#f0b429" />
        <rect x="370" y="165" width="7" height="19" fill="#6da864" />
      </g>

      {/* 貓 A：躲在沙發後（頭先畫，沙發蓋住下半，只露耳朵和額頭） */}
      <g transform="translate(88 86) scale(0.42)">
        <ChinchillaCat variant="fluffy" size={120} />
      </g>
      {/* 沙發 */}
      <rect x="30" y="112" width="170" height="52" rx="14" fill="#d98f6f" stroke="#c07a5b" strokeWidth="3" />
      <rect x="42" y="150" width="146" height="52" rx="10" fill="#e3a184" stroke="#c07a5b" strokeWidth="3" />
      <rect x="24" y="138" width="26" height="62" rx="12" fill="#d98f6f" stroke="#c07a5b" strokeWidth="3" />
      <rect x="180" y="138" width="26" height="62" rx="12" fill="#d98f6f" stroke="#c07a5b" strokeWidth="3" />
      <rect x="52" y="152" width="60" height="26" rx="8" fill="#f2c3a0" />
      <rect x="118" y="152" width="60" height="26" rx="8" fill="#f2c3a0" />

      {/* 盆栽 + 貓 D 半張臉躲在葉子後（葉子蓋住右半臉） */}
      <g transform="translate(213 128) scale(0.34)">
        <ChinchillaCat variant="gentle" size={120} />
      </g>
      <g>
        <ellipse cx="252" cy="138" rx="17" ry="27" fill="#6da864" />
        <ellipse cx="264" cy="150" rx="13" ry="22" fill="#7fb069" transform="rotate(20 264 150)" />
        <ellipse cx="244" cy="158" rx="12" ry="19" fill="#5c9457" transform="rotate(-15 244 158)" />
        {/* 前景葉片：蓋住貓的右半臉，只留左邊偷看 */}
        <circle cx="254" cy="166" r="14" fill="#6da864" />
        <circle cx="243" cy="174" r="11" fill="#5c9457" />
        <path d="M240 180 h28 l-5 26 h-18 z" fill="#c96f5e" stroke="#b05f4f" strokeWidth="2" />
      </g>

      {/* 電視櫃：暗縫裡的貓 E（發光的眼睛） */}
      <rect x="240" y="216" width="130" height="44" rx="6" fill="#8a5a3a" stroke="#6f4630" strokeWidth="3" />
      <rect x="248" y="240" width="114" height="14" rx="4" fill="#33231a" />
      <g>
        <circle cx="290" cy="247" r="3.4" fill="#2f9e77" />
        <circle cx="304" cy="247" r="3.4" fill="#2f9e77" />
        <circle cx="291" cy="246" r="1.2" fill="#fff" />
        <circle cx="305" cy="246" r="1.2" fill="#fff" />
      </g>
      <circle cx="255" cy="228" r="3" fill="#f0b429" />
      <circle cx="355" cy="228" r="3" fill="#f0b429" />

      {/* 地毯 */}
      <ellipse cx="120" cy="240" rx="85" ry="22" fill="#f2d8b8" opacity="0.8" />
      <ellipse cx="120" cy="240" rx="60" ry="14" fill="none" stroke="#e0bd92" strokeWidth="2" />

      {/* 點擊圈（最後畫，蓋在所有遮擋物上） */}
      <CatHit id="sofa" cx={110} cy={98} r={22} {...hit} />
      <CatHit id="curtain" cx={268} cy={104} r={17} {...hit} />
      <CatHit id="shelf" cx={346} cy={146} r={15} {...hit} />
      <CatHit id="plant" cx={224} cy={146} r={18} {...hit} />
      <CatHit id="cabinet" cx={297} cy={247} r={15} {...hit} />
    </svg>
  )
}

/* ---------------- 第 2 關：陽光公園 ---------------- */
function ParkScene({ found, onCat, hintId }) {
  const hit = { found, onCat, hintId }
  return (
    <svg viewBox="0 0 400 280" className="h-auto w-full rounded-2xl">
      {/* 天空與草地 */}
      <rect x="0" y="0" width="400" height="185" fill="#cfe9f2" />
      <rect x="0" y="185" width="400" height="95" fill="#a8cf7f" />
      <circle cx="352" cy="42" r="22" fill="#ffd98a" stroke="#f0b429" strokeWidth="3" />
      <ellipse cx="150" cy="45" rx="30" ry="12" fill="#fff" opacity="0.9" />
      <ellipse cx="175" cy="52" rx="22" ry="9" fill="#fff" opacity="0.8" />
      <ellipse cx="260" cy="30" rx="24" ry="9" fill="#fff" opacity="0.85" />

      {/* 貓 1：躲在樹叢裡（臉先畫，樹葉再蓋） */}
      <g transform="translate(60 62) scale(0.32)">
        <ChinchillaCat variant="fluffy" size={120} />
      </g>
      {/* 大樹 */}
      <rect x="68" y="120" width="18" height="70" rx="6" fill="#8a5a3a" />
      <path d="M77 120 q-14 -8 -22 -22" stroke="#8a5a3a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g fill="#7fb069">
        <circle cx="45" cy="72" r="26" />
        <circle cx="108" cy="74" r="25" />
        <circle cx="76" cy="42" r="26" />
        <circle cx="44" cy="100" r="20" fill="#6da864" />
        <circle cx="110" cy="100" r="20" fill="#6da864" />
        <circle cx="76" cy="108" r="16" fill="#5c9457" />
        {/* 前景葉片：讓樹上的貓只露半張臉 */}
        <circle cx="97" cy="88" r="13" fill="#6da864" />
      </g>

      {/* 溜滑梯 + 貓 4 尾巴垂在平台邊 */}
      <Tail x={302} y={128} />
      <g>
        <rect x="284" y="112" width="40" height="10" rx="3" fill="#f0a05a" stroke="#d98f6f" strokeWidth="2" />
        <polygon points="324,112 324,122 372,196 384,190" fill="#f7b977" stroke="#d98f6f" strokeWidth="2" />
        <line x1="288" y1="122" x2="288" y2="196" stroke="#c07a5b" strokeWidth="5" />
        <line x1="318" y1="122" x2="318" y2="196" stroke="#c07a5b" strokeWidth="5" />
        <line x1="280" y1="140" x2="296" y2="140" stroke="#c07a5b" strokeWidth="4" />
        <line x1="280" y1="160" x2="296" y2="160" stroke="#c07a5b" strokeWidth="4" />
        <line x1="280" y1="180" x2="296" y2="180" stroke="#c07a5b" strokeWidth="4" />
      </g>

      {/* 長椅 + 貓 3 躲在椅旁花叢後（花叢蓋住下半身） */}
      <g transform="translate(140 213) scale(0.3)">
        <ChinchillaCat variant="sitting" size={120} />
      </g>
      <g>
        <rect x="150" y="192" width="96" height="9" rx="4" fill="#a9744a" stroke="#8a5a3a" strokeWidth="2" />
        <rect x="150" y="172" width="96" height="7" rx="3" fill="#a9744a" stroke="#8a5a3a" strokeWidth="2" />
        <line x1="158" y1="201" x2="158" y2="238" stroke="#8a5a3a" strokeWidth="5" />
        <line x1="238" y1="201" x2="238" y2="238" stroke="#8a5a3a" strokeWidth="5" />
      </g>
      {/* 花叢（畫在貓前面） */}
      <g>
        <circle cx="146" cy="242" r="12" fill="#5c9457" />
        <circle cx="161" cy="246" r="13" fill="#6da864" />
        <circle cx="174" cy="240" r="10" fill="#7fb069" />
        <circle cx="150" cy="236" r="5" fill="#f2a3b3" />
        <circle cx="163" cy="238" r="5" fill="#f0b429" />
        <circle cx="173" cy="233" r="4" fill="#fff" />
      </g>

      {/* 貓 2：耳朵藏在灌木叢後 */}
      <Ears x={318} y={196} s={0.9} />
      <g fill="#6da864">
        <circle cx="310" cy="232" r="22" />
        <circle cx="338" cy="228" r="24" />
        <circle cx="360" cy="238" r="18" fill="#5c9457" />
        <circle cx="322" cy="244" r="18" fill="#7fb069" />
      </g>

      {/* 池塘 + 蘆葦 + 貓 5 半張臉 */}
      <ellipse cx="72" cy="248" rx="58" ry="20" fill="#9fd0d8" stroke="#7db8c2" strokeWidth="3" />
      <g transform="translate(96 210) scale(0.26)">
        <ChinchillaCat variant="gentle" size={120} />
      </g>
      <g stroke="#5c9457" strokeWidth="4" strokeLinecap="round">
        <line x1="112" y1="246" x2="116" y2="212" />
        <line x1="122" y1="248" x2="128" y2="218" />
        <line x1="103" y1="246" x2="102" y2="220" />
        <line x1="109" y1="248" x2="110" y2="222" />
      </g>
      <ellipse cx="116" cy="212" rx="5" ry="8" fill="#a9744a" />
      <ellipse cx="128" cy="218" rx="4" ry="7" fill="#a9744a" />
      <ellipse cx="110" cy="222" rx="5" ry="8" fill="#8a5a3a" />

      {/* 點擊圈 */}
      <CatHit id="tree" cx={78} cy={84} r={20} {...hit} />
      <CatHit id="bush" cx={333} cy={205} r={18} {...hit} />
      <CatHit id="bench" cx={156} cy={226} r={18} {...hit} />
      <CatHit id="slide" cx={302} cy={138} r={15} {...hit} />
      <CatHit id="pond" cx={108} cy={226} r={16} {...hit} />
    </svg>
  )
}

export const hideAndSeekLevels = [
  {
    id: 1,
    name: '溫馨客廳',
    emoji: '🛋️',
    timeLimit: 60,
    cats: ['sofa', 'curtain', 'shelf', 'plant', 'cabinet'],
    hints: {
      sofa: '沙發後面好像有誰在偷看…',
      curtain: '窗邊垂下了毛茸茸的東西！',
      shelf: '有一本「書」長得特別可愛。',
      plant: '葉子後面有一雙眼睛。',
      cabinet: '櫃子的縫隙裡有亮亮的光點。',
    },
    Scene: LivingRoomScene,
  },
  {
    id: 2,
    name: '陽光公園',
    emoji: '🌳',
    timeLimit: 75,
    cats: ['tree', 'bush', 'bench', 'slide', 'pond'],
    hints: {
      tree: '樹葉間露出了一張小臉。',
      bush: '灌木叢上面有一對耳朵！',
      bench: '長椅旁的花叢裡好像有誰躲著。',
      slide: '溜滑梯平台垂下了毛茸茸的東西。',
      pond: '蘆葦叢後面有動靜…',
    },
    Scene: ParkScene,
  },
]
