import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/chat.js';

const invoke = async (body, origin = 'https://statools.mdragonsolutions.com') => {
  const res = { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; }, end() { return this; } };
  await handler({ method: 'POST', headers: { origin }, body: { adultConfirmed: true, ...body } }, res);
  return res;
};

test('relay guards, emergency switch, and privacy-preserving upstream errors', async (t) => {
  const previous = { key: process.env.CHATBASE_API_KEY, enabled: process.env.CHAT_ENABLED, environment: process.env.VERCEL_ENV, fetch: globalThis.fetch };
  t.after(() => {
    for (const [key, value] of Object.entries({ CHATBASE_API_KEY: previous.key, CHAT_ENABLED: previous.enabled, VERCEL_ENV: previous.environment })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    globalThis.fetch = previous.fetch;
  });
  process.env.VERCEL_ENV = 'production';
  process.env.CHATBASE_API_KEY = 'test-only-not-a-real-key';
  process.env.CHAT_ENABLED = 'true';
  let calls = 0;
  globalThis.fetch = async () => { calls++; return { ok: true, json: async () => ({ text: 'Test reply' }) }; };
  assert.equal((await invoke({}, 'https://foreign.example')).code, 403);
  assert.equal((await invoke({}, '')).code, 403);
  assert.equal((await invoke({}, 'http://localhost:5173')).code, 403);
  for (const adultConfirmed of [undefined, false, 'true', 1]) {
    assert.equal((await invoke({ message: 'hello', adultConfirmed })).code, 403);
  }
  assert.equal(calls, 0);
  assert.equal((await invoke({})).code, 400);
  assert.equal((await invoke({ message: 'hello', conversationId: { bad: true } })).code, 400);
  process.env.CHAT_ENABLED = 'false';
  assert.equal((await invoke({ message: 'hello' })).code, 503);
  assert.equal(calls, 0);
  process.env.CHAT_ENABLED = 'true';
  let payload;
  globalThis.fetch = async (_, options) => {
    calls++;
    payload = JSON.parse(options.body);
    return { ok: true, json: async () => ({ text: 'Test reply' }) };
  };
  assert.equal((await invoke({ message: 'What is a mean?', conversationId: 'test-reference' })).code, 200);
  assert.equal(payload.conversationId, 'test-reference');
  assert.match(payload.messages.at(-1).content, /What is a mean/);
  assert.ok(!JSON.stringify(payload).includes('CALCULATOR CONTEXT'));
  globalThis.fetch = async () => ({ ok: false, status: 429, text: async () => { throw new Error('Private upstream body must not be read or logged'); } });
  assert.equal((await invoke({ message: 'hello' })).code, 502);
});
