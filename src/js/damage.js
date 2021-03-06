import {globals as G} from './settings.js';
import * as abilities from './abilities.js';
import * as dmgU from './damage.utils.js';
import * as dom from './dom.js';
import * as stats from './stats.js';
import * as timeline from './timeline.js';
import * as utils from './utils.js';

function addAEWaves(state, mod, current) {
  stats.updateSpellStatistics(state, 'aeHit1', current);

  state.aeWave = true;

  let hits = dom.getAERainHitsValue();
  if (hits > state.spell.maxHits) {
    hits = state.spell.maxHits;
  }

  // for each additional wave
  for (let i=1; i<hits; i++) {
    calcAvgDamage(state, mod, 'aeHit' + (i+1));
  }

  state.aeWave = false;
}

function addSpellAndEqpProcs(state, mod) {
  let time = state.workingTime;

  // should look these up at some point
  dmgU.getSpellProcs(state.spellProcAbilities, state.spell)
    .forEach(item => {
      // remove if execute failed to do anything
      if (!item.proc || !executeProc(state, item.proc, mod, item.id)) {
        state.spellProcAbilities.delete(item.id);
      }
    });

  // add eqp and aug procs
  dmgU.getEqpProcs(state.spell).forEach(id => { executeProc(state, id, mod, 'EQP') });
}

