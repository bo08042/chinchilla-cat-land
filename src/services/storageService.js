// localStorage 抽象層。
// 所有遊戲進度/成績都經由這裡讀寫，UI 與遊戲邏輯不直接碰 localStorage，
// 日後若導入雲端同步（Firebase/Supabase），只需替換此檔的實作。

const PREFIX = 'ccl.'
const SCHEMA_VERSION = 1

function storageKey(key) {
  return `${PREFIX}${key}`
}

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(storageKey(key))
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    // 日後 schema 有 breaking change 時，在這裡依 _v 做遷移
    return parsed?._v === SCHEMA_VERSION ? parsed.data : fallback
  } catch {
    // localStorage 不可用（隱私模式）或資料損毀時，一律回傳 fallback
    return fallback
  }
}

export function save(key, data) {
  try {
    localStorage.setItem(
      storageKey(key),
      JSON.stringify({ _v: SCHEMA_VERSION, data }),
    )
  } catch {
    // 寫入失敗（容量滿、隱私模式）不中斷遊戲，僅略過保存
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(storageKey(key))
  } catch {
    /* 同上，略過即可 */
  }
}
