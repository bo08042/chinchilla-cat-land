export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-800">隱私權政策</h1>
      <div className="prose prose-stone mt-6 max-w-none">
        <p>最後更新：2026-07-16</p>
        <h2>我們蒐集哪些資料</h2>
        <ul>
          <li>
            <strong>遊戲進度與成績</strong>：儲存在你瀏覽器的
            localStorage，僅保留在你的裝置上，不會上傳到任何伺服器。
          </li>
          <li>
            <strong>不需要註冊</strong>：本站所有功能皆不需要帳號，也不會要求你提供姓名、Email
            等個人資料。
          </li>
        </ul>
        <h2>Cookie 與第三方服務</h2>
        <p>
          本站目前使用 Google Fonts 載入字型。若日後導入流量分析或廣告服務（如 Google
          AdSense），將於此頁更新說明。
        </p>
        <h2>如何清除資料</h2>
        <p>
          清除瀏覽器的網站資料（localStorage）即可移除所有遊戲進度與成績紀錄。
        </p>
      </div>
    </div>
  )
}
