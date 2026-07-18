import QuizGame from './quiz/QuizGame'
import FortuneGame from './fortune/FortuneGame'
import HideAndSeekGame from './hide-and-seek/HideAndSeekGame'

// 已上線遊戲的路由登錄：id 對應 data/games.js 與網址 /games/:gameId。
// element 為遊戲內容，instructions 顯示在 GameShell 的玩法說明彈窗。
export const gameRoutes = {
  'quiz-master': {
    element: <QuizGame bankId="master" />,
    instructions: (
      <>
        <p>1. 每輪從題庫隨機抽 10 題單選題。</p>
        <p>2. 點選答案後立即顯示對錯與解說。</p>
        <p>3. 全部答完依分數獲得稱號，錯題附上複習文章連結。</p>
        <p>4. 最佳成績會保存在你的瀏覽器，隨時回來刷新紀錄！</p>
      </>
    ),
  },
  'care-exam': {
    element: <QuizGame bankId="careExam" />,
    instructions: (
      <>
        <p>1. 每輪隨機 10 題飼養情境題：餵食、梳毛、健康照護。</p>
        <p>2. 點選答案後立即顯示對錯與解說。</p>
        <p>3. 考滿 90 分就是「五星級鏟屎官」！</p>
      </>
    ),
  },
  fortune: {
    element: <FortuneGame />,
    instructions: (
      <>
        <p>1. 每天限抽一次，點骰子讓金吉拉為你抽出今日運勢。</p>
        <p>2. 運勢從大吉到小凶共 6 級，附貓咪籤詩與今日宜忌。</p>
        <p>3. 可以複製結果分享給朋友，明天再來抽新的！</p>
      </>
    ),
  },
  'hide-and-seek': {
    element: <HideAndSeekGame />,
    instructions: (
      <>
        <p>1. 場景裡藏著 5 隻貓咪：可能只露出耳朵、尾巴或眼睛。</p>
        <p>2. 在限時內全部點出來就過關；點錯地方會扣 3 秒。</p>
        <p>3. 每關可用一次「提示」，會圈出其中一隻的位置。</p>
        <p>4. 過關解鎖下一關，挑戰你的最快紀錄！</p>
      </>
    ),
  },
}
