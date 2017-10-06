export const SPELL_DATA = {
  AFU1: {
    base1: 10,
    baseDmg: 73450,
    castTime: 0,
    focusable: false,
    id: 'AFU1',
    level: 254,
    manaCost: 0,
    maxCritRate: 0.15,
    name: 'Arcane Fusion I',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'afusion'
  },
  AFU2: {
    base1: 10,
    baseDmg: 100000,
    castTime: 0,
    focusable: false,
    id: 'AFU2',
    level: 254,
    manaCost: 0,
    maxCritRate: 0.15,
    name: 'Arcane Fusion II',
    origCastTime: 0,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'afusion'
  },
/*
  CRYO: {
    baseDmg: 16050,
    castTime: 0,
    focusable: false,
    id: 'CRYO',
    level: 254,
    manaCost: 0,
    name: 'Cryomantic Stasis XXIV',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 5,
    target: 'SINGLE',
    timer: 'cryo'
  },
*/
  CF: {
    baseDmg: 21666,
    castTime: 1500,
    focusable: true,
    id: 'CF',
    level: 103,
    lockoutTime: 1500,
    manaCost: 1676,
    name: 'Claw of the Flameweaver Rk. III',
    origCastTime: 3000,
    recastTime: 6000,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '11',
    type3DmgAug: 1392
  },
  CI: {
    baseDmg: 7237,
    castTime: 600,
    focusable: true,
    id: 'CI',
    level: 99,
    lockoutTime: 1500,
    manaCost: 714,
    name: 'Chaos Incandescence Rk. III',
    origCastTime: 750,
    recastTime: 4000,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'chaosinc',
    type3DmgAug: 673
  },
  CS: {
    baseDmg: 17947,
    castTime: 0,
    focusable: true,
    id: 'CS',
    level: 102,
    lockoutTime: 1500,
    manaCost: 3080,
    name: 'Cloudburst Stormstrike Rk. III',
    origCastTime: 0,
    recastTime: 3000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '2',
    type3DmgAug: 1282
  },
  CS2: {
    baseDmg: 8469,
    canTwincast: false,
    castTime: 0,
    focusable: true,
    id: 'CS2',
    level: 101,
    lockoutTime: 1500,
    manaCost: 100,
    name: 'Chaos Scintillation III',
    origCastTime: 0,
    recastTime: 4750,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'chaos2',
    type3DmgAug: 793
  },
  DF: {
    baseDmg: 127710,
    canTwincast: false,
    castTime: 2000,
    focusable: true,
    id: 'DF',
    level: 250,
    lockoutTime: 1500,
    manaCost: 100,
    name: 'Dichotomic Fire 6',
    origCastTime: 0,
    recastTime: 60000,
    recastTime2: 6000,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'dicho'
  },
  EF: {
    baseDmg: 28201,
    castTime: 1900,
    focusable: true,
    id: 'EF',
    level: 102,
    lockoutTime: 1500,
    manaCost: 4980,
    name: 'Ethereal Flash Rk. III',
    origCastTime: 3750,
    recastTime: 5500,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'eflash',
    type3DmgAug: 2381
  },
  ER: {
    baseDmg: 29975,
    castTime: 1900,
    focusable: true,
    id: 'ER',
    level: 104,
    lockoutTime: 1500,
    manaCost: 4639,
    name: 'Ethereal Rimeblast Rk. III',
    origCastTime: 3750,
    recastTime: 5250,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: 'erimeblast',
    type3DmgAug: 2381
  },
  ES: {
    baseDmg: 33330,
    castTime: 1900,
    focusable: true,
    id: 'ES',
    level: 105,
    lockoutTime: 1500,
    manaCost: 5158,
    name: 'Ethereal Skyblaze Rk. III',
    origCastTime: 3750,
    recastTime: 5500,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: 'eskyblaze',
    type3DmgAug: 2381
  },
  FA: {
    castTime: 2000,
    focusable: true,
    id: 'FA',
    level: 102,
    lockoutTime: 1500,
    manaCost: 13261,
    name: 'Frostbound Alliance Rk. III',
    origCastTime: 3000,
    recastTime: 60000,
    resist: 'COLD',
    skill: 5,
    target: 'SINGLE',
    timer: '14'
  },
  FAF: {
    baseDmg: 2696520,
    castTime: 0,
    focusable: false,
    id: 'FAF',
    level: 255,
    lockoutTime: 0,
    manaCost: 0,
    max: 2696520,
    maxCritRate: 0,
    name: 'Frostbound Fulmination III',
    origCastTime: 0,
    recastTime: 0,
    resist: 'COLD',
    skill: 5,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'ff'
  },
  FC: {
    baseDmg: 15294,
    castTime: 0,
    focusable: true,
    id: 'FC',
    level: 104,
    lockoutTime: 1500,
    manaCost: 2467,
    name: 'Flashchar Rk. III',
    origCastTime: 0,
    recastTime: 8250,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '2',
    type3DmgAug: 1040
  },
  FF4: {
    baseDmg: 14010,
    castTime: 500,
    focusable: false,
    id: 'FF4',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Flame IV',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FF5: {
    baseDmg: 15000,
    castTime: 500,
    focusable: false,
    id: 'FF5',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Flame V',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FF6: {
    baseDmg: 15985,
    castTime: 500,
    focusable: false,
    id: 'FF6',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Flame VI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'FIRE',
    skill: 24,
    target: 'SINGLE',
    timer: '36'
  },
  FI4: {
    baseDmg: 14010,
    castTime: 500,
    focusable: false,
    id: 'FI4',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Ice IV',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FI5: {
    baseDmg: 15000,
    castTime: 500,
    focusable: false,
    id: 'FI5',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Ice V',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FI6: {
    baseDmg: 15985,
    castTime: 500,
    focusable: false,
    id: 'FI6',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Ice VI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: '44'
  },
  FU: {
    castTime: 1500,
    focusable: true,
    id: 'FU',
    level: 105,
    lockoutTime: 1500,
    manaCost: 5911,
    name: 'Ethereal Fuse Rk. III',
    origCastTime: 3000,
    recastTime: 36000,
    skill: 24,
    target: 'SINGLE',
    timer: '12'
  },
  FW24: {
    baseDmg: 14010,
    castTime: 500,
    focusable: false,
    id: 'FW24',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Will XVI',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  FW25: {
    baseDmg: 15000,
    castTime: 500,
    focusable: false,
    id: 'FW25',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Will XVII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  FW26: {
    baseDmg: 15985,
    castTime: 500,
    focusable: false,
    id: 'FW26',
    level: 254,
    lockoutTime: 0,
    manaCost: 1750,
    name: 'Force of Will XVIII',
    origCastTime: 500,
    recastTime: 0,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: '37'
  },
  HC: {
    baseDmg: 19104,
    castTime: 1500,
    focusable: true,
    id: 'HC',
    level: 99,
    lockoutTime: 1500,
    manaCost: 1964,
    name: 'Hoarfrost Cascade Rk. III',
    origCastTime: 3000,
    recastTime: 6000,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: 'hoarcascade',
    type3DmgAug: 1345
  },
  MB: {
    baseDmg: 13435,
    castTime: 1500,
    focusable: true,
    id: 'MB',
    level: 104,
    lockoutTime: 1500,
    manaCost: 1681,
    maxCritRate: 0.40,
    name: 'Magmatic Burst Rk. III',
    origCastTime: 3000,
    recastTime: 12000,
    resist: 'FIRE',
    skill: 24,
    target: 'AE',
    timer: '6',
    type3DmgAug: 902
  },
  MBRN: {
    baseDmg: 2400000,
    castTime: 3000,
    focusable: false,
    id: 'MBRN',
    level: 254,
    lockoutTime: 0,
    manaCost: 60000,
    maxCritRate: 0,
    name: 'Mana Burn XVI',
    origCastTime: 3000,
    recastTime: 1800,
    resist: 'MAGIC',
    skill: 98,
    spellDmgCap: 0,
    target: 'SINGLE',
    timer: 'MBRN'
  },
  PE: {
    baseDmg: 11272,
    castTime: 600,
    focusable: true,
    id: 'PE',
    level: 100,
    lockoutTime: 1500,
    manaCost: 50,
    name: 'Pure Wildether III',
    origCastTime: 750,
    recastTime: 4000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'pwildether',
    type3DmgAug: 794
  },
  PF: {
    baseDmg: 13049,
    canTwincast: false,
    castTime: 750,
    focusable: true,
    id: 'PF',
    level: 105,
    lockoutTime: 1500,
    manaCost: 50,
    name: 'Pure Wildflash III',
    origCastTime: 750,
    recastTime: 4000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'pwildflash',
    type3DmgAug: 932
  },
  RC2: {
    baseDmg: 21062,
    canTwincast: false,
    castTime: 0,
    focusable: true,
    id: 'RC2',
    level: 101,
    lockoutTime: 1500,
    manaCost: 100,
    name: 'Rimeblast Cascade Rk. III',
    origCastTime: 0,
    recastTime: 9000,
    resist: 'COLD',
    skill: 24,
    target: 'SINGLE',
    timer: 'rimecascade2',
    type3DmgAug: 1504
  },
  SV: {
    baseDmg: 14388,
    castTime: 800,
    focusable: true,
    id: 'SV',
    level: 103,
    lockoutTime: 1500,
    manaCost: 1246,
    name: 'Shocking Vortex Rk. III',
    origCastTime: 1000,
    recastTime: 24000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'vortex'
  },
  WE: {
    baseDmg: 0,
    castTime: 600,
    focusable: true,
    id: 'WE',
    level: 96,
    lockoutTime: 1500,
    manaCost: 583,
    name: 'Wildether Barrage Rk. III',
    origCastTime: 750,
    recastTime: 4000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'wildether'
  },
  WF: {
    baseDmg: 0,
    castTime: 600,
    focusable: true,
    id: 'WF',
    level: 101,
    lockoutTime: 1500,
    manaCost: 669,
    name: 'Wildflash Barrage Rk. III',
    origCastTime: 750,
    recastTime: 4000,
    resist: 'MAGIC',
    skill: 24,
    target: 'SINGLE',
    timer: 'wildflash'
  }
};
