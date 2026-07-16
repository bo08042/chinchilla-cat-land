// 知識庫文章載入層。
// 用 Vite 的 import.meta.glob 在建置期把 src/content/articles/*.md 全部打包進來，
// 新增文章只需要在該資料夾放一個 .md 檔（含 frontmatter），不用改任何程式碼。
//
// frontmatter 欄位：
//   slug: 網址用 ID（必填）
//   title: 文章標題（必填）
//   category: breed 品種介紹 | care 飼養建議 | health 健康管理
//   summary: 列表頁與 meta description 用摘要
//   updated: 最後更新日（YYYY-MM-DD）

const modules = import.meta.glob('./articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// 解析 frontmatter 的 YAML 子集：字串值與 [a, b] 形式的陣列
function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { meta: {}, body: raw }

  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    meta[key] = value
  }
  return { meta, body: raw.slice(match[0].length) }
}

export const CATEGORIES = [
  { id: 'breed', label: '品種介紹' },
  { id: 'care', label: '飼養建議' },
  { id: 'health', label: '健康管理' },
]

export const articles = Object.entries(modules)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw)
    // 檔名以 01-、02- 開頭，直接用路徑排序
    return { ...meta, body, path }
  })
  .sort((a, b) => a.path.localeCompare(b.path))

export function getArticle(slug) {
  return articles.find((a) => a.slug === slug)
}
