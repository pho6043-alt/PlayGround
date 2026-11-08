/* ============================================================
   GRAVEWAKE — procedural dark-fantasy terrain
   Infinite chunked world: forest, graveyard, ruins and ashen
   wastes, each rendered once and cached.
   ============================================================ */

import { makeCanvas, ctxOf } from './sprites.js';

const CHUNK = 160;

function hash2(x, y, seed = 0) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function smooth(t) { return t * t * (3 - 2 * t); }

function valueNoise(x, y, seed = 0) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  const a = hash2(xi, yi, seed), b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed), d = hash2(xi + 1, yi + 1, seed);
  return (a + (b - a) * xf) * (1 - yf) + (c + (d - c) * xf) * yf;
}

export const BIOMES = [
  {
    id: 'forest', name: 'THE HOLLOW GROVE',
    base: '#1a2a23', base2: '#16241e', speck: '#26382c', patch: '#20342a',
    path: '#2a241c', path2: '#231e17', deco: '#3b5a42',
  },
  {
    id: 'graveyard', name: 'THE MOURNING FIELDS',
    base: '#1d1a26', base2: '#191622', speck: '#2a2638', patch: '#242030',
    path: '#28222a', path2: '#211c24', deco: '#4a4658',
  },
  {
    id: 'ruins', name: 'THE SUNKEN RUINS',
    base: '#241f1a', base2: '#1f1a16', speck: '#302820', patch: '#2b251d',
    path: '#332a1f', path2: '#2a2219', deco: '#4a3f33',
  },
  {
    id: 'ashen', name: 'THE ASHEN REACH',
    base: '#1c1216', base2: '#180f13', speck: '#2a1a1e', patch: '#23151a',
    path: '#2a1c18', path2: '#221612', deco: '#3b2630',
  },
];

export function biomeIndexAt(wx, wy) {
  const n = valueNoise(wx / 1500 + 13.1, wy / 1500 - 7.7, 91);
  const n2 = valueNoise(wx / 2400 - 3.3, wy / 2400 + 9.2, 33);
  const v = n * 0.68 + n2 * 0.32;
  if (v < 0.36) return 0;
  if (v < 0.52) return 1;
  if (v < 0.68) return 2;
  return 3;
}

export class World {
  constructor(seed = 7) {
    this.seed = seed;
    this.chunks = new Map();
    this.order = [];
    this.frame = 0;
  }

  biomeAt(wx, wy) { return biomeIndexAt(wx, wy); }
  biomeName(wx, wy) { return BIOMES[this.biomeAt(wx, wy)].name; }

  chunk(cx, cy) {
    const key = cx + ',' + cy;
    let c = this.chunks.get(key);
    if (c) return c;
    c = this.renderChunk(cx, cy);
    this.chunks.set(key, c);
    this.order.push(key);
    if (this.order.length > 256) {
      const old = this.order.shift();
      this.chunks.delete(old);
    }
    return c;
  }

