// 大冒險音效：Web Audio API 程式合成，不需音檔。
// 瀏覽器規定需使用者互動後才能出聲：第一次點「開始大冒險」時呼叫 initSound()。

let ctx = null
let muted = false

export function initSound() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) ctx = new AC()
  }
  if (ctx?.state === 'suspended') ctx.resume()
}

export function setMuted(m) {
  muted = m
}

function ready() {
  return ctx && !muted
}

function tone({ type = 'sine', freq = 440, to = null, dur = 0.12, gain = 0.06, delay = 0 }) {
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export const sfx = {
  diceTick() {
    if (!ready()) return
    tone({ type: 'square', freq: 500 + Math.random() * 300, dur: 0.04, gain: 0.03 })
  },
  step() {
    if (!ready()) return
    tone({ type: 'triangle', freq: 320, to: 260, dur: 0.06, gain: 0.035 })
  },
  snack() {
    if (!ready()) return
    tone({ type: 'sine', freq: 700, to: 1000, dur: 0.14, gain: 0.07 })
    tone({ type: 'sine', freq: 900, to: 1300, dur: 0.12, gain: 0.05, delay: 0.06 })
  },
  card() {
    if (!ready()) return
    tone({ type: 'triangle', freq: 440, to: 620, dur: 0.18, gain: 0.05 })
  },
  correct() {
    if (!ready()) return
    tone({ type: 'triangle', freq: 523, dur: 0.1, gain: 0.06 })
    tone({ type: 'triangle', freq: 784, dur: 0.16, gain: 0.07, delay: 0.1 })
  },
  wrong() {
    if (!ready()) return
    tone({ type: 'sawtooth', freq: 220, to: 140, dur: 0.22, gain: 0.05 })
  },
  encounter() {
    if (!ready()) return
    tone({ type: 'sine', freq: 600, dur: 0.1, gain: 0.05 })
    tone({ type: 'sine', freq: 800, dur: 0.1, gain: 0.05, delay: 0.09 })
    tone({ type: 'sine', freq: 1000, dur: 0.14, gain: 0.05, delay: 0.18 })
  },
  lap() {
    if (!ready()) return
    tone({ type: 'triangle', freq: 660, dur: 0.1, gain: 0.06 })
    tone({ type: 'triangle', freq: 880, dur: 0.14, gain: 0.07, delay: 0.1 })
  },
  win() {
    if (!ready()) return
    ;[523, 659, 784, 1047].forEach((freq, i) =>
      tone({ type: 'triangle', freq, dur: 0.22, gain: 0.08, delay: i * 0.12 }),
    )
  },
  lose() {
    if (!ready()) return
    tone({ type: 'sine', freq: 400, to: 250, dur: 0.4, gain: 0.06 })
  },
}
