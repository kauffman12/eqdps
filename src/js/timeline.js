import {globals as G} from './settings.js';
import * as damage from './damage.js';
import * as dmgU from './damage.utils.js';
import * as dom  from './dom.js';
import * as stats from './stats.js';
import * as utils from './utils.js';

// html templates for spell icon popup and the icon themselves on the spell timeline
const SPELL_DETAILS_TEMPLATE = Handlebars.compile($('#spell-details-template').html());
const SPELL_ITEM_TEMPLATE = Handlebars.compile($('#spell-timeline-item-template').html());

// timelines start at the time the browser loads and then the date/time info is removed
const CURRENT_TIME = utils.getCurrentTime();

// create the graphs and data set objects
const CRITR_DATA = new vis.DataSet([]);
const CRITD_DATA = new vis.DataSet([]);
const DMG_DATA = new vis.DataSet([]);
const SPELLLINE_DATA = new vis.DataSet([]);
const TIMELINE_DATA = new vis.DataSet([]);
const GRAPH_CRITR = createGraph('graphcritr', CURRENT_TIME, dom.getDomForCritRGraph(), CRITR_DATA);
const GRAPH_CRITD = createGraph('graphcritd', CURRENT_TIME, dom.getDomForCritDGraph(), CRITD_DATA);
const GRAPH_DMG = createGraph('graphdmg', CURRENT_TIME, dom.getDomForDmgGraph(), DMG_DATA);
const SPELL_TIMELINE = createTimeline('spellline', CURRENT_TIME, dom.getDomForSpellline(), SPELLLINE_DATA);
const TIMELINE = createTimeline('timeline', CURRENT_TIME, dom.getDomForTimeline(), TIMELINE_DATA);

let BASE_CRIT_DATA = []; // crit info so it doesn't have to be re-calculated all the time
let UPDATING_CHART = -1; // used to throttle calls to update the chart data

// helper for creating a timeline
function createTimeline(id, time, dom, data, template) {
  let opts = utils.readChartOptions(id, time);
  if (template) opts.template = template;
  return new vis.Timeline(dom, data, opts);
}

// helper for creating a graph
function createGraph(id, time, dom, data) {
  let opts = utils.readChartOptions(id, time);
  return new vis.Graph2d(dom, data, opts);
}

function castSpell(state, spell) {
  // update current state with spell
  state.chartIndex++;
  state.spell = spell;

  let neededTime = state.workingTime + spell.castTime * 1000;
  if (neededTime > state.endTime) return false; // Time EXCEEDED

  state.workingTime = neededTime;

  // if twincast spell is no longer active
  utils.checkSimpleTimer(state, 'TC');

  // abilities that can be enabled and repeat every so often like Enc Synergy
  // cancel or reset counters based on timer, only need to check once per workingTime
  dmgU.ACTIVATED_ABILITIES.forEach(item => initActivatedAbility(state, item));

  // check if RS pets have completed
  let rsKeys = utils.getCounterKeys('RS');
  utils.checkTimerList(state, rsKeys.counter, rsKeys.timers);

  // initialize stats
  stats.updateSpellStatistics(state, 'chartIndex', state.chartIndex);
  stats.updateSpellStatistics(state, 'id', spell.id);

  // set time of last cast and update statistics for interval
  if (state.lastCastMap[spell.timer]) {
   stats.updateSpellStatistics(state, 'castInterval', (state.workingTime - state.lastCastMap[spell.timer]) / 1000);
  }

  state.lastCastMap[spell.timer] = state.workingTime;

  // update spell timeline
  let spellId = (spell.id.length === 3 && isNaN(parseInt(spell.id[2]))) ? spell.id : spell.id.substr(0,2);
  let content = SPELL_ITEM_TEMPLATE({title: spell.name, id: spellId, spellNumber: state.chartIndex})
  SPELLLINE_DATA.add({id: state.chartIndex, content: content, start: state.workingTime, editable: false});

  // round to nearest second to check against current spell landing time
  state.timeEst = Math.round(state.workingTime / 1000) * 1000;

  // figure out current crit change/damage mod
  if (CRITR_DATA.get(state.timeEst)) {
    state.critRate = CRITR_DATA.get(state.timeEst).y / 100;
    state.critDmgMult = CRITD_DATA.get(state.timeEst).y / 100;
  } else {
    console.debug('out of range');
    return;
  }

  // only compute for spells that do damage
  let avgDmg = damage.calcTotalAvgDamage(state);

  // dmg including other dots or abilities that have been accumulating (just RS right now)
  let dotDmg = state.dotGenerator ? Math.trunc(state.dotGenerator.next().value) : 0;

  let plotDmg = 0;
  // update stats
  if (avgDmg > 0) {
    stats.addAggregateStatistics('totalAvgDmg', avgDmg);
    stats.addAggregateStatistics('detCastCount', 1);
    stats.addMaxAggregateStatistics('maxHit', avgDmg);
    plotDmg += avgDmg;
  }

  // update stats
  if (dotDmg > 0) { // pet damage is all we currently have
    stats.addAggregateStatistics('totalAvgPetDmg', dotDmg);
    plotDmg += dotDmg;
  }

  // upgrade graph
  updateDmgGraph(state, plotDmg);
  return true;
}

