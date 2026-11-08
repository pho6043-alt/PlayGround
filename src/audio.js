/* ============================================================
   GRAVEWAKE — procedural audio
   Dark ambient score + synthesized SFX, all generated live.
   ============================================================ */

const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
const freq = (name, octave) => 440 * Math.pow(2, (NOTE[name] + (octave - 4) * 12 - 9) / 12);

export class AudioEngine {
  constructor(settings = {}) {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.noiseBuffer = null;
    this.musicVolume = (settings.music ?? 55) / 100;
    this.sfxVolume = (settings.sfx ?? 80) / 100;
    this.musicOn = false;
    this.intensity = 0;
    this.step = 0;
    this.nextTime = 0;
    this.timer = null;
    this.lastSfx = Object.create(null);
    this.duckAmount = 0;
    this.muted = false;
  }

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return true;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      const ctx = new AC();
      this.ctx = ctx;
      const master = ctx.createGain();
      master.gain.value = 0.9;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 4;
      comp.attack.value = 0.003;
      comp.release.value = 0.2;
      master.connect(comp).connect(ctx.destination);
      this.master = master;

      const music = ctx.createGain();
      music.gain.value = 0;
      music.connect(master);
      this.musicGain = music;

      const sfx = ctx.createGain();
      sfx.gain.value = this.sfxVolume;
      sfx.connect(master);
      this.sfxGain = sfx;