function applyPostSpellEffects(state, mod, dmgKey) {
  mod = (mod === undefined) ? 1 : mod;
  let spell = state.spell;

  // all implemented enc spells have a chance to proc gift of hazy thoughts
  if (G.MODE === 'enc') {
    let hazy = dom.getGiftOfHazyValue();
    if (hazy > 0) {
      timeline.addSpellProcAbility(state, 'GCH', hazy, true);
    } 
  }

  // keep track of a counter based on main spell cast + twincast
  // average DPS sometimes goes down when it shouldnt because some gains
  // are lost during a small twincast. Check mod > 50% ? worth testing anyway
  // Same as with Arcomancy. I think this matters less for damage procs.
  // MSYN and others dont have as big an issue because they always start on main spell cast
  // VFX procs another one when it twincasts, etc
  let cfickleSpells = 0;
  let clawSpells = 0;
  switch(spell.id) {
    case 'CP': case 'CG': case 'CS':
      state.clawSpells = (state.inTwincast ? (mod / 2) : mod) + (state.clawSpells || 0);
      if (state.clawSpells > 0.50 && !state.inTwincast) {
        clawSpells = state.clawSpells;
        state.clawSpells = 0;
      }
      
      // handles Flames of Power giving CP its own additional proc
      if (G.MODE === 'mag') {
        state.cfickleSpells = (state.inTwincast ? (mod / 2) : mod) + (state.cfickleSpells || 0);
        if (state.cfickleSpells > 0.50 && !state.inTwincast) {
          cfickleSpells = state.cfickleSpells;
          state.cfickleSpells = 0;
        }
      }        
      break;
  }

  switch(spell.resist) {
    case 'COLD':
      if (dmgU.isCastDetSpell(spell)) {
        if (G.MODE === 'wiz' && state.activeAbilities.has('TRIF')) {
          executeProc(state, 'CRYO', mod * dmgU.MANCY_PROC_RATE, 'CRYO');
        }
      }      
      break;
    case 'FIRE':
      if (dmgU.isCastDetSpell(spell)) {
        if (G.MODE === 'wiz' && state.activeAbilities.has('TRIF')) {
          executeProc(state, 'PYRO', mod * dmgU.MANCY_PROC_RATE, 'PYRO');
        }
      }      
      break;
    case 'MAGIC':
      if (dmgU.isCastDetSpell(spell)) {
        if (G.MODE === 'wiz' && state.activeAbilities.has('TRIF')) {
          timeline.addSpellProcAbility(state, 'ARCO', mod * dmgU.MANCY_PROC_RATE, true);
        }
      }
      break;
  }

  // switch cases dont have their own scope?
  let synergy = 0;

  switch(spell.id) {
    case 'CA':
      if (dom.getAllianceFulminationValue() > 0) {
        state[utils.getCounterKeys('CA').expireTime] = state.workingTime + dom.getAllianceFulminationValue();
      }
      break;
    case 'CD':
      timeline.addSpellProcAbility(state, 'CDG', abilities.get('CDG').charges, true);
      break;
    // Claw of the Flameweaver/Oceanlord + Mage Chaotic Fire
    case 'CP': case 'CG': case 'CS':
      // generate proc effects
      state.cfSpellProcGenerator.next(clawSpells).value.forEach(id => {
        switch(id) {
          case 'REFRESH':
            timeline.resetTimers(state);
            break;
          case 'SYLLMAGIC': case 'SYLLICE': case 'SYLLFIRE': case 'SYLLMASTER':
            timeline.addSpellProcAbility(state, id + utils.getRank(), 1, true);
            break;
          default:
            timeline.addSpellProcAbility(state, id, 1, true);
        }
      });
      
      if (G.MODE === 'mag') {
        state.fcSpellProcGenerator.next(cfickleSpells).value.forEach(id => timeline.addSpellProcAbility(state, id, 1, true));
      }
      break;
    case 'MT':
      if (dom.getBeguilersSynergyValue() === 12) {
        timeline.addSpellProcAbility(state, 'ESYN3', 1, true);
      } 
      break;
    case 'MS':
      if (dom.getBeguilersSynergyValue() === 11) {
        timeline.addSpellProcAbility(state, 'ESYN2', 1, true);
      } 
      break;
    case 'SH':
      if (G.MODE === 'mag') {
        let steelVeng = dom.getSteelVengeanceValue();
        switch(steelVeng) {
          case 17:
            executeProc(state, 'SV17', mod * 0.35, 'steelveng');
            break;
          case 16:
            executeProc(state, 'SV16', mod * 0.35, 'steelveng');
            break;
          case 15:
            executeProc(state, 'SV15', mod * 0.30, 'steelveng');
            break;
          case 14:
            executeProc(state, 'SV14', mod * 0.30, 'steelveng');
            break;
          case 13:
            executeProc(state, 'SV13', mod * 0.30, 'steelveng');
            break;
          case 12:
            executeProc(state, 'SV12', mod * 0.30, 'steelveng');
            break;
          case 11:
            executeProc(state, 'SV11', mod * 0.25, 'steelveng');
            break;
          case 10:
            executeProc(state, 'SV10', mod * 0.25, 'steelveng');
            break;
        }
      }
      break;
    case 'TV':
      timeline.addSpellProcAbility(state, 'VFX', 1, true);
      synergy = dom.getEvokersSynergyValue();
      if (synergy === 13) {
        timeline.addSpellProcAbility(state, 'WSYN4', 1, true);
      }
      break;
    case 'RS':
      if (dom.getConjurersSynergyValue() === 12) {
        timeline.addSpellProcAbility(state, 'MSYN3', 1, true);
      }

      let keys = utils.getCounterKeys('RS');
      if (state[keys.timers] === undefined) {
        state[keys.timers] = [];
      }

      state[keys.counter] = 1 + (state[keys.counter] || 0);
      state[keys.timers].push(
        utils.createTimer(state.workingTime + dom.getRemorselessServantTTLValue(), (value) => { return value - 1; })
      );
       
      stats.updateSpellStatistics(state, 'rsDPS', dom.getRemorselessServantDPSValue() * state[keys.counter]);
      stats.updateSpellStatistics(state, keys.counter, state[keys.counter]);

      let petTime = dom.getRemorselessServantTTLValue() / 1000;
      petTime = (petTime > state.timeLeft) ? state.timeLeft : petTime;

      let est1PetDmg = dmgU.trunc(dom.getRemorselessServantDPSValue() * petTime);
      stats.addSpellStatistics(state, 'est1PetDmg', est1PetDmg); 
      stats.addSpellStatistics(state, 'totalDmg', est1PetDmg);
      
      //state.dotGenerator = genDamageOverTime(state, dmgU.getRSDPS, 6000, 'totalAvgPetDmg');
      break;
    case 'RU':
      if (G.MODE === 'mag') {
        // proc adds debuf that prevents another proc for 12 seconds (unless we're a twincast then increase proc chance)
        if (!state.lastRUProc || (state.workingTime === state.lastRUProc) || (state.workingTime - state.lastRUProc) >= 12000) {
          let rate = (state.workingTime !== state.lastRUProc) ? 0.12 : 0.1056; // 88% chance of not procing x 12%
          executeProc(state, 'RD', mod * rate, 'repudiatedest');
          state.lastRUProc = state.workingTime;
        }
      }
      break;
    case 'FBC':
      if (dom.getAllianceFulminationValue() > 0) {
        state[utils.getCounterKeys('FBC').expireTime] = state.workingTime + dom.getAllianceFulminationValue();
      }
      break;     
    case 'FB':
      state.fbSpells = mod + (state.fbSpells || 0);

      if (G.MODE === 'wiz' && state.fbSpells >= dmgU.FBSINGE_PROC_RATE) {
        timeline.addSpellProcAbility(state, 'FBSINGE' + utils.getRank(), 1, true);
        state.fbSpells = state.fbSpells - dmgU.FBSINGE_PROC_RATE;
      }    

      break;      
    case 'SKB':
      state[utils.getCounterKeys('FBO').counter] = abilities.get('FBO').charges;
      break;
    case 'EC':
      // Brand is really just Skyfire
      let origSpell = spell;
      state.spell = utils.getSpellData('EB');
      execute(state);
      state.spell = origSpell;

      // Only add one fuse proc since Fuse itself doesn't twincast (the way im implementing it)
      calcCompoundSpellProcDamage(state, mod, dmgU.getCompoundSpellList('EC'), 'fuseProcDmg');
      break;
    case 'WS': case 'WE':
      calcCompoundSpellProcDamage(state, mod, dmgU.getCompoundSpellList(spell.id), state.inTwincast ? 'tcAvgDmg' : dmgKey);
      break;
  }
}