// RS has type 3 aug and AAs that reduce the recast so account for that here
function getModifiedSpellRecastTime(spell) {
  return utils.useCache('spell-recast-time' + spell.id, () => {
    let recastMod = (spell.id === 'RS') ? (dom.getHastenedServantValue() + dom.getType3AugValue(spell)) * -1 : 0;
    return 1000 * (spell.recastTime + recastMod);
  });
}

// Returns the first ability from list that has able to be cast based on recast timers
function isSpellAbilityReady(state, ids) {
  let spell;

  return ids.find(id => {
    spell = utils.getSpellData(id);
    let refresh = spell.discRefresh * 1000;
    return !state.lastCastMap[spell.timer] || ((state.lastCastMap[spell.timer] + refresh) < state.workingTime);
  }) ? spell : undefined;
}

// Initialze counters and expire time for items like Enc Synergy in the Abilities In Use section
function initActivatedAbility(state, item) {
  let keys = utils.getCounterKeys(item.id);
  let lastProcMap = state.lastProcMap;

  if (item.enabled()) {
    if (!lastProcMap[item.id] || lastProcMap[item.id] + item.rate() < state.workingTime) {
      if (!lastProcMap[item.id]) {
        lastProcMap[item.id] = CURRENT_TIME;
        state[keys.expireTime] = CURRENT_TIME + item.timer;
      } else {
        lastProcMap[item.id] += item.rate();
        state[keys.expireTime] = lastProcMap[item.id] + item.timer;
      }

      state[keys.counter] = item.count;
    }
  }

  utils.checkSimpleTimer(state, item.id);
}

// Adjust start time of a timeline item
function setTimelineItemStart(time, item, offset) {
  let newStartTime = time + offset;
  let newEndTime = newStartTime + (item.end - item.start);
  
  if (item.start != newStartTime) {
    item.start = newStartTime;
    item.end = newEndTime;
    silentUpdateTimeline(item);
  }
}

// Turn off events when updating the timeline programmatically
function silentUpdateTimeline(data) {
  TIMELINE_DATA.off('update', visTimelineListener);
  TIMELINE_DATA.update(data);
  TIMELINE_DATA.on('update', visTimelineListener);
}

// The start and end time of a vis.js timeline object is inconsistent depending
// on whether it's set somewhere hear or via drag/move events. This just gives
// back one representation using time in millis
function getTime(item) {
  let result = {};

  if (item) {
    let start = item.start.getTime ? item.start.getTime() : item.start;
    let end = item.end.getTime ? item.end.getTime() : item.end;
    result.start = start;
    result.end = end;
  }

  return result;
}

