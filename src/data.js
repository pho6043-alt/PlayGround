/* ============================================================
   GRAVEWAKE — game data: survivors, weapons, passives, foes
   ============================================================ */

export const CHARACTERS = [
  {
    id: 'seren', name: 'SEREN', title: 'THE GRAVEBLADE', weapon: 'sword',
    perk: '+12% move speed', perkLong: 'A duelist who dances between the dead.',
    hp: 100, speed: 1.12, area: 1, cooldown: 1, magnet: 1, armor: 0,
    accent: '#8192f0', glow: 'rgba(90,110,240,.45)',
  },
  {
    id: 'mira', name: 'MIRA', title: 'THE EMBERWITCH', weapon: 'fireball',
    perk: '+18% area · burning blasts', perkLong: 'Every spark remembers the pyre.',
    hp: 92, speed: 1, area: 1.18, cooldown: 1, magnet: 1, armor: 0,
    accent: '#ef7a63', glow: 'rgba(240,110,70,.45)',
  },
  {
    id: 'kael', name: 'KAEL', title: 'THE STORMCALLER', weapon: 'lightning',
    perk: '−12% weapon cooldown', perkLong: 'The sky answers when he speaks.',
    hp: 96, speed: 1.02, area: 1, cooldown: 0.88, magnet: 1, armor: 0,
    accent: '#69d7c6', glow: 'rgba(80,220,210,.4)',
  },
  {
    id: 'nyx', name: 'NYX', title: 'THE HOLLOW SAINT', weapon: 'orbit',
    perk: '+40% pickup range · +1 armor', perkLong: 'She gathers what the night leaves behind.',
    hp: 88, speed: 1.05, area: 1, cooldown: 1, magnet: 1.4, armor: 1,
    accent: '#b17ce8', glow: 'rgba(170,110,240,.45)',
  },
];

export const WEAPONS = {
  sword: {
    id: 'sword', name: 'GRAVEBLADE', evoName: 'DAWNBREAKER', icon: 'sword',
    maxLevel: 8, type: 'melee', cooldown: 0.78, damage: 15, range: 78, arc: 2.0, amount: 1,
    color: '#bcd0ff', desc: 'Carve a wide arc through nearby foes.',
    evo: { passive: 'might', text: 'A blazing arc that burns and cleaves all it touches.' },
    evoColor: '#ffe9a8',
  },
  bolt: {
    id: 'bolt', name: 'ARCANE SHARD', evoName: 'VOID LANCE', icon: 'bolt',
    maxLevel: 8, type: 'projectile', cooldown: 0.92, damage: 11, speed: 300, range: 270, pierce: 1, amount: 1,
    color: '#7fa8ff', desc: 'Hurl arcane shards at the nearest enemy.',
    evo: { passive: 'haste', text: 'A lance of nothing that pierces every foe in its path.' },
    evoColor: '#b8ccff',
  },
  fireball: {
    id: 'fireball', name: 'CINDER ORB', evoName: 'METEOR CROWN', icon: 'fireball',
    maxLevel: 8, type: 'explosive', cooldown: 1.75, damage: 21, speed: 200, range: 250, area: 36,
    color: '#ff9a3c', desc: 'Lob a burning orb that bursts on impact.',
    evo: { passive: 'area', text: 'Calls meteors that scorch the earth and leave fire behind.' },
    evoColor: '#ffb03a',
  },
  lightning: {
    id: 'lightning', name: 'STORM SIGIL', evoName: 'STORMCALLER', icon: 'lightning',
    maxLevel: 8, type: 'lightning', cooldown: 1.65, damage: 23, range: 190, amount: 2, chains: 1,
    color: '#8fe8ff', desc: 'Call chain lightning down on random foes.',
    evo: { passive: 'luck', text: 'The heavens split. Storms leap endlessly between the dead.' },
    evoColor: '#c8f6ff',
  },
  orbit: {
    id: 'orbit', name: 'MOURNING BLADES', evoName: 'BLADE TEMPEST', icon: 'orbit',
    maxLevel: 8, type: 'orbit', cooldown: 0.42, damage: 9, radius: 56, amount: 2,
    color: '#c9a6ff', desc: 'Spectral blades orbit you, shredding anything close.',
    evo: { passive: 'multishot', text: 'A whirlwind of blades that never stops turning.' },
    evoColor: '#e0c2ff',
  },
  aura: {
    id: 'aura', name: 'HALLOWED AURA', evoName: 'SOLAR FLARE', icon: 'aura',
    maxLevel: 8, type: 'aura', cooldown: 0.55, damage: 7, radius: 62,
    color: '#ffe9a8', desc: 'A sanctified aura burns the unholy around you.',
    evo: { passive: 'vitality', text: 'A miniature sun that scorches foes and mends your wounds.' },
    evoColor: '#fff3c4',
  },
  flask: {
    id: 'flask', name: 'SACRED FLASK', evoName: 'ASHEN CHALICE', icon: 'flask',
    maxLevel: 8, type: 'zone', cooldown: 2.2, damage: 9, radius: 46, duration: 4, amount: 1, range: 210,
    color: '#62e0d0', desc: 'Throw sacred fire, leaving a burning pool.',
    evo: { passive: 'growth', text: 'Unholy flame spreads wide and devours everything within.' },
    evoColor: '#7ff0dc',
  },
  spear: {
    id: 'spear', name: 'BONE SPEAR', evoName: 'BONE REAPER', icon: 'spear',
    maxLevel: 8, type: 'pierce', cooldown: 1.25, damage: 17, speed: 340, range: 300, pierce: 4, amount: 1,
    color: '#e8ddb8', desc: 'Skewer a line of enemies with a bone spear.',
    evo: { passive: 'armor', text: 'Every kill sends another spear screaming through the dark.' },
    evoColor: '#fff0c4',
  },
};