function applyPreSpellChecks(state, mod) {
  // Update Storm of Many damage based on selected value
  // Start handling spell recast timer mods, etc here instead of in run or
  // using origRecastTimer or anything like that
  switch(state.spell.id) {
    case 'CP': case 'CS': case 'CG':
      if (!state.cfSpellProcGenerator) {
        // Mage Chaotic Fire seems to twinproc its chaotic fire chance
        // so increase the counter by that amount
        let offset = G.MODE === 'mag' ? dom.getTwinprocAAValue() : 0.0;
        state.cfSpellProcGenerator = genSpellProc(dmgU.CLAW_SPELL_PROC_RATES[G.MODE][state.spell.id], offset);
      }
      
      if (G.MODE === 'mag') {
        if (!state.fcSpellProcGenerator) {
          // AA modifies the proc chance
          let offset = 0;
          switch(dom.getFlamesOfPowerValue()) {
            case 4: case 5: offset = 0.34; break;
            case 6: offset = 0.35; break;
            case 7: offset = 0.36; break;
          }
          state.fcSpellProcGenerator = genSpellProc(dmgU.FC_SPELL_PROC_RATES, offset);
        }
      }      
      break;
    case 'SI':
      if (G.MODE === 'wiz') {
        state.spell.baseDmg = dmgU.trunc(state.spell.baseDmgUnMod * dmgU.getSCDmgMod(dom.getAEUnitDistanceValue()));
      }
      break;
    case 'SP':
      if (G.MODE === 'wiz') {
        state.spell.baseDmg = dmgU.trunc(state.spell.baseDmgUnMod * dmgU.getSPDmgMod(dom.getAEUnitDistanceValue()));
      }
      break;
    case 'SH': case 'SR':
      if (G.MODE === 'wiz') {
        state.spell.baseDmg = dmgU.trunc(state.spell.baseDmgUnMod * dmgU.getSHDmgMod(dom.getAEUnitDistanceValue()));
      }
      break;
    case 'SM':
      let baseDmg = state.spell['baseDmg' + dom.getVolleyOfManyCountValue()];
      state.spell.baseDmg = baseDmg || state.spell.baseDmg;
      break;
    }
}

