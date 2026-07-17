// 金吉拉吉祥物 SVG，全站共用以維持視覺一致。
// 造型參考真實金吉拉的神韻：小耳半埋蓬毛、綠寶石眼配天生黑眼線、磚紅小鼻、銀色毛尖。
//
// variant:
//   'classic'（預設）— 初版雲朵臉
//   'fluffy'  — 蓬蓬大頭版：毛球更多更密、小耳半埋、扁臉五官
//   'ruff'    — 優雅圍脖版：頭部 + 胸前大鬃毛圍脖
//   'sitting' — 全身坐姿版：毛球身體、前腳與蓬尾
//   'gentle'  — 恬靜肖像版：尖毛叢輪廓 + 溫柔杏仁眼 + 粉鼻（參考舊站照片神韻）
//   'lying'   — 優雅趴姿版：慵懶趴姿 + 大蓬尾（參考舊站 hero2 照片）
//   'portrait'— 真實臉型版：寬扁橢圓臉 + 不規則絲狀毛叢 + 內部毛流（最貼近真實照片；
//               輪廓由 scratchpad 的 gen-realistic.mjs 腳本產生後貼入）
// expression: 'happy'（預設）| 'surprised'（classic 與 fluffy 支援，404 等驚訝場景用）

const OUTLINE = '#cfc4b6'
const SILVER = '#ded5c8'
const EYE = '#2f9e77'
const EYE_RIM = '#2b2018'
const PUPIL = '#1f1710'
const NOSE = '#b8574a'
const NOSE_RIM = '#a34a3e'
const MOUTH = '#6b5747'
const BLUSH = '#f7d4c4'
const INNER_EAR = '#f4c7c3'
const WHISKER = '#c9bfae'

function Classic({ expression }) {
  return (
    <>
      <g stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
        <polygon points="24,46 31,9 54,27" fill="#fff" />
        <polygon points="96,46 89,9 66,27" fill="#fff" />
      </g>
      <polygon points="31,38 34,19 46,28" fill={INNER_EAR} />
      <polygon points="89,38 86,19 74,28" fill={INNER_EAR} />

      <g fill="#fff" stroke={OUTLINE} strokeWidth="3">
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

      <g stroke={SILVER} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M40 36 q2 -4 5 -5" />
        <path d="M76 34 q3 1 5 4" />
        <path d="M27 72 q-2 3 -1 6" />
        <path d="M93 70 q2 3 1 6" />
      </g>

      <circle cx="36" cy="76" r="5.5" fill={BLUSH} opacity="0.85" />
      <circle cx="84" cy="76" r="5.5" fill={BLUSH} opacity="0.85" />

      {expression === 'surprised' ? (
        <g>
          <circle cx="45" cy="62" r="9.5" fill={EYE} stroke={EYE_RIM} strokeWidth="2.5" />
          <circle cx="75" cy="62" r="9.5" fill={EYE} stroke={EYE_RIM} strokeWidth="2.5" />
          <circle cx="45" cy="62" r="4" fill={PUPIL} />
          <circle cx="75" cy="62" r="4" fill={PUPIL} />
        </g>
      ) : (
        <g>
          <ellipse cx="45" cy="62" rx="8.5" ry="9.5" fill={EYE} stroke={EYE_RIM} strokeWidth="2.5" />
          <ellipse cx="75" cy="62" rx="8.5" ry="9.5" fill={EYE} stroke={EYE_RIM} strokeWidth="2.5" />
          <ellipse cx="45" cy="63" rx="3.2" ry="5.2" fill={PUPIL} />
          <ellipse cx="75" cy="63" rx="3.2" ry="5.2" fill={PUPIL} />
        </g>
      )}
      <circle cx="42.5" cy="59" r="2" fill="#fff" />
      <circle cx="72.5" cy="59" r="2" fill="#fff" />

      <path d="M56.5 76.5 h7 l-3.5 4.5 z" fill={NOSE} stroke={NOSE_RIM} strokeWidth="1" strokeLinejoin="round" />
      {expression === 'surprised' ? (
        <ellipse cx="60" cy="87" rx="3.5" ry="4.5" fill={MOUTH} />
      ) : (
        <g stroke={MOUTH} strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M60 81 v4" />
          <path d="M60 85 q-4 4 -8 1" />
          <path d="M60 85 q4 4 8 1" />
        </g>
      )}

      <g stroke={WHISKER} strokeWidth="1.5" strokeLinecap="round">
        <line x1="26" y1="68" x2="9" y2="64" />
        <line x1="26" y1="76" x2="10" y2="78" />
        <line x1="94" y1="68" x2="111" y2="64" />
        <line x1="94" y1="76" x2="110" y2="78" />
      </g>
    </>
  )
}

