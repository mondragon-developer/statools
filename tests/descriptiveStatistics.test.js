import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAllStatistics } from '../src/utils/descriptiveStatistics.js';

test('worked example agrees with hand-calculated sample and population measures', () => {
  const input = [2, 4, 4, 6, 9];
  const sample = calculateAllStatistics(input);
  assert.equal(sample.mean, 5);
  assert.equal(sample.median, 4);
  assert.deepEqual(sample.mode, [4]);
  assert.equal(sample.variance, 7);
  assert.ok(Math.abs(sample.stdDev - 2.6457513110645907) < 1e-12);
  assert.equal(calculateAllStatistics(input, 'population').variance, 5.6);
  assert.deepEqual(input, [2, 4, 4, 6, 9]);
});

test('constant data retains its mode and has no spread', () => {
  const stats = calculateAllStatistics([7, 7, 7]);
  assert.deepEqual(stats.mode, [7]);
  assert.equal(stats.variance, 0);
  assert.equal(stats.iqr, 0);
  assert.equal(stats.outlierCount, 0);
});

test('inclusive quartiles and outlier fences are deterministic', () => {
  const stats = calculateAllStatistics([1, 2, 3, 4, 100]);
  assert.equal(stats.q1, 2);
  assert.equal(stats.q3, 4);
  assert.equal(stats.outlierMax, 7);
  assert.equal(stats.outlierCount, 1);
  assert.deepEqual(stats.mode, ['No mode']);
});

test('empty, nonfinite, and single-value sample inputs cannot produce misleading results', () => {
  for (const input of [[], [Infinity, 2], [NaN, 2], [5]]) {
    assert.throws(() => calculateAllStatistics(input));
  }
  assert.equal(calculateAllStatistics([5], 'population').variance, 0);
});

test('negative and decimal values preserve multimodal results', () => {
  const stats = calculateAllStatistics([-1.5, -1.5, 2.5, 2.5]);
  assert.equal(stats.mean, 0.5);
  assert.equal(stats.median, 0.5);
  assert.deepEqual([...stats.mode].sort((a, b) => a - b), [-1.5, 2.5]);
});