// Using Beimeth's post as a starting point for a lot of this
// http://elitegamerslounge.com/home/eqwizards/viewtopic.php?f=22&t=26
function calcAvgDamage(state, mod, dmgKey) {
  // Default to full strength
  // mod takes a percentage of results and counters if set
  mod = (mod === undefined) ? 1 : mod;

  // average damage
  let avgDmg = 0;

  // dots spread out modifiers over the default tick duration
  let dotMod = 1;
  if (state.spell.duration > 0) {
    dotMod = state.spell.ticks + 1;
  }

  // get SPA info
  let spaValues = dmgU.computeSPAs(state, mod, dotMod).spaValues;

  if (state.spell.baseDmg > 0) {
    // Get Crit Dmg Multiplyer -- maybe keep this first since FD/AD counters modified in crit rate
    let critDmgMult = dmgU.getBaseCritDmg() + spaValues.addCritDmg;

    // Get Crit Rate
    let critRate = dmgU.getBaseCritRate() + spaValues.addCritRate;
    // Check for spells with max crit rate
    critRate = ((state.spell.maxCritRate != undefined) && critRate > state.spell.maxCritRate) ? state.spell.maxCritRate : critRate;
    // Check for spells with min crit rate
    critRate = ((state.spell.minCritRate != undefined) && state.spell.minCritRate > critRate) ? state.spell.minCritRate : critRate;
    // Check if we've gone over 100%
    critRate = (critRate > 1.0) ? 1.0 : critRate;

    // Get Spell Damage
    let spellDmg = calcSpellDamage(state);
    // Get Effectiveness
    let effectiveness = dmgU.round(getEffectiveness(state, spaValues) + dom.getAddEffectivenessValue());
    // Get Before Crit Focus
    let beforeCritFocus = dmgU.round(getBeforeCritFocus(state, spaValues) + dom.getAddBeforeCritFocusValue());
    // Get Before Crit Add -- type3 dmg is SPA 303, should move to computeSPA eventually --
    let beforeCritAdd = dmgU.trunc(dom.getType3DmdAugValue(state.spell) / dotMod) + spaValues.beforeCritAdd + dom.getAddBeforeCritAddValue();
    // Get Before DoT Crit Focus
    let beforeDoTCritFocus = dmgU.round(spaValues.beforeDoTCritFocus + dom.getAddBeforeDoTCritFocusValue());
    // Get After Crit Focus
    let afterCritFocus = dmgU.round((spaValues.afterCritFocus||0) + dom.getAddAfterCritFocusValue()); // or 0 since non defined atm
    // Get After Crit Add
    let afterCritAdd = spaValues.afterCritAdd + dom.getAddAfterCritAddValue();
    // Get AfterCrit Add (SPA 484) (not modifiable)
    let afterSPA461Add = spaValues.afterSPA461Add + dom.getAddAfterSPA461AddValue();
    // Get AfterCrit Focus (not modifiable)
    let afterSPA461Focus = dmgU.round(spaValues.afterSPA461Focus + dom.getAddAfterSPA461FocusValue());
    // Get New SPA 461 Focus
    let spa461Focus = dmgU.round(spaValues.spa461Focus + dom.getAddSPA461FocusValue());
    // Get New semi-broken SPA 483 Focus
    let spa483Focus = spaValues.spa483Focus;

    // effective damage
    let effDmg = state.spell.baseDmg + dmgU.trunc(state.spell.baseDmg * effectiveness);
    // SPAs that are included in a crit
    let beforeCritDmg = effDmg + dmgU.trunc(effDmg * beforeCritFocus) + beforeCritAdd + spellDmg;
    // SPAs that are included when a dot crits (none implemented for wizard)
    let beforeDoTCritDmg = dmgU.trunc(effDmg * beforeDoTCritFocus);
    // damage to appended after crits have been calculated but before SPA 461
    let afterCritDmg = dmgU.trunc(effDmg * afterCritFocus) + afterCritAdd / dotMod;

    // luck
    let luckyRate = (dom.getLuckValue() > 0) ? 0.45 : dom.getLuckValue() >= 10 ? 0.50 : 0;
    
    let luckIndex = parseInt(dom.getLuckValue() / 10);
    luckIndex = (luckIndex < dmgU.LUCK_VALUES.length) ? luckIndex : dmgU.LUCK_VALUES.length - 1;
    let luckyCritDmgMult = critDmgMult + (dom.getLuckValue() > 0 ? dmgU.LUCK_VALUES[luckIndex] : 0);

    let avgBaseDmg = beforeCritDmg + beforeDoTCritDmg + afterCritDmg;
    let avgCritDmg = avgBaseDmg + Math.round(beforeCritDmg * critDmgMult);
    let avgLuckyCritDmg = avgBaseDmg + Math.round(beforeCritDmg * luckyCritDmgMult);

    // damage to append after SPA 461
    // need to add 483 separate or damage is off by 1 plus its the messed up SPA so it's 
    // probably calculated on its own
    let afterSPA461Dmg = Math.round(effDmg * afterSPA461Focus) + afterSPA461Add + Math.round(effDmg * spa483Focus);

    // add SPA 461
    avgBaseDmg += dmgU.trunc(avgBaseDmg * spa461Focus) + afterSPA461Dmg;
    avgCritDmg += dmgU.trunc(avgCritDmg * spa461Focus) + afterSPA461Dmg;
    avgLuckyCritDmg += dmgU.trunc(avgLuckyCritDmg * spa461Focus) + afterSPA461Dmg;

    // adjust for luck
    avgCritDmg = (1 - luckyRate) * avgCritDmg + luckyRate * avgLuckyCritDmg;

    // find average damage overall before additional twincasts
    avgDmg = (avgBaseDmg * (1.0 - critRate)) + avgCritDmg * critRate;

    // apply mod
    avgDmg = dmgU.trunc(avgDmg * mod);

    // update stats for main damage spells
    if (dmgU.isCastDetSpellOrAbility(state.spell)) {
      // save total crit rate including from twincats and procs plus associated count
      stats.addAggregateStatistics('critRate', critRate * mod);
      stats.addAggregateStatistics('spellCount', mod);

      // update core stats in main spell cast
      stats.updateSpellStatistics(state, 'origBaseDmg', state.spell.baseDmg);
      stats.updateSpellStatistics(state, 'critRate', critRate);
      stats.updateSpellStatistics(state, 'luckyCritRate', critRate * luckyRate);
      stats.updateSpellStatistics(state, 'critDmgMult', critDmgMult);
      stats.updateSpellStatistics(state, 'luckyCritDmgMult', luckyCritDmgMult);
      stats.updateSpellStatistics(state, 'spellDmg', spellDmg);
      stats.updateSpellStatistics(state, 'effectiveness', effectiveness);
      stats.updateSpellStatistics(state, 'beforeCritFocus', beforeCritFocus);
      stats.updateSpellStatistics(state, 'beforeCritAdd', beforeCritAdd);
      stats.updateSpellStatistics(state, 'beforeDoTCritFocus', beforeDoTCritFocus);
      stats.updateSpellStatistics(state, 'afterCritFocus', afterCritFocus);
      stats.updateSpellStatistics(state, 'afterCritAdd', afterCritAdd);
      stats.updateSpellStatistics(state, 'spa461Focus', spa461Focus);
      stats.updateSpellStatistics(state, 'afterSPA461Focus', afterSPA461Focus + spa483Focus);
      stats.updateSpellStatistics(state, 'afterSPA461Add', afterSPA461Add);
      stats.updateSpellStatistics(state, 'avgBaseDmg', avgBaseDmg);
      stats.updateSpellStatistics(state, 'avgCritDmg', avgCritDmg);
      stats.updateSpellStatistics(state, 'avgLuckyCritDmg', avgLuckyCritDmg);

      if (!state.aeWave && critRate > 0) { // dont want Frostbound Fulmination showing up as 0
        // Update graph
        state.updatedCritRValues.push({time: state.timeEst, y: Math.round(critRate * 100)});
        state.updatedCritDValues.push({time: state.timeEst, y: Math.round(critDmgMult * 100)});
      }
    }

    // Handle AE waves if current spell is an AE
    if (['TargetAE', 'FrontalAE', 'CasterPB', 'TargetRingAE'].find(id => id === state.spell.target) && !state.aeWave) {
      addAEWaves(state, mod, avgDmg);
    }

    // update totals
    stats.addSpellStatistics(state, 'totalDmg', avgDmg);

    // save avg damage of main spell
    let avgDmgKey = state.inTwincast ? 'tcAvgDmg' : 'avgDmg';
    if (!dmgKey || state.aeWave) {
      stats.addSpellStatistics(state, avgDmgKey, avgDmg);
    }

    // dont count twincast damage in AE Hits
    if (dmgKey && !(state.aeWave && state.inTwincast)) {
      stats.addSpellStatistics(state, dmgKey, avgDmg);
    }

    // add spell procs last
    if (!state.aeWave) {
      addSpellAndEqpProcs(state, mod);
    }
  }
  
  return {avgDmg: avgDmg, spaValues: spaValues};
}