function Fluffy({ expression }) {
  return (
    <>
      <g stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
        <polygon points="30,36 35,13 52,26" fill="#fff" />
        <polygon points="90,36 85,13 68,26" fill="#fff" />
      </g>
      <polygon points="36,30 38,20 47,26" fill={INNER_EAR} />
      <polygon points="84,30 82,20 73,26" fill={INNER_EAR} />

      <g fill="#fff" stroke={OUTLINE} strokeWidth="3">
        <circle cx="98" cy="66" r="10" />
        <circle cx="94" cy="83" r="10" />
        <circle cx="84" cy="96" r="10" />
        <circle cx="69" cy="103" r="10" />
        <circle cx="51" cy="103" r="10" />
        <circle cx="36" cy="96" r="10" />
        <circle cx="26" cy="83" r="10" />
        <circle cx="22" cy="66" r="10" />
        <circle cx="26" cy="49" r="10" />
        <circle cx="36" cy="36" r="10" />
        <circle cx="51" cy="29" r="10" />
        <circle cx="69" cy="29" r="10" />
        <circle cx="84" cy="36" r="10" />
        <circle cx="94" cy="49" r="10" />
      </g>
      <circle cx="60" cy="66" r="39" fill="#fff" />

      <g stroke={SILVER} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M50 38 l2 -7" />
        <path d="M60 36 l0 -8" />
        <path d="M70 38 l-2 -7" />
        <path d="M30 56 l-6 -3" />
        <path d="M90 56 l6 -3" />
        <path d="M33 86 l-6 4" />
        <path d="M87 86 l6 4" />
      </g>

      <circle cx="35" cy="73" r="6" fill={BLUSH} opacity="0.85" />
      <circle cx="85" cy="73" r="6" fill={BLUSH} opacity="0.85" />

      <circle cx="44" cy="60" r="9" fill={EYE} stroke={EYE_RIM} strokeWidth="2.5" />
      <circle cx="76" cy="60" r="9" fill={EYE} stroke={EYE_RIM} strokeWidth="2.5" />
      {expression === 'surprised' ? (
        <g>
          <circle cx="44" cy="60" r="3.8" fill={PUPIL} />
          <circle cx="76" cy="60" r="3.8" fill={PUPIL} />
        </g>
      ) : (
        <g>
          <ellipse cx="44" cy="61" rx="3.4" ry="5.4" fill={PUPIL} />
          <ellipse cx="76" cy="61" rx="3.4" ry="5.4" fill={PUPIL} />
        </g>
      )}
      <circle cx="41.5" cy="57" r="2.2" fill="#fff" />
      <circle cx="73.5" cy="57" r="2.2" fill="#fff" />

      <path d="M57 70 h6 l-3 4 z" fill={NOSE} stroke={NOSE_RIM} strokeWidth="1" strokeLinejoin="round" />
      {expression === 'surprised' ? (
        <ellipse cx="60" cy="79" rx="3.2" ry="4" fill={MOUTH} />
      ) : (
        <g stroke={MOUTH} strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M60 74 v3" />
          <path d="M60 77 q-3.5 3.5 -7 1" />
          <path d="M60 77 q3.5 3.5 7 1" />
        </g>
      )}

      <g stroke={WHISKER} strokeWidth="1.5" strokeLinecap="round">
        <line x1="24" y1="66" x2="6" y2="62" />
        <line x1="24" y1="74" x2="7" y2="77" />
        <line x1="96" y1="66" x2="114" y2="62" />
        <line x1="96" y1="74" x2="113" y2="77" />
      </g>
    </>
  )
}

