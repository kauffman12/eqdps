import {globals as G} from './settings.js';
import * as abilities from './abilities.js';
import * as utils from './utils.js';

// What to query on to find a spell focus value by ID
const FOCUS_AA_KEYS = {
  enc: {
    'CR': '.aa-chromarift .dropdown-toggle',
    'GT': '.aa-gravity-twist .dropdown-toggle',
    'MU': '.aa-mindsunder .dropdown-toggle',
    'MS': '.aa-mindsunder .dropdown-toggle',
    'PA': '.aa-polyrefractive-assault .dropdown-toggle'
  },
  mag: {
    'BS': '.aa-focus-bolt-molten .dropdown-toggle',
    'RM': '.aa-focus-coronal-rain .dropdown-toggle',
    'FC': '.aa-focus-fickle-conflag .dropdown-toggle',
    'RK': '.aa-focus-rain-cutlasses .dropdown-toggle',
    'VM': '.aa-focus-storm-many .dropdown-toggle',
    'SS': '.aa-focus-spear-molten .dropdown-toggle',
    'SA': '.aa-focus-spear-molten .dropdown-toggle'
  },
  wiz: {
    'CQ': '.aa-focus-claws .dropdown-toggle',
    'CO': '.aa-focus-claws .dropdown-toggle',
    'CT': '.aa-focus-cloudburst .dropdown-toggle',
    'CB': '.aa-focus-chaos .dropdown-toggle',
    'EV': '.aa-focus-ethereal-flash .dropdown-toggle',
    'ES': '.aa-focus-ethereal-skyblaze .dropdown-toggle',
    'EZ': '.aa-focus-ethereal-skyblaze .dropdown-toggle',
    'EI': '.aa-focus-ethereal-rimeblast .dropdown-toggle',
    'FB': '.aa-focus-flashchar .dropdown-toggle',
    'ME': '.aa-focus-rains .dropdown-toggle',
    'PF': '.aa-focus-purewild .dropdown-toggle',
    'IC': '.aa-focus-rimeblastcascade .dropdown-toggle',
    'SV': '.aa-focus-vortexes .dropdown-toggle',
    'TW': '.aa-focus-thricewovenstorm .dropdown-toggle'
  }
};

// Methods for easy lookup of values from DOM nodes related to configuration of
// AAs, spells, equipment options, etc
//
// Some of these use a cache based on those being used most according to profiling
//   --- should probably add more to cache
//

export function getAERainHitsValue() {
  return utils.useCache('.ae-rain-hits', () => {
    return utils.getNumberValue($('#aeRainHits').val());
  });
}

export function getConfiguredAbilities(state) {
  return utils.useCache('active-configured-abilities', () => {
    let active = [];
    let spellProc = [];

    // add if set and if specified has a value > 0
    let addAbility = (id, value, spa) => {
      if (id && id !== 'NONE') {
        if (value === undefined || value > 0) {
          let ability = abilities.get(id);
          if (ability) {
            active.push(id);

            if (value > 0) {
              abilities.setSPAValue(id, spa, value);
            }
          }
        }
      }
    };

    let setSpellProc = (id, value) => {
      if (id !== 'NONE') {
        if (value === 'NONE') {
          value = '';
        }

        let ability = abilities.get(id);
        if (value && ability) {
          abilities.setProcValue(id, value);

          // only configure manual abilities here
          // dont return them
          if (!ability.manuallyActivated && ability.class === G.MODE) {
            spellProc.push(id);
          }
        }
      }
    };

    // class specific abilities
    switch(G.MODE) {
      case 'wiz':
        // familiar
        addAbility(getFamiliarValue());
        setSpellProc('AFU', getArcaneFusionValue());
        setSpellProc('FF', getForceOfFlameValue());
        setSpellProc('FI', getForceOfIceValue());
        setSpellProc('FW', getForceOfWillValue());
        addAbility('DADEPT', getDestructiveAdeptValue(), 124);
        addAbility('SVENG', getSorcererVengeananceValue(), 286);
        break;

      case 'mag':
        setSpellProc('FE', getForceOfElementsValue());

        // Setup Flames of Power
        abilities.setCharges('FPWR', (getFlamesOfPowerValue() === 4) ? 2 : 1);
        break;
    }

    addAbility(getRobeValue());
    addAbility(getBeltProcValue());
    addAbility('EDECAY', getEyeOfDecayValue(), 413);
    addAbility('TCAA', getTwincastAAValue(), 399);
    addAbility('TP', getTwinprocAAValue(), 399);
    getWornDamageFocusList().forEach(id => addAbility(id));

    return { active: active, spellProc: spellProc };
  });
}

