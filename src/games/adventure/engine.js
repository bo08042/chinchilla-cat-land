// 大冒險引擎：純函式輔助。
import { TILES, EVENT_CARDS } from './data'
import { banks } from '../quiz/banks'

export const TILE_COUNT = TILES.length

// 棋盤座標：6x6 外圈 20 格。index 0 在左下角，順時針（沿底邊向右 → 右邊向上 → 頂邊向左 → 左邊向下）。
// 回傳格子左上角座標（格子 60x60、外距 15，viewBox 390x390）。
export function tileCoord(index) {
  const size = 60
  const margin = 15
  let col
  let row
  if (index <= 5) {
    col = index
    row = 5
  } else if (index <= 9) {
    col = 5
    row = 5 - (index - 5)
  } else if (index <= 15) {
    col = 5 - (index - 10)
    row = 0
  } else {
    col = 0
    row = index - 15
  }
  return { x: margin + col * size, y: margin + row * size }
}

export function rollDice() {
  return Math.ceil(Math.random() * 6)
}

export function pickEventCard() {
  return EVENT_CARDS[Math.floor(Math.random() * EVENT_CARDS.length)]
}

// 從兩套測驗題庫隨機抽一題（選項洗牌）
export function pickQuizQuestion() {
  const all = [...banks.master.questions, ...banks.careExam.questions]
  const q = all[Math.floor(Math.random() * all.length)]
  const order = q.options.map((_, i) => i).sort(() => Math.random() - 0.5)
  return {
    question: q.question,
    options: order.map((i) => q.options[i]),
    answer: order.indexOf(q.answer),
    explanation: q.explanation,
  }
}

// 下一個點心格的 index（從 from 往前找，不含 from）
export function nextSnackIndex(from) {
  for (let step = 1; step <= TILE_COUNT; step++) {
    const idx = (from + step) % TILE_COUNT
    if (TILES[idx].type === 'snack') return idx
  }
  return from
}

// 魚最多的其他玩家 index（同分取前者；全部同分也會回傳一位）
export function richestOpponent(fish, self) {
  let best = -1
  let bestFish = -1
  for (let i = 0; i < fish.length; i++) {
    if (i === self) continue
    if (fish[i] > bestFish) {
      bestFish = fish[i]
      best = i
    }
  }
  return best
}
