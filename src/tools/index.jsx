import CostCalculator from './CostCalculator'
import AgeConverter from './AgeConverter'
import NameGenerator from './NameGenerator'

// 互動工具登錄表：工具列表頁、路由與 SEO meta 皆由此產生
export const tools = [
  {
    id: 'cost-calculator',
    emoji: '💰',
    title: '飼養花費試算機',
    summary: '勾選飼料、貓砂、美容等項目，估算每月與首年的養貓預算。',
    element: <CostCalculator />,
  },
  {
    id: 'age-converter',
    emoji: '🎂',
    title: '貓咪年齡換算器',
    summary: '把貓齡換算成人類年齡，並看看這個階段的照顧重點。',
    element: <AgeConverter />,
  },
  {
    id: 'name-generator',
    emoji: '✨',
    title: '貓咪取名產生器',
    summary: '可愛、貴族、中二、復古……八種風格隨機產生適合你家貓咪的名字。',
    element: <NameGenerator />,
  },
]