export function getActiveRepeatingAbilities() {
  return utils.useCache('active-repeating-abilities', () => {
    return $('input.repeating-ability:checked').toArray().map(item => item.id);
  });
}

export function getAbilityCharges(id) {
  return utils.useCache('ability-charges-' + id, () => {
    let charges;
    let $node = $('#' + id + 'Charges');
    if ($node.length > 0) {
      charges = utils.getNumberValue($node.val());
    }

    return charges;
  });
}

export function getAbilityRate(id) {
  return utils.useCache('ability-rate-' + id, () => {
    return 1000 * utils.getNumberValue(($('#' + id + 'Rate').val()));
  });
}

export function getAddAfterCritFocusValue() {
  return utils.useCache('.add-after-crit-focus', () => {
    return utils.getNumberValue($('#addAfterCritFocus').val() / 100);
  });
}

export function getAddAfterCritAddValue() {
  return utils.useCache('.add-after-crit-add', () => {
    return utils.getNumberValue($('#addAfterCritAdd').val());
  });
}
export function getAddAfterSPA461AddValue() {
  return utils.useCache('.add-after-spa-461-add', () => {
    return utils.getNumberValue($('#addAfterSPA461Add').val());
  });
}

export function getAddAfterSPA461FocusValue() {
  return utils.useCache('.add-after-spa-461-focus', () => {
    return utils.getNumberValue($('#addAfterSPA461Focus').val() / 100);
  });
}

export function getAddBeforeCritFocusValue() {
  return utils.useCache('.add-before-crit-focus', () => {
    return utils.getNumberValue($('#addBeforeCritFocus').val() / 100);
  });
}

export function getAddBeforeCritAddValue() {
  return utils.useCache('.add-before-crit-add', () => {
    return utils.getNumberValue($('#addBeforeCritAdd').val());
  });
}

export function getAddBeforeDoTCritFocusValue() {
  return utils.useCache('.add-before-dot-crit-focus', () => {
    return utils.getNumberValue($('#addBeforeDoTCritFocus').val() / 100);
  });
}

export function getAddEffectivenessValue() {
  return utils.useCache('.add-effectiveness', () => {
    return utils.getNumberValue($('#addEffectiveness').val() / 100);
  });
}

export function getAddSPA461FocusValue() {
  return utils.useCache('.add-SPA461Focus', () => {
    return utils.getNumberValue($('#addSPA461Focus').val() / 100);
  });
}

export function getAddTwincastValue() {
  return utils.useCache('.add-twincast', () => {
    return utils.getNumberValue($('#addTwincast').val() / 100);
  });
}

export function getAllianceFulminationValue() {
  return utils.useCache('.allianceFulmination', () => {
    return 1000 * utils.getNumberValue($('#allianceFulmination').val());
  });
}

export function getArcaneFusionValue() {
  return utils.useCache('.aa-arcane-fusion', () => {
    return $('.aa-arcane-fusion .dropdown-toggle').data('value');
  });
}

export function getWornDamageFocusList() {
  return utils.useCache('avg-worn-dmg-focus-list', () => {
    return [
      $('.worn-arms-focus .dropdown-toggle').data('value'),
      $('.worn-hands-focus .dropdown-toggle').data('value'),
      $('.worn-head-focus .dropdown-toggle').data('value'),
      $('.worn-wrist-focus .dropdown-toggle').data('value')
    ];
  });
}