      // 1s of noise for percussive effects
      const len = ctx.sampleRate;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buf;

      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  setMusicVolume(v) {
    this.musicVolume = Math.max(0, Math.min(1, v / 100));
    if (this.musicGain && this.ctx) {
      const target = this.musicOn ? this.musicVolume * 0.5 * (1 - this.duckAmount) : 0;
      this.musicGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.12);
    }
  }

  setSfxVolume(v) {
    this.sfxVolume = Math.max(0, Math.min(1, v / 100));
    if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(this.sfxVolume, this.ctx.currentTime, 0.08);
  }

  duck(on) {
    this.duckAmount = on ? 0.55 : 0;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(this.musicOn ? this.musicVolume * 0.5 * (1 - this.duckAmount) : 0, this.ctx.currentTime, 0.15);
    }
  }

  startMusic() {
    if (!this.ensure()) return;
    if (this.musicOn) return;
    this.musicOn = true;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.1;
    this.musicGain.gain.setTargetAtTime(this.musicVolume * 0.5 * (1 - this.duckAmount), this.ctx.currentTime, 0.6);
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.schedule(), 80);
    this.schedule();
  }

  stopMusic() {
    this.musicOn = false;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.musicGain && this.ctx) this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
  }

  setIntensity(v) { this.intensity = Math.max(0, Math.min(1, v)); }

  schedule() {
    if (!this.ctx || !this.musicOn) return;
    const ahead = 0.3;
    while (this.nextTime < this.ctx.currentTime + ahead) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += 60 / 76 / 2; // eighth notes at 76 BPM
      this.step = (this.step + 1) % 128;
    }
  }

  playStep(step, t) {
    const ctx = this.ctx;
    const bar = Math.floor(step / 8) % 16;
    const inBar = step % 8;
    const inten = this.intensity;
    // D minor / Bb / Gm / A, two bars each
    const chords = [
      { root: ['D', 2], tones: [['D', 3], ['F', 3], ['A', 3], ['D', 4]] },
      { root: ['D', 2], tones: [['D', 3], ['F', 3], ['A', 3], ['D', 4]] },
      { root: ['A#', 1], tones: [['A#', 2], ['D', 3], ['F', 3], ['A#', 3]] },
      { root: ['A#', 1], tones: [['A#', 2], ['D', 3], ['F', 3], ['A#', 3]] },
      { root: ['G', 1], tones: [['G', 2], ['A#', 2], ['D', 3], ['G', 3]] },
      { root: ['G', 1], tones: [['G', 2], ['A#', 2], ['D', 3], ['G', 3]] },
      { root: ['A', 1], tones: [['A', 2], ['C#', 3], ['E', 3], ['A', 3]] },
      { root: ['A', 1], tones: [['A', 2], ['C#', 3], ['E', 3], ['A', 3]] },
      { root: ['D', 2], tones: [['D', 3], ['F', 3], ['A', 3], ['D', 4]] },
      { root: ['D', 2], tones: [['D', 3], ['F', 3], ['A', 3], ['D', 4]] },
      { root: ['F', 1], tones: [['F', 2], ['A', 2], ['C', 3], ['F', 3]] },
      { root: ['F', 1], tones: [['F', 2], ['A', 2], ['C', 3], ['F', 3]] },
      { root: ['C', 2], tones: [['C', 3], ['E', 3], ['G', 3], ['C', 4]] },
      { root: ['C', 2], tones: [['C', 3], ['E', 3], ['G', 3], ['C', 4]] },
      { root: ['A', 1], tones: [['A', 2], ['C#', 3], ['E', 3], ['A', 3]] },
      { root: ['A', 1], tones: [['A', 2], ['C#', 3], ['E', 3], ['A', 3]] },
    ];
    const chord = chords[bar];

    // Pads at the top of each bar
    if (inBar === 0) {
      for (let i = 0; i < chord.tones.length; i++) {
        const [n, o] = chord.tones[i];
        this.pad(freq(n, o), t, 3.4, 0.035 + inten * 0.012, i);
      }
    }
    // Bass pulse
    if (inBar === 0 || inBar === 3 || (inBar === 6 && inten > 0.35)) {
      this.bass(freq(chord.root[0], chord.root[1]), t, inBar === 0 ? 0.55 : 0.34, 0.15);
    }
    // Sparse arpeggio
    if (inBar % 2 === 0 || inten > 0.5) {
      const tone = chord.tones[(step + Math.floor(step / 8)) % chord.tones.length];
      this.pluck(freq(tone[0], tone[1] + 1), t, 0.12 + inten * 0.06);
    }
    // Percussion layers with intensity
    if (inten > 0.18 && inBar % 2 === 1) this.hat(t, 0.025 + inten * 0.02);
    if (inten > 0.42 && inBar === 0) this.kick(t, 0.2);
    if (inten > 0.62 && inBar === 4) this.kick(t, 0.13);
    // Ominous bell every 4 bars
    if (inten > 0.55 && step % 32 === 0) {
      const [n, o] = chord.tones[3];
      this.bell(freq(n, o + 1), t, 0.08);
    }
  }

  pad(f, t, dur, vol, idx) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const flt = ctx.createBiquadFilter();
    o.type = idx % 2 ? 'sawtooth' : 'triangle';
    o.frequency.value = f * (idx % 2 ? 1.004 : 0.996);
    flt.type = 'lowpass';
    flt.frequency.value = 620 + idx * 80;
    flt.Q.value = 0.7;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.5);
    g.gain.linearRampToValueAtTime(vol * 0.75, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(flt).connect(g).connect(this.musicGain);
    o.start(t); o.stop(t + dur + 0.05);
  }

  bass(f, t, dur, vol) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(f * 1.02, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.08);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(this.musicGain);
    o.start(t); o.stop(t + dur + 0.02);
  }

  pluck(f, t, vol) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle'; o2.type = 'sine';
    o.frequency.value = f; o2.frequency.value = f * 2.01;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.55);
    o.connect(g); o2.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + 0.6); o2.start(t); o2.stop(t + 0.6);
  }

  bell(f, t, vol) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0005, t + 2.4);
    o.connect(g).connect(this.musicGain);
    o.start(t); o.stop(t + 2.5);
  }

  hat(t, vol) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const flt = ctx.createBiquadFilter();
    flt.type = 'highpass'; flt.frequency.value = 7200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0005, t + 0.055);
    src.connect(flt).connect(g).connect(this.musicGain);
    src.start(t); src.stop(t + 0.06);
  }

  kick(t, vol) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 0.13);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g).connect(this.musicGain);
    o.start(t); o.stop(t + 0.22);
  }

  /* ---------------- SFX ---------------- */
  sfx(name, opts = {}) {
    if (!this.ctx || this.ctx.state !== 'running' || this.sfxVolume <= 0) return;
    const now = this.ctx.currentTime;
    const cooldown = opts.cooldown ?? SFX_COOLDOWN[name] ?? 0.03;
    const last = this.lastSfx[name] || 0;
    if (now - last < cooldown) return;
    this.lastSfx[name] = now;
    const vol = (opts.volume ?? 1) * (SFX_VOLUME[name] ?? 0.5);
    try { this['_' + name]?.(now, vol, opts); } catch { /* ignore audio glitches */ }
  }

  _noise(t, dur, vol, type, f0, f1, q = 1) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const flt = ctx.createBiquadFilter();
    flt.type = type; flt.Q.value = q;
    flt.frequency.setValueAtTime(f0, t);
    flt.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
    src.connect(flt).connect(g).connect(this.sfxGain);
    src.start(t); src.stop(t + dur + 0.02);
  }

  _tone(t, type, f0, f1, dur, vol, detune = 0) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.detune.value = detune;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + Math.min(0.012, dur * 0.2));
    g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
    o.connect(g).connect(this.sfxGain);
    o.start(t); o.stop(t + dur + 0.02);
  }

  _hit(t, vol, o) { this._noise(t, 0.07, vol * 0.7, 'bandpass', o.crit ? 3200 : 1600, 500, 1.2); this._tone(t, 'square', o.crit ? 520 : 300, 110, 0.06, vol * 0.28); }
  _slash(t, vol) { this._noise(t, 0.14, vol, 'bandpass', 3400, 700, 1.5); }
  _shoot(t, vol, o) { this._tone(t, 'sine', o.pitch || 720, 280, 0.12, vol); }
  _fire(t, vol) { this._noise(t, 0.22, vol, 'lowpass', 1400, 220); this._tone(t, 'sawtooth', 220, 70, 0.18, vol * 0.25); }
  _explode(t, vol) { this._noise(t, 0.5, vol * 1.2, 'lowpass', 900, 60, 1); this._tone(t, 'sine', 120, 32, 0.4, vol * 0.8); }
  _zap(t, vol) { this._noise(t, 0.18, vol, 'highpass', 5000, 1400, 2); this._tone(t, 'sawtooth', 1600, 300, 0.12, vol * 0.3); }
  _pickup(t, vol, o) { this._tone(t, 'sine', o.big ? 660 : 880, o.big ? 1600 : 1320, 0.09, vol * 0.5); }
  _level(t, vol) {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => this._tone(t + i * 0.075, 'triangle', f, f * 1.01, 0.34, vol * 0.5));
    this._noise(t, 0.6, vol * 0.25, 'highpass', 3000, 6000, 0.8);
  }
  _hurt(t, vol) { this._tone(t, 'sawtooth', 190, 70, 0.22, vol * 0.7); this._noise(t, 0.16, vol * 0.35, 'lowpass', 800, 120); }
  _death(t, vol) { this._noise(t, 0.18, vol, 'lowpass', 900, 120); this._tone(t, 'triangle', 180, 60, 0.15, vol * 0.3); }
  _boss(t, vol) {
    [73, 110, 146].forEach((f, i) => this._tone(t + i * 0.05, 'sawtooth', f, f * 0.98, 1.4, vol * 0.35, i * 6));
    this._noise(t, 1.2, vol * 0.35, 'lowpass', 500, 80);
  }
  _heal(t, vol) { [523, 784, 1047].forEach((f, i) => this._tone(t + i * 0.06, 'sine', f, f, 0.3, vol * 0.4)); }
  _click(t, vol) { this._tone(t, 'square', 620, 480, 0.03, vol * 0.2); }
  _victory(t, vol) {
    [523, 659, 784, 1047, 1319].forEach((f, i) => this._tone(t + i * 0.14, 'triangle', f, f, 0.9, vol * 0.45));
  }
  _defeat(t, vol) {
    [392, 311, 261, 196].forEach((f, i) => this._tone(t + i * 0.18, 'sawtooth', f, f * 0.98, 0.7, vol * 0.3));
  }
  _evolve(t, vol) {
    this._noise(t, 0.9, vol * 0.4, 'highpass', 1800, 7000, 0.7);
    [392, 523, 659, 784, 1047, 1319].forEach((f, i) => this._tone(t + i * 0.06, 'triangle', f, f, 0.8, vol * 0.4));
  }
  _freeze(t, vol) { this._noise(t, 0.5, vol * 0.4, 'highpass', 6000, 900, 1.5); this._tone(t, 'sine', 1400, 400, 0.4, vol * 0.2); }
}

const SFX_VOLUME = {
  hit: 0.36, slash: 0.3, shoot: 0.22, fire: 0.3, explode: 0.45, zap: 0.3,
  pickup: 0.3, level: 0.65, hurt: 0.6, death: 0.2, boss: 0.6, heal: 0.5,
  click: 0.4, victory: 0.8, defeat: 0.6, evolve: 0.8, freeze: 0.5,
};
const SFX_COOLDOWN = {
  hit: 0.045, slash: 0.08, shoot: 0.05, fire: 0.09, explode: 0.09, zap: 0.08,
  pickup: 0.035, hurt: 0.18, death: 0.03, click: 0.02, freeze: 0.1,
};
