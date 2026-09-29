#!/usr/bin/env node
/*
 * Churchill Variant Bot - USA
 *
 * Standalone implementation of the US column of the "Churchill_Variant_Bot"
 * spreadsheet (sheets "AI interface" and "variables"). It produces the US
 * bot decisions for the four phases of a conference turn:
 *
 *   1. Agenda phase      - agenda card choice, issue selection priorities
 *   2. Meeting segment   - issue advancement, staff use, advancement
 *                          priorities, responses to UK / USSR advancement
 *   3. Decision segment  - Pol/Mil funding, theater production / D.O.,
 *                          theater leadership bonus locations
 *   4. War phase         - clandestine network and political alignment
 *                          placement priorities
 *
 * Usage: node usa-bot.js [--state state.json] [--phase all|agenda|meeting|decision|war]
 *                       [--seed N] [--json] [turn setup flags, see --help]
 */
'use strict';

var NATION = 'USA';

// ---------------------------------------------------------------------------
// Random numbers (Excel RAND()) - optionally seeded for reproducible runs
// ---------------------------------------------------------------------------

function createRng(seed) {
  if (seed === undefined || seed === null) return Math.random;
  var a = seed >>> 0;
  return function () { // mulberry32
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Sort weighted options by value (highest first) like Excel RANK(), drop
// options with value 0 (impossible options) and keep the first n.
function rankTop(entries, n) {
  return entries
    .filter(function (e) { return e.value > 0; })
    .sort(function (a, b) { return b.value - a.value; })
    .slice(0, n)
    .map(function (e) { return e.name; });
}

// ---------------------------------------------------------------------------
// Turn setup ("AI interface" rows 3-14 and cards in hand)
// ---------------------------------------------------------------------------

var DEFAULT_STATE = {
  bolero: false,          // Bolero space occupied
  normandy: false,        // Normandy occupied
  centralItaly: false,    // Central Italy occupied
  germanyDefeated: false,
  japanDefeated: false,
  vp: { uk: 0, us: 0, ussr: 0 },
  usEurLeadership: false, // US Eur leadership
  ukPacLeadership: false, // UK Pac leadership
  trinity: false,
  conference: 1,          // conference #
  cardsInHand: 6,
  // War phase global issue status, Roosevelt - Churchill track:
  // 'self-determination', 'neutral' or 'colonialism'
  rooseveltChurchill: 'neutral'
};

function normalizeState(input) {
  var s = JSON.parse(JSON.stringify(DEFAULT_STATE));
  input = input || {};
  Object.keys(input).forEach(function (k) {
    if (k === 'vp') {
      Object.keys(input.vp || {}).forEach(function (n) { s.vp[n] = Number(input.vp[n]) || 0; });
    } else {
      s[k] = input[k];
    }
  });
  s.conference = Number(s.conference) || 1;
  s.cardsInHand = Number(s.cardsInHand);
  if (!(s.cardsInHand >= 1)) s.cardsInHand = DEFAULT_STATE.cardsInHand;
  return s;
}

// VP factor: (1 + own VP) / (average VP of all three powers + 1)
function vpFactors(s) {
  var avg = (s.vp.uk + s.vp.us + s.vp.ussr) / 3;
  return {
    uk: (1 + s.vp.uk) / (avg + 1),
    us: (1 + s.vp.us) / (avg + 1),
    ussr: (1 + s.vp.ussr) / (avg + 1)
  };
}

var STAFF_USES = [
  'play staff card for highest priority capturable',
  'play staff card for highest priority capturable from conference leader if any',
  'play staff card on attribute named issue if capturable',
  'play staff card for highest priority capturable from game leader',
  'check if any staff card will neutralize Second front- play that card instead for that purpose',
  'check if any staff card will neutralize USSR DOW vs Japan- play that card instead for that purpose',
  'check if any staff card will neutralize Strat material- play that card instead for that purpose'
];

var LEADER_OPTIONS = {
  capture1st: 'use leader to capture 1st priority if possible',
  capture1st2nd: 'use leader to capture 1st or 2nd priority if possible',
  rooseveltGlobal: 'if Global issue is on the UK or USSR track use Roosevelt to capture the highest priority issue capturable'
};

var DEBATE_OPTIONS = [
  'no debate',
  'debate if capturable by any staff making specific use of attribute',
  'debate if capturable by any staff and opponent leading conference currently',
  'debate if issue is 1st or 2nd advancement priority above and capturable (use leader if needed )',
  'debate if capturable by any staff',
  'debate use leader if necessary to capture'
];

// ---------------------------------------------------------------------------
// Phase 1: Agenda phase
// ---------------------------------------------------------------------------

function agendaPhase(s, rng) {
  var f = vpFactors(s);
  var bolero = s.bolero, normandy = s.normandy;

  // Agenda card: 8 - INT(SQRT(RAND())*7+1)  -> 1..7, low numbers favoured
  var agendaCard = 8 - Math.floor(Math.sqrt(rng()) * 7 + 1);

  function caseValue(base) { return rng() * base + rng() / 100; }

  var v = {};
  v.secondFront = caseValue(bolero && !normandy ? 10 : 0);
  v.ussrDow = caseValue(s.germanyDefeated ? 1 : 0);
  v.global = caseValue(2);
  v.aBomb = caseValue(s.trinity ? 0 : 6);
  v.strat = caseValue(1);
  v.eurLead = caseValue(!s.usEurLeadership ? 3 * f.uk / f.us : 0);
  v.pacLead = caseValue(s.ukPacLeadership ? 4 * f.uk / f.us : 0);
  v.usProd1 = caseValue(0);
  v.ukProd = caseValue(3 * f.uk);
  v.usOff1 = caseValue(0);
  v.ukOff = caseValue(3.5 * f.uk);
  v.ussrOff = caseValue(3.5 * f.ussr);
  v.polMilA = caseValue(3 - f.us);
  v.usProd2 = caseValue(0);
  v.usOff2 = caseValue(0);
  v.polMilB = caseValue(v.polMilA + 0.25);
  v.polMil12 = caseValue(v.polMilB + 0.25);
  v.polMil11 = caseValue(v.polMil12 + 0.25);

  var first = s.conference === 1;
  var issues = [
    { name: 'second front', value: v.secondFront },
    { name: 'Ussr D.O.W.', value: v.ussrDow },
    { name: 'Global', value: v.global },
    { name: 'A-Bomb', value: v.aBomb },
    { name: 'Strat. Materials', value: v.strat },
    { name: 'Eur. Leadership', value: v.eurLead },
    { name: 'Pac. Leadership', value: v.pacLead },
    { name: '1st US Prod', value: v.usProd1 },
    { name: 'UK Prod', value: v.ukProd },
    { name: '1st US Offensive', value: v.usOff1 },
    { name: 'UK Offensive', value: v.ukOff },
    { name: 'USSR Offensive', value: v.ussrOff },
    { name: first ? '1/3 Pol/Mil' : '2/2 Pol/Mil', value: v.polMilA },
    { name: '2nd US Prod', value: v.usProd2 },
    { name: '2nd US Offensive', value: v.usOff2 },
    { name: first ? '2/2 Pol/Mil' : '1/3 Pol/Mil', value: v.polMilB },
    { name: '1/2 Pol/Mil', value: v.polMil12 },
    { name: '1/1 Pol/Mil', value: v.polMil11 }
  ];

  return {
    agendaCardChoice: agendaCard,
    issueSelectionPriorities: rankTop(issues, 10)
  };
}

// ---------------------------------------------------------------------------
// Phase 2: Meeting segment
// ---------------------------------------------------------------------------

function pickDebate(weights, rng) {
  return rankTop(DEBATE_OPTIONS.map(function (name, i) {
    return { name: name, value: rng() * weights[i] };
  }), 1)[0] || DEBATE_OPTIONS[0];
}

function meetingPhase(s, rng) {
  var cards = s.cardsInHand;
  var staffCard = Math.floor(cards * Math.sqrt(rng())) + 1;
  var playStaff = 'play staff card ' + staffCard + ' of ' + cards;

  // Issue advancement: 23% chance of a leader instruction with staff fallback
  var advancement = playStaff;
  if (rng() > 0.77) {
    if (rng() > 0.5) {
      advancement = LEADER_OPTIONS.rooseveltGlobal + ' ELSE ' + playStaff;
    } else {
      advancement = (rng() > 0.5 ? LEADER_OPTIONS.capture1st2nd : LEADER_OPTIONS.capture1st) +
        ' ELSE ' + playStaff;
    }
  }

  // Priorities for use of staff (not leader card)
  var sfBlocked = s.bolero && !s.normandy;
  var staffWeights = [
    12 - cards,
    6 - cards,
    cards === 1 ? 0 : 6,
    s.conference - 1,
    sfBlocked ? s.conference + 8 : 0,
    s.germanyDefeated ? 1 : 0,
    6
  ];
  var staffPriorities = rankTop(STAFF_USES.map(function (name, i) {
    return { name: name, value: rng() * staffWeights[i] };
  }), 4);

  // US advancement priorities
  var adv = [
    ['second front', 0],
    ['Ussr D.O.W.', 0.25],
    ['Global', 3],
    ['A-Bomb', 4],
    ['Strat. Materials', 1.5],
    ['Eur. Leadership', 2.8],
    ['Pac. Leadership', 3],
    ['Production', 2.9],
    ['Directed Offensive', 3.3],
    ['Pol/Mil', 3]
  ];
  var advancementPriorities = rankTop(adv.map(function (a) {
    return { name: a[0], value: a[1] * rng() };
  }), 7);

  return {
    issueAdvancement: advancement,
    staffPriorities: staffPriorities,
    advancementPriorities: advancementPriorities,
    responseToUK: pickDebate([12, 2, 2, 2, 0.5, 0.5], rng),  // us v uk
    responseToUSSR: pickDebate([12, 3, 3, 3, 0.5, 0.5], rng) // us v ussr
  };
}

// ---------------------------------------------------------------------------
// Phase 3: Decision segment
// ---------------------------------------------------------------------------

var EUROPE = ['Western', 'Eastern', 'Mediterranean', 'arctic'];
var PACIFIC = ['CBI', 'Far Eastern', 'Central Pacific', 'SW Pacific',
  'Central/SW pacific least advanced theater', 'Central/SW pacific most advanced theater'];

function decisionPhase(s, rng) {
  var f = vpFactors(s);
  var maxPolMil = Math.floor(Math.pow(rng(), f.us * 1.5) * 3.2 + 0.7);

  var weights = {
    'Western': 8,
    'Eastern': 1,
    'Mediterranean': 1,
    'CBI': 1,
    'Far Eastern': 1,
    'Central Pacific': 8,
    'SW Pacific': 8,
    'Central/SW pacific least advanced theater': 8,
    'Central/SW pacific most advanced theater': 1,
    'arctic': 2
  };
  var theaters = Object.keys(weights).map(function (name) {
    var closed = EUROPE.indexOf(name) >= 0 ? s.germanyDefeated : s.japanDefeated;
    return { name: name, value: closed ? 0 : rng() * weights[name] };
  });
  function best(names) {
    return rankTop(theaters.filter(function (t) { return names.indexOf(t.name) >= 0; }), 1)[0] || 'none';
  }

  return {
    maxPolMilIssuesToFund: maxPolMil,
    theaterProduction: best(EUROPE.concat(PACIFIC)),
    leadershipBonus: { europe: best(EUROPE), pacific: best(PACIFIC) }
  };
}

// ---------------------------------------------------------------------------
// Phase 4: War phase
// ---------------------------------------------------------------------------

function warPhase(s, rng) {
  var f = vpFactors(s);
  var first = s.conference === 1;

  var network = [
    ['colony location without network', s.rooseveltChurchill === 'self-determination' ? 5 : 4],
    ['location without network along western theater track', 5],
    ['location without network along eastern theater track', 4],
    ['location without network in arctic', 3],
    ['location without network along mediterranean track', first ? 6 : 4.5],
    ['place to remove UK network along western theater track', 3 * f.uk],
    ['place to remove UK network along eastern theater track', 3 * f.uk],
    ['place to remove UK network in arctic', 2 * f.uk],
    ['place to remove UK network along mediterranean theater track', 3 * f.uk],
    ['place to remove UK network in colony', 2.5 * f.uk],
    ['place to remove US network along western theater track', 0],
    ['place to remove US network along eastern theater track', 0],
    ['place to remove US network in arctic', 0],
    ['place to remove US network along mediterranean theater track', 0],
    ['place to remove US network in colony', 0],
    ['place to remove USSR network along western theater track', 3.5 * f.ussr],
    ['place to remove USSR network along eastern theater track', 3 * f.ussr],
    ['place to remove USSR network in arctic', 3 * f.ussr],
    ['place to remove USSR network along mediterranean theater track', 3.5 * f.ussr],
    ['place to remove USSR network in colony', 2.75 * f.ussr],
    ['place to remove opponent network where own political alignment', 5],
    ['place to add network where own political alignment and no network present', 5]
  ];
  var alignment = [
    ['place alignment to remove random UK alignment', f.uk * f.uk],
    ['place alignment to remove random USSR alignment', f.ussr * f.ussr],
    ['place alignment to remove random US alignment', 0],
    ['place new alignment', 3]
  ];

  return {
    clandestineNetworkPlacement: rankTop(network.map(function (n) {
      return { name: n[0], value: n[1] * rng() };
    }), 7),
    politicalAlignmentPlacement: rankTop(alignment.map(function (a) {
      return { name: a[0], value: rng() * Math.min(a[1], 4.5) };
    }), 3)
  };
}

// ---------------------------------------------------------------------------
// Output / CLI
// ---------------------------------------------------------------------------

var PHASES = ['agenda', 'meeting', 'decision', 'war'];

function run(state, options) {
  options = options || {};
  var s = normalizeState(state);
  var rng = createRng(options.seed);
  var phases = options.phase && options.phase !== 'all' ? [options.phase] : PHASES;
  var result = { nation: NATION, conference: s.conference };
  if (phases.indexOf('agenda') >= 0) result.agenda = agendaPhase(s, rng);
  if (phases.indexOf('meeting') >= 0) result.meeting = meetingPhase(s, rng);
  if (phases.indexOf('decision') >= 0) result.decision = decisionPhase(s, rng);
  if (phases.indexOf('war') >= 0) result.war = warPhase(s, rng);
  return result;
}

function list(items) {
  return items.map(function (x, i) { return '    ' + (i + 1) + '. ' + x; }).join('\n');
}

function format(r) {
  var out = ['=== ' + NATION + ' bot - conference ' + r.conference + ' ==='];
  if (r.agenda) {
    out.push('', 'AGENDA PHASE',
      '  Agenda card choice: #' + r.agenda.agendaCardChoice +
      ' (arrange staff cards by small ID number at the bottom, lowest# is card #1)',
      '  Issue selection priorities:', list(r.agenda.issueSelectionPriorities));
  }
  if (r.meeting) {
    out.push('', 'MEETING SEGMENT',
      '  US issue advancement: ' + r.meeting.issueAdvancement,
      '  Priorities for use of staff (not leader card):', list(r.meeting.staffPriorities),
      '    (if none of the priorities are possible advance random issue)',
      '  US advancement priorities:', list(r.meeting.advancementPriorities),
      '  US response to UK issue advancement: ' + r.meeting.responseToUK,
      '  US response to USSR issue advancement: ' + r.meeting.responseToUSSR);
  }
  if (r.decision) {
    out.push('', 'DECISION SEGMENT',
      '  Max # of Pol/Mil issues to fund: ' + r.decision.maxPolMilIssuesToFund,
      '  Theater production / D.O. location: ' + r.decision.theaterProduction,
      '  Theater leadership bonus locations:',
      '    Europe:  ' + r.decision.leadershipBonus.europe,
      '    Pacific: ' + r.decision.leadershipBonus.pacific);
  }
  if (r.war) {
    out.push('', 'WAR PHASE',
      '  Clandestine network placement priorities:', list(r.war.clandestineNetworkPlacement),
      '  Political alignment placement priorities:', list(r.war.politicalAlignmentPlacement));
  }
  return out.join('\n');
}

var HELP = [
  'Usage: node usa-bot.js [options]',
  '',
  '  --state FILE           JSON file with the turn setup (flags below override it)',
  '  --phase NAME           all (default), agenda, meeting, decision, war',
  '  --seed N               seed the random generator for reproducible results',
  '  --json                 print the result as JSON',
  '',
  'Turn setup:',
  '  --bolero --normandy --central-italy --germany-defeated --japan-defeated',
  '  --us-eur-leadership --uk-pac-leadership --trinity',
  '  --uk-vp N --us-vp N --ussr-vp N --conference N --cards N',
  '  --roosevelt-churchill self-determination|neutral|colonialism',
  '                         (global issue status for the war phase)'
].join('\n');

var BOOL_FLAGS = {
  '--bolero': 'bolero', '--normandy': 'normandy', '--central-italy': 'centralItaly',
  '--germany-defeated': 'germanyDefeated', '--japan-defeated': 'japanDefeated',
  '--us-eur-leadership': 'usEurLeadership', '--uk-pac-leadership': 'ukPacLeadership',
  '--trinity': 'trinity'
};

function parseArgs(argv) {
  var opts = { state: {}, file: null, phase: 'all', seed: undefined, json: false, help: false };
  for (var i = 0; i < argv.length; i++) {
    var a = argv[i];
    var next = function () {
      if (i + 1 >= argv.length) throw new Error('Missing value for ' + a);
      return argv[++i];
    };
    if (BOOL_FLAGS[a]) opts.state[BOOL_FLAGS[a]] = true;
    else if (a === '--state') opts.file = next();
    else if (a === '--phase') opts.phase = next();
    else if (a === '--seed') opts.seed = Number(next());
    else if (a === '--json') opts.json = true;
    else if (a === '--uk-vp' || a === '--us-vp' || a === '--ussr-vp') {
      opts.state.vp = opts.state.vp || {};
      opts.state.vp[a.slice(2, -3)] = Number(next());
    } else if (a === '--conference') opts.state.conference = Number(next());
    else if (a === '--cards') opts.state.cardsInHand = Number(next());
    else if (a === '--roosevelt-churchill') opts.state.rooseveltChurchill = next();
    else if (a === '-h' || a === '--help') opts.help = true;
    else throw new Error('Unknown option: ' + a);
  }
  if (opts.phase !== 'all' && PHASES.indexOf(opts.phase) < 0) {
    throw new Error('Unknown phase: ' + opts.phase);
  }
  return opts;
}

function main() {
  var opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(e.message + '\n\n' + HELP);
    process.exit(1);
  }
  if (opts.help) { console.log(HELP); return; }
  var state = {};
  if (opts.file) state = JSON.parse(require('fs').readFileSync(opts.file, 'utf8'));
  Object.keys(opts.state).forEach(function (k) {
    if (k === 'vp') {
      state.vp = state.vp || {};
      Object.keys(opts.state.vp).forEach(function (n) { state.vp[n] = opts.state.vp[n]; });
    } else {
      state[k] = opts.state[k];
    }
  });
  var result = run(state, { phase: opts.phase, seed: opts.seed });
  console.log(opts.json ? JSON.stringify(result, null, 2) : format(result));
}

module.exports = {
  run: run, format: format,
  agendaPhase: agendaPhase, meetingPhase: meetingPhase,
  decisionPhase: decisionPhase, warPhase: warPhase,
  normalizeState: normalizeState, createRng: createRng
};

if (require.main === module) main();