export function getBeltProcValue() {
  return utils.useCache('.belt-proc', () => {
    return $('.belt-proc .dropdown-toggle').data('value');
  });
}

export function getBeguilersSynergyValue() {
  return utils.useCache('.aa-beguilers-synergy', () => {
    return utils.getNumberValue($('.aa-beguilers-synergy .dropdown-toggle').data('value'));
  });
}

export function getConjurersSynergyValue() {
  return utils.useCache('.aa-conjurers-synergy', () => {
    return utils.getNumberValue($('.aa-conjurers-synergy .dropdown-toggle').data('value'));
  });
}

export function getCritDmgValue() {
  return utils.getNumberValue($('#innatCritDmg').val());
}

export function getCritRateValue() {
  return utils.getNumberValue($('#innatCritRate').val());
}

export function getDPSAug1AugValue() {
  return utils.useCache('.add-dps-aug1', () => {
    return $('.add-dps-aug1 .dropdown-toggle').data('value');
  });
}

export function getDPSAug2AugValue() {
  return utils.useCache('.add-dps-aug2', () => {
    return $('.add-dps-aug2 .dropdown-toggle').data('value');
  });
}

export function getDestructiveAdeptValue() {
  return utils.useCache('.aa-destructive-adept', () => {
    return utils.getNumberValue($('.aa-destructive-adept .dropdown-toggle').data('value'));
  });
}

export function getEyeOfDecayValue() {
  return utils.useCache('.eye-of-decay', () => {
    return utils.getNumberValue($('.eye-of-decay .dropdown-toggle').data('value'));
  });
}

export function getFlamesOfPowerValue() {
  return utils.useCache('.aa-flames-of-power', () => {
    return utils.getNumberValue($('.aa-flames-of-power .dropdown-toggle').data('value'));
  });
}

export function getForceOfElementsValue() {
  return utils.useCache('.aa-force-of-elements', () => {
    return $('.aa-force-of-elements .dropdown-toggle').data('value');
  });
}

export function getForceOfFlameValue() {
  return utils.useCache('.aa-force-of-flame', () => {
    return $('.aa-force-of-flame .dropdown-toggle').data('value');
  });
}

export function getForceOfIceValue() {
  return utils.useCache('.aa-force-of-ice', () => {
    return $('.aa-force-of-ice .dropdown-toggle').data('value');
  });
}

export function getForceOfWillValue() {
  return utils.useCache('.aa-force-of-will', () => {
    return $('.aa-force-of-will .dropdown-toggle').data('value');
  });
}

export function getGCDValue() {
  return utils.useCache('.gcd-value', () => {
    return 1000 * utils.getNumberValue($('#gcd').val());
  });
}

export function getDomForCritDGraph() {
  return $('#critDGraph').get(0);
}

export function getDomForCritRGraph() {
  return $('#critRGraph').get(0);
}

export function getDomForDmgGraph() {
  return $('#dmgGraph').get(0);
}

export function getDomForSpellline() {
  return $('#spellline').get(0);
}

export function getDomForTimeline() {
  return $('#timeline').get(0);
}

export function getEvokersSynergyValue() {
  return utils.useCache('.aa-evokers-synergy', () => {
    return utils.getNumberValue($('.aa-evokers-synergy .dropdown-toggle').data('value'));
  });
}

export function getHastenedServantValue() {
  return utils.useCache('.aa-hastened-servant', () => {
    return 1000 * utils.getNumberValue($('.aa-hastened-servant .dropdown-toggle').data('value'));
  });
}

export function getRangeAugValue() {
  return utils.useCache('.range-aug', () => {
    return $('.range-aug .dropdown-toggle').data('value');
  });
}

export function getRemorselessServantDPSValue() {
  return utils.useCache('.remorseless-servant-dps', () => {
    return utils.getNumberValue($('#remorselessDPS').val());
  });
}