// Clears and redraws the crit graphs from the starting dataset
function updateCritGraphs() {
  CRITR_DATA.clear();
  CRITD_DATA.clear();

  let critRPoints = [];
  let critDPoints = [];
  let prevRate = 0;
  let prevDmg = 0;
  let lastRateLabel = 0;
  let lastDmgLabel = 0;

  $(BASE_CRIT_DATA).each(function(i, item) {
    let rp = {id: item.time, x: item.time, y: item.rate};
    let dp = {id: item.time, x: item.time, y: item.dmg};

    if (prevRate != item.rate || lastRateLabel % 10 === 0) {
      rp.label = {content: item.rate + '%', yOffset: 15};
      lastRateLabel = 0;
    }

    lastRateLabel++;
    prevRate = item.rate;

    if (prevDmg != item.dmg || lastDmgLabel % 10 === 0) {
      dp.label = {content: '+' + item.dmg + '%', yOffset: 15};
      lastDmgLabel = 0;
    }

    lastDmgLabel++;
    prevDmg = item.dmg;

    critRPoints.push(rp);
    critDPoints.push(dp);
  });

  // Update graph
  CRITR_DATA.add(critRPoints);
  CRITD_DATA.add(critDPoints);
}

function updateCritGraphValue(data, time, value) {
  let item = data.get(time);
  if (item.y != value) {
    if (item.label) {
      let l = item.label.content;
      item.label.content = value + l.substring(l.indexOf('%'), l.length);
    }

    item.y = value;
    data.update(item);
  }
}

function updateDmgGraph(state, dmg, labelFreq) {
  if (dmg >= 0) {

    // in case were plotting multiple damage at some point
    let pointData = DMG_DATA.get(state.workingTime);
    if (pointData) {
      pointData.y += dmg;

      // update label if it exists
      if (pointData.label) {
        pointData.label.content = pointData.y;
      }

      DMG_DATA.update(pointData);
    } else {
      pointData = {id: state.workingTime, x: state.workingTime, y: dmg, yOffset: 0};

      // add label if meets requirements
      if (!labelFreq || (state.workingTime % labelFreq === 0)) {
        pointData.label = {content: pointData.y, yOffset: 15};
      }

      DMG_DATA.add(pointData);
    }
  }
}

function willCastDuring(state, time, spell) {
  let lockout = false;
  let lockoutTime = spell.lockoutTime ? (((spell.lockoutTime * 1000) > state.gcd) ? (spell.lockoutTime * 1000) : state.gcd) : 0;
  lockoutTime += spell.castTime * 1000; // total time the spell will be busy
  let timeToCast = state.workingTime + lockoutTime;

  return (timeToCast >= time.start && state.workingTime < time.end);
}

function withinTimeFrame(time, data) {
  return (data && (data.start <= time && data.end >= time));
}

export function callUpdateSpellChart() {
  if (UPDATING_CHART === -1) {
    UPDATING_CHART = setTimeout(function() {
      updateSpellChart();
      UPDATING_CHART = -1;
    }, 350);
  } else {
    clearTimeout(UPDATING_CHART);
    UPDATING_CHART = -1;
    callUpdateSpellChart();
  }
}

export function connectPopovers() {
  let items = $('#spellline div.vis-center div.vis-itemset div.vis-foreground a[data-toggle="popover"]');
  items.popover({html: true});

  items.unbind('inserted.bs.popover');
  items.on('inserted.bs.popover', function(e) {
    let index = $(e.currentTarget).data('value');
    let statInfo = stats.getSpellStatistics(index);

    let popover = $('#spellPopover' + index);
    popover.html('');
    popover.append(SPELL_DETAILS_TEMPLATE({ data: stats.getStatisticsSummary(statInfo) }));
  });
}

export function createAdpsItem(adpsOption, repeat) {
  let adpsItem = {
    id: adpsOption.id,
    start: CURRENT_TIME,
    end: CURRENT_TIME + adpsOption.offset
  };

  let label = utils.createLabel(adpsOption, new Date(adpsItem.end - adpsItem.start));
  adpsItem.content = label;
  adpsItem.title = label;
  adpsItem.group = utils.readAdpsConfig('displayList').indexOf(adpsOption.id);
  TIMELINE_DATA.add(adpsItem);
  return adpsItem;
}

export function getAdpsDataIfActive(id, time, key) {
  let item = TIMELINE_DATA.get(id);

  if (item && withinTimeFrame(time, getTime(item))) {
    let adpsOption = utils.readAdpsOption(id);
    return (key === undefined) ? adpsOption : adpsOption[key];
  }

  return null;
}

export function getAdpsGroups() {
  let groups = new vis.DataSet();
  let displayList = utils.readAdpsConfig('displayList');

  $(displayList).each(function(i, item) {
    groups.add({id: i, content: utils.readAdpsOption(item)});
  });
}

