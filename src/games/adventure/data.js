// 金吉拉與好朋友的大冒險：棋盤、事件卡與角色資料。
// 簡化版大富翁：環形 20 格、擲骰前進、三圈內收集最多小魚乾獲勝。
// 不做地產買賣，改以事件卡、機會格答題、玩家相遇維持變化與互動。

export const LAPS_TO_FINISH = 3 // 完成圈數後進入結算
export const PASS_START_BONUS = 5 // 經過起點的小魚乾獎勵

// 格子類型：
//   start 起點 | snack 點心 | event 事件卡 | quiz 機會（答題）| rest 休息 | dash 衝刺
export const TILES = [
  { type: 'start', emoji: '🏁', label: '起點' },
  { type: 'snack', emoji: '🐟', label: '小魚乾', gain: 3 },
  { type: 'event', emoji: '❓', label: '事件' },
  { type: 'quiz', emoji: '💡', label: '機會' },
  { type: 'snack', emoji: '🍙', label: '飯糰', gain: 2 },
  { type: 'rest', emoji: '😴', label: '午睡' },
  { type: 'event', emoji: '❓', label: '事件' },
  { type: 'snack', emoji: '🐟', label: '小魚乾', gain: 3 },
  { type: 'quiz', emoji: '💡', label: '機會' },
  { type: 'event', emoji: '❓', label: '事件' },
  { type: 'dash', emoji: '💨', label: '衝刺' },
  { type: 'snack', emoji: '🍙', label: '飯糰', gain: 2 },
  { type: 'event', emoji: '❓', label: '事件' },
  { type: 'quiz', emoji: '💡', label: '機會' },
  { type: 'snack', emoji: '🐟', label: '小魚乾', gain: 3 },
  { type: 'rest', emoji: '😴', label: '午睡' },
  { type: 'event', emoji: '❓', label: '事件' },
  { type: 'quiz', emoji: '💡', label: '機會' },
  { type: 'snack', emoji: '🍙', label: '飯糰', gain: 2 },
  { type: 'event', emoji: '❓', label: '事件' },
]

// 角色：玩家是金吉拉，AI 是好朋友（accuracy = 答題正確率）
export const PLAYERS = [
  { id: 'chin', name: '金吉拉', emoji: '🐱', color: '#f0b429', isAI: false },
  { id: 'ragdoll', name: '布偶貓妞妞', emoji: '🐈', color: '#e58ba0', isAI: true, accuracy: 0.6 },
  { id: 'shiba', name: '柴犬旺旺', emoji: '🐶', color: '#5da583', isAI: true, accuracy: 0.5 },
]

// 事件卡：
//   固定效果卡用 effect，由遊戲元件解讀：
//     fish: 自己加減 | move: 前進/後退 N 格（會觸發新格子）| rest: 下回合休息
//     collect: 每位其他玩家給你 N | give: 你給每位其他玩家 N
//     steal: 從魚最多的對手拿 N | again: 再擲一次 | toSnack: 前進到下一個點心格
//   選擇卡（B2）用 choices：兩個選項各自的 effect + resultText，玩家自選、AI 依期望值挑高的
export const EVENT_CARDS = [
  { emoji: '🥫', text: '路邊撿到一個沒開過的罐罐！', effect: { fish: 6 } },
  { emoji: '🍼', text: '幫鄰居阿姨照顧小奶貓，獲得謝禮。', effect: { fish: 4 } },
  { emoji: '📸', text: '被觀光客拍照，當了一天網紅貓。', effect: { fish: 3 } },
  { emoji: '🤢', text: '毛球卡在喉嚨，看獸醫花掉一些小魚乾……', effect: { fish: -3 } },
  { emoji: '🏺', text: '打翻花瓶！賠償損失。', effect: { fish: -4 } },
  { emoji: '🌧️', text: '突然下雨，躲在屋簷下發呆，什麼也沒發生。', effect: {} },
  { emoji: '🐟', text: '聞到魚攤的香味，忍不住往前衝！', effect: { move: 2 } },
  { emoji: '🧹', text: '被掃把嚇到，倒退好幾步！', effect: { move: -2 } },
  { emoji: '🎉', text: '今晚是貓咪集會！每位朋友送你 1 條小魚乾。', effect: { collect: 1 } },
  { emoji: '🍽️', text: '心情大好請客，給每位朋友 1 條小魚乾。', effect: { give: 1 } },
  { emoji: '🕵️', text: '趁最富有的對手打瞌睡，叼走 2 條小魚乾！', effect: { steal: 2 } },
  { emoji: '🍀', text: '踩到幸運的四葉草，再擲一次骰子！', effect: { again: true } },
  { emoji: '🛤️', text: '發現貓咪限定捷徑，直達下一個點心格！', effect: { toSnack: true } },
  { emoji: '💤', text: '曬著太陽睡著了……下回合休息。', effect: { rest: true } },
  { emoji: '🧣', text: '撿到一顆毛線球，玩到忘記時間，原地度過了一天。', effect: {} },
  { emoji: '🐾', text: '留下一整排可愛腳印，被路人稱讚拍手！', effect: { fish: 2 } },
  { emoji: '🕳️', text: '差點掉進水溝，虛驚一場，什麼也沒發生。', effect: {} },
  { emoji: '🎈', text: '追著飄走的氣球玩，開心地跑了一段路！', effect: { move: 1 } },
  { emoji: '🧴', text: '被草叢裡的灑水器噴到，嚇得後退！', effect: { move: -1 } },
  { emoji: '🌻', text: '在向日葵花園裡打滾，心情大好。', effect: { fish: 2 } },
  {
    emoji: '🍡',
    text: '路邊撿到一支糖葫蘆，要跟旁邊的野貓分享嗎？',
    choices: [
      { label: '大方分享', effect: { give: 1 }, resultText: '大方分享，收穫了滿滿好人緣！' },
      { label: '偷偷獨吞', effect: { fish: 2 }, resultText: '偷偷獨吞，賺到 2 條魚！' },
    ],
  },
  {
    emoji: '🚦',
    text: '眼前有兩條路：看起來危險的捷徑，還是穩妥的大路？',
    choices: [
      { label: '走危險捷徑', effect: { move: 3 }, resultText: '勇敢抄了捷徑，往前衝 3 格！' },
      { label: '穩穩走大路', effect: { fish: 2 }, resultText: '穩穩地走，順手撿到 2 條魚。' },
    ],
  },
  {
    emoji: '🎣',
    text: '池塘邊有條魚在跳，要冒險撈魚嗎？',
    choices: [
      { label: '試著撈起來', effect: { fish: 4 }, resultText: '成功撈到魚，+4 🐟！' },
      { label: '安靜旁觀就好', effect: { fish: 1 }, resultText: '靜靜欣賞，+1 🐟。' },
    ],
  },
  {
    emoji: '🧺',
    text: '看到一位老爺爺提著菜籃走得吃力，要幫忙嗎？',
    choices: [
      { label: '蹭過去陪他走', effect: { fish: 3 }, resultText: '老爺爺開心地給了謝禮，+3 🐟！' },
      { label: '在旁邊曬太陽', effect: {}, resultText: '悠閒地曬了個太陽，什麼都沒發生。' },
    ],
  },
]