function Ruff() {
  return (
    <>
      {/* 圍脖尖毛 */}
      <polygon
        points="17,86 32,84 25,100 39,93 37,110 51,99 52,116 60,101 68,116 69,99 83,110 81,93 95,100 88,84 103,86 92,72 28,72"
        fill="#fff"
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* 肩部蓬毛：蓋住圍脖平肩線 */}
      <g fill="#fff" stroke={OUTLINE} strokeWidth="3">
        <circle cx="30" cy="76" r="9" />
        <circle cx="90" cy="76" r="9" />
      </g>

      <g stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
        <polygon points="36,32 40,12 55,23" fill="#fff" />
        <polygon points="84,32 80,12 65,23" fill="#fff" />
      </g>
      <polygon points="41,26 43,18 50,23" fill={INNER_EAR} />
      <polygon points="79,26 77,18 70,23" fill={INNER_EAR} />

      <g fill="#fff" stroke={OUTLINE} strokeWidth="3">
        <circle cx="87" cy="48" r="9" />
        <circle cx="80" cy="65" r="9" />
        <circle cx="60" cy="73" r="9" />
        <circle cx="40" cy="65" r="9" />
        <circle cx="33" cy="48" r="9" />
        <circle cx="41" cy="31" r="9" />
        <circle cx="60" cy="24" r="9" />
        <circle cx="79" cy="31" r="9" />
      </g>
      <circle cx="60" cy="48" r="29" fill="#fff" />

      <g stroke={SILVER} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M35 96 l-3 6" />
        <path d="M48 103 l-2 6" />
        <path d="M72 103 l2 6" />
        <path d="M85 96 l3 6" />
        <path d="M60 105 v6" />
      </g>

      <circle cx="41" cy="56" r="4.5" fill={BLUSH} opacity="0.85" />
      <circle cx="79" cy="56" r="4.5" fill={BLUSH} opacity="0.85" />

      <ellipse cx="48" cy="45" rx="7" ry="8" fill={EYE} stroke={EYE_RIM} strokeWidth="2.5" />
      <ellipse cx="72" cy="45" rx="7" ry="8" fill={EYE} stroke={EYE_RIM} strokeWidth="2.5" />
      <ellipse cx="48" cy="46" rx="2.6" ry="4.4" fill={PUPIL} />
      <ellipse cx="72" cy="46" rx="2.6" ry="4.4" fill={PUPIL} />
      <circle cx="46" cy="42.5" r="1.8" fill="#fff" />
      <circle cx="70" cy="42.5" r="1.8" fill="#fff" />

      <path d="M57.5 54 h5 l-2.5 3.5 z" fill={NOSE} stroke={NOSE_RIM} strokeWidth="1" strokeLinejoin="round" />
      <g stroke={MOUTH} strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M60 57.5 v2.5" />
        <path d="M60 60 q-3 3 -6 0.8" />
        <path d="M60 60 q3 3 6 0.8" />
      </g>

      <g stroke={WHISKER} strokeWidth="1.4" strokeLinecap="round">
        <line x1="34" y1="50" x2="20" y2="47" />
        <line x1="34" y1="56" x2="21" y2="58" />
        <line x1="86" y1="50" x2="100" y2="47" />
        <line x1="86" y1="56" x2="99" y2="58" />
      </g>
    </>
  )
}

