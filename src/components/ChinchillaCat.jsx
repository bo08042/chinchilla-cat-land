// 金吉拉吉祥物 SVG，全站共用以維持視覺一致。
// 造型參考真實金吉拉的神韻：小耳半埋蓬毛、綠寶石眼配天生黑眼線、磚紅小鼻、銀色毛尖。
//
// variant:
//   'classic'（預設）— 初版雲朵臉
//   'fluffy'  — 蓬蓬大頭版：毛球更多更密、小耳半埋、扁臉五官
//   'ruff'    — 優雅圍脖版：頭部 + 胸前大鬃毛圍脖
//   'sitting' — 全身坐姿版：毛球身體、前腳與蓬尾
// expression: 'happy'（預設）| 'surprised'（僅 classic 支援，404 等驚訝場景用）

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

function Fluffy() {
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
      <ellipse cx="44" cy="61" rx="3.4" ry="5.4" fill={PUPIL} />
      <ellipse cx="76" cy="61" rx="3.4" ry="5.4" fill={PUPIL} />
      <circle cx="41.5" cy="57" r="2.2" fill="#fff" />
      <circle cx="73.5" cy="57" r="2.2" fill="#fff" />

      <path d="M57 70 h6 l-3 4 z" fill={NOSE} stroke={NOSE_RIM} strokeWidth="1" strokeLinejoin="round" />
      <g stroke={MOUTH} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M60 74 v3" />
        <path d="M60 77 q-3.5 3.5 -7 1" />
        <path d="M60 77 q3.5 3.5 7 1" />
      </g>

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

const VARIANTS = {
  classic: Classic,
  fluffy: Fluffy,
  ruff: Ruff,
  sitting: Sitting,
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
