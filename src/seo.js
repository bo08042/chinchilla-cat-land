import { getArticle } from './content/articles'
import { games } from './data/games'
import { tools } from './tools'

export const SITE = {
  name: '金吉拉樂園 Chinchilla Cat Land',
}

const DEFAULT_DESCRIPTION =
  '金吉拉貓的品種介紹、飼養建議、健康管理知識，還有一系列金吉拉主題小遊戲。'

const STATIC_META = {
  '/': {
    title: '金吉拉樂園 Chinchilla Cat Land — 金吉拉貓的知識樂園',
    description: DEFAULT_DESCRIPTION,
  },
  '/knowledge': {
    title: '認識金吉拉 — 品種、飼養與健康知識庫',
    description: '金吉拉貓的品種介紹、飼養建議與健康管理文章，專為金吉拉飼主與準飼主整理。',
  },
  '/games': {
    title: '遊戲樂園 — 金吉拉主題小遊戲',
    description: '金吉拉大師知識測驗、每日運勢、躲貓貓等金吉拉主題小遊戲。',
  },
  '/tools': {
    title: '互動工具 — 飼養花費試算與更多',
    description: '飼養花費試算機、貓咪年齡換算器、貓咪取名產生器。',
  },
  '/about': {
    title: '關於本站／免責聲明',
    description: '金吉拉樂園的初衷與免責聲明：本站內容為飼養參考，非獸醫醫療建議。',
  },
  '/privacy': {
    title: '隱私權政策',
    description: '金吉拉樂園的資料蒐集、Cookie 與第三方服務說明。',
  },
}

// pathname 為 React Router 的 location.pathname
export function getMeta(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname

  const articleMatch = /^\/knowledge\/([^/]+)$/.exec(path)
  if (articleMatch) {
    const article = getArticle(articleMatch[1])
    if (article) {
      return {
        title: `${article.title}｜${SITE.name}`,
        description: article.summary ?? DEFAULT_DESCRIPTION,
      }
    }
  }

  const gameMatch = /^\/games\/([^/]+)$/.exec(path)
  if (gameMatch) {
    const game = games.find((g) => g.id === gameMatch[1])
    if (game) {
      return {
        title: `${game.title}｜${SITE.name}`,
        description: game.summary,
      }
    }
  }

  const toolMatch = /^\/tools\/([^/]+)$/.exec(path)
  if (toolMatch) {
    const tool = tools.find((t) => t.id === toolMatch[1])
    if (tool) {
      return {
        title: `${tool.title}｜${SITE.name}`,
        description: tool.summary,
      }
    }
  }

  return (
    STATIC_META[path] ?? {
      title: SITE.name,
      description: DEFAULT_DESCRIPTION,
    }
  )
}