export function getRemorselessServantTTLValue() {
  return utils.useCache('.remorseless-servant-ttl', () => {
    return 1000 * utils.getNumberValue($('#remorselessTTL').val());
  });
}

export function getRobeValue() {
  return utils.useCache('.worn-chest-focus', () => {
    return $('.worn-chest-focus .dropdown-toggle').data('value');
  });
}

export function getSelectedSpells() {
  let spells = [];
  $('#spellButtons div.spell button').each(function(item, b) {
    let spellId = $(b).data('value');
    if (spellId != 'NONE') {
      spells.push(spellId);
    }
  });

  return spells;
}

export function getShieldProcValue() {
  return utils.useCache('.shield-proc', () => {
    return $('.shield-proc .dropdown-toggle').data('value');
  });
}

export function getSorcererVengeananceValue() {
  return utils.useCache('.aa-sorcerer-vengeance', () => {
    return utils.getNumberValue($('.aa-sorcerer-vengeance .dropdown-toggle').data('value'));
  });
}

export function getSpellDamageValue() {
  return utils.useCache('.spell-damage', () => {
    return utils.getNumberValue($('#spellDamage').val());
  });
}

export function getSpellFocusAAValue(id) {
  return utils.useCache('.spell-focus-aa-' + id, () => {
    let value = 0;

    let keys = FOCUS_AA_KEYS[G.MODE];
    if (keys && keys[id]) {
      value = utils.getNumberValue($(keys[id]).data('value'));

      // special case for now to handle some new and old focus
      // levels but not the new one
      if (['SA', 'ES', 'MS', 'PA'].find(spell => spell === id) && value < 9) {
        value = 0;
      } 

      if (value === 9) {
        value = 0.16;
      }
    }

    return value ? value : 0;
  });
}

export function getSpellTimeRangeControl() {
  return $('#spellTimeRange');
}

export function getSpellTimeRangeValue() {
  let timeRange = utils.getNumberValue(getSpellTimeRangeControl().val());
  if (timeRange > 1000) {
    timeRange = 1000;
  }
  return 1000 * ((timeRange < 0) ? 0 : timeRange);
}

export function getStaffProcValue() {
  return utils.useCache('.staff-proc', () => {
    return $('.staff-proc .dropdown-toggle').data('value');
  });
}

export function getVolleyOfManyCountValue() {
  return utils.useCache('.volley-of-many-count', () => {
    return utils.getNumberValue($('#volleyOfManyCount').val());
  });
}

export function getTwincastAAValue() {
  return utils.useCache('.aa-twincast', () => {
    return utils.getNumberValue($('.aa-twincast .dropdown-toggle').data('value'));
  });
}

export function getTwinprocAAValue() {
  return utils.useCache('.aa-twinproc', () => {
    return utils.getNumberValue($('.aa-twinproc .dropdown-toggle').data('value'));
  });
}

export function getType3AugValue(spell) {
  return utils.useCache('.worn-type3augs-' + spell.id, () => {
    return $('.worn-type3augs .dropdown-toggle').data('value') ? spell.type3Aug || 0 : 0;
  });
}

export function getType3DmdAugValue(spell) {
  return utils.useCache('.worn-type3dmgaugs-' + spell.id, () => {
    return $('.worn-type3augs .dropdown-toggle').data('value') ? spell.type3DmgAug || 0 : 0;
  });
}

export function isUsingArcaneFusion() {
  return (getArcaneFusionValue() != 'NONE');
}

// Don't cache these since load rates is called before cache is cleared
// Fix sometime
export function getDestructiveFuryValue() {
  return utils.getNumberValue($('.aa-destructive-fury .dropdown-toggle').data('value'));
}

export function getDoNValue() {
  return utils.getNumberValue($('.aa-don .dropdown-toggle').data('value'));
}

export function getFuryOfMagicValue() {
  return utils.getNumberValue($('.aa-fury-of-magic .dropdown-toggle').data('value'));
}

export function getFamiliarValue() {
  return $('.spell-pet-focus .dropdown-toggle').data('value');
}