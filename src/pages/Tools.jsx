const tools = [
  {
    id: 'cost-calculator',
    emoji: '💰',
    title: '飼養花費試算機',
    text: '勾選飼料、貓砂、美容等項目，估算每月與首年的養貓預算。',
  },
  {
    id: 'age-converter',
    emoji: '🎂',
    title: '貓咪年齡換算器',
    text: '把貓齡換算成人類年齡，並看看這個階段的照顧重點。',
  },
  {
    id: 'name-generator',
    emoji: '✨',
    title: '貓咪取名產生器',
    text: '可愛系、貴族系、食物系……隨機產生適合你家貓咪的名字。',
  },
]

export default function Tools() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800">互動工具</h1>
      <p className="mt-2 text-stone-600">養貓路上的實用小工具，全部在瀏覽器裡完成。</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {tools.map(({ id, emoji, title, text }) => (
          <div
            key={id}
            className="rounded-2xl border border-dashed border-stone-300 bg-white p-6"
          >
            <div className="flex items-start justify-between">
              <p className="text-4xl">{emoji}</p>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                即將登場
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold text-stone-800">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
