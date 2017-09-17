export const SPELL_DATA = {
  BJ: {
    id: 'BJ',
    name: 'Blazing Jet III',
    baseDmg: 28769,
    castTime: 0,
    origCastTime: 0,
    recastTime: 6000,
    lockoutTime: 1500,
    resist: 'FIRE',
    timer: '5',
    manaCost: 10,
    discRefresh: 12000,
    isFocusable: true,
    skill: 24,
    level: 102
  },
  BS: {
    id: 'BS',
    name: 'Bolt of Molten Shieldstone Rk. III',
    baseDmg: 17280,
    castTime: 1500,
    origCastTime: 3000,
    recastTime: 6000,
    lockoutTime: 1500,
    resist: 'FIRE',
    type3DmgAug: 1234,
    timer: 'boltmoltenshield',
    manaCost: 1874,
    isFocusable: true,
    skill: 24,
    level: 101
  },
  CF: {
    id: 'CF',
    name: 'Chaotic Fire Rk. III',
    baseDmg: 21496,
    castTime: 1200,
    origCastTime: 1500,
    recastTime: 5250,
    lockoutTime: 1500,
    resist: 'FIRE',
    type3DmgAug: 1392,
    timer: '4',
    manaCost: 2624,
    isFocusable: true,
    skill: 24,
    level: 105
  },
  CR: {
    id: 'CR',
    name: 'Coronal Rain Rk. III',
    baseDmg: 17122,
    castTime: 2000,
    origCastTime: 4000,
    recastTime: 12000,
    lockoutTime: 1500,
    resist: 'FIRE',
    timer: '3',
    target: 'AE',
    manaCost: 1974,
    maxCritRate: 0.40,
    isFocusable: true,
    skill: 24,
    level: 103
  },
  FA: {
    id: 'FA',
    name: 'Firebound Alliance Rk. III',
    baseDmg: 0,
    castTime: 2000,
    origCastTime: 3000,
    recastTime: 60000,
    lockoutTime: 1500,
    resist: 'FIRE',
    timer: '13',
    manaCost: 12214,
    isFocusable: true,
    skill: 5,
    level: 101
  },
  FAF: {
    id: 'FAF',
    name: 'Firebound Fulmination III',
    baseDmg: 2347439,
    castTime: 0,
    origCastTime: 0,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'FIRE',
    timer: 'ff',
    manaCost: 0,
    max: 2347439,    
    maxCritRate: 0,
    spellDmgCap: 0,
    isFocusable: false,
    skill: 5,
    level: 255
  },
  FC: {
    id: 'FC',
    name: 'Fickle Conflagration Rk. III',
    baseDmg: 16954,
    castTime: 1200,
    origCastTime: 1500,
    recastTime: 5250,
    lockoutTime: 1500,
    resist: 'FIRE',
    type3DmgAug: 1211,
    timer: 'fickleconflag',
    manaCost: 1941,
    isFocusable: true,
    skill: 24,
    level: 105
  },
  RC: {
    id: 'RC',
    name: 'Rain of Cutlasses Rk. III',
    baseDmg: 16708,
    castTime: 2000,
    origCastTime: 4000,
    recastTime: 12000,
    lockoutTime: 1500,
    resist: 'MAGIC',
    type3DmgAug: 1193,
    timer: '7',
    target: 'AE',
    manaCost: 1899,
    maxCritRate: 0.40,
    isFocusable: true,
    skill: 24,
    level: 104
  },
  RS: {
    id: 'RS',
    name: 'Remorseless Servant Rk. III',
    baseDmg: 2,
    castTime: 800,
    origCastTime: 1000,
    recastTime: 19000,
    lockoutTime: 1500,
    resist: 'NONE',
    type3Aug: 1000,
    timer: 'remroselessservant',
    spellDmgCap: 0,
    canTwincast: false,
    manaCost: 4030,
    isFocusable: true,
    skill: 14,
    level: 105
  },
  SFB: {
    id: 'SFB',
    name: 'Summon Firebound Orb Rk. III',
    beneficial: true,
    baseDmg: 0,
    castTime: 3500,
    origCastTime: 7000,
    recastTime: 6000,
    lockoutTime: 1500,
    resist: 'NONE',
    target: 'self',
    timer: 'summonfirebound',
    manaCost: 9453,
    isFocusable: true,
    skill: 14,
    level: 102
  },
  SB: {
    id: 'SB',
    name: 'Spear of Blistersteel Rk. III',
    baseDmg: 26967,
    castTime: 1800,
    origCastTime: 3500,
    recastTime: 9000,
    lockoutTime: 1500,
    resist: 'FIRE',
    type3DmgAug: 1926,
    timer: 'spearblister',
    manaCost: 4273,
    isFocusable: true,
    skill: 24,
    level: 100
  },
  SM: {
    id: 'SM',
    name: 'Storm of Many Rk. III',
    baseDmg: 4101,
    baseDmg1: 4101,
    baseDmg2: 4101,
    baseDmg3: 8838,
    baseDmg4: 8838,
    baseDmg5: 8838,
    baseDmg6: 14900,
    baseDmg7: 14900,
    baseDmg8: 14900,
    baseDmg9: 14900,
    baseDmg10: 24391,
    baseDmg11: 24391,
    baseDmg12: 24391,
    baseDmg13: 24391,
    baseDmg14: 24391,
    baseDmg15: 38466,
    castTime: 600,
    origCastTime: 750,
    recastTime: 9000,
    lockoutTime: 1500,
    resist: 'FIRE',
    type3DmgAug: 230,
    timer: '6',
    manaCost: 1860,
    isFocusable: true,
    skill: 24,
    level: 102
  },
  SS: {
    id: 'SS',
    name: 'Spear of Molten Shieldstone Rk. III',
    baseDmg: 29731,
    castTime: 1800,
    origCastTime: 3500,
    recastTime: 9000,
    lockoutTime: 1500,
    resist: 'FIRE',
    type3DmgAug: 2124,
    timer: 'spearmoltenshield',
    manaCost: 4900,
    isFocusable: true,
    skill: 24,
    level: 105
  },
  FE15: {
    id: 'FE15',
    name: 'Force of Elements XV',
    baseDmg: 20105,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FE14: {
    id: 'FE14',
    name: 'Force of Elements XIV',
    baseDmg: 18800,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FE13: {
    id: 'FE13',
    name: 'Force of Elements XIII',
    baseDmg: 17530,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FE12: {
    id: 'FE12',
    name: 'Force of Elements XII',
    baseDmg: 16250,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FE11: {
    id: 'FE11',
    name: 'Force of Elements XI',
    baseDmg: 13150,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FE10: {
    id: 'FE10',
    name: 'Force of Elements X',
    baseDmg: 10050,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: false,
    skill: 24,
    level: 254
  },
  FE9: {
    id: 'FE9',
    name: 'Force of Elements IX',
    baseDmg: 5950,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: true,
    skill: 24,
    level: 254
  },
  FE8: {
    id: 'FE8',
    name: 'Force of Elements VIII',
    baseDmg: 4850,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: true,
    skill: 24,
    level: 254
  },
  FE7: {
    id: 'FE7',
    name: 'Force of Elements VII',
    baseDmg: 3750,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: true,
    skill: 24,
    level: 254
  },
  FE6: {
    id: 'FE6',
    name: 'Force of Elements VI',
    baseDmg: 2750,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: true,
    skill: 24,
    level: 254
  },
  FE5: {
    id: 'FE5',
    name: 'Force of Elements V',
    baseDmg: 2250,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: true,
    skill: 24,
    level: 254
  },
  FE4: {
    id: 'FE4',
    name: 'Force of Elements IV',
    baseDmg: 1850,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: true,
    skill: 24,
    level: 254
  },
  FE3: {
    id: 'FE3',
    name: 'Force of Elements III',
    baseDmg: 1550,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: true,
    skill: 24,
    level: 254
  },
  FE2: {
    id: 'FE2',
    name: 'Force of Elements II',
    baseDmg: 1350,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: true,
    skill: 24,
    level: 254
  },
  FE1: {
    id: 'FE1',
    name: 'Force of Elements I',
    baseDmg: 1150,
    castTime: 500,
    origCastTime: 500,
    recastTime: 0,
    lockoutTime: 0,
    resist: 'MAGIC',
    timer: 'FE',
    manaCost: 0,
    discRefresh: 20000,
    isFocusable: true,
    skill: 24,
    level: 254
  }
};