export function getArcaneFuryValue(time) {
  if (G.MODE === 'wiz' && getAdpsDataIfActive('AF', time)) {
    return dmgU.ARCANE_FURY_FOCUS;
  }

  return 0;
}

export function getElementalUnionValue(time) {
  return ((G.MODE === 'mage') ? getAdpsDataIfActive('EU', time, 'afterCritMult') : 0) || 0;
}

export function getHeartOfFlamesValue(time) {
  return ((G.MODE === 'mage') ? getAdpsDataIfActive('HF', time, 'afterCritMult') : 0) || 0;
}

export function init() {
  // connect all the zoom/pan/range events together of the charts
  let chartList = [SPELL_TIMELINE, TIMELINE, GRAPH_CRITR, GRAPH_CRITD, GRAPH_DMG];
  $(chartList).each(function(index, chart) {
    chart.on('rangechanged', function(update) {
      updateWindow(chart, update, chartList);
    });
  });

  TIMELINE.setGroups(getAdpsGroups());
  TIMELINE_DATA.on('add', visTimelineListener);
  TIMELINE_DATA.on('update', visTimelineListener);
  TIMELINE_DATA.on('remove', visTimelineListener);
}

export function initCounterBasedADPS(state) {
  utils.getCounterBasedAdps().forEach(adpsKey => {
    let counter = utils.getCounterKeys(adpsKey).counter;
    let item = TIMELINE_DATA.get(adpsKey);

    if (item) {
      let time = getTime(item);
      let timeLimit = utils.readAdpsOption(adpsKey, 'offset');
      let maxTimeFrame = { start: time.start, end: time.start + timeLimit };

      if (withinTimeFrame(state.workingTime, maxTimeFrame)) {
        if (state[counter] === undefined) {
          state[counter] = dom.getConfiguredCharges(adpsKey) || utils.readAdpsOption(adpsKey, 'charges');
        }
      } else if (time.start + timeLimit < state.workingTime) {
        state[counter] = -1;
      }
    }
  });
}

export function getTimelineItemTime(id) {
  return getTime(TIMELINE_DATA.get(id));
}

export function loadRates() {
  BASE_CRIT_DATA = [];
  let baseRate = dmgU.getBaseCritRate();
  let baseDmg = dmgU.getBaseCritDmg();
  let seconds = dom.getSpellTimeRangeValue();
  let displayList = utils.readAdpsConfig('displayList');

  for(let i=0; i<=(seconds*1000); i+=1000) {
    let time = CURRENT_TIME + i;
    let rate = baseRate;
    let dmg = baseDmg;
    let rateStacking = {};
    let dmgStacking = {};
    let hasUsedMap = {};

    $(displayList).each(function(index, item) {
      let adpsItem = TIMELINE_DATA.get(item);
      if (withinTimeFrame(time, adpsItem)) {
        let adpsOption = utils.readAdpsOption(item);
        if (!adpsOption.chargeBased) {
          rate += utils.checkStacking(hasUsedMap, rateStacking, adpsOption, 'critRateMod');
          dmg += utils.checkStacking(hasUsedMap, dmgStacking, adpsOption, 'critDmgMod');
        }
      }
    });

    BASE_CRIT_DATA.push({time: time, rate: rate, dmg: dmg});
  }
}

export function postCounterBasedADPS(state) {
  utils.getCounterBasedAdps().forEach(adpsKey => {
    let counter = utils.getCounterKeys(adpsKey).counter;
    let item = TIMELINE_DATA.get(adpsKey);

    if (item) {
      let time = getTime(item);
      let adpsOption = utils.readAdpsOption(adpsKey);
      if (state[counter] === 0) {
        // this is the last one
        item.end = state.workingTime;
        item.content = utils.createLabel(adpsOption, new Date(state.workingTime - time.start));
        item.title = item.content;
        silentUpdateTimeline(item);
        state[counter] = -1;
      } else if (state[counter] > 0) {
        let timeLimit = adpsOption.offset;
        if ( (time.end - time.start) != timeLimit ) {
          item.end = time.start + timeLimit;
          item.content = utils.createLabel(adpsOption, new Date(timeLimit));
          item.title = item.content;
          silentUpdateTimeline(item);
        }
      }
    }
  });
}

