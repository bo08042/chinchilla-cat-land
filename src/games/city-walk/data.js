// 城市漫步：事件卡池與結局。
// 事件 schema：
//   { id, zone, emoji, text, choices: [choice] }
//   choice: { text, effects?: {curiosity/fullness/courage: n}, goTo?: 換區域,
//             next?: 指定下一事件（劇情鏈）, flag?: 設旗標, requires?: {屬性: 門檻} }
// 沒有 goTo/next 時，下一步從目前區域卡池隨機抽（不重複）。

export const STEPS = 8 // 一場散步的事件數

export const ATTRS = [
  { id: 'curiosity', name: '好奇', emoji: '🔍' },
  { id: 'fullness', name: '飽足', emoji: '🍙' },
  { id: 'courage', name: '勇氣', emoji: '💪' },
]

export const ZONES = {
  street: { name: '街道', emoji: '🏘️' },
  park: { name: '公園', emoji: '🌳' },
  market: { name: '市場', emoji: '🏮' },
  alley: { name: '小巷', emoji: '🚏' },
  rooftop: { name: '屋頂', emoji: '🌇' },
}

export const START_EVENT = 'start'

export const events = [
  /* ---------- 街道 ---------- */
  {
    id: 'start',
    zone: 'street',
    emoji: '🚪',
    text: '天氣真好！窗戶沒關緊——金吉拉決定溜出門，展開今天的城市漫步。要往哪走呢？',
    choices: [
      { text: '往綠意盎然的公園', effects: { curiosity: 1 }, goTo: 'park' },
      { text: '往香味飄來的市場', effects: { fullness: 1 }, goTo: 'market' },
      { text: '沿著熟悉的街道走', effects: { courage: 1 } },
    ],
  },
  {
    id: 'shiba',
    zone: 'street',
    emoji: '🐕',
    text: '迎面走來一隻散步中的柴犬，搖著尾巴湊過來聞聞。',
    choices: [
      { text: '優雅地打聲招呼', effects: { courage: 2 } },
      { text: '跳上矮牆保持距離', effects: { curiosity: 1 } },
      { text: '掉頭鑽進小巷', goTo: 'alley' },
    ],
  },
  {
    id: 'butterfly',
    zone: 'street',
    emoji: '🦋',
    text: '一隻橘色蝴蝶從眼前飛過，停在圍牆上，翅膀一開一合。',
    choices: [
      { text: '追！尾隨蝴蝶前進', effects: { curiosity: 2 } },
      { text: '蹲下觀察就好', effects: { curiosity: 1, courage: 1 } },
    ],
  },
  {
    id: 'puddle',
    zone: 'street',
    emoji: '💧',
    text: '昨晚下過雨，路邊有個小水窪，倒映著一隻毛茸茸的漂亮貓咪。',
    choices: [
      { text: '欣賞自己的美貌', effects: { courage: 1 } },
      { text: '拍拍水面驗證真偽', effects: { curiosity: 2 } },
    ],
  },
  {
    id: 'scooter',
    zone: 'street',
    emoji: '🛵',
    text: '一排機車下傳來窸窸窣窣的聲音，好像有誰躲在陰影裡。',
    choices: [
      { text: '鑽進去一探究竟', effects: { curiosity: 2, courage: 1 } },
      { text: '喵一聲看誰回應', effects: { curiosity: 1 } },
      { text: '不理會，繼續散步', effects: { fullness: 1 } },
    ],
  },

  /* ---------- 公園 ---------- */
  {
    id: 'sparrows',
    zone: 'park',
    emoji: '🐦',
    text: '草地上一群麻雀跳來跳去啄食物，完全沒發現一隻貓正在接近。',
    choices: [
      { text: '壓低身子……狩獵演習！', effects: { courage: 2 } },
      { text: '靜靜看牠們吃飯', effects: { curiosity: 1 } },
    ],
  },
  {
    id: 'grandpa',
    zone: 'park',
    emoji: '👴',
    text: '長椅上的爺爺看見金吉拉，笑瞇瞇地從袋子裡拿出一小塊魚乾。',
    choices: [
      { text: '大方接受招待', effects: { fullness: 2 } },
      { text: '蹭蹭他的褲管再吃', effects: { fullness: 1, curiosity: 1 } },
      { text: '保持貴族的矜持', effects: { courage: 1 } },
    ],
  },
  {
    id: 'fountain',
    zone: 'park',
    emoji: '⛲',
    text: '噴水池的水柱忽高忽低，在陽光下閃閃發亮，好像在跳舞。',
    choices: [
      { text: '伸出貓掌碰碰水花', effects: { curiosity: 2 } },
      { text: '在池邊優雅喝兩口水', effects: { fullness: 1 } },
    ],
  },
  {
    id: 'big-tree',
    zone: 'park',
    emoji: '🌳',
    text: '公園裡最高的老榕樹。從這裡爬上去，好像可以通到旁邊房子的屋頂……',
    choices: [
      { text: '爬上去！', requires: { courage: 3 }, effects: { courage: 1 }, goTo: 'rooftop' },
      { text: '在樹幹磨磨爪就好', effects: { courage: 1 } },
      { text: '樹下打個小盹', effects: { fullness: 1 } },
    ],
  },
  {
    id: 'picnic',
    zone: 'park',
    emoji: '🧺',
    text: '一家人在野餐墊上吃三明治，小妹妹發現了金吉拉，眼睛都亮了。',
    choices: [
      { text: '表演翻滾賣萌', effects: { fullness: 2, curiosity: 1 } },
      { text: '遠遠坐著當觀眾', effects: { curiosity: 1 } },
    ],
  },

  /* ---------- 市場 ---------- */
  {
    id: 'fish-stall',
    zone: 'market',
    emoji: '🐟',
    text: '魚攤上的鯖魚閃著銀光，香味撲鼻。老闆正忙著招呼客人……',
    choices: [
      { text: '趁機叼走一條小魚', requires: { courage: 2 }, effects: { fullness: 2, courage: 1 } },
      { text: '坐在攤前賣萌等投餵', effects: { fullness: 1, curiosity: 1 } },
      { text: '深呼吸聞個過癮就好', effects: { fullness: 1 } },
    ],
  },
  {
    id: 'fried-stand',
    zone: 'market',
    emoji: '🍗',
    text: '鹽酥雞攤的香氣霸佔了整條街。排隊的人龍裡，有人低頭看見了金吉拉。',
    choices: [
      { text: '用眼神施展催眠術：給我一塊', effects: { fullness: 2 } },
      { text: '這種重口味不適合貓，撤退', effects: { courage: 1 }, goTo: 'alley' },
    ],
  },
  {
    id: 'crowd',
    zone: 'market',
    emoji: '👥',
    text: '市場人潮洶湧，腳步聲從四面八方而來，有點可怕，但攤位後面好像有捷徑。',
    choices: [
      { text: '勇敢穿越人群', effects: { courage: 2 } },
      { text: '沿著攤位後面繞路', effects: { curiosity: 1 }, goTo: 'alley' },
    ],
  },
  {
    id: 'butcher',
    zone: 'market',
    emoji: '🥩',
    text: '肉攤的老闆娘認得這隻漂亮的貓：「又來啦？」她切了一小條肉放在乾淨的紙板上。',
    choices: [
      { text: '感恩享用，蹭蹭道謝', effects: { fullness: 2, curiosity: 1 } },
      { text: '叼到安靜的角落慢慢吃', effects: { fullness: 2 }, goTo: 'alley' },
    ],
  },
  {
    id: 'sausage',
    zone: 'market',
    emoji: '🌭',
    text: '前方一個小朋友的香腸掉在地上，他還沒發現。香腸近在眼前……',
    choices: [
      { text: '喵喵叫提醒小朋友', effects: { courage: 1, curiosity: 1 } },
      { text: '這是天上掉下來的禮物', effects: { fullness: 2 } },
    ],
  },

  /* ---------- 小巷 ---------- */
  {
    id: 'kitten-cry',
    zone: 'alley',
    emoji: '📦',
    text: '小巷深處傳來微弱的「咪、咪」聲……是一隻卡在倒塌紙箱堆裡的小奶貓！',
    choices: [
      { text: '衝過去想辦法救牠', next: 'kitten-rescue', effects: { courage: 1 } },
      { text: '大聲喵叫呼救', next: 'kitten-rescue', effects: { curiosity: 1 } },
      { text: '有點可怕，還是離開吧', goTo: 'street' },
    ],
  },
  {
    id: 'kitten-rescue',
    zone: 'alley',
    emoji: '🐱',
    text: '金吉拉用力推開紙箱，小奶貓獲救了！牠感激地蹭著金吉拉。巷口的住戶聞聲出來，決定收編小奶貓。',
    choices: [
      { text: '目送小奶貓有了新家', flag: 'hero', effects: { courage: 2, curiosity: 1 } },
      { text: '驕傲地抬頭挺胸離開', flag: 'hero', effects: { courage: 2 } },
    ],
  },
  {
    id: 'tough-cat',
    zone: 'alley',
    emoji: '🐈‍⬛',
    text: '一隻獨眼黑貓擋在巷子中間，牠是這一帶的地盤主，正上下打量著金吉拉。',
    choices: [
      { text: '不卑不亢地對視', requires: { courage: 2 }, effects: { courage: 2 } },
      { text: '露出肚皮表示友好', effects: { curiosity: 1 } },
      { text: '緩緩退出小巷', goTo: 'street' },
    ],
  },
  {
    id: 'box-fort',
    zone: 'alley',
    emoji: '🏰',
    text: '巷子裡堆著一疊乾淨的紙箱，簡直是貓咪的城堡！最上層的視野一定很棒。',
    choices: [
      { text: '一層層跳上紙箱頂', effects: { courage: 2, curiosity: 1 } },
      { text: '鑽進最下層的箱子窩著', effects: { fullness: 1 } },
    ],
  },
  {
    id: 'fire-ladder',
    zone: 'alley',
    emoji: '🪜',
    text: '牆邊有座生鏽的逃生梯，一路通往屋頂。風從上面吹下來，帶著天空的味道。',
    choices: [
      { text: '順著梯子往上爬', requires: { courage: 3 }, goTo: 'rooftop', effects: { courage: 1 } },
      { text: '在梯子下仰望就好', effects: { curiosity: 1 } },
    ],
  },

  /* ---------- 屋頂 ---------- */
  {
    id: 'pigeons',
    zone: 'rooftop',
    emoji: '🕊️',
    text: '屋頂上停著一排鴿子，看見貓咪上來，牠們警戒地咕咕叫。',
    choices: [
      { text: '假裝沒興趣地經過', effects: { courage: 1, curiosity: 1 } },
      { text: '衝散牠們！哈哈！', effects: { courage: 2 } },
    ],
  },
  {
    id: 'rooftop-view',
    zone: 'rooftop',
    emoji: '🌆',
    text: '從屋頂望出去，整座城市在腳下延伸——原來自己的家在那個方向。',
    choices: [
      { text: '靜靜眺望，記住這風景', effects: { courage: 1, curiosity: 1 } },
      { text: '對著城市喵一聲宣示', effects: { courage: 2 } },
    ],
  },
  {
    id: 'water-tower',
    zone: 'rooftop',
    emoji: '🛢️',
    text: '水塔的陰影下涼涼的，是個午睡的好地方，但睡著就要錯過接下來的冒險了。',
    choices: [
      { text: '小睡片刻，補充體力', effects: { fullness: 2 } },
      { text: '忍住睡意，繼續探索', effects: { curiosity: 2 } },
    ],
  },
]