  renderChunk(cx, cy) {
    const canvas = makeCanvas(CHUNK, CHUNK);
    const g = ctxOf(canvas);
    const wx = cx * CHUNK, wy = cy * CHUNK;
    const bi = biomeIndexAt(wx + CHUNK / 2, wy + CHUNK / 2);
    const b = BIOMES[bi];
    const seed = this.seed + cx * 977 + cy * 131;

    // base ground
    g.fillStyle = b.base;
    g.fillRect(0, 0, CHUNK, CHUNK);
    g.fillStyle = b.base2;
    g.fillRect(0, 0, CHUNK, CHUNK);

    // large soft patches
    for (let i = 0; i < 6; i++) {
      const x = hash2(i, 1, seed) * CHUNK, y = hash2(i, 2, seed) * CHUNK;
      const r = 18 + hash2(i, 3, seed) * 46;
      g.globalAlpha = 0.25 + hash2(i, 4, seed) * 0.3;
      g.fillStyle = hash2(i, 5, seed) > 0.5 ? b.patch : b.speck;
      g.beginPath(); g.ellipse(x, y, r, r * (0.55 + hash2(i, 6, seed) * 0.5), hash2(i, 7, seed) * 3.14, 0, 7); g.fill();
    }
    g.globalAlpha = 1;

    // paths / dirt
    const pathN = valueNoise(wx / 260, wy / 260, 55);
    if (pathN > 0.55) {
      g.globalAlpha = Math.min(0.8, (pathN - 0.55) * 2.4);
      g.fillStyle = b.path;
      for (let i = 0; i < 10; i++) {
        const x = hash2(i, 11, seed) * CHUNK, y = hash2(i, 12, seed) * CHUNK;
        g.beginPath(); g.ellipse(x, y, 22 + hash2(i, 13, seed) * 26, 14 + hash2(i, 14, seed) * 18, hash2(i, 15, seed) * 3.14, 0, 7); g.fill();
      }
      g.globalAlpha = 1;
    }

    // speckles
    for (let i = 0; i < 210; i++) {
      const x = (hash2(i, 21, seed) * CHUNK) | 0, y = (hash2(i, 22, seed) * CHUNK) | 0;
      const v = hash2(i, 23, seed);
      g.globalAlpha = 0.1 + v * 0.3;
      g.fillStyle = v > 0.62 ? b.speck : (v > 0.3 ? b.path2 : b.base);
      const s = v > 0.9 ? 2 : 1;
      g.fillRect(x, y, s, s);
    }
    g.globalAlpha = 1;

    // ground cracks / grass strokes
    for (let i = 0; i < 8; i++) {
      const x = 12 + hash2(i, 31, seed) * (CHUNK - 24);
      const y = 12 + hash2(i, 32, seed) * (CHUNK - 24);
      g.globalAlpha = 0.22;
      g.strokeStyle = b.speck;
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (hash2(i, 33, seed) - 0.5) * 22, y + (hash2(i, 34, seed) - 0.5) * 22);
      g.lineTo(x + (hash2(i, 35, seed) - 0.5) * 34, y + (hash2(i, 36, seed) - 0.5) * 34);
      g.stroke();
    }
    g.globalAlpha = 1;

    // biome decorations
    const count = 7 + Math.floor(hash2(1, 99, seed) * 7);
    for (let i = 0; i < count; i++) {
      const x = 18 + hash2(i, 41, seed) * (CHUNK - 36);
      const y = 18 + hash2(i, 42, seed) * (CHUNK - 36);
      const r = hash2(i, 43, seed);
      this.drawDeco(g, bi, x, y, r, seed + i * 13);
    }

    // ambient detail sparkles (glowing spores / embers)
    if (bi === 0 || bi === 3) {
      for (let i = 0; i < 4; i++) {
        const x = hash2(i, 51, seed) * CHUNK, y = hash2(i, 52, seed) * CHUNK;
        const c = bi === 0 ? 'rgba(150,255,180,.5)' : 'rgba(255,140,70,.55)';
        g.fillStyle = c;
        g.fillRect(x | 0, y | 0, 1, 1);
      }
    }