export function removeAdpsItemById(id) {
  TIMELINE_DATA.remove(id);
}

export function removePopovers() {
  $('.popover').remove();
}

export function setTitle(data, adpsOption, date) {
  let label = utils.createLabel(adpsOption, date);
  let lineItem = data.get(adpsOption.id);
  if (lineItem.content != label) {
    lineItem.content = label;
    lineItem.title = label;
    data.update(lineItem);
  }
}

export function updateSpellChart() {
  utils.clearCache();
  SPELLLINE_DATA.clear();
  DMG_DATA.clear();
  stats.clear();
  updateCritGraphs();
  removePopovers();

  let timeRange = dom.getSpellTimeRangeValue() * 1000;
  let hasForcedRejuv = TIMELINE_DATA.get('FR');
  let sp = 0;
  let twincastHasBeenCast = false;
  let gcdWaitTime = 0;
  let tcItem = TIMELINE_DATA.get('TC');
  let mbrnItem = TIMELINE_DATA.get('MBRN');
  let lockout = false;
  let preemptSpells = [];
  
  let state = {
    chartIndex: -1,
    gcd: dom.getGCDValue() * 1000,
    tcCounter: 0,
    updatedCritRValues: [],
    updatedCritDValues: [],
    lastCastMap: {},
    lastProcMap: {},
    spells: dom.getSelectedSpells(),
    fbOrbCounter: dom.isUsingFireboundOrb() ? dmgU.FIREBOUND_ORB_COUNT : 0,
    endTime: CURRENT_TIME + timeRange,
    workingTime:  CURRENT_TIME
  };

  // Items that exist both as abilties on the spell timeline as well as ADPS chart. They need to be in sync.
  // Check that spell exists since it may not depending on Mage vs Wiz abilities
  dmgU.PREEMPT_SPELL_CASTS.filter(id => utils.getSpellData(id).id !== undefined).forEach(id => {
    let item = TIMELINE_DATA.get(id);
    
    if (item) {
      preemptSpells.push({ id: id, item: item, iTime: getTime(item), spell: utils.getSpellData(id), hasBeenCast: false });
    }
  });
  
  let checkPreempt = (entry, current, spellReady) => {
    // stop after first spell that's successful using 'update'
    if (entry.item && !entry.hasBeenCast) {
      // if we're about to cast a spell but it won't land until after this ability is supposed to be
      // cast then do nothing and wait
      lockout = current && (spellReady && willCastDuring(state, entry.iTime, current));

      if (withinTimeFrame(state.workingTime + (entry.spell.castTime * 1000), entry.item)) {
        // Fix start point on timeline if its out of bounds
        let adpsStartTime = state.workingTime;
        
        castSpell(state, entry.spell);
        setTimelineItemStart(adpsStartTime, entry.item, entry.spell.castTime * 1000);
        entry.hasBeenCast = true;
        lockout = false;

        if (entry.spell.lockoutTime !== 0) { // some spells like Manaburn dont have one at all
          gcdWaitTime = state.workingTime + state.gcd;            
        }          
          
        return true;
      }
    }
    
    return false;
  };

  while (state.workingTime <= state.endTime) {
    // workaround to get these on the timeline for AA or abilities like Firebound Orb
    preemptSpells.find(entry => checkPreempt(entry));
        
     // Forced Rejuvination resets lockouts and end GCD
    if (hasForcedRejuv && withinTimeFrame(state.workingTime, getTime(hasForcedRejuv))) {
      hasForcedRejuv = false;
      state.spells.forEach(id => { delete state.lastCastMap[utils.getSpellData(id).timer] });
      gcdWaitTime = state.workingTime;
    }

    // Display/Cast alliance damage when timer expires
    if (utils.checkSimpleTimer(state, 'FA')) {
      castSpell(state, utils.getSpellData('FAF'));
      continue;
    }

    // abilities that can be enabled and repeat every so often like Enc Synergy
    // cancel or reset counters based on timer, only need to check once per workingTime
    dmgU.ACTIVATED_ABILITIES.forEach(item => initActivatedAbility(state, item));

    // Don't do any spell cast if we're during the GCD lockout phase
    if (gcdWaitTime <= state.workingTime) {
      // Summon more Orbs
      if (dom.isUsingFireboundOrb() && state.fbOrbCounter <= 0) {
        castSpell(state, utils.getSpellData('SFB'));
      }

      // find a spell to cast
      for (sp = 0; sp < state.spells.length; sp++) {
        let current = utils.getSpellData(state.spells[sp]);
        let castTime = current.castTime * 1000;
        let recastTime = getModifiedSpellRecastTime(current);
        let spellReady = (state.workingTime - ((state.lastCastMap[current.timer] || 0) + recastTime) > 0);

        // check if these spells need to be cast soon
        if (preemptSpells.find(entry => checkPreempt(entry, current, spellReady))) { break; }

        if (!lockout && spellReady) {
          // if cast successful update gcd wait time
          if (castSpell(state, current)) {
            if (current.lockoutTime !== 0) { // some spells like Manaburn dont have one at all
              gcdWaitTime = state.workingTime + state.gcd;            
            }
          }

          break; // break and try again at the updated workingTime
        }
      }
    }

    // spell not available so handle other click/AA abilities
    if (sp === state.spells.length || gcdWaitTime > state.workingTime) {
      // try to cast force nuke early to prevent conflicts later on
      // Ex FD can update crit dmg in the chart itself
      let activatedNukes = dom.getActivatedNukes();
      if (activatedNukes.length > 0) {
        let spell = isSpellAbilityReady(state, activatedNukes);
        if (spell) castSpell(state, spell);
      }

      // add dot/RS damage
      if (state.workingTime % 1000 === 0) {
        // check if RS pets have completed
        let rsKeys = utils.getCounterKeys('RS');
        utils.checkTimerList(state, rsKeys.counter, rsKeys.timers);

        let dotDmg = state.dotGenerator ? state.dotGenerator.next().value : 0;
        if (dotDmg > 0) {
          stats.addAggregateStatistics('totalAvgPetDmg', dotDmg);
          updateDmgGraph(state, dotDmg, 10000);
        }
      }
    }

    // do nothing if additional casts available otherwise increment time
    state.workingTime += 200;
  }

  // update charts
  state.updatedCritRValues.forEach((rI, rV) => {
    updateCritGraphValue(CRITR_DATA, rV.time, rV.y);
  });
  state.updatedCritDValues.forEach((rI, rV) => {
    updateCritGraphValue(CRITD_DATA, rV.time, rV.y);
  });

  // connect up popover
  connectPopovers();

  // print spellStats window
  stats.printStats($('#spellCountStats'), state, timeRange);
}