function Sitting() {
  return (
    <>
      {/* 尾巴（先畫，壓在身體後） */}
      <g fill="#fff" stroke={OUTLINE} strokeWidth="3">
        <circle cx="97" cy="97" r="9" />
        <circle cx="103" cy="84" r="8" />
        <circle cx="104" cy="71" r="7" />
      </g>
      {/* 尾巴接縫遮蓋 */}
      <circle cx="100" cy="91" r="6" fill="#fff" />
      <circle cx="103" cy="78" r="5" fill="#fff" />

      {/* 身體 */}
      <g fill="#fff" stroke={OUTLINE} strokeWidth="3">
        <circle cx="91" cy="82" r="11" />
        <circle cx="85" cy="97" r="11" />
        <circle cx="67" cy="106" r="11" />
        <circle cx="47" cy="105" r="11" />
        <circle cx="32" cy="94" r="11" />
        <circle cx="27" cy="78" r="11" />
      </g>
      <ellipse cx="59" cy="89" rx="32" ry="25" fill="#fff" />

      <g stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
        <polygon points="40,26 44,9 57,19" fill="#fff" />
        <polygon points="80,26 76,9 63,19" fill="#fff" />
      </g>
      <polygon points="45,21 47,14 53,18" fill={INNER_EAR} />
      <polygon points="75,21 73,14 67,18" fill={INNER_EAR} />

      {/* 頭部毛球 */}
      <g fill="#fff" stroke={OUTLINE} strokeWidth="3">
        <circle cx="84" cy="42" r="8" />
        <circle cx="78" cy="57" r="8" />
        <circle cx="60" cy="63" r="8" />
        <circle cx="42" cy="57" r="8" />
        <circle cx="36" cy="42" r="8" />
        <circle cx="43" cy="27" r="8" />
        <circle cx="60" cy="21" r="8" />
        <circle cx="77" cy="27" r="8" />
      </g>
      <circle cx="60" cy="42" r="26" fill="#fff" />

      {/* 前腳 */}
      <g fill="#fff" stroke={OUTLINE} strokeWidth="2.5">
        <ellipse cx="51" cy="106" rx="7" ry="4.5" />
        <ellipse cx="69" cy="106" rx="7" ry="4.5" />
      </g>
      <g stroke={SILVER} strokeWidth="1.5" strokeLinecap="round">
        <line x1="49" y1="103.5" x2="49" y2="108" />
        <line x1="53" y1="103.5" x2="53" y2="108" />
        <line x1="67" y1="103.5" x2="67" y2="108" />
        <line x1="71" y1="103.5" x2="71" y2="108" />
      </g>

      <circle cx="43" cy="50" r="4.5" fill={BLUSH} opacity="0.85" />
      <circle cx="77" cy="50" r="4.5" fill={BLUSH} opacity="0.85" />

      <circle cx="49" cy="40" r="7" fill={EYE} stroke={EYE_RIM} strokeWidth="2.2" />
      <circle cx="71" cy="40" r="7" fill={EYE} stroke={EYE_RIM} strokeWidth="2.2" />
      <ellipse cx="49" cy="41" rx="2.6" ry="4.2" fill={PUPIL} />
      <ellipse cx="71" cy="41" rx="2.6" ry="4.2" fill={PUPIL} />
      <circle cx="47" cy="37.5" r="1.7" fill="#fff" />
      <circle cx="69" cy="37.5" r="1.7" fill="#fff" />

      <path d="M57.5 48 h5 l-2.5 3.5 z" fill={NOSE} stroke={NOSE_RIM} strokeWidth="1" strokeLinejoin="round" />
      <g stroke={MOUTH} strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M60 51.5 v2.5" />
        <path d="M60 54 q-3 3 -6 0.8" />
        <path d="M60 54 q3 3 6 0.8" />
      </g>

      <g stroke={WHISKER} strokeWidth="1.4" strokeLinecap="round">
        <line x1="36" y1="44" x2="23" y2="41" />
        <line x1="36" y1="50" x2="24" y2="52" />
        <line x1="84" y1="44" x2="97" y2="41" />
        <line x1="84" y1="50" x2="96" y2="52" />
      </g>
    </>
  )
}

// 恬靜/趴姿版的照片感配色：柔和眼綠、粉鼻、銀影
const SOFT_EYE = '#4f9468'
const PINK_NOSE = '#d9968f'
const PINK_NOSE_RIM = '#c8837c'
const SOFT_MOUTH = '#8a7561'
const SHADE = '#f1ebe0'