export const PASSIVES = {
  might: { id: 'might', name: 'MIGHT', icon: 'might', max: 5, desc: '+12% attack power', rarity: 'common' },
  haste: { id: 'haste', name: 'HASTE', icon: 'haste', max: 5, desc: '−8% weapon cooldown', rarity: 'common' },
  area: { id: 'area', name: 'AREA', icon: 'area', max: 5, desc: '+10% attack area', rarity: 'common' },
  speed: { id: 'speed', name: 'SWIFTNESS', icon: 'speed', max: 5, desc: '+6% move speed', rarity: 'common' },
  vitality: { id: 'vitality', name: 'VITALITY', icon: 'vitality', max: 5, desc: '+18 max health (and heal)', rarity: 'common' },
  armor: { id: 'armor', name: 'ARMOR', icon: 'armor', max: 5, desc: '+2 defense', rarity: 'common' },
  magnet: { id: 'magnet', name: 'SOUL MAGNET', icon: 'magnet', max: 5, desc: '+30% gem pickup range', rarity: 'common' },
  growth: { id: 'growth', name: 'GROWTH', icon: 'growth', max: 5, desc: '+10% experience gained', rarity: 'common' },
  regen: { id: 'regen', name: 'REGENERATION', icon: 'regen', max: 5, desc: '+0.4 health per second', rarity: 'rare' },
  luck: { id: 'luck', name: 'OMEN', icon: 'luck', max: 5, desc: '+2% crit chance, rarer choices', rarity: 'rare' },
  multishot: { id: 'multishot', name: 'MULTISHOT', icon: 'multishot', max: 3, desc: '+1 projectile / blade', rarity: 'rare' },
};