function calcAvgMRProcDamage(state, mod, dmgKey) {
  // Mana reciprocation has a chance to proc more procs
  calcAvgProcDamage(state, utils.getSpellData('MR'), mod, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRR'), mod * 0.1, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRRR'), mod * 0.01, dmgKey);
  calcAvgProcDamage(state, utils.getSpellData('MRRRR'), mod * 0.001, dmgKey);
}

function calcAvgProcDamage(state, proc, mod, dmgKey) {
  // proc damage is based on normal spell damage modified by proc rate and whether or not
  // we're in a twincast
  let procRate = dmgU.getProcRate(state.spell, proc) * mod;
  let prevSpell = state.spell;

  state.spell = proc;
  execute(state, procRate, dmgKey, true);
  state.spell = prevSpell;

  stats.addAggregateStatistics('totalProcs', procRate);
}

function calcCompoundSpellProcDamage(state, mod, spellList, dmgKey) {
  let origSpell = state.spell;
  let inTwincast = state.inTwincast;
  //state.inTwincast = false;

  // spells like fuse and wildmagic require casting multiple spells and
  // averaging the results
  $(spellList).each(function(i, item) {
    state.spell = utils.getSpellData(item.id);

    // procs are their own un-twincasted spell but if they were triggered
    // from a twincast of the parent then record the damage there
    execute(state, item.chance * mod, dmgKey);
  });

  //state.inTwincast = inTwincast;
  state.spell = origSpell;
}

