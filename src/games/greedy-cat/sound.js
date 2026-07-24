// 貪吃貓音效：Web Audio API 程式合成，不需音檔。
// 瀏覽器規定需使用者互動後才能出聲：第一次點「開始遊戲」時呼叫 initSound()。

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

function tone({ type = 'sine', freq = 440, to = null, dur = 0.1, gain = 0.06, delay = 0 }) {
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

// 簡化版喵聲：單振盪器 + 低通濾波開合，音高先揚後降
function meow({ base = 320, dur = 0.6, gain = 0.13 }) {
  const t0 = ctx.currentTime
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  const lp = ctx.createBiquadFilter()
  osc.type = 'sawtooth'
  lp.type = 'lowpass'
  lp.Q.value = 3
  const peakT = t0 + dur * 0.25
  osc.frequency.setValueAtTime(base * 0.9, t0)
  osc.frequency.exponentialRampToValueAtTime(base * 1.8, peakT)
  osc.frequency.exponentialRampToValueAtTime(base * 0.75, t0 + dur)
  lp.frequency.setValueAtTime(700, t0)
  lp.frequency.exponentialRampToValueAtTime(2200, peakT)
  lp.frequency.exponentialRampToValueAtTime(700, t0 + dur)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + dur * 0.15)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(lp).connect(g).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export const sfx = {
  eat() {
    if (!ready()) return
    tone({ type: 'square', freq: 500, to: 720, dur: 0.06, gain: 0.06 })
    tone({ type: 'square', freq: 700, to: 940, dur: 0.05, gain: 0.05, delay: 0.05 })
  },
  eatGolden() {
    if (!ready()) return
    ;[660, 880, 1100, 1320].forEach((freq, i) =>
      tone({ type: 'triangle', freq, dur: 0.14, gain: 0.07, delay: i * 0.06 }),
    )
  },
  powerUp() {
    if (!ready()) return
    tone({ type: 'sine', freq: 520, to: 780, dur: 0.12, gain: 0.07 })
    tone({ type: 'sine', freq: 780, to: 1040, dur: 0.1, gain: 0.06, delay: 0.08 })
  },
  gameOver() {
    if (!ready()) return
    meow({ base: 320, dur: 0.6, gain: 0.13 })
  },
}
