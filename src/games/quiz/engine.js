// 測驗引擎：純函式，不依賴 React。
// 題庫格式見 banks.js；一輪 = 從題庫隨機抽 N 題 + 選項洗牌。

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 產生一輪題目：隨機抽題、選項洗牌並重算正解索引
export function buildRound(bank) {
  const picked = shuffle(bank.questions).slice(0, bank.questionsPerRound)
  return picked.map((q) => {
    const order = shuffle(q.options.map((_, i) => i))
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      answer: order.indexOf(q.answer),
    }
  })
}

// 依答對題數計算百分制分數
export function scoreOf(correctCount, total) {
  return Math.round((correctCount / total) * 100)
}

// 依分數取得稱號（ranks 需由高分到低分排列）
export function rankOf(bank, score) {
  return bank.ranks.find((r) => score >= r.min) ?? bank.ranks[bank.ranks.length - 1]
}