export const ENEMIES = {
  ghoul: { id: 'ghoul', name: 'Ghoul', sprites: ['ghoul_0', 'ghoul_1', 'ghoul_2'], hp: 16, speed: 31, dmg: 8, radius: 6, xp: 1, weight: m => 10, kb: 1 },
  bat: { id: 'bat', name: 'Grave Bat', sprites: ['bat_0', 'bat_1'], hp: 8, speed: 64, dmg: 5, radius: 5, xp: 1, weight: m => 8 + m * 0.15, kb: 1.3, weave: true },
  spider: { id: 'spider', name: 'Crypt Spider', sprites: ['spider'], hp: 7, speed: 78, dmg: 4, radius: 4, xp: 1, weight: m => m >= 1 ? 5 + m * 0.1 : 0, kb: 1.5, weave: true },
  skeleton: { id: 'skeleton', name: 'Bone Archer', sprites: ['skeleton'], hp: 24, speed: 24, dmg: 9, radius: 6, xp: 2, weight: m => m >= 2 ? 5 : 0, kb: 0.8, ranged: 165, shotCd: 3.2 },
  slime: { id: 'slime', name: 'Mire Slime', sprites: ['slime'], hp: 42, speed: 19, dmg: 11, radius: 8, xp: 2, weight: m => m >= 3 ? 4 : 0, kb: 0.6, splits: 2 },
  wraith: { id: 'wraith', name: 'Wraith', sprites: ['wraith'], hp: 20, speed: 47, dmg: 10, radius: 6, xp: 3, weight: m => m >= 4 ? 5 : 0, kb: 1, blink: true },
  cultist: { id: 'cultist', name: 'Cultist', sprites: ['cultist'], hp: 28, speed: 23, dmg: 10, radius: 6, xp: 3, weight: m => m >= 6 ? 4 : 0, kb: 0.9, ranged: 190, shotCd: 2.6, arcShot: true },
  brute: { id: 'brute', name: 'Bone Brute', sprites: ['brute'], hp: 95, speed: 17, dmg: 19, radius: 10, xp: 5, weight: m => m >= 8 ? 3 + m * 0.04 : 0, kb: 0.25, charge: true },
};

export const BOSSES = [
  { name: 'THE BONE TYRANT', sprite: 'bossBone', tint: '#ffb08a', scale: 2.1 },
  { name: 'THE MIRE COLOSSUS', sprite: 'bossMire', tint: '#c8ff8a', scale: 2.3 },
  { name: 'THE HOLLOW KING', sprite: 'bossKing', tint: '#d8a8ff', scale: 2.2 },
  { name: 'THE DREAD WARDEN', sprite: 'bossBone', tint: '#ff8a8a', scale: 2.35 },
  { name: 'THE ROTMOTHER', sprite: 'bossMire', tint: '#a8ffb0', scale: 2.45 },
  { name: 'THE UMBRAL SOVEREIGN', sprite: 'bossKing', tint: '#ffd8a8', scale: 2.7 },
];

export const POWERUPS = {
  heart: { id: 'heart', name: 'BLOOD VIAL', icon: 'heal', color: '#ff7d8d', desc: 'Restore 30% health' },
  magnet: { id: 'magnet', name: 'SOUL DRAW', icon: 'magnet', color: '#d9c2ff', desc: 'Pull in every gem' },
  bomb: { id: 'bomb', name: 'GRAVE BOMB', icon: 'bomb', color: '#ffb03a', desc: 'Blast all nearby foes' },
  hourglass: { id: 'hourglass', name: 'FROZEN HOUR', icon: 'haste', color: '#8fd8ef', desc: 'Freeze the horde for 5s' },
  fury: { id: 'fury', name: 'BLOOD FURY', icon: 'crit', color: '#ff7a4d', desc: '+100% damage for 10s' },
  shield: { id: 'shield', name: 'WARD OF DAWN', icon: 'armor', color: '#ffe9b0', desc: 'Absorb damage for 8s' },
};

export const BUFF_META = {
  fury: { label: 'FURY', cls: 'fury', dur: 10 },
  freeze: { label: 'FROZEN', cls: 'freeze', dur: 5 },
  shield: { label: 'WARD', cls: 'shield', dur: 8 },
  magnet: { label: 'MAGNET', cls: 'magnet', dur: 3 },
};

