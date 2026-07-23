import { useRef, useState } from 'react'

// 虛擬搖桿：拖曳判斷上下左右四方向（貼合網格類遊戲，非自由角度）。
// 用 pointerdown/pointermove/pointerup 追蹤，沒有 click 事件延遲；
// 搖桿頭用 setPointerCapture 鎖定，手指拖出圓圈範圍外也能持續追蹤。
// onDirection(dir) 只在方向「改變」時觸發一次，不會每個像素都觸發。
export default function Joystick({ onDirection, size = 128 }) {
  const baseRef = useRef(null)
  const originRef = useRef({ x: 0, y: 0 })
  const lastDirRef = useRef(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const radius = size * 0.3 // 搖桿頭最大位移半徑
  const deadzone = size * 0.11 // 小於這個距離不觸發方向，避免手抖誤觸

  function updateFromPoint(clientX, clientY) {
    let dx = clientX - originRef.current.x
    let dy = clientY - originRef.current.y
    const dist = Math.hypot(dx, dy)
    const clamped = Math.min(dist, radius)
    if (dist > 0) {
      dx = (dx / dist) * clamped
      dy = (dy / dist) * clamped
    }
    setKnob({ x: dx, y: dy })

    if (dist < deadzone) return
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up'
    if (dir !== lastDirRef.current) {
      lastDirRef.current = dir
      onDirection(dir)
    }
  }

  function handlePointerDown(e) {
    e.preventDefault()
    const rect = baseRef.current.getBoundingClientRect()
    originRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    baseRef.current.setPointerCapture(e.pointerId)
    setActive(true)
    lastDirRef.current = null
    updateFromPoint(e.clientX, e.clientY)
  }

  function handlePointerMove(e) {
    if (!active) return
    updateFromPoint(e.clientX, e.clientY)
  }

  function handlePointerUp(e) {
    setActive(false)
    setKnob({ x: 0, y: 0 })
    lastDirRef.current = null
    try {
      baseRef.current.releasePointerCapture(e.pointerId)
    } catch {
      /* 指標可能已經釋放，忽略 */
    }
  }

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative flex items-center justify-center rounded-full border-2 border-cocoa-200 bg-white/80 select-none"
      style={{ width: size, height: size, touchAction: 'none' }}
      aria-label="方向搖桿"
      role="slider"
      aria-valuenow={0}
    >
      {/* 十字方向淡影提示 */}
      <div className="pointer-events-none absolute inset-2 text-cocoa-300">
        <span className="absolute top-0.5 left-1/2 -translate-x-1/2">▲</span>
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2">▼</span>
        <span className="absolute top-1/2 left-0.5 -translate-y-1/2">◀</span>
        <span className="absolute top-1/2 right-0.5 -translate-y-1/2">▶</span>
      </div>
      {/* 搖桿頭 */}
      <div
        className="pointer-events-none rounded-full border-2 border-honey-500 bg-honey-300 shadow-[2px_2px_0_0_var(--color-honey-600)]"
        style={{
          width: size * 0.44,
          height: size * 0.44,
          transform: `translate(${knob.x}px, ${knob.y}px)`,
          transition: active ? 'none' : 'transform 150ms ease-out',
        }}
      />
    </div>
  )
}
