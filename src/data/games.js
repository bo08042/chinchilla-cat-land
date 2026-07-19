// 遊戲登錄表：遊戲列表頁與 SEO meta 皆由此產生。
// 新遊戲上線流程：實作遊戲頁元件 → 在 App.jsx 加路由 → 把這裡的 status 改為 'live'。
// status: 'live' 已上線 | 'coming-soon' 開發中

export const games = [
  {
    id: 'quiz-master',
    title: '金吉拉大師',
    summary: '10 題知識測驗，看看你對金吉拉的了解夠不夠當一位大師！',
    emoji: '🎓',
    wave: 1,
    status: 'live',
  },
  {
    id: 'care-exam',
    title: '金吉拉飼養考試',
    summary: '餵食與照顧情境題，測測你是不是合格的鏟屎官。',
    emoji: '📋',
    wave: 1,
    status: 'live',
  },
  {
    id: 'fortune',
    title: '金吉拉骰運勢',
    summary: '每天擲一次骰子，讓金吉拉為你抽出今日運勢與幸運小語。',
    emoji: '🎲',
    wave: 1,
    status: 'live',
  },
  {
    id: 'hide-and-seek',
    title: '躲貓貓',
    summary: '眼力大考驗！從溫馨客廳找到月夜屋頂，四關卡揪出所有躲起來的貓咪。',
    emoji: '🔍',
    wave: 1,
    status: 'live',
  },
  {
    id: 'cat-blocks',
    title: '貓咪方塊',
    summary: '貓主題的經典方塊消除遊戲，魚乾、毛球、貓掌通通落下來！',
    emoji: '🧩',
    wave: 2,
    status: 'live',
  },
  {
    id: 'city-walk',
    title: '城市漫步',
    summary: '陪金吉拉出門散步，每個選擇都通往不同的結局。',
    emoji: '🏙️',
    wave: 2,
    status: 'live',
  },
  {
    id: 'adventure',
    title: '金吉拉與好朋友的大冒險',
    summary: '擲骰前進的桌遊大冒險，和好朋友比賽收集小魚乾！',
    emoji: '🎯',
    wave: 3,
    status: 'coming-soon',
  },
]
