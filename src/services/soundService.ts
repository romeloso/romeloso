type SoundName = 'correct' | 'wrong' | 'reward' | 'levelup'

/** Sonidos generados con Web Audio API (sin archivos externos). */
export class SoundService {
  private ctx: AudioContext | null = null

  private getContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext()
    }
    return this.ctx
  }

  async play(name: SoundName, enabled: boolean) {
    if (!enabled) return
    try {
      const ctx = this.getContext()
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (name === 'correct') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(523.25, now)
        osc.frequency.setValueAtTime(659.25, now + 0.08)
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)
        osc.start(now)
        osc.stop(now + 0.26)
      } else if (name === 'wrong') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(220, now)
        osc.frequency.linearRampToValueAtTime(180, now + 0.18)
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
        osc.start(now)
        osc.stop(now + 0.23)
      } else if (name === 'reward') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(392, now)
        osc.frequency.setValueAtTime(523.25, now + 0.1)
        osc.frequency.setValueAtTime(659.25, now + 0.2)
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(0.14, now + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)
        osc.start(now)
        osc.stop(now + 0.42)
      } else {
        osc.type = 'square'
        osc.frequency.setValueAtTime(523.25, now)
        osc.frequency.setValueAtTime(783.99, now + 0.12)
        osc.frequency.setValueAtTime(1046.5, now + 0.24)
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(0.1, now + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
        osc.start(now)
        osc.stop(now + 0.46)
      }
    } catch {
      // silenciosamente ignora entornos sin audio
    }
  }
}

export const soundService = new SoundService()