// 相遇事件（B3）：兩位玩家的棋子停在同一格（起點除外）時隨機觸發一種。
// resolve(st, p, target) 直接修改 fish 陣列，回傳給雙方看的訊息字串。
export const ENCOUNTERS = [
  {
    id: 'paw-duel',
    emoji: '🤜',
    flavor: '玩起了貓拳對決',
    resolve(st, p, target) {
      const steal = 2
      const winner = Math.random() < 0.5 ? p : target
      const loser = winner === p ? target : p
      const taken = Math.min(steal, st.fish[loser])
      st.fish[loser] -= taken
      st.fish[winner] += taken
      return `${winner === p ? '你' : '對方'}贏得對決，拿走 ${taken} 🐟！`
    },
  },
  {
    id: 'race',
    emoji: '🏃',
    flavor: '互相下戰帖比賽衝刺',
    resolve(st, p, target) {
      const winner = Math.random() < 0.5 ? p : target
      const loser = winner === p ? target : p
      st.fish[winner] += 3
      st.fish[loser] += 1
      return `${winner === p ? '你' : '對方'}贏得比賽，+3 🐟；另一位安慰獎 +1 🐟。`
    },
  },
  {
    id: 'share-snack',
    emoji: '🍡',
    flavor: '一起分享路邊撿到的小點心',
    resolve(st, p, target) {
      st.fish[p] += 2
      st.fish[target] += 2
      return '雙方都很開心，各 +2 🐟！'
    },
  },
  {
    id: 'startled',
    emoji: '🙀',
    flavor: '冷不防互相嚇了一大跳',
    resolve() {
      return '雙方都愣住了，什麼事也沒發生。'
    },
  },
  {
    id: 'gift-swap',
    emoji: '🎁',
    flavor: '交換了彼此的小禮物',
    resolve(st, p, target) {
      const diff = st.fish[p] - st.fish[target]
      const transfer = Math.round(Math.abs(diff) * 0.3)
      if (transfer > 0) {
        if (diff > 0) {
          st.fish[p] -= transfer
          st.fish[target] += transfer
        } else {
          st.fish[target] -= transfer
          st.fish[p] += transfer
        }
        return `比較闊綽的一方分了 ${transfer} 🐟 給對方，拉近了距離。`
      }
      return '雙方的禮物差不多，開心地交換了心意。'
    },
  },
]

// 機會格加注（B1）：押注需要至少這麼多魚，答對雙倍、答錯全虧
export const WAGER = { cost: 2, correctFish: 12, wrongLoss: 2 }
export const QUIZ_BASE = { correctFish: 6, wrongFish: 1 }
