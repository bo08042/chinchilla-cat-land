# Chinchilla Cat Land（金吉拉樂園）

專門介紹金吉拉貓（Chinchilla Persian）的主題網站：品種介紹、飼養建議、健康管理文章，搭配多款金吉拉主題網頁小遊戲與互動工具。

純前端專案（React 19 + Vite + Tailwind CSS 4），部署於 GitHub Pages。

## 文件

- [專案規劃](docs/project-plan.md) — 定位、內容規劃、技術架構、開發里程碑
- [小遊戲設計規格](docs/games-design.md) — 各遊戲玩法、資料結構與實作要點

## 開發

```bash
npm install
npm run dev      # 開發伺服器
npm run build    # 產出靜態檔至 dist/
```

## 部署

Push 到 GitHub 的 `main` 分支即自動透過 GitHub Actions 部署到 GitHub Pages（首次需在 repo 的 Settings → Pages 將 Source 設為「GitHub Actions」）。
