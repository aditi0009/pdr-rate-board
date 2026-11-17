// Run: node advisor.test.mjs
// Pulls the knowledge base and the pure scoring core out of index.html and checks
// the KB's integrity plus a few golden questions.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const kb = JSON.parse(html.match(/id="pdr-kb">\n([\s\S]*?)\n<\/script>/)[1]);
const core = html.match(/\/\* advisor-core:start[\s\S]*?\*\/([\s\S]*?)\/\* advisor-core:end \*\//)[1];
const { needsFrom, scoreCodes } = new Function(core + 'return {needsFrom, scoreCodes};')();

// Integrity: every claim/fact cites a known source with a quote; caps and values are valid.
for (const c of kb.codes) {
  for (const x of c.claims) {
    assert.ok(kb.caps[x.cap], `${c.id}: unknown cap ${x.cap}`);
    assert.ok(['yes', 'partial', 'no'].includes(x.v), `${c.id}/${x.cap}: bad value ${x.v}`);
    assert.ok(kb.sources[x.s] && x.q && x.t, `${c.id}/${x.cap}: missing source, quote or text`);
    if (x.code) assert.ok(kb.sources[x.code.s]?.kind === 'code' && x.code.q, `${c.id}/${x.cap}: code evidence needs a code source and quote`);
  }
  assert.equal(new Set(c.claims.map(x => x.cap)).size, c.claims.length, `${c.id}: duplicate cap`);
  for (const [k, v, s, q] of c.facts) assert.ok(kb.sources[s] && q && v, `${c.id}/${k}: unsourced fact`);
}
for (const q of kb.questions) for (const o of q.opts) for (const k of o[2]) assert.ok(kb.caps[k], `question ${q.id}: unknown cap ${k}`);

const top = answers => scoreCodes(kb, needsFrom(kb, answers))[0].code.id;
assert.equal(top({ obj: ['core'], time: ['evolve'], obs: ['ices'] }), 'uclchem');
assert.equal(top({ obj: ['hii'], obs: ['spec'] }), 'cloudy');
assert.equal(top({ obj: ['pdr'], geo: ['3d'] }), '3dpdr');
assert.equal(top({ obj: ['xray'] }), 'cloudy');
assert.equal(top({ obj: ['pdr'], obs: ['lines'], extra: ['h2', 'cr'] }), 'meudon');
// Silence is not a "no": a code with no claim for a requirement scores 0, one with "no" scores below it.
const r = scoreCodes(kb, ['xray']);
assert.ok(r.find(x => x.code.id === 'uclchem').score > r.find(x => x.code.id === '3dpdr').score);
assert.ok(Array.isArray(kb.tbd) && kb.tbd.every(([n, a]) => n && a && !kb.codes.some(c => c.name === n)), 'tbd: name and authors, not already a code');
assert.deepEqual(needsFrom(kb, {}), []);
console.log('advisor: all checks passed');
