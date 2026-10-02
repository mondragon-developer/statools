import { useState, useEffect } from 'react';

// Development-only audit controls, deliberately excluded from the scan.
export default function AccessibilityAudit() {
  const [report, setReport] = useState('Not scanned');
  const [largeText, setLargeText] = useState(false);
  const [spacing, setSpacing] = useState(false);
  const scan = () => {
    setReport('Scanning in 5 seconds; open the state you want to test.');
    setTimeout(async () => {
      try {
        const { default: axe } = await import('axe-core');
        const result = await axe.run({ exclude: ['#accessibility-audit'] }, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
        });
        const summarize = items => items.map(({ id, impact, tags, nodes }) => ({ id, impact, tags,
          nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }));
        setReport(JSON.stringify({ version: axe.version, url: location.href, viewport: [innerWidth, innerHeight],
          violations: summarize(result.violations), incomplete: summarize(result.incomplete),
          passes: result.passes.map(({ id }) => id) }, null, 2));
      } catch (error) { setReport(String(error)); }
    }, 5000);
  };
  useEffect(() => {
    const key = event => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') { event.preventDefault(); scan(); }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);
  return <aside id="accessibility-audit" aria-label="Development accessibility audit" className="bg-white border-4 border-black p-4">
    {largeText && <style>{`html {font-size:200% !important}`}</style>}
    <button onClick={() => setLargeText(!largeText)} className="border p-3" aria-pressed={largeText}>Test 200 percent text</button>
    {spacing && <style>{`body * {line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important} body p {margin-bottom:2em !important}`}</style>}
    <p>Development shortcut: Control+Alt+A scans the current state after 5 seconds, including an open dialog.</p>
    <button onClick={scan} className="border p-3">Scan accessibility in 5 seconds</button>
    <button onClick={() => setSpacing(!spacing)} className="border p-3" aria-pressed={spacing}>Test text spacing</button>
    <pre id="accessibility-audit-report" className="whitespace-pre-wrap text-xs">{report}</pre>
  </aside>;
}