// 結局：checkOrder 由上而下判定
export const endings = [
  {
    id: 'hero',
    name: '巷口的小英雄',
    emoji: '🦸',
    variant: 'ruff',
    condition: '救出小巷裡的小奶貓',
    text: '救援小奶貓的事蹟傳遍了整個街區，連魚攤老闆都多留了一條小魚給這位英雄。金吉拉優雅地舔舔手，深藏功與名。',
  },
  {
    id: 'sunset',
    name: '屋頂上的夕陽',
    emoji: '🌇',
    variant: 'lying',
    condition: '勇氣最高且達 6 點',
    text: '爬上最高的屋頂，金吉拉在夕陽下瞇起眼睛。城市被染成蜂蜜色，晚風吹過蓬鬆的毛——這是勇者才看得到的風景。',
  },
  {
    id: 'feast',
    name: '吃飽飽的福貓',
    emoji: '🍱',
    variant: 'sitting',
    condition: '飽足最高且達 6 點',
    text: '魚乾、小肉條、路邊的招待……今天的收穫太豐盛了。金吉拉摸著圓滾滾的肚子踏上歸途，決定明天再來巡視一次。',
  },
  {
    id: 'friend',
    name: '交到新朋友',
    emoji: '🤝',
    variant: 'fluffy',
    condition: '好奇最高且達 6 點',
    text: '好奇心帶著金吉拉認識了蝴蝶、麻雀、黑貓老大和野餐的小妹妹。回家的路上，牠的尾巴翹得高高的——朋友變多的日子真好。',
  },
  {
    id: 'chill',
    name: '平靜的散步日',
    emoji: '🛋️',
    variant: 'gentle',
    condition: '悠閒地走完全程',
    text: '沒有大冒險也沒關係，曬曬太陽、看看街景，就是貓生的美好。金吉拉回到家，跳上最愛的沙發，滿足地閉上眼睛。',
  },
]
