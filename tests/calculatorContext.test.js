import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCalculatorContext } from '../src/utils/calculatorContext.js';

test('default tutor context never reads or sends calculator inputs', () => {
  const context = buildCalculatorContext({ name: 'Statistics', purpose: 'Summarize data' }, false, () => {
    throw new Error('Calculator snapshot must not be read without opt-in');
  });
  assert.match(context, /Statistics/);
  assert.match(context, /not shared/);
});

test('explicit sharing includes a snapshot and switching off excludes subsequent snapshots', () => {
  let reads = 0;
  const snapshot = () => { reads++; return 'Synthetic input: 2, 4, 6'; };
  const guide = { name: 'Statistics', purpose: 'Summarize data' };
  assert.match(buildCalculatorContext(guide, true, snapshot), /Synthetic input: 2, 4, 6/);
  assert.doesNotMatch(buildCalculatorContext(guide, false, snapshot), /Synthetic input/);
  assert.equal(reads, 1);
});
