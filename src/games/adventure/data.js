// 金吉拉與好朋友的大冒險：棋盤、事件卡與角色資料。
// 簡化版大富翁：環形 20 格、擲骰前進、三圈內收集最多小魚乾獲勝。
// 不做地產買賣，以事件卡與答題維持變化與互動。

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

// 事件卡：effect 由遊戲元件解讀
//   fish: 自己加減 | move: 前進/後退 N 格（會觸發新格子）| rest: 下回合休息
//   collect: 每位其他玩家給你 N | give: 你給每位其他玩家 N
//   steal: 從魚最多的對手拿 N | again: 再擲一次 | toSnack: 前進到下一個點心格
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
]