    return canvas;
  }

  drawDeco(g, bi, x, y, r, seed) {
    if (bi === 0) {
      if (r < 0.3) this.tree(g, x, y, seed, false);
      else if (r < 0.48) this.bush(g, x, y, seed);
      else if (r < 0.62) this.grassTuft(g, x, y, seed);
      else if (r < 0.74) this.mushroom(g, x, y, seed);
      else if (r < 0.86) this.rock(g, x, y, seed, '#3d4a44', '#59685e');
      else this.fallenLog(g, x, y, seed);
    } else if (bi === 1) {
      if (r < 0.3) this.tombstone(g, x, y, seed);
      else if (r < 0.46) this.crossGrave(g, x, y, seed);
      else if (r < 0.62) this.deadTree(g, x, y, seed);
      else if (r < 0.74) this.bones(g, x, y, seed);
      else if (r < 0.86) this.fence(g, x, y, seed);
      else this.grassTuft(g, x, y, seed);
    } else if (bi === 2) {
      if (r < 0.26) this.pillar(g, x, y, seed);
      else if (r < 0.44) this.rubble(g, x, y, seed);
      else if (r < 0.58) this.tilePatch(g, x, y, seed);
      else if (r < 0.72) this.brazier(g, x, y, seed);
      else if (r < 0.86) this.rock(g, x, y, seed, '#4a4034', '#665844');
      else this.grassTuft(g, x, y, seed);
    } else {
      if (r < 0.32) this.deadTree(g, x, y, seed, true);
      else if (r < 0.5) this.emberCrack(g, x, y, seed);
      else if (r < 0.66) this.rock(g, x, y, seed, '#2b1f26', '#4a3038');
      else if (r < 0.8) this.runeCircle(g, x, y, seed);
      else this.bones(g, x, y, seed);
    }
  }

  /* ---------------- decorations ---------------- */
  tree(g, x, y, seed, dead = false) {
    const h = 18 + hash2(2, 3, seed) * 12;
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.beginPath(); g.ellipse(x, y + 2, 11, 4, 0, 0, 7); g.fill();
    g.fillStyle = '#2a1f18';
    g.fillRect(x - 2, y - h, 4, h);
    g.fillStyle = '#1d150f';
    g.fillRect(x + 1, y - h, 1, h);
    const layers = 3;
    for (let i = 0; i < layers; i++) {
      const w = (15 - i * 3) * (0.9 + hash2(i, 1, seed) * 0.2);
      const yy = y - h + 4 - i * 6;
      g.fillStyle = i % 2 ? '#1b2d22' : '#223a2a';
      g.beginPath(); g.moveTo(x, yy - 10); g.lineTo(x + w, yy + 4); g.lineTo(x - w, yy + 4); g.closePath(); g.fill();
      g.fillStyle = 'rgba(90,140,100,.16)';
      g.beginPath(); g.moveTo(x, yy - 9); g.lineTo(x + w * 0.5, yy + 3); g.lineTo(x - w * 0.15, yy + 3); g.closePath(); g.fill();
    }
  }

  deadTree(g, x, y, seed, ashen = false) {
    const h = 16 + hash2(4, 5, seed) * 14;
    g.fillStyle = 'rgba(0,0,0,.32)';
    g.beginPath(); g.ellipse(x, y + 1, 8, 3, 0, 0, 7); g.fill();
    g.strokeStyle = ashen ? '#38232a' : '#2f2733';
    g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + 1, y - h); g.stroke();
    g.lineWidth = 2;
    const branches = 3;
    for (let i = 0; i < branches; i++) {
      const yy = y - h * (0.45 + i * 0.17);
      const dir = i % 2 ? 1 : -1;
      g.beginPath(); g.moveTo(x + 1, yy);
      g.lineTo(x + dir * (6 + hash2(i, 7, seed) * 6), yy - 5 - hash2(i, 8, seed) * 5);
      g.lineTo(x + dir * (9 + hash2(i, 9, seed) * 5), yy - 9);
      g.stroke();
    }
  }

  bush(g, x, y, seed) {
    g.fillStyle = 'rgba(0,0,0,.28)';
    g.beginPath(); g.ellipse(x, y + 2, 9, 3, 0, 0, 7); g.fill();
    for (let i = 0; i < 4; i++) {
      const dx = (hash2(i, 1, seed) - 0.5) * 10, dy = (hash2(i, 2, seed) - 0.5) * 5;
      g.fillStyle = i % 2 ? '#22392a' : '#2c4a35';
      g.beginPath(); g.ellipse(x + dx, y - 3 + dy, 5, 4, 0, 0, 7); g.fill();
    }
    g.fillStyle = 'rgba(110,170,120,.22)';
    g.fillRect(x - 3, y - 7, 2, 1);
  }

  grassTuft(g, x, y, seed) {
    g.strokeStyle = 'rgba(90,130,95,.4)';
    g.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      g.beginPath(); g.moveTo(x + i - 2, y);
      g.lineTo(x + i - 2 + (hash2(i, 1, seed) - 0.5) * 4, y - 3 - hash2(i, 2, seed) * 4);
      g.stroke();
    }
  }

  mushroom(g, x, y, seed) {
    g.fillStyle = 'rgba(0,0,0,.3)';
    g.fillRect(x - 2, y, 5, 1);
    g.fillStyle = '#c9d8c0'; g.fillRect(x, y - 3, 1, 3);
    g.fillStyle = hash2(1, 2, seed) > 0.5 ? '#8a4bd6' : '#5cc9b0';
    g.beginPath(); g.ellipse(x + 0.5, y - 4, 3, 2, 0, Math.PI, 0); g.fill();
    g.fillStyle = 'rgba(200,255,230,.7)'; g.fillRect(x, y - 5, 1, 1);
  }

  rock(g, x, y, seed, dark, light) {
    const w = 5 + hash2(1, 1, seed) * 7;
    g.fillStyle = 'rgba(0,0,0,.3)';
    g.beginPath(); g.ellipse(x, y + 1, w, 3, 0, 0, 7); g.fill();
    g.fillStyle = dark;
    g.beginPath(); g.moveTo(x - w, y); g.lineTo(x - w * 0.5, y - w * 0.8); g.lineTo(x + w * 0.3, y - w); g.lineTo(x + w, y - w * 0.2); g.lineTo(x + w * 0.7, y); g.closePath(); g.fill();
    g.fillStyle = light;
    g.beginPath(); g.moveTo(x - w * 0.5, y - w * 0.8); g.lineTo(x + w * 0.3, y - w); g.lineTo(x + w * 0.2, y - w * 0.5); g.closePath(); g.fill();
  }

  fallenLog(g, x, y, seed) {
    g.save(); g.translate(x, y); g.rotate((hash2(1, 2, seed) - 0.5) * 0.5);
    g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-10, 1, 22, 3);
    g.fillStyle = '#33251c'; g.fillRect(-11, -3, 22, 5);
    g.fillStyle = '#453224'; g.fillRect(-10, -3, 20, 2);
    g.fillStyle = '#241a14'; g.fillRect(-11, -3, 2, 5);
    g.restore();
  }

  tombstone(g, x, y, seed) {
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.beginPath(); g.ellipse(x, y + 1, 8, 3, 0, 0, 7); g.fill();
    const w = 7 + hash2(1, 1, seed) * 3;
    g.fillStyle = '#3e3a4c';
    g.beginPath(); g.moveTo(x - w, y); g.lineTo(x - w, y - 10); g.arc(x, y - 10, w, Math.PI, 0); g.lineTo(x + w, y); g.closePath(); g.fill();
    g.fillStyle = '#555067';
    g.fillRect(x - w + 2, y - 11, 2, 9);
    g.fillStyle = '#2b2838';
    g.fillRect(x - 1, y - 10, 2, 4);
    g.fillRect(x - 3, y - 8, 6, 1);
    g.fillStyle = 'rgba(140,120,180,.25)'; g.fillRect(x + 1, y - 12, 3, 2);
  }

  crossGrave(g, x, y, seed) {
    g.fillStyle = 'rgba(0,0,0,.3)';
    g.beginPath(); g.ellipse(x, y + 1, 6, 2.5, 0, 0, 7); g.fill();
    g.fillStyle = '#453f52'; g.fillRect(x - 1, y - 14, 3, 14);
    g.fillRect(x - 5, y - 10, 11, 3);
    g.fillStyle = '#5d566e'; g.fillRect(x - 1, y - 14, 1, 13);
    g.fillStyle = '#2a2636'; g.fillRect(x - 4, y - 9, 9, 1);
  }

  bones(g, x, y, seed) {
    g.save(); g.translate(x, y); g.rotate(hash2(1, 1, seed) * 3.14);
    g.strokeStyle = '#7d7466'; g.lineWidth = 1.5; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-4, 0); g.lineTo(4, 0); g.stroke();
    g.fillStyle = '#8f8574'; g.fillRect(-5, -1, 2, 2); g.fillRect(3, -1, 2, 2);
    g.restore();
    g.fillStyle = 'rgba(180,170,140,.5)'; g.fillRect(x + 3, y - 4, 2, 2);
  }

  fence(g, x, y, seed) {
    g.strokeStyle = '#3a3548'; g.lineWidth = 1.5;
    const n = 3;
    for (let i = 0; i < n; i++) g.fillRect(x - 8 + i * 7, y - 9, 1.5, 9);
    g.beginPath(); g.moveTo(x - 9, y - 7); g.lineTo(x + 9, y - 7); g.moveTo(x - 9, y - 3); g.lineTo(x + 9, y - 3); g.stroke();
    g.fillStyle = 'rgba(120,110,150,.2)'; g.fillRect(x - 8, y - 9, 1, 3);
  }

  pillar(g, x, y, seed) {
    const h = 14 + hash2(1, 1, seed) * 12;
    g.fillStyle = 'rgba(0,0,0,.35)';
    g.beginPath(); g.ellipse(x, y + 1, 8, 3, 0, 0, 7); g.fill();
    g.fillStyle = '#4a4034'; g.fillRect(x - 4, y - h, 8, h);
    g.fillStyle = '#5f5242'; g.fillRect(x - 4, y - h, 2, h);
    g.fillStyle = '#382f27'; g.fillRect(x + 2, y - h, 2, h);
    g.fillStyle = '#5f5242'; g.fillRect(x - 6, y - h - 3, 12, 3);
    g.fillStyle = '#3b322a'; g.fillRect(x - 6, y - h - 3, 12, 1);
    g.fillStyle = 'rgba(100,160,100,.25)';
    g.fillRect(x - 3, y - 5, 2, 4);
  }

  rubble(g, x, y, seed) {
    for (let i = 0; i < 4; i++) {
      const dx = (hash2(i, 1, seed) - 0.5) * 14, dy = (hash2(i, 2, seed) - 0.5) * 6;
      g.fillStyle = i % 2 ? '#3b332a' : '#4b4134';
      g.fillRect(x + dx, y + dy, 3 + (i % 2) * 2, 2 + (i % 2));
    }
  }

  tilePatch(g, x, y, seed) {
    g.save(); g.globalAlpha = 0.55;
    g.strokeStyle = '#3d342a'; g.lineWidth = 1;
    const w = 18 + hash2(1, 1, seed) * 10, h = 14;
    for (let i = 0; i <= 3; i++) {
      g.beginPath(); g.moveTo(x - w / 2 + i * (w / 3), y - h / 2); g.lineTo(x - w / 2 + i * (w / 3), y + h / 2); g.stroke();
    }
    for (let i = 0; i <= 2; i++) {
      g.beginPath(); g.moveTo(x - w / 2, y - h / 2 + i * (h / 2)); g.lineTo(x + w / 2, y - h / 2 + i * (h / 2)); g.stroke();
    }
    g.restore();
  }

  brazier(g, x, y, seed) {
    g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x, y + 1, 7, 3, 0, 0, 7); g.fill();
    g.fillStyle = '#3c332a'; g.fillRect(x - 5, y - 6, 10, 6);
    g.fillStyle = '#56493a'; g.fillRect(x - 6, y - 8, 12, 2);
    const grd = g.createRadialGradient(x, y - 9, 0, x, y - 9, 14);
    grd.addColorStop(0, 'rgba(255,160,60,.32)'); grd.addColorStop(1, 'rgba(255,100,30,0)');
    g.fillStyle = grd; g.fillRect(x - 14, y - 23, 28, 28);
    g.fillStyle = '#ff9a3c'; g.fillRect(x - 2, y - 12, 4, 4);
    g.fillStyle = '#ffe08a'; g.fillRect(x - 1, y - 13, 2, 2);
  }

  emberCrack(g, x, y, seed) {
    g.strokeStyle = 'rgba(255,110,50,.42)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(x - 8, y); g.lineTo(x - 2, y - 3); g.lineTo(x + 2, y + 2); g.lineTo(x + 9, y - 2); g.stroke();
    g.strokeStyle = 'rgba(255,190,90,.3)';
    g.beginPath(); g.moveTo(x - 3, y - 2); g.lineTo(x + 1, y + 1); g.stroke();
    g.fillStyle = 'rgba(255,140,60,.16)';
    g.beginPath(); g.ellipse(x, y, 9, 5, 0, 0, 7); g.fill();
  }

  runeCircle(g, x, y, seed) {
    g.save(); g.globalAlpha = 0.5;
    g.strokeStyle = '#7a4a9a'; g.lineWidth = 1;
    g.beginPath(); g.arc(x, y, 10, 0, 7); g.stroke();
    g.beginPath(); g.arc(x, y, 6, 0, 7); g.stroke();
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2;
      g.fillStyle = '#a06ac4';
      g.fillRect(x + Math.cos(a) * 8 - 1, y + Math.sin(a) * 8 - 1, 2, 2);
    }
    g.restore();
  }

  draw(g, camX, camY, vw, vh) {
    const x0 = Math.floor((camX - vw / 2) / CHUNK) - 1;
    const x1 = Math.floor((camX + vw / 2) / CHUNK) + 1;
    const y0 = Math.floor((camY - vh / 2) / CHUNK) - 1;
    const y1 = Math.floor((camY + vh / 2) / CHUNK) + 1;
    for (let cy = y0; cy <= y1; cy++) {
      for (let cx = x0; cx <= x1; cx++) {
        const c = this.chunk(cx, cy);
        g.drawImage(c, Math.round(cx * CHUNK - camX + vw / 2), Math.round(cy * CHUNK - camY + vh / 2));
      }
    }
  }
}
