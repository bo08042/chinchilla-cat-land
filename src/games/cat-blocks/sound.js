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

// 合成喵聲：頻率先上滑再下滑 + 低通濾波 + 輕微顫音
function meow({ base = 520, peak = 1.6, dur = 0.32, gain = 0.14, delay = 0, vibrato = 0 }) {
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  const lp = ctx.createBiquadFilter()
  osc.type = 'sawtooth'
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(1400, t0)
  lp.Q.value = 3

  // 喵的音高輪廓：起音 → 上滑到頂點 → 緩降收尾
  osc.frequency.setValueAtTime(base, t0)
  osc.frequency.exponentialRampToValueAtTime(base * peak, t0 + dur * 0.35)
  osc.frequency.exponentialRampToValueAtTime(base * 0.75, t0 + dur)

  if (vibrato > 0) {
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 7
    lfoGain.gain.value = vibrato
    lfo.connect(lfoGain).connect(osc.frequency)
    lfo.start(t0)
    lfo.stop(t0 + dur)
  }

  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + dur * 0.15)
  g.gain.setValueAtTime(gain, t0 + dur * 0.6)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

  osc.connect(lp).connect(g).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
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
  // 消行：行數越多，喵得越熱鬧
  clear(n) {
    if (!ready()) return
    if (n === 1) meow({ base: 500 })
    if (n === 2) {
      meow({ base: 500, dur: 0.24 })
      meow({ base: 620, dur: 0.26, delay: 0.22 })
    }
    if (n === 3) {
      meow({ base: 480, dur: 0.2 })
      meow({ base: 600, dur: 0.2, delay: 0.18 })
      meow({ base: 740, dur: 0.26, delay: 0.36 })
    }
    if (n >= 4) {
      meow({ base: 520, peak: 1.9, dur: 0.55, gain: 0.16, vibrato: 18 })
      purr({ dur: 0.8, delay: 0.45 })
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
    meow({ base: 700, peak: 1.3, dur: 0.16, gain: 0.1 }) // 短促的「咪！」
    tone({ type: 'triangle', freq: 1200, to: 1800, dur: 0.12, gain: 0.04, delay: 0.1 })
  },
  purr() {
    if (!ready()) return
    purr({ dur: 1.2 })
  },
  gameOver() {
    if (!ready()) return
    meow({ base: 420, peak: 1.15, dur: 0.5, gain: 0.13 })
    meow({ base: 300, peak: 1.1, dur: 0.6, gain: 0.12, delay: 0.45 }) // 惋惜的低喵
  },
}
