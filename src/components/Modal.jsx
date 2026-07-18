// 全站共用的輕量彈窗，取代原生 alert()。
// 用法：<Modal open={...} onClose={...} title="..." icon="🎉">內容</Modal>
export default function Modal({ open, onClose, title, icon, children, actions }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-cocoa-900/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="card-sticker w-full max-w-sm p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {icon && <p className="text-4xl">{icon}</p>}
        {title && <h2 className="mt-2 text-lg font-black text-cocoa-900">{title}</h2>}
        <div className="mt-2 text-sm leading-relaxed text-cocoa-700">{children}</div>
        <div className="mt-5 flex justify-center gap-3">
          {actions ?? (
            <button onClick={onClose} className="btn-honey">
              知道了！
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
