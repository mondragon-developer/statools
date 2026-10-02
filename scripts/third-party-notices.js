import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

// Include installed runtime dependency notices, even when tree-shaking excludes a package.
// Asset and educational-content permissions require separate provenance review.
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const sections = ['Third-party software notices\nGenerated from package-lock.json by npm run notices.\nOriginal licenses and notices follow.'];
const missing = [];
const readText = path => readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const extraNotices = {
  'rehype-katex@7.0.1': 'licenses/rehype-katex-7.0.1.txt',
  'remark-math@6.0.0': 'licenses/remark-math-6.0.0.txt',
  'victory-vendor@37.3.6': 'licenses/victory-vendor-37.3.6.txt',
};
for (const [directory, entry] of Object.entries(lock.packages).sort(([a], [b]) => a.localeCompare(b))) {
  if (!directory || entry.dev || !directory.includes('node_modules/') || !existsSync(directory)) continue;
  const manifest = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'));
  const files = readdirSync(directory, { withFileTypes: true }).filter(f => f.isFile() && /^(licen[cs]e|copying|notice)([.-]|$)/i.test(f.name));
  const extra = extraNotices[`${manifest.name}@${manifest.version}`];
  if (!files.length && !extra) missing.push(`${manifest.name}@${manifest.version}`);
  const vendored = manifest.name === 'victory-vendor'
    ? readdirSync(join(directory, 'lib-vendor')).sort().map(name => join(directory, 'lib-vendor', name, 'LICENSE')).filter(existsSync)
    : [];
  sections.push(`\n${'='.repeat(72)}\n${manifest.name || basename(directory)} ${manifest.version}\nLicense: ${typeof manifest.license === 'string' ? manifest.license : JSON.stringify(manifest.license || entry.license || 'unspecified')}\n${files.sort((a, b) => a.name.localeCompare(b.name)).map(f => `\n--- ${f.name} ---\n${readText(join(directory, f.name))}`).join('\n')}${extra ? '\n' + readText(extra) : ''}${vendored.map(path => '\n' + readText(path)).join('\n')}`);
}
const output = sections.join('\n') + '\n';
if (process.argv.includes('--check')) {
  if (!existsSync('public/third-party-notices.txt') || readText('public/third-party-notices.txt') !== output) {
    throw new Error('Dependency notices are stale. Run npm run notices and commit the result.');
  }
} else writeFileSync('public/third-party-notices.txt', output);
if (missing.length) {
  console.error('License text needs review for:', missing.join(', '));
  process.exitCode = 1;
}
