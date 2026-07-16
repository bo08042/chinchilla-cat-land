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
      <h1 className="text-2xl font-black text-cocoa-900">🧮 互動工具</h1>
      <p className="mt-2 text-cocoa-700">養貓路上的實用小工具，全部在瀏覽器裡完成。</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {tools.map(({ id, emoji, title, text }) => (
          <div
            key={id}
            className="rounded-3xl border-2 border-dashed border-cocoa-300 bg-white/70 p-6"
          >
            <div className="flex items-start justify-between">
              <p className="inline-block rounded-2xl bg-cream-100 p-2.5 text-4xl">{emoji}</p>
              <span className="rounded-full bg-honey-300 px-2.5 py-1 text-xs font-bold text-cocoa-900">
                即將登場
              </span>
            </div>
            <h2 className="mt-3 text-lg font-black text-cocoa-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cocoa-700">{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
