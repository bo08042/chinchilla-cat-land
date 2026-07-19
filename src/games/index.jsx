import QuizGame from './quiz/QuizGame'
import FortuneGame from './fortune/FortuneGame'
import HideAndSeekGame from './hide-and-seek/HideAndSeekGame'
import CatBlocksGame from './cat-blocks/CatBlocksGame'
import CityWalkGame from './city-walk/CityWalkGame'
import AdventureGame from './adventure/AdventureGame'

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
  'cat-blocks': {
    element: <CatBlocksGame />,
    instructions: (
      <>
        <p>1. 經典方塊玩法：移動、旋轉落下的貓咪方塊，填滿一整行就消除。</p>
        <p>2. 一次消越多行分數越高，每消 10 行升一級、掉落越來越快。</p>
        <p>3. 消行累積 ⚡ 能量，集滿可施放道具：🎣 逗貓棒（換方塊）、🥫 罐罐時間（減速 10 秒）、🧹 除毛神器（清底部 3 行）。</p>
        <p>4. 電腦用方向鍵＋空白鍵、P 暫停、1/2/3 放道具；手機用畫面按鈕。</p>
        <p>5. 方塊堆到頂就結束，挑戰你的最高分！（音效可用 🔊 按鈕開關）</p>
      </>
    ),
  },
  adventure: {
    element: <AdventureGame />,
    instructions: (
      <>
        <p>1. 你是金吉拉，和布偶貓妞妞、柴犬旺旺輪流擲骰子在棋盤上前進。</p>
        <p>2. 點心格得小魚乾、事件格抽卡（部分能自己選擇）、機會格回答金吉拉知識題（可選擇押注挑戰雙倍獎勵）、午睡格休息一回合、衝刺格往前衝。</p>
        <p>3. 兩位棋子停在同一格會觸發相遇事件——可能對決、比賽、分享點心，充滿驚喜！</p>
        <p>4. 每經過起點 +5 🐟 並完成一圈；有人跑完 3 圈後該輪結束就結算，小魚乾最多的獲勝！</p>
      </>
    ),
  },
  'city-walk': {
    element: <CityWalkGame />,
    instructions: (
      <>
        <p>1. 陪金吉拉散步 8 個路口，每個路口都有隨機事件與選擇。</p>
        <p>2. 選擇會累積 🔍 好奇、🍙 飽足、💪 勇氣三種屬性；部分選項需要屬性達標才能解鎖。</p>
        <p>3. 散步結束時依累積的屬性走向不同結局，收集全部 5 種結局吧！</p>
        <p>4. 聽說在小巷裡幫助弱小，會開啟隱藏結局……</p>
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
