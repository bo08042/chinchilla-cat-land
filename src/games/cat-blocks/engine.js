// 貓咪方塊引擎：純函式，不依賴 React 與 Canvas。
// 棋盤為 ROWS x COLS 的二維陣列，0 = 空格，其餘為方塊類型字串（'I'、'O'…）。

export const COLS = 10
export const ROWS = 20

// 七種方塊的旋轉態（以 4x4 內的座標表示）
const SHAPES = {
  I: [
    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[1, 0], [1, 1], [1, 2], [1, 3]],
  ],
  O: [
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
  ],
  T: [
    [[1, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [1, 2]],
    [[1, 0], [0, 1], [1, 1], [1, 2]],
  ],
  S: [
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[1, 0], [1, 1], [2, 1], [2, 2]],
    [[1, 1], [2, 1], [0, 2], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
  ],
  Z: [
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    [[2, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [1, 2], [2, 2]],
    [[1, 0], [0, 1], [1, 1], [0, 2]],
  ],
  J: [
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [0, 2], [1, 2]],
  ],
  L: [
    [[2, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
    [[0, 1], [1, 1], [2, 1], [0, 2]],
    [[0, 0], [1, 0], [1, 1], [1, 2]],
  ],
}

export const TYPES = Object.keys(SHAPES)

export function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0))
}

// 7-bag 隨機：一袋七種各一，抽完再洗新袋，避免同款連續出太多
export function refillBag() {
  const bag = [...TYPES]
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[bag[i], bag[j]] = [bag[j], bag[i]]
  }
  return bag
}

export function spawnPiece(type) {
  return { type, rot: 0, x: 3, y: -1 }
}

// 方塊目前佔用的棋盤座標
export function cellsOf(piece) {
  return SHAPES[piece.type][piece.rot].map(([dx, dy]) => [piece.x + dx, piece.y + dy])
}

export function collides(board, piece) {
  return cellsOf(piece).some(([x, y]) => {
    if (x < 0 || x >= COLS || y >= ROWS) return true
    if (y < 0) return false // 頂端上方允許（剛出生）
    return board[y][x] !== 0
  })
}

// 嘗試移動/旋轉，成功回傳新 piece，失敗回傳 null
export function tryMove(board, piece, dx, dy) {
  const next = { ...piece, x: piece.x + dx, y: piece.y + dy }
  return collides(board, next) ? null : next
}

export function tryRotate(board, piece) {
  const next = { ...piece, rot: (piece.rot + 1) % 4 }
  // 簡易 wall kick：原地不行就往左右各試一格
  for (const dx of [0, -1, 1, -2, 2]) {
    const kicked = { ...next, x: next.x + dx }
    if (!collides(board, kicked)) return kicked
  }
  return null
}

// 固定方塊到棋盤（不修改原棋盤）
export function merge(board, piece) {
  const next = board.map((row) => [...row])
  for (const [x, y] of cellsOf(piece)) {
    if (y >= 0) next[y][x] = piece.type
  }
  return next
}

// 消行：回傳新棋盤與消除行數
export function clearLines(board) {
  const kept = board.filter((row) => row.some((c) => c === 0))
  const cleared = ROWS - kept.length
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(0))
  return { board: kept, cleared }
}

// 幽靈方塊（落點預覽）的 y 位置
export function ghostOf(board, piece) {
  let ghost = piece
  let next = tryMove(board, ghost, 0, 1)
  while (next) {
    ghost = next
    next = tryMove(board, ghost, 0, 1)
  }
  return ghost
}

// 計分：一次消 1/2/3/4 行的基礎分 × 等級
const LINE_SCORES = { 1: 100, 2: 300, 3: 500, 4: 800 }
export function scoreFor(cleared, level) {
  return (LINE_SCORES[cleared] ?? 0) * level
}

// 等級與掉落速度：每消 10 行升一級
export function levelFor(lines) {
  return Math.floor(lines / 10) + 1
}

export function dropInterval(level) {
  return Math.max(120, 800 - (level - 1) * 70)
}

// 道具「除毛神器」：清除底部 n 行，上方補空行
export function clearBottomRows(board, n) {
  const kept = board.slice(0, ROWS - n)
  const empties = Array.from({ length: n }, () => Array(COLS).fill(0))
  return [...empties, ...kept]
}
