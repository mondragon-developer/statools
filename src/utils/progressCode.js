// A progress code is the journey progress as compressed, URL-safe base64 text, so a
// student can paste it into an email or LMS and restore it on any device.
const PREFIX = 'STJ1-';

const toBase64Url = (bytes) => {
  let binary = '';
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (text) => {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text.length + 3) % 4);
  return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
};

async function pipe(bytes, stream) {
  const out = await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer();
  return new Uint8Array(out);
}

export const codesSupported = () => typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';

const UNSUPPORTED = 'This browser is too old to use progress codes. Please update it or try another browser.';

export async function encodeProgress(progress) {
  if (!codesSupported()) throw new Error(UNSUPPORTED);
  const json = new TextEncoder().encode(JSON.stringify({ v: 1, savedAt: new Date().toISOString(), progress }));
  return PREFIX + toBase64Url(await pipe(json, new CompressionStream('deflate-raw')));
}

// Throws with a learner-friendly message; callers show it as is.
export async function decodeProgress(code) {
  if (!codesSupported()) throw new Error(UNSUPPORTED);
  const clean = code.replace(/\s+/g, '');
  if (!clean.startsWith(PREFIX)) throw new Error('This does not look like a Statools progress code. It should start with STJ1-.');
  try {
    const bytes = await pipe(fromBase64Url(clean.slice(PREFIX.length)), new DecompressionStream('deflate-raw'));
    const data = JSON.parse(new TextDecoder().decode(bytes));
    if (data?.v !== 1 || typeof data.progress !== 'object' || data.progress === null) throw new Error('bad shape');
    return data;
  } catch {
    throw new Error('This code is incomplete or damaged. Copy the whole code and try again.');
  }
}
