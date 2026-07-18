// 每日運勢資料：等級（含權重）與貓咪主題籤詩。
// 權重決定抽中機率；每個等級有多條籤詩與宜/忌隨機組合。

export const levels = [
  {
    id: 'daikichi',
    name: '大吉',
    emoji: '🌟',
    weight: 10,
    color: 'text-honey-600',
    variant: 'ruff',
    lines: [
      '今天的你就像剛梳完毛的金吉拉，走到哪裡都閃閃發光！',
      '貓咪主動來蹭你的日子，好運也會跟著蹭上門。',
      '如絲般順滑的一天，所有事情都會像貓咪落地一樣穩穩的。',
    ],
  },
  {
    id: 'chukichi',
    name: '中吉',
    emoji: '✨',
    weight: 20,
    color: 'text-emerald-700',
    variant: 'fluffy',
    lines: [
      '穩穩的好日子，像窗台上曬太陽的貓，舒服自在。',
      '會有小驚喜出現，就像在沙發縫裡撿到貓咪藏的玩具。',
      '適合完成拖延已久的事，貓咪都在替你加油。',
    ],
  },
  {
    id: 'kichi',
    name: '吉',
    emoji: '🍀',
    weight: 25,
    color: 'text-emerald-700',
    variant: 'sitting',
    lines: [
      '平順的一天，記得像貓咪一樣偶爾伸個懶腰。',
      '小事順利、大事緩緩，跟著貓咪的步調走就對了。',
      '今天適合安靜做自己的事，像金吉拉一樣優雅低調。',
    ],
  },
  {
    id: 'shokichi',
    name: '小吉',
    emoji: '🌤️',
    weight: 25,
    color: 'text-cocoa-700',
    variant: 'gentle',
    lines: [
      '運氣像貓咪的心情，時好時壞，但撐過去就有罐罐。',
      '別急，貓咪等罐頭都能等三小時，你也可以再等等。',
      '今天適合觀察與等待，機會像躲貓貓一樣藏在角落。',
    ],
  },
  {
    id: 'suekichi',
    name: '末吉',
    emoji: '🌥️',
    weight: 15,
    color: 'text-cocoa-500',
    variant: 'lying',
    lines: [
      '慢慢來比較快，學學趴著的金吉拉，急什麼呢？',
      '今天低調行事，像貓咪縮在紙箱裡最安全。',
      '運勢平平，但摸摸貓就能回血，記得補充毛茸茸能量。',
    ],
  },
  {
    id: 'kyo',
    name: '小凶',
    emoji: '🌧️',
    weight: 5,
    color: 'text-cocoa-500',
    variant: 'classic',
    expression: 'surprised',
    lines: [
      '今天容易踩到貓尾巴——說話做事都放輕一點。',
      '諸事不宜衝動，像被吸塵器嚇到的貓，先冷靜再行動。',
      '小心地滑（貓咪剛打翻水碗），謹慎度過就會沒事的。',
    ],
  },
]

export const doList = [
  '梳毛', '吸貓', '曬太陽', '喝水 2000cc', '早點睡', '整理房間',
  '跟貓咪說早安', '拍貓咪美照', '買個小罐罐', '散步', '深呼吸三次', '稱讚別人',
]

export const dontList = [
  '洗貓', '剪指甲', '熬夜', '暴飲暴食', '踩貓尾巴', '亂買東西',
  '跟貓咪講道理', '打擾睡覺中的貓', '拖延症發作', '嗑太多零食', '生悶氣', '忘記鏟砂',
]
