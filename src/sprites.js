/* ============================================================
   GRAVEWAKE — procedural pixel art
   All sprites, icons and textures are original and generated
   at runtime. No external assets.
   ============================================================ */

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w | 0);
  c.height = Math.max(1, h | 0);
  return c;
}

export function ctxOf(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

export function drawMap(map, palette, scale = 1, pad = 0) {
  const w = map[0].length, h = map.length;
  const c = makeCanvas(w * scale + pad * 2, h * scale + pad * 2);
  const g = ctxOf(c);
  for (let y = 0; y < h; y++) {
    const row = map[y];
    for (let x = 0; x < w; x++) {
      const ch = row[x];
      const col = palette[ch];
      if (!col) continue;
      g.fillStyle = col;
      g.fillRect(pad + x * scale, pad + y * scale, scale, scale);
    }
  }
  return c;
}

function mapFrom(rows) { return rows.map(r => r.padEnd(rows[0].length, '.')); }

/* ============================== HEROES ============================== */
const HERO_BASE = mapFrom([
  '................',
  '......oooo......',
  '.....occcco.....',
  '....occlllco....',
  '....oclllllco...',
  '....oclssssco...',
  '....ocseessco...',
  '....oclssssco...',
  '.....occcco.....',
  '....omccccmo....',
  '..oscccccccsso..',
  '..oscccccccsso..',
  '...occcccccco...',
  '...occdddddco...',
  '...ocddddddco...',
  '....occcccco....',
  '....obboobbo....',
  '...oobboobboo...',
]);

const HERO_WALK = mapFrom([
  '................',
  '................',
  '......oooo......',
  '.....occcco.....',
  '....occlllco....',
  '....oclllllco...',
  '....oclssssco...',
  '....ocseessco...',
  '....oclssssco...',
  '.....occcco.....',
  '....omccccmo....',
  '..oscccccccsso..',
  '..oscccccccsso..',
  '...occcccccco...',
  '...occdddddco...',
  '....ocddddco....',
  '...obbo..obbo...',
  '..oobbo..obboo..',
]);

const HERO_CAST = mapFrom([
  '................',
  '................',
  '................',
  '......oooo......',
  '.....occcco.....',
  '....occlllco....',
  '....oclllllco...',
  '....oclssssco...',
  '....ocseessco...',
  '....oclssssco...',
  '.....occcco.....',
  '...omccccccmo...',
  '.osccccccccccso.',
  '.osccccccccccso.',
  '..occcccccccco..',
  '..occddddddcco..',
  '...obbo..obbo...',
  '..oobbo..obboo..',
]);

const HERO_PALETTES = {
  seren: { o: '#0d0b16', c: '#4b5bb8', d: '#2c3470', l: '#8192f0', s: '#ecc39b', e: '#ffe9a8', m: '#c8c4d8', b: '#241d33' },
  mira:  { o: '#160a10', c: '#a83a3c', d: '#6d1f28', l: '#ef7a63', s: '#f0c19b', e: '#ffe28f', m: '#e0b46e', b: '#2e1a22' },
  kael:  { o: '#081012', c: '#2a7f7e', d: '#164b54', l: '#69d7c6', s: '#d9b28d', e: '#aef9ff', m: '#b9c8cc', b: '#1a262b' },
  nyx:   { o: '#0d0814', c: '#6a3c96', d: '#3e2260', l: '#b17ce8', s: '#d8b7c7', e: '#ff9ee6', m: '#d2c3e0', b: '#261731' },
};

/* ============================== ENEMIES ============================== */
const GHoul = mapFrom([
  '..............',
  '....oooo......',
  '...oggggo.....',
  '..oggllggo....',
  '..oggeeggo....',
  '..oggllggo....',
  '...oggggo.....',
  '..oggggggo....',
  '.oggggggggo...',
  '.oggggggggo...',
  '..oggggggo....',
  '..ogggggo.....',
  '..og..ggo.....',
  '..oo..oo......',
]);

const GHUL_PALETTES = [
  { o: '#0b100b', g: '#65745a', l: '#93a579', e: '#d8ff6e' },
  { o: '#100b0b', g: '#7a5d54', l: '#a88476', e: '#ffb35e' },
  { o: '#0a0c14', g: '#556272', l: '#7f91a6', e: '#8fe8ff' },
];

const BAT_A = mapFrom([
  '............',
  'o..o....o..o',
  'oo.oo..oo.oo',
  '.oooooooooo.',
  '..obbbbbbo..',
  '..obebbebo..',
  '...obbbbo...',
  '....oooo....',
  '............',
  '............',
]);
const BAT_B = mapFrom([
  '............',
  '............',
  'oo.o....o.oo',
  '.oooooooooo.',
  '..obbbbbbo..',
  '..obebbebo..',
  '...obbbbo...',
  '....oooo....',
  '............',
  '............',
]);

const SKELETON = mapFrom([
  '..............',
  '....oooo......',
  '...obbbbo.....',
  '...obebbo.....',
  '...obbbbo.....',
  '....obbo......',
  '...obbbbo.....',
  '..obbbbbbo....',
  '.ob.obbo.bo...',
  '.ob.obbo.bo...',
  '...obbbbo.....',
  '...obbbbo.....',
  '...ob..bo.....',
  '...ob..bo.....',
  '...oo..oo.....',
  '..............',
]);

const WRAITH = mapFrom([
  '..............',
  '....oooo......',
  '...occcco.....',
  '..occlllco....',
  '..ocleelcco...',
  '..ocllllcco...',
  '..occccccco...',
  '.occccccccco..',
  '.occccccccco..',
  '..occccccco...',
  '..occccccco...',
  '...occcccco...',
  '...occcccco...',
  '....occcco....',
  '....ooooo.....',
  '..............',
]);

const SLIME = mapFrom([
  '..............',
  '..............',
  '....oooo......',
  '..ooggggoo....',
  '.oggggggggo...',
  '.ogggeeggggo..',
  '.ogggeeggggo..',
  '.ogggggggggo..',
  '.ogggggggggo..',
  '..ogggggggo...',
  '...ooooooo....',
  '..............',
]);

const BRUTE = mapFrom([
  '..................',
  '......oooooo......',
  '.....oggggggo.....',
  '....oggmmmmggo....',
  '....ogmmeemmggo...',
  '....ogmmmmmmggo...',
  '....oggmmmmggo....',
  '.....oggggggo.....',
  '...oogggggggoo....',
  '..oggggggggggggo..',
  '.oggoggggggggoggo.',
  '.oggoggggggggoggo.',
  '.oggoggggggggoggo.',
  '..oooggggggggooo..',
  '....oggggggggo....',
  '....oggg..gggo....',
  '...oogg....ggoo...',
  '...ooo......ooo...',
]);

const CULTIST = mapFrom([
  '..............',
  '....oooo......',
  '...occcco.....',
  '..occlllco....',
  '..ocleelcco...',
  '..ocllllcco...',
  '..occccccco...',
  '.occccccccco..',
  '.occccccccco..',
  '..occccccco...',
  '..occccccco...',
  '..occccccco...',
  '...occcccco...',
  '...occdddco...',
  '..oooccccooo..',
  '..............',
]);

const SPIDER = mapFrom([
  '............',
  '..o......o..',
  '.o.o....o.o.',
  '.o..oooo..o.',
  '..ooggggoo..',
  '.ooggeegggoo',
  '.oogggggggoo',
  '..oogggggoo.',
  '...o.oo.o...',
  '............',
]);

const BOSS_BONE = mapFrom([
  '..........oooooo..........',
  '.........ocbbbbco.........',
  '........ocbbbbbbco........',
  '........ocbebbbeco........',
  '........ocbbbbbbco........',
  '.........ocbbbbco.........',
  '..........obbbbo..........',
  '.......ooobbbbbbooo.......',
  '.....oobbbbbbbbbbbboo.....',
  '....obbbbbbbbbbbbbbbbo....',
  '...obbboobbbbbbbboobbbbo..',
  '...obbboobbbbbbbboobbbbo..',
  '...obbbbbbbbbbbbbbbbbbbo..',
  '....obbbbbbbbbbbbbbbbbbo..',
  '.....oobbbbbbbbbbbbbboo...',
  '.......obbbbbbbbbbbbo.....',
  '.......obbbboobbbbbo......',
  '.......obbbboobbbbbo......',
  '.......obbo....obbo.......',
  '.......obbo....obbo.......',
  '......oobbo....obboo......',
  '......oooo......oooo......',
]);

const BOSS_MIRE = mapFrom([
  '...........oooo...........',
  '.........ooggggoo.........',
  '........oggggggggo........',
  '.......oggmmmmmmggo.......',
  '......oggmmeemmmggo.......',
  '......oggmmmmmmggo.......',
  '.......oggmmmmggo.........',
  '........oggggggo..........',
  '.....oooggggggggooo.......',
  '...oogggggggggggggoo......',
  '..ogggoggggggggggogggo....',
  '..ogggoggggggggggogggo....',
  '..ogggoggggggggggogggo....',
  '..oogggggggggggggggggo....',
  '...ogggggggggggggggggo....',
  '....ogggggggggggggggo.....',
  '....ogggg..gggg..gggo.....',
  '...ooggg....ggg....ggoo...',
  '...oooo......o......oooo...',
]);

const BOSS_KING = mapFrom([
  '...........oooo...........',
  '..........occcco..........',
  '.........occlllco.........',
  '........occlllllco........',
  '........ocleeeelco........',
  '........ocllllllco........',
  '.........occcccco.........',
  '.......oooccccccooo.......',
  '.....ooccccccccccccoo.....',
  '....occcccccccccccccco....',
  '...occccooccccccocccccco..',
  '...occccooccccccocccccco..',
  '...occccccccccccccccccco..',
  '....occcccccccccccccccco..',
  '.....ooccccccccccccccoo...',
  '.......occcccccccccco.....',
  '.......occccoocccccco.....',
  '.......occccoocccccco.....',
  '.......occco..occcco......',
  '......ooccco..occccoo.....',
  '......oooooo..oooooo......',
]);

/* ============================== PICKUPS ============================== */
const GEM = mapFrom([
  '...o...',
  '..olo..',
  '.olllo.',
  'ollpllo',
  '.olllo.',
  '..olo..',
  '...o...',
]);

const HEART = mapFrom([
  '.oo..oo...',
  'ohhoohho..',
  'ohhhhhho..',
  'ohhhhhho..',
  '.ohhhho...',
  '..ohho....',
  '...oo.....',
]);

const CHEST = mapFrom([
  '..............',
  '..oooooooooo..',
  '.oyyyyyyyyyyo.',
  '.oyyyyyyyyyyo.',
  '.oyymmmmmmyyo.',
  '.oyymmggmmyyo.',
  '.oyymmmmmmyyo.',
  '.oyyyyyyyyyyo.',
  '..oooooooooo..',
  '..............',
]);

const POTION = mapFrom([
  '....oo....',
  '...obbo...',
  '...obbo...',
  '..obbbbo..',
  '..obllbo..',
  '.obllllbo.',
  '.obllllbo.',
  '..obbbbo..',
  '...oooo...',
  '..........',
]);

const BOMB = mapFrom([
  '.....o....',
  '....o.o...',
  '...o...o..',
  '..ooggoo..',
  '.oggllggo.',
  '.ogllllgo.',
  '.ogllllgo.',
  '..oggggo..',
  '...oooo...',
  '..........',
]);

const HOURGLASS = mapFrom([
  '.oooooooo.',
  '.oyyyyyyo.',
  '..oyyyyo..',
  '...oyyo...',
  '....oo....',
  '...oyyo...',
  '..oyyyyo..',
  '.oyyyyyyo.',
  '.oooooooo.',
  '..........',
]);

const MAGNET = mapFrom([
  '..oo..oo..',
  '.orroorro.',
  '.orroorro.',
  '.orroorro.',
  '.orroorro.',
  '..orroo...',
  '...oo.....',
  '..........',
  '..........',
  '..........',
]);

const FURY = mapFrom([
  '....o.....',
  '...oo.....',
  '..oyyo....',
  '.oyryyo...',
  '.oyrrryo..',
  '..oyrryo..',
  '...oyyo...',
  '....oo....',
  '..........',
  '..........',
]);

const ENEMY_PALETTES = {
  ghoul: [
    { o: '#0b100b', g: '#65745a', l: '#93a579', e: '#d8ff6e' },
    { o: '#100b0b', g: '#7a5d54', l: '#a88476', e: '#ffb35e' },
    { o: '#0a0c14', g: '#556272', l: '#7f91a6', e: '#8fe8ff' },
  ],
  bat: { o: '#100a16', b: '#4b3358', e: '#ff5d6c' },
  skeleton: { o: '#121014', b: '#d8d0b4', e: '#ff6a3d' },
  wraith: { o: '#0c0816', c: '#3b2c5c', l: '#66509a', e: '#8ff6ff' },
  slime: { o: '#0a140c', g: '#4d8c50', l: '#7ec46f', e: '#ffe66d' },
  brute: { o: '#0d0a10', g: '#6a5560', m: '#8d7f96', e: '#ffb347' },
  cultist: { o: '#13070c', c: '#7a2230', l: '#b34a4a', e: '#ffd36b' },
  spider: { o: '#0d0910', g: '#3d3350', e: '#ff4d6d' },
  bossBone: { o: '#0a0810', b: '#e2d7b2', c: '#c9b47a', e: '#ff4d3d' },
  bossMire: { o: '#06100a', g: '#4c7a44', m: '#9b8a63', e: '#d6ff4d' },
  bossKing: { o: '#08050e', c: '#3a2354', l: '#6c4b96', e: '#c08bff' },
};

export const SPRITES = {};
export const ICON_URLS = {};

function add(key, canvas) { SPRITES[key] = canvas; }

function build() {
  for (const [id, pal] of Object.entries(HERO_PALETTES)) {
    add(`hero_${id}_0`, drawMap(HERO_BASE, pal));
    add(`hero_${id}_1`, drawMap(HERO_WALK, pal));
    add(`hero_${id}_cast`, drawMap(HERO_CAST, pal));
  }
  ENEMY_PALETTES.ghoul.forEach((pal, i) => add(`ghoul_${i}`, drawMap(GHoul, pal)));
  add('bat_0', drawMap(BAT_A, ENEMY_PALETTES.bat));
  add('bat_1', drawMap(BAT_B, ENEMY_PALETTES.bat));
  add('skeleton', drawMap(SKELETON, ENEMY_PALETTES.skeleton));
  add('wraith', drawMap(WRAITH, ENEMY_PALETTES.wraith));
  add('slime', drawMap(SLIME, ENEMY_PALETTES.slime));
  add('brute', drawMap(BRUTE, ENEMY_PALETTES.brute));
  add('cultist', drawMap(CULTIST, ENEMY_PALETTES.cultist));
  add('spider', drawMap(SPIDER, ENEMY_PALETTES.spider));
  add('bossBone', drawMap(BOSS_BONE, ENEMY_PALETTES.bossBone));
  add('bossMire', drawMap(BOSS_MIRE, ENEMY_PALETTES.bossMire));
  add('bossKing', drawMap(BOSS_KING, ENEMY_PALETTES.bossKing));

  add('gem0', drawMap(GEM, { o: '#0b1830', l: '#3a7bff', p: '#bcd7ff' }));
  add('gem1', drawMap(GEM, { o: '#07220f', l: '#45c86a', p: '#c8ffd4' }));
  add('gem2', drawMap(GEM, { o: '#170a2c', l: '#9a5cff', p: '#e8d4ff' }));
  add('gem3', drawMap(GEM, { o: '#2a1a05', l: '#f0b43c', p: '#fff3c0' }));
  add('heart', drawMap(HEART, { o: '#2a0710', h: '#e8415c' }));
  add('chest', drawMap(CHEST, { o: '#1a1108', y: '#b8862e', m: '#e6c86e', g: '#ffeaa0' }));
  add('potion', drawMap(POTION, { o: '#101826', b: '#5b7f9e', l: '#ff6b7d' }));
  add('bomb', drawMap(BOMB, { o: '#0a0a0c', g: '#4a4450', l: '#9b93a8' }));
  add('hourglass', drawMap(HOURGLASS, { o: '#0a1620', y: '#8fd8ef' }));
  add('magnet', drawMap(MAGNET, { o: '#1a0c0c', r: '#e8556d' }));
  add('fury', drawMap(FURY, { o: '#200a04', y: '#ffb03a', r: '#ff5a2e' }));
  add('crown', drawMap(mapFrom([
    'o..o..o..o',
    'oyoyoyoyyo',
    'oyyyyyyyyo',
    'oyoyoyoyyo',
    '.oooooooo.',
  ]), { o: '#2a1a04', y: '#f2c96b' }));
  add('shadow', (() => {
    const c = makeCanvas(18, 7); const g = ctxOf(c);
    const grd = g.createRadialGradient(9, 3.5, 1, 9, 3.5, 9);
    grd.addColorStop(0, 'rgba(0,0,0,.55)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 18, 7); return c;
  })());
  add('glow', (() => {
    const c = makeCanvas(32, 32); const g = ctxOf(c);
    const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(.35, 'rgba(255,255,255,.5)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 32, 32); return c;
  })());

  buildIcons();
}

/* ============================== ICONS ============================== */
function iconCanvas(draw) {
  const c = makeCanvas(32, 32);
  const g = ctxOf(c);
  draw(g, c);
  return c;
}

function pixelLine(g, x0, y0, x1, y1, color, w = 2) {
  g.strokeStyle = color; g.lineWidth = w; g.lineCap = 'square';
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
}

function glow(g, x, y, r, color) {
  const grd = g.createRadialGradient(x, y, 0, x, y, r);
  grd.addColorStop(0, color); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(x - r, y - r, r * 2, r * 2);
}

function buildIcons() {
  const icons = {
    sword: g => {
      glow(g, 16, 16, 15, 'rgba(140,180,255,.25)');
      pixelLine(g, 7, 25, 22, 8, '#c8d4f0', 3);
      pixelLine(g, 9, 23, 22, 9, '#f2f7ff', 1);
      pixelLine(g, 6, 19, 13, 26, '#d8b45e', 2);
      pixelLine(g, 7, 27, 11, 23, '#8a5c2a', 2);
      g.fillStyle = '#f2c96b'; g.fillRect(21, 6, 3, 3);
    },
    bolt: g => {
      glow(g, 16, 16, 15, 'rgba(100,140,255,.5)');
      g.fillStyle = '#2a3f9e'; g.beginPath(); g.arc(16, 16, 8, 0, 7); g.fill();
      g.fillStyle = '#6f9cff'; g.beginPath(); g.arc(16, 16, 6, 0, 7); g.fill();
      g.fillStyle = '#d8e6ff'; g.beginPath(); g.arc(14, 14, 2.4, 0, 7); g.fill();
      g.fillStyle = '#bcd0ff'; g.fillRect(24, 6, 2, 2); g.fillRect(6, 24, 2, 2); g.fillRect(25, 21, 1, 1);
    },
    fireball: g => {
      glow(g, 16, 17, 16, 'rgba(255,120,30,.55)');
      g.fillStyle = '#8e1f0c'; g.beginPath(); g.ellipse(16, 18, 8, 9, 0, 0, 7); g.fill();
      g.fillStyle = '#e8541c'; g.beginPath(); g.ellipse(16, 18, 6, 7, 0, 0, 7); g.fill();
      g.fillStyle = '#ffb03a'; g.beginPath(); g.ellipse(15, 17, 3.6, 4.6, 0, 0, 7); g.fill();
      g.fillStyle = '#fff3c4'; g.beginPath(); g.ellipse(14, 16, 1.7, 2.2, 0, 0, 7); g.fill();
      g.fillStyle = '#ff7a2e'; g.beginPath(); g.moveTo(16, 3); g.lineTo(19, 11); g.lineTo(13, 9); g.fill();
    },
    lightning: g => {
      glow(g, 16, 16, 15, 'rgba(120,220,255,.45)');
      g.fillStyle = '#eaf9ff';
      g.beginPath(); g.moveTo(19, 3); g.lineTo(9, 18); g.lineTo(15, 18); g.lineTo(12, 29); g.lineTo(24, 13); g.lineTo(17, 13); g.lineTo(21, 3); g.closePath(); g.fill();
      g.fillStyle = '#72d9ff'; g.fillRect(13, 14, 3, 8); g.fillRect(18, 8, 2, 5);
    },
    orbit: g => {
      glow(g, 16, 16, 15, 'rgba(170,130,255,.35)');
      g.strokeStyle = '#6b4aa8'; g.lineWidth = 1.5; g.beginPath(); g.arc(16, 16, 10, 0, 7); g.stroke();
      for (const a of [0.5, 3.6]) {
        g.save(); g.translate(16 + Math.cos(a) * 10, 16 + Math.sin(a) * 10); g.rotate(a + 1.2);
        g.fillStyle = '#d9e2ff'; g.fillRect(-1, -6, 2.6, 9);
        g.fillStyle = '#f2c96b'; g.fillRect(-2, 3, 4, 1.6);
        g.restore();
      }
      g.fillStyle = '#b98cff'; g.beginPath(); g.arc(16, 16, 2.4, 0, 7); g.fill();
    },
    aura: g => {
      glow(g, 16, 16, 16, 'rgba(255,220,120,.4)');
      g.strokeStyle = '#f2c96b'; g.lineWidth = 2;
      g.beginPath(); g.arc(16, 16, 9, 0, 7); g.stroke();
      g.strokeStyle = 'rgba(255,240,190,.75)'; g.lineWidth = 1;
      g.beginPath(); g.arc(16, 16, 13, 0, 7); g.stroke();
      g.fillStyle = '#fff3c4'; g.beginPath(); g.arc(16, 16, 3, 0, 7); g.fill();
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * Math.PI * 2;
        g.fillStyle = '#ffe9a8';
        g.fillRect(16 + Math.cos(a) * 11 - 1, 16 + Math.sin(a) * 11 - 1, 2, 2);
      }
    },
    flask: g => {
      glow(g, 16, 19, 14, 'rgba(90,220,220,.35)');
      g.fillStyle = '#9ec8d8'; g.fillRect(13, 4, 6, 3); g.fillRect(14, 7, 4, 4);
      g.fillStyle = '#3b5b70'; g.beginPath(); g.moveTo(14, 10); g.lineTo(9, 20); g.quadraticCurveTo(8, 27, 16, 27); g.quadraticCurveTo(24, 27, 23, 20); g.lineTo(18, 10); g.closePath(); g.fill();
      g.fillStyle = '#62e0d0'; g.beginPath(); g.moveTo(11.5, 17); g.lineTo(20.5, 17); g.quadraticCurveTo(22, 24, 16, 24.5); g.quadraticCurveTo(10, 24, 11.5, 17); g.fill();
      g.fillStyle = '#c8fff4'; g.fillRect(13, 19, 3, 3);
    },
    spear: g => {
      glow(g, 16, 16, 14, 'rgba(220,220,180,.25)');
      pixelLine(g, 7, 26, 21, 9, '#b8a982', 2.5);
      g.fillStyle = '#e8ddb8';
      g.beginPath(); g.moveTo(26, 4); g.lineTo(21, 14); g.lineTo(18, 8); g.closePath(); g.fill();
      g.fillStyle = '#9b8a63'; g.fillRect(17, 11, 3, 2);
      pixelLine(g, 9, 24, 12, 21, '#7d6b48', 2);
    },
    might: g => {
      glow(g, 16, 17, 14, 'rgba(255,90,70,.3)');
      g.fillStyle = '#c8b08a'; g.fillRect(9, 12, 14, 8); g.fillRect(7, 14, 3, 5);
      g.fillStyle = '#e8d0a8'; g.fillRect(10, 13, 5, 4);
      g.fillStyle = '#8a5c3a'; g.fillRect(9, 20, 14, 2);
      pixelLine(g, 13, 4, 13, 11, '#e8556d', 2);
      pixelLine(g, 19, 5, 19, 11, '#e8556d', 2);
    },
    haste: g => {
      glow(g, 16, 16, 13, 'rgba(120,210,255,.3)');
      g.fillStyle = '#7fd8ef';
      g.beginPath(); g.moveTo(20, 4); g.lineTo(9, 16); g.lineTo(16, 16); g.lineTo(12, 28); g.lineTo(24, 15); g.lineTo(17, 15); g.closePath(); g.fill();
      g.fillStyle = '#d8f8ff'; g.fillRect(14, 12, 4, 7);
    },
    area: g => {
      glow(g, 16, 16, 15, 'rgba(180,120,255,.28)');
      g.strokeStyle = '#b98cff'; g.lineWidth = 2;
      g.beginPath(); g.arc(16, 16, 6, 0, 7); g.stroke();
      g.strokeStyle = 'rgba(220,190,255,.8)'; g.lineWidth = 1;
      g.beginPath(); g.arc(16, 16, 11, 0, 7); g.stroke();
      g.strokeStyle = 'rgba(160,110,255,.4)';
      g.beginPath(); g.arc(16, 16, 14, 0, 7); g.stroke();
      for (let i = 0; i < 4; i++) {
        const a = i / 4 * Math.PI * 2 + .4;
        pixelLine(g, 16 + Math.cos(a) * 6, 16 + Math.sin(a) * 6, 16 + Math.cos(a) * 13, 16 + Math.sin(a) * 13, '#c9a6ff', 1.5);
      }
    },
    speed: g => {
      glow(g, 16, 16, 14, 'rgba(120,255,200,.25)');
      g.fillStyle = '#8fd8b8';
      g.beginPath(); g.moveTo(21, 4); g.lineTo(8, 16); g.lineTo(16, 16); g.lineTo(12, 28); g.lineTo(24, 15); g.lineTo(17, 15); g.closePath(); g.fill();
      g.fillStyle = '#e8fff4'; g.fillRect(14, 13, 4, 6);
    },
    vitality: g => {
      glow(g, 16, 16, 14, 'rgba(255,70,110,.3)');
      g.fillStyle = '#e8415c';
      g.beginPath(); g.moveTo(16, 27); g.bezierCurveTo(6, 20, 5, 12, 10, 9); g.bezierCurveTo(14, 7, 16, 11, 16, 12); g.bezierCurveTo(16, 11, 18, 7, 22, 9); g.bezierCurveTo(27, 12, 26, 20, 16, 27); g.fill();
      g.fillStyle = '#ff9aa8'; g.beginPath(); g.ellipse(12, 13, 2, 3, -.5, 0, 7); g.fill();
    },
    armor: g => {
      glow(g, 16, 16, 14, 'rgba(140,170,220,.25)');
      g.fillStyle = '#5b6b8c';
      g.beginPath(); g.moveTo(16, 4); g.lineTo(27, 8); g.lineTo(25, 19); g.quadraticCurveTo(22, 25, 16, 28); g.quadraticCurveTo(10, 25, 7, 19); g.lineTo(5, 8); g.closePath(); g.fill();
      g.fillStyle = '#9fb2d0';
      g.beginPath(); g.moveTo(16, 7); g.lineTo(23, 10); g.lineTo(21.5, 18); g.quadraticCurveTo(19, 22, 16, 24); g.closePath(); g.fill();
      g.fillStyle = '#d8e2f2'; g.fillRect(15, 10, 2, 8);
    },
    magnet: g => {
      glow(g, 16, 16, 14, 'rgba(255,90,110,.25)');
      g.strokeStyle = '#e8556d'; g.lineWidth = 5; g.lineCap = 'butt';
      g.beginPath(); g.arc(16, 16, 8, 0, Math.PI); g.stroke();
      g.fillStyle = '#d8d0e0'; g.fillRect(5, 16, 6, 4); g.fillRect(21, 16, 6, 4);
      g.fillStyle = '#8fd8ef'; g.fillRect(5, 20, 6, 2); g.fillRect(21, 20, 6, 2);
    },
    growth: g => {
      glow(g, 16, 18, 14, 'rgba(120,255,140,.25)');
      g.strokeStyle = '#5ecf72'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(16, 27); g.quadraticCurveTo(16, 16, 16, 11); g.stroke();
      g.fillStyle = '#7ee08a';
      g.beginPath(); g.ellipse(10, 13, 6, 3, -.6, 0, 7); g.fill();
      g.beginPath(); g.ellipse(22, 9, 6, 3, .6, 0, 7); g.fill();
      g.fillStyle = '#b8ffc0'; g.fillRect(15, 18, 2, 3);
    },
    regen: g => {
      glow(g, 16, 16, 14, 'rgba(120,255,190,.25)');
      g.fillStyle = '#6fe0a8'; g.fillRect(13, 6, 6, 20); g.fillRect(6, 13, 20, 6);
      g.fillStyle = '#d8ffe8'; g.fillRect(14, 7, 2, 18); g.fillRect(7, 14, 18, 2);
    },
    luck: g => {
      glow(g, 16, 16, 14, 'rgba(255,220,90,.3)');
      g.fillStyle = '#f2c96b';
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5;
        const r = i % 2 ? 5 : 12;
        g.lineTo(16 + Math.cos(a) * r, 16 + Math.sin(a) * r);
      }
      g.closePath(); g.fill();
      g.fillStyle = '#fff3c4'; g.beginPath(); g.arc(16, 16, 2.5, 0, 7); g.fill();
    },
    multishot: g => {
      glow(g, 16, 16, 14, 'rgba(120,160,255,.28)');
      for (const dy of [-7, 0, 7]) {
        pixelLine(g, 7, 16 + dy, 21, 16 + dy, '#9fb8f0', 2);
        g.fillStyle = '#e8f0ff';
        g.beginPath(); g.moveTo(26, 16 + dy); g.lineTo(20, 13 + dy); g.lineTo(20, 19 + dy); g.fill();
      }
    },
    crit: g => {
      glow(g, 16, 16, 14, 'rgba(255,120,60,.3)');
      g.fillStyle = '#ffb03a';
      g.beginPath(); g.moveTo(16, 3); g.lineTo(20, 12); g.lineTo(29, 16); g.lineTo(20, 20); g.lineTo(16, 29); g.lineTo(12, 20); g.lineTo(3, 16); g.lineTo(12, 12); g.closePath(); g.fill();
      g.fillStyle = '#fff3c4'; g.beginPath(); g.arc(16, 16, 3, 0, 7); g.fill();
    },
    heal: g => {
      glow(g, 16, 16, 14, 'rgba(120,255,140,.3)');
      g.fillStyle = '#6fe08a'; g.fillRect(13, 6, 6, 20); g.fillRect(6, 13, 20, 6);
      g.fillStyle = '#e8ffe8'; g.fillRect(14, 8, 2, 16); g.fillRect(8, 14, 16, 2);
    },
  };
  for (const [id, draw] of Object.entries(icons)) {
    const c = iconCanvas(draw);
    ICON_URLS[id] = c.toDataURL();
  }
}

build();

export function sprite(key) { return SPRITES[key] || SPRITES.gem0; }
export function iconURL(id) { return ICON_URLS[id] || ICON_URLS.sword; }

/* Draw a sprite canvas centred on (x, y) with optional scale/flip. */
export function drawSprite(g, key, x, y, scale = 1, flip = false, alpha = 1) {
  const s = SPRITES[key];
  if (!s) return;
  const w = s.width * scale, h = s.height * scale;
  g.save();
  g.globalAlpha *= alpha;
  g.translate(Math.round(x), Math.round(y));
  if (flip) g.scale(-1, 1);
  g.drawImage(s, Math.round(-w / 2), Math.round(-h), w, h);
  g.restore();
}

/* Build a small portrait canvas for a hero, scaled to fit. */
export function portraitFor(heroId, w = 34, h = 42) {
  const c = makeCanvas(w, h);
  const g = ctxOf(c);
  const s = SPRITES[`hero_${heroId}_0`];
  const scale = Math.min((w - 2) / s.width, (h - 2) / s.height);
  g.drawImage(s, (w - s.width * scale) / 2, (h - s.height * scale) / 2, s.width * scale, s.height * scale);
  return c;
}