function Gentle() {
  return (
    <>
      <g stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
        <polygon points="32,38 37,17 52,29" fill="#fff" />
        <polygon points="88,38 83,17 68,29" fill="#fff" />
      </g>
      <polygon points="38,32 40,23 48,28" fill={INNER_EAR} />
      <polygon points="82,32 80,23 72,28" fill={INNER_EAR} />

      {/* 尖毛叢輪廓 */}
      <polygon
        points="101,64 94,71 98,80 89,83 89,93 79,93 76,102 67,98 60,105 53,98 44,102 41,93 31,93 31,83 22,80 26,71 19,64 26,57 22,48 31,45 31,35 41,35 44,26 53,30 60,23 67,30 76,26 79,35 89,35 89,45 98,48 94,57"
        fill="#fff"
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* 銀色淡影 */}
      <ellipse cx="60" cy="41" rx="11" ry="4.5" fill={SHADE} opacity="0.7" />
      <ellipse cx="31" cy="64" rx="4.5" ry="8" fill={SHADE} opacity="0.8" />
      <ellipse cx="89" cy="64" rx="4.5" ry="8" fill={SHADE} opacity="0.8" />
      <g stroke={SILVER} strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M52 34 l1 -7" />
        <path d="M60 32 v-8" />
        <path d="M68 34 l-1 -7" />
        <path d="M31 88 l-4 5" />
        <path d="M89 88 l4 5" />
      </g>

      {/* 溫柔杏仁眼 */}
      <path
        d="M37.5 60 Q45 52.5 52.5 60 Q45 68.5 37.5 60 z"
        fill={SOFT_EYE}
        stroke={EYE_RIM}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M67.5 60 Q75 52.5 82.5 60 Q75 68.5 67.5 60 z"
        fill={SOFT_EYE}
        stroke={EYE_RIM}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="45" cy="60.5" r="2.6" fill={PUPIL} />
      <circle cx="75" cy="60.5" r="2.6" fill={PUPIL} />
      <circle cx="43.5" cy="58.5" r="1.3" fill="#fff" />
      <circle cx="73.5" cy="58.5" r="1.3" fill="#fff" />

      <path d="M57.5 71 h5 l-2.5 3.5 z" fill={PINK_NOSE} stroke={PINK_NOSE_RIM} strokeWidth="0.8" strokeLinejoin="round" />
      <g stroke={SOFT_MOUTH} strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M60 74.5 v2.5" />
        <path d="M60 77 q-3 2.5 -5.5 0.8" />
        <path d="M60 77 q3 2.5 5.5 0.8" />
      </g>

      <g stroke={WHISKER} strokeWidth="1.3" strokeLinecap="round">
        <line x1="30" y1="68" x2="8" y2="64" />
        <line x1="30" y1="74" x2="9" y2="77" />
        <line x1="33" y1="80" x2="14" y2="87" />
        <line x1="90" y1="68" x2="112" y2="64" />
        <line x1="90" y1="74" x2="111" y2="77" />
        <line x1="87" y1="80" x2="106" y2="87" />
      </g>
    </>
  )
}