export const WAVE_NAMES = [
  [30, 'THE DEAD STIR'],
  [60, 'BLOOD MOON RISING'],
  [120, 'THE GRAVEYARD WAKES'],
  [180, 'HUNGER IN THE DARK'],
  [240, 'THE HOLLOW HUNT'],
  [300, 'A TYRANT APPROACHES'],
  [420, 'THE NIGHT DEEPENS'],
  [540, 'ASH FALLS LIKE SNOW'],
  [660, 'THE HORDE WITHOUT END'],
  [780, 'RUIN COMES CALLING'],
  [900, 'HALFWAY TO DAWN'],
  [1020, 'THE STARS GO OUT'],
  [1140, 'EVERYTHING THAT DIED'],
  [1260, 'THE UMBRAL TIDE'],
  [1380, 'NO DAWN FOR THE WICKED'],
  [1500, 'THE LAST HOUR'],
  [1620, 'THE WORLD IS BLEEDING'],
  [1740, 'THE HOLLOW KING COMES'],
];

export const XP_TIER = [
  { max: 1, sprite: 'gem0' },
  { max: 3, sprite: 'gem1' },
  { max: 9, sprite: 'gem2' },
  { max: Infinity, sprite: 'gem3' },
];

export function gemSpriteFor(value) {
  for (const t of XP_TIER) if (value <= t.max) return t.sprite;
  return 'gem3';
}

export function xpNeeded(level) {
  return Math.floor(5 + level * 4 + level * level * 0.55);
}

export function weaponStat(w, player) {
  const d = WEAPONS[w.id];
  const lvl = w.level;
  const evo = w.evolved ? 1 : 0;
  const amountBase = d.amount || 0;
  const amountFromLevel = d.type === 'projectile' || d.type === 'pierce' || d.type === 'explosive' || d.type === 'lightning' || d.type === 'orbit' || d.type === 'zone'
    ? Math.floor((lvl - 1) / 3) : 0;
  const multishot = (d.type === 'projectile' || d.type === 'pierce' || d.type === 'explosive' || d.type === 'lightning' || d.type === 'orbit' || d.type === 'zone')
    ? (player.stats.multishot || 0) : 0;
  const dmg = d.damage * (1 + 0.26 * (lvl - 1)) * (evo ? 1.75 : 1) * (1 + (player.stats.might || 0) * 0.12);
  const cd = d.cooldown * Math.pow(0.93, lvl - 1) * (evo ? 0.72 : 1) * Math.pow(0.92, player.stats.haste || 0) * (player.charCooldown || 1);
  const area = (1 + 0.07 * (lvl - 1)) * (evo ? 1.3 : 1) * (1 + (player.stats.area || 0) * 0.10) * (player.charArea || 1);
  const amount = Math.max(1, amountBase + amountFromLevel + multishot + (evo ? 2 : 0));
  const pierce = (d.pierce || 0) + (evo ? 99 : Math.floor((lvl - 1) / 4));
  return {
    damage: dmg, cooldown: cd, area, amount, pierce,
    range: (d.range || 0) * area, radius: (d.radius || 0) * area,
    speed: d.speed || 0, arc: (d.arc || 0) * (0.9 + area * 0.1),
    duration: (d.duration || 0) * area,
  };
}

export function weaponUpgradeText(w) {
  const d = WEAPONS[w.id];
  const next = w.level + 1;
  const parts = [];
  parts.push('+26% damage');
  if (next % 2 === 0) parts.push('faster cast');
  if (next % 3 === 1 && next > 1) parts.push('+1 projectile');
  if (next >= 5) parts.push('wider area');
  return parts.slice(0, 2).join(' · ');
}

export const RARITY = {
  common: { key: 'common', label: 'COMMON' },
  rare: { key: 'rare', label: 'RARE' },
  epic: { key: 'epic', label: 'EPIC' },
  legend: { key: 'legend', label: 'LEGENDARY' },
};
