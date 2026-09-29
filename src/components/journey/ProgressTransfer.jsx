import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Save, Upload, Copy, Download } from 'lucide-react';
import useJourneyProgress, { journeyActions } from '../../hooks/useJourneyProgress';
import { encodeProgress, decodeProgress } from '../../utils/progressCode';
import { STAGES } from '../../data/journey';

const buttonClass = `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed`;

const ProgressTransfer = () => {
  const progress = useJourneyProgress();
  const [code, setCode] = useState('');
  const [pasted, setPasted] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const statusRef = useRef(null);

  const create = async () => {
    try {
      setCode(await encodeProgress(progress));
      setStatus('Your code is ready. Copy it or download it, then send it to your teacher or keep it somewhere safe.');
    } catch (e) {
      setStatus(e.message);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('Copied. Paste it into an email, your LMS, or a note.');
    } catch {
      setStatus('Copy failed. Select the code and copy it manually.');
    }
  };

  const download = () => {
    const name = progress.certificateName.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'student';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statools-progress-${name}.txt`;
    link.click();
    // Revoking in the same tick can cancel the download in older Safari and Firefox.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const check = async () => {
    setError('');
    setPreview(null);
    try {
      setPreview(await decodeProgress(pasted));
    } catch (e) {
      setError(e.message);
    }
  };

  const restore = () => {
    journeyActions.importProgress(preview.progress);
    setPreview(null);
    setPasted('');
    setStatus('Progress restored on this device.');
    // The confirm button just unmounted; move focus to the result instead of <body>.
    setTimeout(() => statusRef.current?.focus(), 0);
  };

  return (
    <section aria-labelledby="transfer-heading" className="bg-white rounded-lg shadow-md p-5 space-y-6">
      <div>
        <h2 id="transfer-heading" className="text-2xl font-bold text-darkGrey">Save or move your progress</h2>
        <p className="text-darkGrey/80">
          Your progress lives in this browser. A progress code lets you continue on another device, or show your teacher what you finished.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-darkGrey"><Save size={18} aria-hidden="true" /> Save a code</h3>
          <label htmlFor="transfer-name" className="block text-sm font-semibold text-darkGrey">Your name (so your teacher knows whose code it is)</label>
          <input
            id="transfer-name"
            type="text"
            maxLength={80}
            value={progress.certificateName}
            onChange={(e) => { journeyActions.setCertificateName(e.target.value); setCode(''); }}
            className="w-full border-2 border-platinum rounded-md px-3 py-2 text-darkGrey focus:outline-none focus:border-darkTeal focus:ring-2 focus:ring-accentDark"
          />
          <button type="button" onClick={create} className={`${buttonClass} bg-darkTeal text-white hover:bg-darkTeal/90`}>
            Create my progress code
          </button>
          {code && (
            <>
              <label htmlFor="transfer-code" className="sr-only">Your progress code</label>
              <textarea
                id="transfer-code"
                readOnly
                value={code}
                rows={4}
                onFocus={(e) => e.target.select()}
                className="w-full font-mono text-xs border-2 border-platinum rounded-md p-2 text-darkGrey break-all"
              />
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copy} className={`${buttonClass} border-2 border-darkTeal text-darkTeal hover:bg-darkTeal/5`}>
                  <Copy size={16} aria-hidden="true" /> Copy code
                </button>
                <button type="button" onClick={download} className={`${buttonClass} border-2 border-darkGrey text-darkGrey hover:bg-platinum`}>
                  <Download size={16} aria-hidden="true" /> Download as a file
                </button>
              </div>
            </>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-bold text-darkGrey"><Upload size={18} aria-hidden="true" /> Restore from a code</h3>
          <label htmlFor="transfer-paste" className="block text-sm font-semibold text-darkGrey">Paste a progress code (starts with STJ1-)</label>
          <textarea
            id="transfer-paste"
            value={pasted}
            onChange={(e) => { setPasted(e.target.value); setPreview(null); setError(''); }}
            rows={4}
            aria-describedby={error ? 'transfer-error' : undefined}
            className="w-full font-mono text-xs border-2 border-platinum rounded-md p-2 text-darkGrey focus:outline-none focus:border-darkTeal focus:ring-2 focus:ring-accentDark"
          />
          <button type="button" onClick={check} disabled={!pasted.trim()} className={`${buttonClass} border-2 border-darkTeal text-darkTeal hover:bg-darkTeal/5`}>
            Check code
          </button>
          {error && <p id="transfer-error" role="alert" className="text-sm text-red-700">{error}</p>}
          {preview && (
            <div className="bg-accent/15 border border-accent rounded-md p-3 space-y-2">
              <p className="text-sm text-darkGrey">
                {`${preview.progress.certificateName ? `${preview.progress.certificateName}: ` : ''}`}
                {`${Object.keys(preview.progress.lessons || {}).length} lessons, ${Object.keys(preview.progress.badges || {}).length} of ${STAGES.length} badges, `}
                {`saved ${new Date(preview.savedAt).toLocaleString()}.`}
              </p>
              <p className="text-sm font-semibold text-darkGrey">This replaces the progress currently in this browser.</p>
              <button type="button" onClick={restore} className={`${buttonClass} bg-accent text-darkGrey border-2 border-darkGrey hover:bg-darkGrey hover:text-white`}>
                Replace my progress with this code
              </button>
            </div>
          )}
        </div>
      </div>

      <p ref={statusRef} tabIndex={-1} role="status" className="text-sm text-darkTeal font-semibold min-h-[1.25rem] focus:outline-none">{status}</p>
      <p className="text-sm text-darkGrey/80">
        Teachers: <Link to="/learn/report" className="text-darkTeal underline hover:no-underline">read a student progress code</Link>.
      </p>
    </section>
  );
};

export default ProgressTransfer;