function Lying() {
  return (
    <>
      {/* 尾巴 */}
      <g fill="#fff" stroke={OUTLINE} strokeWidth="3">
        <circle cx="14" cy="86" r="9" />
        <circle cx="25" cy="90" r="10" />
        <circle cx="38" cy="92" r="10" />
      </g>
      <circle cx="20" cy="88" r="6" fill="#fff" />
      <circle cx="32" cy="91" r="7" fill="#fff" />

      {/* 身體 */}
      <g fill="#fff" stroke={OUTLINE} strokeWidth="3">
        <circle cx="42" cy="70" r="10" />
        <circle cx="54" cy="65" r="10" />
        <circle cx="66" cy="63" r="10" />
        <circle cx="38" cy="82" r="10" />
        <circle cx="48" cy="88" r="10" />
        <circle cx="62" cy="91" r="10" />
        <circle cx="76" cy="90" r="10" />
      </g>
      <ellipse cx="60" cy="78" rx="28" ry="16" fill="#fff" />

      {/* 前腳 */}
      <g fill="#fff" stroke={OUTLINE} strokeWidth="2.5">
        <ellipse cx="97" cy="90" rx="8" ry="4.5" />
        <ellipse cx="107" cy="85" rx="7" ry="4" />
      </g>

      <g stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
        <polygon points="73,38 77,21 90,29" fill="#fff" />
        <polygon points="103,38 99,21 86,29" fill="#fff" />
      </g>
      <polygon points="77,32 79,25 85,29" fill={INNER_EAR} />
      <polygon points="99,32 97,25 91,29" fill={INNER_EAR} />

      {/* 頭部毛叢 */}
      <g fill="#fff" stroke={OUTLINE} strokeWidth="3">
        <circle cx="105" cy="52" r="8" />
        <circle cx="100" cy="65" r="8" />
        <circle cx="88" cy="70" r="8" />
        <circle cx="76" cy="65" r="8" />
        <circle cx="71" cy="52" r="8" />
        <circle cx="76" cy="39" r="8" />
        <circle cx="88" cy="34" r="8" />
        <circle cx="100" cy="39" r="8" />
      </g>
      <circle cx="88" cy="52" r="19" fill="#fff" />

      {/* 胸口蓬毛 */}
      <g fill="#fff" stroke={OUTLINE} strokeWidth="2.5">
        <circle cx="74" cy="73" r="6" />
        <circle cx="82" cy="77" r="6" />
      </g>
      <circle cx="78" cy="75" r="4.5" fill="#fff" />

      {/* 背部銀色毛流 */}
      <g stroke={SILVER} strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M46 64 q4 -3 8 -3" />
        <path d="M58 60 q4 -2 8 -2" />
        <path d="M40 78 q-3 3 -3 7" />
      </g>

      {/* 溫柔杏仁眼 */}
      <path
        d="M76.5 50 Q82 44.5 87.5 50 Q82 56 76.5 50 z"
        fill={SOFT_EYE}
        stroke={EYE_RIM}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M92.5 50 Q98 44.5 103.5 50 Q98 56 92.5 50 z"
        fill={SOFT_EYE}
        stroke={EYE_RIM}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="81" cy="50.5" r="2.2" fill={PUPIL} />
      <circle cx="97" cy="50.5" r="2.2" fill={PUPIL} />
      <circle cx="79.8" cy="49" r="1.1" fill="#fff" />
      <circle cx="95.8" cy="49" r="1.1" fill="#fff" />

      <path d="M87.5 58 h4.5 l-2.25 3 z" fill={PINK_NOSE} stroke={PINK_NOSE_RIM} strokeWidth="0.8" />
      <g stroke={SOFT_MOUTH} strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M89.7 61 v2" />
        <path d="M89.7 63 q-2.5 2 -4.5 0.6" />
        <path d="M89.7 63 q2.5 2 4.5 0.6" />
      </g>

      <g stroke={WHISKER} strokeWidth="1.2" strokeLinecap="round">
        <line x1="74" y1="56" x2="58" y2="53" />
        <line x1="74" y1="61" x2="59" y2="63" />
        <line x1="102" y1="56" x2="116" y2="53" />
        <line x1="102" y1="61" x2="115" y2="63" />
      </g>
    </>
  )
}