function calcSpellDamage(state) {
  let spellDmg = 0;
  let spell = state.spell;

  if ((G.MAX_LEVEL - spell.level) < 10) {
    // Mana Burn uses this because AA recast time should be separate from the spell data
    // dicho/fuse needs to use an alternative time since it's really 2 spell casts
    // that get applied differently depending on what we're looking for
    var recastTime = (spell.recastTime2 !== undefined) ? spell.recastTime2 : spell.recastTime;

    // fix for dicho being a combined proc/spell
    var totalCastTime = (spell.id === 'CF' ? 0 : spell.origCastTime) +
      ((recastTime > spell.lockoutTime) ? recastTime : spell.lockoutTime);

    var multiplier = dmgU.getMultiplier(totalCastTime);
    spellDmg = dmgU.trunc(dom.getSpellDamageValue() * multiplier);

    // The ranged augs seem to get stuck at 2x their damage
    if (spell.spellDmgCap !== undefined && spellDmg > spell.spellDmgCap) {
      spellDmg = spell.spellDmgCap;
    }
  }

  return spellDmg;
}

function executeProc(state, id, mod, statId) {
  let value = 0;
  let key = statId ? statId : id;
  let keys = utils.getCounterKeys(key);
  let proc = utils.getSpellData(id);
  let partUsed = 1;

  // update counters if it uses them
  let ability = abilities.get(statId);
  if (ability && ability.charges) {
    if (utils.isAbilityActive(state, key)) {
      let chargesPer = (statId != 'DR') ? 1 : 1 + dmgU.getProcRate(state.spell, proc); // fix for DR issue
      let charge = mod * chargesPer;    
      partUsed = dmgU.processCounter(state, key, charge);
    } else {
      // inactive
      partUsed = 0;
    }
  }

  if (partUsed > 0 && !(proc.spa497 && state.inTwincast)) { // if charges were consumed for abilities that need them
    partUsed = partUsed * mod;
    (id != 'MR') ? calcAvgProcDamage(state, proc, partUsed, keys.addDmg) : calcAvgMRProcDamage(state, partUsed, keys.addDmg);
  }

  return partUsed > 0;
}

