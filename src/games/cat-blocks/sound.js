// 貓咪方塊音效：Web Audio API 程式合成，不需音檔。
// 操作音是機械聲，事件音是「合成貓叫」——用頻率滑音 + 低通濾波模擬卡通感的喵聲。
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

export function isMuted() {
  return muted
}

function ready() {
  return ctx && !muted
}

// 基本音：單一振盪器 + 音量包絡
function tone({ type = 'square', freq = 800, to = null, dur = 0.06, gain = 0.05, delay = 0 }) {
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

// 合成喵聲「喵～」：
// 音高先快速上揚（喵）再緩慢下滑收尾（～），配合低通濾波開合模擬嘴型，
// 尾音帶顫音；雙振盪器（基頻 + 八度）讓音色更接近貓的鼻腔共鳴。
function meow({ base = 420, dur = 0.55, gain = 0.13, delay = 0, vibrato = 10 }) {
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const g = ctx.createGain()
  const g2 = ctx.createGain()
  const lp = ctx.createBiquadFilter()
  osc.type = 'sawtooth'
  osc2.type = 'triangle'
  lp.type = 'lowpass'
  lp.Q.value = 4

  // 音高輪廓：base → 快速升到 1.9x（喵）→ 緩降到 0.8x（～）
  const peakT = t0 + dur * 0.22
  for (const o of [osc, osc2]) {
    const mul = o === osc2 ? 2 : 1
    o.frequency.setValueAtTime(base * 0.9 * mul, t0)
    o.frequency.exponentialRampToValueAtTime(base * 1.9 * mul, peakT)
    o.frequency.setValueAtTime(base * 1.9 * mul, peakT + dur * 0.08)
    o.frequency.exponentialRampToValueAtTime(base * 0.8 * mul, t0 + dur)
  }

  // 嘴型開合：濾波器由悶 → 開 → 收
  lp.frequency.setValueAtTime(700, t0)
  lp.frequency.exponentialRampToValueAtTime(2600, peakT)
  lp.frequency.exponentialRampToValueAtTime(800, t0 + dur)

  // 尾音顫音
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 5.5
  lfoGain.gain.setValueAtTime(0, t0)
  lfoGain.gain.setValueAtTime(vibrato, peakT)
  lfo.connect(lfoGain).connect(osc.frequency)
  lfo.start(t0)
  lfo.stop(t0 + dur)

  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + dur * 0.12)
  g.gain.setValueAtTime(gain * 0.85, t0 + dur * 0.55)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  g2.gain.value = 0.25

  osc.connect(lp)
  osc2.connect(g2).connect(lp)
  lp.connect(g).connect(ctx.destination)
  osc.start(t0); osc.stop(t0 + dur + 0.02)
  osc2.start(t0); osc2.stop(t0 + dur + 0.02)
}

// 呼嚕聲：低頻鋸齒波 + 振幅顫動
function purr({ dur = 0.7, delay = 0 }) {
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.value = 62
  lfo.frequency.value = 22
  lfoGain.gain.value = 0.05
  g.gain.setValueAtTime(0.06, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  lfo.connect(lfoGain).connect(g.gain)
  osc.connect(g).connect(ctx.destination)
  osc.start(t0); osc.stop(t0 + dur)
  lfo.start(t0); lfo.stop(t0 + dur)
}

export const sfx = {
  move() {
    if (!ready()) return
    tone({ freq: 700, dur: 0.03, gain: 0.03 })
  },
  rotate() {
    if (!ready()) return
    tone({ freq: 900, to: 1100, dur: 0.05, gain: 0.035 })
  },
  lock() {
    if (!ready()) return
    tone({ type: 'triangle', freq: 170, to: 90, dur: 0.09, gain: 0.08 })
  },
  // 消行：一聲「喵～」，行數越多音調越高、越激動
  clear(n) {
    if (!ready()) return
    if (n === 1) meow({ base: 380 })
    if (n === 2) meow({ base: 500, dur: 0.5 })
    if (n === 3) meow({ base: 640, dur: 0.55, vibrato: 14 })
    if (n >= 4) {
      meow({ base: 780, dur: 0.7, gain: 0.16, vibrato: 20 })
      purr({ dur: 0.8, delay: 0.6 })
    }
  },
  levelUp() {
    if (!ready()) return
    tone({ type: 'triangle', freq: 523, dur: 0.09, gain: 0.06 })
    tone({ type: 'triangle', freq: 659, dur: 0.09, gain: 0.06, delay: 0.09 })
    tone({ type: 'triangle', freq: 784, dur: 0.14, gain: 0.07, delay: 0.18 })
  },
  item() {
    if (!ready()) return
    meow({ base: 700, dur: 0.25, gain: 0.1, vibrato: 0 }) // 短促的「咪！」
    tone({ type: 'triangle', freq: 1200, to: 1800, dur: 0.12, gain: 0.04, delay: 0.15 })
  },
  purr() {
    if (!ready()) return
    purr({ dur: 1.2 })
  },
  gameOver() {
    if (!ready()) return
    // 一聲拖長的低音惋惜喵
    meow({ base: 300, dur: 0.9, gain: 0.13, vibrato: 8 })
  },
}