function Portrait() {
  return (
    <>
      {/* 耳朵：小、寬距、半埋進毛裡 */}
      <g stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
        <polygon points="29,40 35,20 49,29" fill="#fff" />
        <polygon points="91,40 85,20 71,29" fill="#fff" />
      </g>
      <polygon points="34,34 37,25 44,28" fill={INNER_EAR} />
      <polygon points="86,34 83,25 76,28" fill={INNER_EAR} />

      {/* 絲狀毛叢輪廓：寬扁橢圓（腳本產生的不規則毛叢） */}
      <path
        d="M105.0 63.0 Q119.2 69.4 103.2 72.6 Q111.5 80.8 97.9 81.4 Q105.5 92.8 89.5 88.7 Q90.3 98.6 78.7 93.9 Q76.0 104.1 66.4 96.7 Q60.0 101.2 53.6 96.7 Q43.6 105.1 41.3 93.9 Q29.1 99.4 30.5 88.7 Q17.7 90.7 22.1 81.4 Q5.9 81.7 16.8 72.6 Q3.4 69.1 15.0 63.0 Q2.1 56.7 16.8 53.4 Q10.3 45.9 22.1 44.6 Q17.0 34.9 30.5 37.3 Q29.5 27.1 41.3 32.1 Q45.3 25.3 53.6 29.3 Q60.0 22.1 66.4 29.3 Q74.9 24.7 78.7 32.1 Q90.1 27.6 89.5 37.3 Q100.6 36.4 97.9 44.6 Q112.6 44.8 103.2 53.4 Q115.2 57.0 105.0 63.0 Z"
        fill="#fff"
        stroke={OUTLINE}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* 銀色淡影：額頭與兩頰 */}
      <ellipse cx="60" cy="38" rx="12" ry="4" fill={SHADE} opacity="0.7" />
      <ellipse cx="26" cy="63" rx="6" ry="9" fill={SHADE} opacity="0.7" />
      <ellipse cx="94" cy="63" rx="6" ry="9" fill={SHADE} opacity="0.7" />

      {/* 內部毛流 */}
      <g stroke="#e4dccf" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M85.3 52.0 Q92.7 50.8 95.1 47.7" />
        <path d="M88.6 58.4 Q91.6 56.5 99.6 56.6" />
        <path d="M89.0 66.1 Q97.0 67.7 100.1 67.3" />
        <path d="M86.5 72.3 Q89.1 73.1 96.7 75.9" />
        <path d="M34.2 73.4 Q31.7 76.4 24.2 77.4" />
        <path d="M31.4 67.6 Q23.4 67.5 20.4 69.4" />
        <path d="M31.7 57.3 Q28.8 57.2 20.9 55.1" />
        <path d="M35.2 51.3 Q27.9 48.0 25.7 46.8" />
        <path d="M74.6 82.1 Q79.9 86.8 80.3 89.5" />
        <path d="M45.4 82.1 Q40.1 84.8 39.8 89.5" />
        <path d="M54.9 84.8 Q56.4 89.9 53.0 93.1" />
        <path d="M65.1 84.8 Q63.6 87.9 67.0 93.1" />
        <path d="M74.6 43.9 Q79.9 41.2 80.3 36.5" />
        <path d="M50.0 42.2 Q45.6 37.2 46.1 34.2" />
        <path d="M45.4 43.9 Q45.1 41.2 39.7 36.5" />
        <path d="M67.6 41.7 Q66.5 36.5 70.5 33.4" />
      </g>

      {/* 溫柔杏仁眼 */}
      <path
        d="M36.5 58 Q44 49.5 51.5 58 Q44 67.5 36.5 58 z"
        fill="#5ba379"
        stroke={EYE_RIM}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M68.5 58 Q76 49.5 83.5 58 Q76 67.5 68.5 58 z"
        fill="#5ba379"
        stroke={EYE_RIM}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="58.5" r="2.2" fill={PUPIL} />
      <circle cx="76" cy="58.5" r="2.2" fill={PUPIL} />
      <circle cx="42.5" cy="56.5" r="1.3" fill="#fff" />
      <circle cx="74.5" cy="56.5" r="1.3" fill="#fff" />

      {/* 粉鼻與小嘴（扁臉：鼻子靠近眼睛） */}
      <path d="M57 67 h6 l-3 4.2 z" fill={PINK_NOSE} stroke={PINK_NOSE_RIM} strokeWidth="0.8" strokeLinejoin="round" />
      <g stroke={SOFT_MOUTH} strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M60 71 v2.3" />
        <path d="M60 73.3 q-3 2.5 -5.5 0.8" />
        <path d="M60 73.3 q3 2.5 5.5 0.8" />
      </g>

      {/* 鬍鬚 */}
      <g stroke="#b3a68f" strokeWidth="1.3" strokeLinecap="round">
        <line x1="28" y1="64" x2="6" y2="60" />
        <line x1="28" y1="70" x2="7" y2="73" />
        <line x1="31" y1="76" x2="12" y2="83" />
        <line x1="92" y1="64" x2="114" y2="60" />
        <line x1="92" y1="70" x2="113" y2="73" />
        <line x1="89" y1="76" x2="108" y2="83" />
      </g>
    </>
  )
}

const VARIANTS = {
  classic: Classic,
  fluffy: Fluffy,
  ruff: Ruff,
  sitting: Sitting,
  gentle: Gentle,
  lying: Lying,
  portrait: Portrait,
}

export default function ChinchillaCat({
  className = '',
  variant = 'classic',
  expression = 'happy',
}) {
  const Variant = VARIANTS[variant] ?? Classic
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="金吉拉貓" className={className}>
      <Variant expression={expression} />
    </svg>
  )
}
