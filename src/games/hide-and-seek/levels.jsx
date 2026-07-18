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

// 蓬鬆垂尾：波浪輪廓的貓尾巴（根部在上、往下垂），帶銀色條紋與深色尾尖
function Tail({ x, y, flip = false }) {
  return (
    <g transform={`translate(${x} ${y})${flip ? ' scale(-1 1)' : ''}`}>
      <path
        d="M-6 0 Q-10 5 -7 11 Q-10 17 -7 23 Q-9 29 -4 34 Q0 39 5 35 Q10 31 8 25 Q11 19 8 13 Q10 7 6 1 Q0 -3 -6 0 z"
        fill="#fff"
        stroke="#cfc4b6"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* 深色尾尖（金吉拉毛尖著色） */}
      <path d="M-4 30 Q0 36 5 31 Q7 28 6 25 Q1 30 -3 26 Q-5 28 -4 30 z" fill="#cfc4b6" opacity="0.85" />
      {/* 毛流條紋 */}
      <g stroke="#e0d7c5" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M-5 9 Q0 12 5 9" />
        <path d="M-5 18 Q0 21 5 18" />
      </g>
    </g>
  )
}

// 從縫隙伸出的小貓掌（肉球朝外）
function Paw({ x, y, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <ellipse cx="0" cy="0" rx="7" ry="9" fill="#fff" stroke="#cfc4b6" strokeWidth="2" />
      <ellipse cx="0" cy="2.5" rx="3.4" ry="3" fill="#f4c7c3" />
      <circle cx="-3.6" cy="-3.5" r="1.7" fill="#f4c7c3" />
      <circle cx="0" cy="-4.6" r="1.7" fill="#f4c7c3" />
      <circle cx="3.6" cy="-3.5" r="1.7" fill="#f4c7c3" />
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
      <Tail x={302} y={124} />
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

/* ---------------- 第 3 關：熱鬧廚房 ---------------- */
function KitchenScene({ found, onCat, hintId }) {
  const hit = { found, onCat, hintId }
  return (
    <svg viewBox="0 0 400 280" className="h-auto w-full rounded-2xl">
      {/* 牆面磁磚與地板 */}
      <rect x="0" y="0" width="400" height="170" fill="#f7eedd" />
      <g stroke="#eee0c6" strokeWidth="2">
        <line x1="0" y1="45" x2="400" y2="45" />
        <line x1="0" y1="90" x2="400" y2="90" />
        <line x1="0" y1="135" x2="400" y2="135" />
        <line x1="100" y1="0" x2="100" y2="170" />
        <line x1="200" y1="0" x2="200" y2="170" />
        <line x1="300" y1="0" x2="300" y2="170" />
      </g>
      <rect x="0" y="170" width="400" height="110" fill="#d9b98c" />
      <g stroke="#c4a172" strokeWidth="2">
        <line x1="0" y1="205" x2="400" y2="205" />
        <line x1="0" y1="240" x2="400" y2="240" />
      </g>

      {/* 上櫃：右門半開，縫裡有貓 1 的眼睛 */}
      <rect x="18" y="26" width="150" height="58" rx="4" fill="#a9744a" stroke="#8a5a3a" strokeWidth="3" />
      <line x1="93" y1="28" x2="93" y2="82" stroke="#8a5a3a" strokeWidth="3" />
      <circle cx="84" cy="55" r="3" fill="#f0b429" />
      <rect x="96" y="29" width="69" height="52" fill="#33231a" />
      <g>
        <circle cx="128" cy="56" r="3.2" fill="#2f9e77" />
        <circle cx="141" cy="56" r="3.2" fill="#2f9e77" />
        <circle cx="129" cy="55" r="1.1" fill="#fff" />
        <circle cx="142" cy="55" r="1.1" fill="#fff" />
      </g>
      <rect x="150" y="27" width="22" height="56" rx="3" fill="#b57f52" stroke="#8a5a3a" strokeWidth="3" transform="rotate(14 150 27)" />

      {/* 層架與罐子（白色棉花罐當干擾物）+ 貓 6 的尾巴垂在架邊 */}
      <Tail x={296} y={100} />
      <rect x="185" y="96" width="118" height="7" rx="3" fill="#8a5a3a" />
      <rect x="192" y="72" width="16" height="24" rx="3" fill="#bfe3ec" opacity="0.9" />
      <rect x="214" y="68" width="18" height="28" rx="3" fill="#d9c48f" />
      <rect x="238" y="70" width="18" height="26" rx="3" fill="#fff" stroke="#cfc4b6" strokeWidth="2" />
      <circle cx="247" cy="78" r="5" fill="#f3ede1" />
      <circle cx="243" cy="86" r="4" fill="#f3ede1" />
      <rect x="262" y="76" width="15" height="20" rx="3" fill="#8ec9ab" />

      {/* 貓 2：躲在鍋子裡（頭先畫，鍋身蓋住下半） */}
      <g transform="translate(104 96) scale(0.3)">
        <ChinchillaCat variant="fluffy" size={120} />
      </g>
      {/* 流理台與爐具 */}
      <rect x="30" y="138" width="120" height="10" rx="3" fill="#5a4636" />
      <rect x="8" y="146" width="200" height="10" rx="3" fill="#e8d3ae" />
      <rect x="8" y="156" width="200" height="60" fill="#b57f52" stroke="#8a5a3a" strokeWidth="3" />
      <line x1="75" y1="158" x2="75" y2="214" stroke="#8a5a3a" strokeWidth="2.5" />
      <line x1="142" y1="158" x2="142" y2="214" stroke="#8a5a3a" strokeWidth="2.5" />
      {/* 鍋 A（有蓋） */}
      <rect x="38" y="118" width="44" height="22" rx="5" fill="#7a8b99" />
      <ellipse cx="60" cy="118" rx="24" ry="6" fill="#5a6b77" />
      <circle cx="60" cy="112" r="4" fill="#5a6b77" />
      {/* 鍋 B（貓咪鍋） */}
      <rect x="100" y="122" width="48" height="20" rx="5" fill="#c96f5e" stroke="#b05f4f" strokeWidth="2" />
      <line x1="96" y1="128" x2="100" y2="128" stroke="#b05f4f" strokeWidth="4" strokeLinecap="round" />
      <line x1="148" y1="128" x2="152" y2="128" stroke="#b05f4f" strokeWidth="4" strokeLinecap="round" />

      {/* 冰箱 + 貓 3 的耳朵（耳朵先畫，冰箱蓋住底部） */}
      <Ears x={322} y={42} s={0.85} />
      <rect x="306" y="58" width="74" height="152" rx="8" fill="#dfe5e8" stroke="#b8c2c8" strokeWidth="3" />
      <line x1="308" y1="118" x2="378" y2="118" stroke="#b8c2c8" strokeWidth="3" />
      <rect x="312" y="96" width="6" height="16" rx="2" fill="#9aa5ac" />
      <rect x="312" y="128" width="6" height="20" rx="2" fill="#9aa5ac" />

      {/* 餐桌與桌巾 + 貓 4 的貓掌從桌巾下伸出 */}
      <rect x="216" y="206" width="88" height="14" fill="#a9744a" />
      <path d="M214 206 h92 v40 q-8 6 -16 0 q-8 6 -15 0 q-8 6 -15 0 q-8 6 -15 0 q-8 6 -15 0 q-8 6 -16 0 z" fill="#f2a3b3" stroke="#e58ba0" strokeWidth="2" />
      <line x1="228" y1="248" x2="228" y2="272" stroke="#8a5a3a" strokeWidth="5" />
      <line x1="292" y1="248" x2="292" y2="272" stroke="#8a5a3a" strokeWidth="5" />
      <Paw x={258} y={258} />

      {/* 菜籃 + 貓 5 的臉混在蔬菜裡 */}
      <g transform="translate(46 212) scale(0.27)">
        <ChinchillaCat variant="gentle" size={120} />
      </g>
      <g>
        <circle cx="54" cy="238" r="11" fill="#7fb069" />
        <path d="M49 232 q5 -4 10 0" stroke="#5c9457" strokeWidth="2" fill="none" />
        <circle cx="72" cy="240" r="8" fill="#c96f5e" />
        <path d="M70 233 l2 -4 l3 3" stroke="#5c9457" strokeWidth="2" fill="none" />
        <polygon points="86,228 94,244 78,244" fill="#f0a05a" />
        <path d="M36 240 h68 l-8 30 h-52 z" fill="#a9744a" stroke="#8a5a3a" strokeWidth="2.5" />
        <path d="M40 250 h60 M42 260 h56" stroke="#8a5a3a" strokeWidth="1.5" />
      </g>

      {/* 點擊圈 */}
      <CatHit id="cupboard" cx={133} cy={55} r={14} {...hit} />
      <CatHit id="pot" cx={124} cy={110} r={16} {...hit} />
      <CatHit id="fridge" cx={337} cy={48} r={15} {...hit} />
      <CatHit id="table" cx={258} cy={258} r={13} {...hit} />
      <CatHit id="basket" cx={62} cy={226} r={16} {...hit} />
      <CatHit id="shelf" cx={296} cy={116} r={14} {...hit} />
    </svg>
  )
}

/* ---------------- 第 4 關：月夜屋頂（高難度：白色干擾物多） ---------------- */
function RooftopScene({ found, onCat, hintId }) {
  const hit = { found, onCat, hintId }
  return (
    <svg viewBox="0 0 400 280" className="h-auto w-full rounded-2xl">
      {/* 夜空與星星 */}
      <rect x="0" y="0" width="400" height="280" fill="#2b3a5a" />
      <g fill="#fff">
        <circle cx="30" cy="30" r="1.5" /><circle cx="70" cy="55" r="1.2" /><circle cx="120" cy="25" r="1.5" />
        <circle cx="175" cy="48" r="1.2" /><circle cx="225" cy="30" r="1.5" /><circle cx="262" cy="62" r="1.2" />
        <circle cx="300" cy="24" r="1.3" /><circle cx="380" cy="90" r="1.4" /><circle cx="40" cy="95" r="1.2" />
        <circle cx="200" cy="80" r="1.3" /><circle cx="360" cy="130" r="1.2" />
      </g>

      {/* 月亮 + 貓 6 的剪影（耳朵擋住月光） */}
      <circle cx="330" cy="52" r="26" fill="#f7e8b0" stroke="#e8d48e" strokeWidth="3" />
      <path d="M312 68 L317 54 L324 61 Q330 56 336 61 L343 54 L348 68 Q330 76 312 68 z" fill="#3a3050" />

      {/* 背景公寓與閣樓圓窗（貓 1 的眼睛） */}
      <polygon points="8,122 80,84 152,122" fill="#322a44" />
      <rect x="16" y="122" width="128" height="70" fill="#3a3050" />
      <circle cx="80" cy="112" r="13" fill="#241d33" stroke="#574a6b" strokeWidth="3" />
      <g>
        <circle cx="75" cy="112" r="3" fill="#2f9e77" />
        <circle cx="86" cy="112" r="3" fill="#2f9e77" />
        <circle cx="76" cy="111" r="1" fill="#fff" />
        <circle cx="87" cy="111" r="1" fill="#fff" />
      </g>
      <rect x="30" y="140" width="18" height="24" fill="#241d33" />
      <rect x="110" y="140" width="18" height="24" fill="#241d33" />

      {/* 貓 4：屋脊後的小耳朵（先畫，屋頂蓋住底部） */}
      <Ears x={183} y={156} s={0.75} />

      {/* 前景屋頂 */}
      <polygon points="0,196 200,168 400,188 400,280 0,280" fill="#4a3f55" />
      <path d="M0 196 L200 168 L400 188" stroke="#5c5169" strokeWidth="4" fill="none" />
      <g stroke="#41374b" strokeWidth="2">
        <line x1="60" y1="212" x2="400" y2="238" />
        <line x1="0" y1="238" x2="340" y2="266" />
      </g>

      {/* 煙囪 + 貓 2 的尾巴 + 白煙干擾物 */}
      <g fill="#fff" opacity="0.45">
        <circle cx="70" cy="128" r="7" /><circle cx="79" cy="112" r="9" /><circle cx="92" cy="94" r="11" />
      </g>
      <rect x="52" y="150" width="34" height="52" fill="#6b4a3f" stroke="#59392f" strokeWidth="3" />
      <rect x="48" y="144" width="42" height="10" rx="2" fill="#59392f" />
      <g stroke="#59392f" strokeWidth="1.5">
        <line x1="54" y1="166" x2="84" y2="166" />
        <line x1="54" y1="182" x2="84" y2="182" />
      </g>
      <Tail x={92} y={154} flip />

      {/* 曬衣繩：白毛巾干擾物 + 貓 3 偽裝在毛巾之間 */}
      <line x1="150" y1="190" x2="150" y2="114" stroke="#8a7a94" strokeWidth="4" />
      <line x1="340" y1="186" x2="340" y2="106" stroke="#8a7a94" strokeWidth="4" />
      <path d="M150 116 Q245 132 340 108" stroke="#d8cbe8" strokeWidth="2.5" fill="none" />
      {/* 毛巾們（干擾物） */}
      <g stroke="#cfc4b6" strokeWidth="2">
        <path d="M166 120 h26 v30 q-6 5 -13 0 q-7 5 -13 0 z" fill="#fff" />
        <path d="M212 126 h24 v26 q-6 5 -12 0 q-6 5 -12 0 z" fill="#e8e3f5" />
        <path d="M296 112 h24 v30 q-6 5 -12 0 q-6 5 -12 0 z" fill="#fff" />
      </g>
      {/* 貓 3：趴在繩上偽裝成毛巾（有耳朵和小尾巴） */}
      <Ears x={241} y={112} s={0.8} />
      <ellipse cx="255" cy="134" rx="17" ry="12" fill="#fff" stroke="#cfc4b6" strokeWidth="2" />
      <path d="M270 130 q8 -2 9 6 q-6 3 -9 -1" fill="#fff" stroke="#cfc4b6" strokeWidth="2" />

      {/* 天線 */}
      <line x1="368" y1="188" x2="368" y2="118" stroke="#8a7a94" strokeWidth="3" />
      <line x1="352" y1="128" x2="384" y2="128" stroke="#8a7a94" strokeWidth="2.5" />
      <line x1="356" y1="142" x2="380" y2="142" stroke="#8a7a94" strokeWidth="2.5" />

      {/* 水塔 + 貓 5 探出半張臉 */}
      <g transform="translate(282 150) scale(0.24)">
        <ChinchillaCat variant="fluffy" size={120} />
      </g>
      <rect x="304" y="152" width="52" height="36" fill="#5b5169" stroke="#4a4157" strokeWidth="2.5" />
      <ellipse cx="330" cy="152" rx="26" ry="7" fill="#6b6178" stroke="#4a4157" strokeWidth="2.5" />
      <line x1="310" y1="188" x2="310" y2="200" stroke="#4a4157" strokeWidth="4" />
      <line x1="350" y1="188" x2="350" y2="200" stroke="#4a4157" strokeWidth="4" />

      {/* 天窗圓頂（白色干擾物） */}
      <ellipse cx="250" cy="216" rx="12" ry="8" fill="#cfd6e8" stroke="#8a7a94" strokeWidth="2" />

      {/* 排氣管 + 貓 7 的貓掌 + 白色管帽干擾物 */}
      <rect x="148" y="214" width="20" height="32" fill="#5b5169" stroke="#4a4157" strokeWidth="2.5" />
      <ellipse cx="158" cy="214" rx="13" ry="5" fill="#d8cbe8" stroke="#8a7a94" strokeWidth="2" />
      <Paw x={174} y={234} rotate={-20} />

      {/* 點擊圈 */}
      <CatHit id="window" cx={80} cy={112} r={14} {...hit} />
      <CatHit id="chimney" cx={90} cy={170} r={15} {...hit} />
      <CatHit id="laundry" cx={252} cy={124} r={16} {...hit} />
      <CatHit id="ridge" cx={196} cy={162} r={13} {...hit} />
      <CatHit id="tank" cx={290} cy={162} r={15} {...hit} />
      <CatHit id="moon" cx={330} cy={66} r={14} {...hit} />
      <CatHit id="pipe" cx={174} cy={234} r={13} {...hit} />
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
    timeLimit: 65,
    cats: ['tree', 'bush', 'bench', 'slide', 'pond'],
    hints: {
      tree: '樹葉間露出了一張小臉。',
      bush: '灌木叢上面有一對耳朵！',
      bench: '長椅旁的花叢裡好像有誰躲著。',
      slide: '溜滑梯平台垂下了毛茸茸的尾巴。',
      pond: '蘆葦叢後面有動靜…',
    },
    Scene: ParkScene,
  },
  {
    id: 3,
    name: '熱鬧廚房',
    emoji: '🍳',
    timeLimit: 65,
    cats: ['cupboard', 'pot', 'fridge', 'table', 'basket', 'shelf'],
    hints: {
      cupboard: '半開的櫥櫃深處有光點在閃。',
      pot: '有一鍋正在燉煮的……毛茸茸？',
      fridge: '冰箱上面露出了一對耳朵。',
      table: '桌巾下面悄悄伸出了什麼。',
      basket: '菜籃裡混進了不是蔬菜的東西。',
      shelf: '層架邊垂下了一條蓬蓬的尾巴。',
    },
    Scene: KitchenScene,
  },
  {
    id: 4,
    name: '月夜屋頂',
    emoji: '🌙',
    timeLimit: 80,
    cats: ['window', 'chimney', 'laundry', 'ridge', 'tank', 'moon', 'pipe'],
    hints: {
      window: '閣樓的圓窗裡有一雙發光的眼睛。',
      chimney: '煙囪邊垂著不是煙的東西。',
      laundry: '曬衣繩上有一條「長了耳朵」的毛巾。',
      ridge: '屋脊上冒出了小小的三角形。',
      tank: '水塔旁邊探出了半張臉。',
      moon: '是誰擋住了月光？',
      pipe: '排氣管後面伸出了小小的手。',
    },
    Scene: RooftopScene,
  },
]
