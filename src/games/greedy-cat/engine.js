// 貪吃貓引擎：網格、移動、碰撞、食物生成（純函式為主，含少量隨機輔助，
// 與貓咪方塊 engine.js 的慣例一致，不依賴 React 或 Canvas）。

export const GRID = 18
export const GOLDEN_TICKS = 26 // 金色魚乾存在的 tick 數，超過就消失
export const GOLDEN_EVERY = 5 // 每吃幾條普通魚乾後，觸發一次金色魚乾機會

// 難度模式：目前只影響速度曲線（之後障礙物/道具會依模式進一步分化，
// 見 docs 規劃）。start/floor 單位為毫秒，step 是每 3 分加快的幅度。
export const MODES = {
  easy: { id: 'easy', label: '簡單', emoji: '🐢', start: 260, step: 6, floor: 110 },
  medium: { id: 'medium', label: '中等', emoji: '🐱', start: 220, step: 8, floor: 70 },
  hard: { id: 'hard', label: '困難', emoji: '🔥', start: 180, step: 10, floor: 55 },
}
export const MODE_ORDER = ['easy', 'medium', 'hard']

export const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export function createSnake() {
  const c = Math.floor(GRID / 2)
  // 蛇頭在陣列第 0 個，身體向左延伸
  return [
    { x: c, y: c },
    { x: c - 1, y: c },
    { x: c - 2, y: c },
  ]
}

export function isOpposite(a, b) {
  return DIRS[a].x === -DIRS[b].x && DIRS[a].y === -DIRS[b].y
}

export function nextHead(head, dir) {
  const d = DIRS[dir]
  return { x: head.x + d.x, y: head.y + d.y }
}

export function samePos(a, b) {
  return !!a && !!b && a.x === b.x && a.y === b.y
}

export function outOfBounds(pos) {
  return pos.x < 0 || pos.x >= GRID || pos.y < 0 || pos.y >= GRID
}

// 簡化判定：不含目前尾巴（尾巴這一步通常會讓開，撞尾巴不算撞到）
export function hitsBody(segments, pos) {
  return segments.slice(0, -1).some((s) => s.x === pos.x && s.y === pos.y)
}

// 前進一格：grew=true 時保留尾巴（變長），否則去掉尾巴
export function advance(segments, head, grew) {
  const next = [head, ...segments]
  if (!grew) next.pop()
  return next
}

// 從網格中隨機挑一個未被佔用的格子
export function randomCell(occupied) {
  const taken = new Set(occupied.map((c) => `${c.x},${c.y}`))
  const free = []
  for (let x = 0; x < GRID; x++) {
    for (let y = 0; y < GRID; y++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  if (free.length === 0) return null
  return free[Math.floor(Math.random() * free.length)]
}

// 速度曲線：分數越高跑越快，仿貓咪方塊的等級加速公式；依模式套用不同的
// 起始速度/加快幅度/最快下限
export function tickInterval(score, mode = MODES.medium) {
  return Math.max(mode.floor, mode.start - Math.floor(score / 3) * mode.step)
}