export function updateWindow(caller, update, windowList){
  // remove/reconnect any popover when changing window view
  removePopovers();
  connectPopovers();

  // sync up defaults to current view
  for (let w in windowList) {
    let chart = windowList[w];
    if (chart && (caller != chart)) {
      let w = chart.getWindow();
      if (w.start != update.start || w.end != update.end) {
        chart.setWindow(update.start, update.end, {animation: false})
      }
    }
  }
}

export function visTimelineListener(e, item) {
  let opt = utils.readAdpsOption(item.items[0]);
  if (opt) {
    if (e === 'remove') {
      $('#spellButtons div.adps li > a[data-value=' + item.items[0] + ']')
        .parent().removeClass('disabled');
      $('#spellButtons div.remove-adps li > a[data-value=' + item.items[0] + ']')
        .parent().addClass('disabled');
    } else if (e === 'update') {
      let lineItem = TIMELINE_DATA.get(item.items[0]);
      let time = new Date(lineItem.end - lineItem.start);
      setTitle(TIMELINE_DATA, opt, time);
    }

    // don't really have to reload rate data for every type
    switch(item.items[0]) {
      case 'TC': case 'ITC': case 'FURYDRUZ': case 'FURYRO': case 'FURYECI':
      case 'FURYKERA': case 'AF': case 'FR': case 'FD': case 'AD':
        break;
      default:
        setTimeout(loadRates, 5);
        break;
    }

    if (e != 'update' || item.oldData[0].start != item.data[0].start || item.oldData[0].end != item.data[0].end) {
      callUpdateSpellChart();
    }
  }
}