import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('every resource-library PDF exists and is a PDF rather than an HTML fallback', () => {
  const source = readFileSync('src/data/journey/resources.js', 'utf8');
  const paths = [...source.matchAll(/resources\/([\w-]+\.pdf)/g)].map(match => match[1]);
  assert.ok(paths.length >= 18);
  for (const path of paths) {
    assert.equal(readFileSync(`public/resources/${path}`).subarray(0, 5).toString(), '%PDF-', path);
  }
});