function* genSpellProc(rateInfo, offset) {
  offset = offset || 0;
  let count = 1 + offset;
  let lastProcCounts = [];

  if (rateInfo) {
    Object.keys(rateInfo).forEach(key => {
      lastProcCounts.push({ id: key, count: rateInfo[key] });
    });
  }
 
  while (true) {
    let incr = yield (
      lastProcCounts.filter(item => {
        if (count >= item.count) {
          item.count += rateInfo[item.id];
          return true;
        } else {
          return false;
        }
      }).map(item => item.id)
    );

    count += (incr + (offset * incr));
  }
}

function* genDamageOverTime(state, fDps, interval, statLabel) {
  let current = state.workingTime;
  let total = 0;
  let reportTime = 0;
  let end = false;
  
  while (true) {
    let time = state.workingTime - current;
    current = state.workingTime;

    // accumulate results until interval (typically 1 tick) is reached
    total += (fDps(state) * (time / 1000));

    let value = 0;
    reportTime += time;

    if ((reportTime >= interval) || end) { // report if almost out of time
      value = total;
      total = 0;
      reportTime -= interval;

      if (statLabel) {
        stats.addAggregateStatistics(statLabel, value);
      }
    }
  
    end = yield dmgU.trunc(value);
  }

  return 0;
}

function getBeforeCritFocus(state, spaValues) {
  let spell = state.spell;
  let beforeCritFocus = spaValues.beforeCritFocus;

  // Before Crit Focus AA (SPA 302) only for some spells
  if (['ET', 'TV', 'CG', 'CS', 'RU'].find(id => id === spell.id)) {
    beforeCritFocus = beforeCritFocus + dom.getSpellFocusAAValue(state.spell);
  }

  return beforeCritFocus;
}

function getEffectiveness(state, spaValues) {
  let spell = state.spell;
  let effectiveness = spaValues.effectiveness;

    // Effectiveness AA (SPA 413) Focus: Skyblaze, Rimeblast, etc
  if (! ['ET', 'TV', 'CG', 'CS', 'RU'].find(id => id === spell.id)) {
    effectiveness += dom.getSpellFocusAAValue(state.spell);
  }

  return effectiveness;
}

function getTwincastRate(state, spaValues) {
  let rate = spaValues.twincast;

  if (dom.getAddTwincastValue() >= 0) {
    rate += (dmgU.checkSingleEffectLimit(state.spell, 'TC') ? dom.getAddTwincastValue() : 0);
  }

  rate = (rate > 1.0) ? 1.0 : rate;

  // prevent from procs from setting the stat for everything
  if (rate && dmgU.isCastDetSpellOrAbility(state.spell)) {
    stats.updateSpellStatistics(state, 'twincastRate', rate);
  }

  return rate;
}

export function execute(state, mod, dmgKey, isProc) {
  // Default to full strength
  mod = (mod === undefined) ? 1 : mod;
  
  // add any pre spell cast checks
  applyPreSpellChecks(state, mod);
  // avg damage for one spell cast
  let result = calcAvgDamage(state, mod, dmgKey);
  // add any post spell procs/mods before we're ready to
  // twincast another spell
  applyPostSpellEffects(state, mod, dmgKey);

  // get twincast rate
  let twincastRate = getTwincastRate(state, result.spaValues);

  // now twincast the spell
  if (twincastRate > 0 && !state.aeWave) {
    // add any pre spell cast checks required
    let tcMod = mod * twincastRate;

    let prev = state.inTwincast;
    state.inTwincast = true;
    applyPreSpellChecks(state, tcMod);

    calcAvgDamage(state, tcMod, dmgKey);

    // handle post checks and reset twincast state if it was broken by calcAvgDamage or post procs running
    state.inTwincast = true;
    applyPostSpellEffects(state, tcMod, dmgKey);
    state.inTwincast = prev;
 
    if (isProc) { // keep stats for proc twincast
      stats.addAggregateStatistics('totalProcs', tcMod);
    }
  }

  return stats.getSpellStatistics(state, 'totalDmg') || 0; // Alliance
}
