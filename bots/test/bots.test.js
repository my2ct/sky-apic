'use strict';

var test = require('node:test');
var assert = require('node:assert');
var path = require('path');
var execFileSync = require('child_process').execFileSync;

var BOTS = {
  UK: require('../uk-bot'),
  USA: require('../usa-bot'),
  USSR: require('../ussr-bot')
};

function runMany(bot, state, n, fn) {
  for (var seed = 1; seed <= n; seed++) fn(bot.run(state, { seed: seed }), seed);
}

Object.keys(BOTS).forEach(function (nation) {
  var bot = BOTS[nation];

  test(nation + ': all four phases produce complete results', function () {
    runMany(bot, {}, 200, function (r) {
      assert.strictEqual(r.nation, nation);
      assert.ok(r.agenda.agendaCardChoice >= 1 && r.agenda.agendaCardChoice <= 7);
      assert.strictEqual(r.agenda.issueSelectionPriorities.length, 10);
      assert.ok(/play staff card [1-6] of 6$/.test(r.meeting.issueAdvancement));
      assert.ok(r.meeting.staffPriorities.length >= 1 && r.meeting.staffPriorities.length <= 4);
      assert.strictEqual(r.meeting.advancementPriorities.length, 7);
      assert.ok(r.decision.maxPolMilIssuesToFund >= 0 && r.decision.maxPolMilIssuesToFund <= 3);
      assert.notStrictEqual(r.decision.theaterProduction, 'none');
      assert.strictEqual(r.war.clandestineNetworkPlacement.length, 7);
      assert.strictEqual(r.war.politicalAlignmentPlacement.length, 3);
    });
  });

  test(nation + ': same seed gives same result', function () {
    assert.deepStrictEqual(bot.run({}, { seed: 42 }), bot.run({}, { seed: 42 }));
  });

  test(nation + ': never targets its own network or alignment', function () {
    var own = nation === 'USA' ? 'US' : nation;
    runMany(bot, {}, 300, function (r) {
      r.war.clandestineNetworkPlacement.forEach(function (x) {
        assert.ok(x.indexOf('remove ' + own + ' network') < 0, x);
      });
      r.war.politicalAlignmentPlacement.forEach(function (x) {
        assert.ok(x.indexOf('remove random ' + own + ' alignment') < 0, x);
      });
    });
  });

  test(nation + ': no theater when Germany and Japan are defeated', function () {
    var r = bot.run({ germanyDefeated: true, japanDefeated: true }, { seed: 7, phase: 'decision' });
    assert.strictEqual(r.decision.theaterProduction, 'none');
    assert.deepStrictEqual(r.decision.leadershipBonus, { europe: 'none', pacific: 'none' });
  });

  test(nation + ': --phase runs a single phase only', function () {
    var r = bot.run({}, { seed: 1, phase: 'war' });
    assert.ok(r.war && !r.agenda && !r.meeting && !r.decision);
  });

  test(nation + ': one staff card in hand drops attribute-named staff use', function () {
    runMany(bot, { cardsInHand: 1 }, 100, function (r) {
      assert.ok(r.meeting.staffPriorities.indexOf('play staff card on attribute named issue if capturable') < 0);
      assert.ok(/play staff card 1 of 1$/.test(r.meeting.issueAdvancement));
    });
  });
});

test('UK: Europe theaters closed once Germany is defeated', function () {
  runMany(BOTS.UK, { germanyDefeated: true }, 100, function (r) {
    assert.ok(['Western', 'Eastern', 'Mediterranean', 'arctic'].indexOf(r.decision.theaterProduction) < 0);
    assert.strictEqual(r.decision.leadershipBonus.europe, 'none');
  });
});

test('Leader instruction: UK uses Churchill, USA Roosevelt, USSR Stalin', function () {
  var seen = { UK: false, USA: false, USSR: false };
  var leader = { UK: 'Churchill', USA: 'Roosevelt', USSR: 'Stalin' };
  Object.keys(BOTS).forEach(function (n) {
    runMany(BOTS[n], {}, 500, function (r) {
      Object.keys(leader).forEach(function (other) {
        if (other !== n) assert.ok(r.meeting.issueAdvancement.indexOf(leader[other]) < 0);
      });
      if (r.meeting.issueAdvancement.indexOf(leader[n]) >= 0) seen[n] = true;
    });
  });
  assert.deepStrictEqual(seen, { UK: true, USA: true, USSR: true });
});

test('USA: A-Bomb issue disappears after Trinity', function () {
  runMany(BOTS.USA, { trinity: true }, 200, function (r) {
    assert.ok(r.agenda.issueSelectionPriorities.indexOf('A-Bomb') < 0);
  });
});

test('CLI: each bot runs standalone with a state file', function () {
  var state = path.join(__dirname, '..', 'example-state.json');
  ['uk-bot.js', 'usa-bot.js', 'ussr-bot.js'].forEach(function (file) {
    var out = execFileSync(process.execPath,
      [path.join(__dirname, '..', file), '--state', state, '--seed', '5', '--json']);
    var r = JSON.parse(out);
    assert.strictEqual(r.conference, 2);
    assert.ok(r.agenda && r.meeting && r.decision && r.war);
  });
});
