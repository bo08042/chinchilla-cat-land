// 貪吃貓引擎：網格、移動、碰撞、食物生成（純函式為主，含少量隨機輔助，
// 與貓咪方塊 engine.js 的慣例一致，不依賴 React 或 Canvas）。

export const GRID = 18
export const GOLDEN_TICKS = 26 // 金色魚乾存在的 tick 數，超過就消失
export const GOLDEN_EVERY = 5 // 每吃幾條普通魚乾後，觸發一次金色魚乾機會

export const POWERUP_EVERY = 7 // 每吃幾條普通魚乾後，觸發一次道具生成機會
export const POWERUP_TICKS = 30 // 道具在場上存在的 tick 數，超過就消失
export const EFFECT_TICKS = { catnip: 40, magnet: 35, slow: 35 } // 各道具吃到後的持續 tick 數
export const MAGNET_RADIUS = 4 // 魚乾磁鐵吸引食物的曼哈頓距離範圍
export const SLOW_MULTIPLIER = 1.6 // 減速藥水期間，tick 間隔乘上的倍率

export const POWERUP_TYPES = ['catnip', 'magnet', 'slow']
export const POWERUP_META = {
  catnip: { emoji: '🌿', label: '貓草無敵' },
  magnet: { emoji: '🧲', label: '魚乾磁鐵' },
  slow: { emoji: '🐌', label: '減速藥水' },
}

// 難度模式：速度曲線 + 家具障礙成長規則 + 該模式會出現的道具種類 + 是否有
// 掃地機器人（第二波新增 obstacles/powerups，第三波新增 roomba/seeded，見
// docs/chinchilla-cat-land/greedy-cat-roadmap.md 的搭配表）。
// start/floor 單位為毫秒，step 是每 3 分加快的幅度。
export const MODES = {
  easy: {
    id: 'easy',
    label: '簡單',
    emoji: '🐢',
    start: 260,
    step: 6,
    floor: 110,
    obstacles: null,
    powerups: { catnip: true, magnet: true, slow: false },
    roomba: false,
  },
  medium: {
    id: 'medium',
    label: '中等',
    emoji: '🐱',
    start: 220,
    step: 8,
    floor: 70,
    obstacles: { initial: 2, every: 12, max: 8 },
    powerups: { catnip: true, magnet: true, slow: true },
    roomba: false,
  },
  hard: {
    id: 'hard',
    label: '困難',
    emoji: '🔥',
    start: 180,
    step: 10,
    floor: 55,
    obstacles: { initial: 5, every: 8, max: 14 },
    powerups: { catnip: true, magnet: false, slow: true },
    roomba: true,
  },
  daily: {
    id: 'daily',
    label: '每日挑戰',
    emoji: '🎲',
    start: 220,
    step: 8,
    floor: 70,
    obstacles: { initial: 3, every: 10, max: 12 },
    powerups: { catnip: true, magnet: true, slow: true },
    roomba: true,
    seeded: true, // 所有隨機（食物/道具/機器人路徑）都改用種子亂數，見 mulberry32
  },
}
export const MODE_ORDER = ['easy', 'medium', 'hard']

export const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}
const DIR_KEYS = Object.keys(DIRS)

// mulberry32：輕量種子亂數產生器，回傳一個介於 0~1 的函式，用法與 Math.random
// 相容。每日挑戰用同一組種子讓所有玩家的關卡隨機序列（食物/道具位置、機器人
// 路徑）一致，達到「大家玩同一份考卷」的效果（詳見 roadmap 文件的架構前提：
// 純前端沒有後端即時排行榜，這裡只保證關卡本身相同）。
export function mulberry32(seed) {
  let a = seed >>> 0
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 由日期字串（YYYY-MM-DD）算出當天的種子
export function seedFromDate(dateStr) {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0
  }
  return hash >>> 0
}

export function todayDateStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
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

export function hitsCell(cells, pos) {
  return (cells || []).some((c) => c.x === pos.x && c.y === pos.y)
}

// 前進一格：grew=true 時保留尾巴（變長），否則去掉尾巴
export function advance(segments, head, grew) {
  const next = [head, ...segments]
  if (!grew) next.pop()
  return next
}

// 從網格中隨機挑一個未被佔用的格子；rng 預設 Math.random，每日挑戰會傳入
// mulberry32 的種子亂數，讓同一天所有玩家抽到同一組位置序列
export function randomCell(occupied, rng = Math.random) {
  const taken = new Set(occupied.map((c) => `${c.x},${c.y}`))
  const free = []
  for (let x = 0; x < GRID; x++) {
    for (let y = 0; y < GRID; y++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  if (free.length === 0) return null
  return free[Math.floor(rng() * free.length)]
}

// 速度曲線：分數越高跑越快，仿貓咪方塊的等級加速公式；依模式套用不同的
// 起始速度/加快幅度/最快下限
export function tickInterval(score, mode = MODES.medium) {
  return Math.max(mode.floor, mode.start - Math.floor(score / 3) * mode.step)
}

// 該模式目前分數下應該有幾個家具障礙（隨分數階梯式增加，有上限）
export function obstacleCountForScore(mode, score) {
  const cfg = mode.obstacles
  if (!cfg) return 0
  return Math.min(cfg.max, cfg.initial + Math.floor(score / cfg.every))
}

// 該模式會出現的道具種類（依搭配表，例如困難模式沒有魚乾磁鐵）
export function eligiblePowerupTypes(mode) {
  return POWERUP_TYPES.filter((t) => mode.powerups[t])
}

export function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

// 魚乾磁鐵吸引效果：往目標移動一格，一次只移動一個軸向，
// 模擬食物被「滑」過來的感覺（避免直接跳格、跳過障礙判斷過度複雜）
export function stepToward(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  if (dx === 0 && dy === 0) return { ...from }
  if (Math.abs(dx) >= Math.abs(dy)) return { x: from.x + Math.sign(dx), y: from.y }
  return { x: from.x, y: from.y + Math.sign(dy) }
}

// 掃地機器人下一步方向：60% 機率選「離蛇頭最近」的合法方向（簡單追蹤），
// 40% 純隨機（巡邏感，避免每次都精準咬過來，維持可閃避的難度）
export function pickRoombaDirection(pos, validDirs, targetPos, rng) {
  if (validDirs.length === 0) return null
  if (rng() < 0.6) {
    let best = validDirs[0]
    let bestDist = Infinity
    for (const d of validDirs) {
      const dist = manhattan(nextHead(pos, d), targetPos)
      if (dist < bestDist) {
        bestDist = dist
        best = d
      }
    }
    return best
  }
  return validDirs[Math.floor(rng() * validDirs.length)]
}

// 機器人下一步的合法方向：不出界、不撞家具障礙（蛇不會擋住它——撞到蛇正是
// 危險發生的時刻，不該被當成「路被擋住」而繞開）
export function roombaValidDirs(pos, obstacles) {
  return DIR_KEYS.filter((d) => {
    const next = nextHead(pos, d)
    return !outOfBounds(next) && !hitsCell(obstacles, next)
  })
}
