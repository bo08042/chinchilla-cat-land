import { useRef, useState } from 'react'

// 虛擬搖桿：拖曳判斷上下左右四方向（貼合網格類遊戲，非自由角度）。
// 用 pointerdown/pointermove/pointerup 追蹤，沒有 click 事件延遲；
// 搖桿頭用 setPointerCapture 鎖定，手指拖出圓圈範圍外也能持續追蹤。
// onDirection(dir) 只在方向「改變」時觸發一次；若回傳 false（例如遊戲判定
// 這是禁止的反向轉彎），搖桿頭會短暫變紅，讓使用者知道「有收到，但不能轉」。
export default function Joystick({ onDirection, size = 128 }) {
  const baseRef = useRef(null)
  const originRef = useRef({ x: 0, y: 0 })
  const lastDirRef = useRef(null)
  // activeRef 而非 useState：handlePointerMove 需要同步讀到最新值，
  // 若改用 state，pointerdown 剛觸發、React 還沒重新渲染前送達的
  // pointermove 事件會讀到舊的 closure（active 仍是 false）而被誤丟棄，
  // 造成「手指按下立刻滑動時，前幾下沒反應」。
  const activeRef = useRef(false)
  const rejectTimerRef = useRef(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const [rejected, setRejected] = useState(false)

  const radius = size * 0.3 // 搖桿頭最大位移半徑
  const deadzone = size * 0.11 // 小於這個距離不觸發方向，避免手抖誤觸
  const hysteresis = 1.25 // 已判定某軸向後，要切到另一軸向需要多明顯的分量差距

  function pickDirection(dx, dy, lastDir) {
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    let horizontalWins
    if (lastDir === 'up' || lastDir === 'down') {
      // 目前判定為垂直方向，避免對角線附近的手抖讓它誤跳成水平
      horizontalWins = absDx > absDy * hysteresis
    } else if (lastDir === 'left' || lastDir === 'right') {
      horizontalWins = !(absDy > absDx * hysteresis)
    } else {
      horizontalWins = absDx > absDy
    }
    return horizontalWins ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up'
  }

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
    const dir = pickDirection(dx, dy, lastDirRef.current)
    if (dir !== lastDirRef.current) {
      lastDirRef.current = dir
      const accepted = onDirection(dir)
      if (accepted === false) {
        setRejected(true)
        clearTimeout(rejectTimerRef.current)
        rejectTimerRef.current = setTimeout(() => setRejected(false), 180)
      }
    }
  }

  function handlePointerDown(e) {
    e.preventDefault()
    const rect = baseRef.current.getBoundingClientRect()
    originRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    baseRef.current.setPointerCapture(e.pointerId)
    activeRef.current = true
    lastDirRef.current = null
    updateFromPoint(e.clientX, e.clientY)
  }

  function handlePointerMove(e) {
    if (!activeRef.current) return
    updateFromPoint(e.clientX, e.clientY)
  }

  function handlePointerUp(e) {
    activeRef.current = false
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
      {/* 搖桿頭：拖到不能轉的方向（反向）時短暫變紅 */}
      <div
        className={`pointer-events-none rounded-full border-2 shadow-[2px_2px_0_0_var(--color-honey-600)] ${
          rejected ? 'border-red-500 bg-red-300' : 'border-honey-500 bg-honey-300'
        }`}
        style={{
          width: size * 0.44,
          height: size * 0.44,
          transform: `translate(${knob.x}px, ${knob.y}px)`,
          transition: `transform ${activeRef.current ? '0ms' : '150ms'} ease-out, background-color 100ms ease, border-color 100ms ease`,
        }}
      />
    </div>
  )
}
