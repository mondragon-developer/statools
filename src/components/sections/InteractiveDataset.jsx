import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, RotateCcw } from 'lucide-react';
import { calculateAllStatistics } from '../../utils/descriptiveStatistics';

const format = value => Number(value.toFixed(2)).toLocaleString('en-US');

export default function InteractiveDataset() {
  const [lastValue, setLastValue] = useState(9);
  const values = [2, 4, 4, 6, lastValue];
  const { mean, median, stdDev } = calculateAllStatistics(values);
  const position = value => 20 + ((value + 10) / 40) * 320;
  const explanation = lastValue === 9
    ? 'The largest value pulls the mean above the median. Move the last value and watch what changes.'
    : lastValue > 9
      ? 'The high value pulls the mean upward and increases the spread. The median stays at 4 because it is still the middle value.'
      : lastValue < 2
        ? 'The low value pulls the mean downward. The median stays at 4 while the mean responds to every change.'
        : 'The values are closer together, so the spread is smaller than in the original example. The median is still the middle value: 4.';

  return (
    <div className="min-w-0 bg-white border border-darkTeal/20 rounded-2xl p-5 sm:p-8 shadow-sm">
      <h2 className="text-sm font-semibold text-darkTeal">A small dataset, a clearer picture</h2>
      <p className="text-sm text-darkGrey/80 mt-2">Change one number. See how the story changes.</p>
      <div className="flex flex-wrap gap-2 mt-4 font-mono text-xl text-darkGrey" aria-label={`Dataset: ${values.join(', ')}`}>
        {values.map((value, index) => <span key={index} aria-hidden="true" className={`rounded-lg px-3 py-2 ${index === 4 ? 'bg-darkTeal text-white font-bold' : 'bg-platinum/60'}`}>{value}</span>)}
      </div>
      <label htmlFor="hero-last-value" className="block mt-5 text-sm font-semibold text-darkGrey">Move the last value: {lastValue}</label>
      <input id="hero-last-value" type="range" min="-10" max="30" step="1" value={lastValue}
        onChange={event => setLastValue(Number(event.target.value))}
        aria-describedby="hero-slider-help" className="w-full h-10 accent-darkTeal cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-darkTeal rounded" />
      <p id="hero-slider-help" className="text-xs text-darkGrey/80">Drag or use the arrow keys. Range: −10 to 30.</p>
      <div className="flex flex-wrap gap-2 mt-3">
        <button type="button" onClick={() => setLastValue(25)} aria-pressed={lastValue === 25} className="rounded-lg border border-darkTeal px-3 py-2 text-sm font-semibold text-darkTeal hover:bg-darkTeal/10 focus-visible:outline focus-visible:outline-2">Try an outlier: 25</button>
        <button type="button" onClick={() => setLastValue(9)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-darkGrey hover:bg-platinum/60 focus-visible:outline focus-visible:outline-2"><RotateCcw size={14} aria-hidden="true" /> Reset</button>
      </div>
      <svg viewBox="0 0 360 92" role="img" aria-label={`Dot plot of ${values.join(', ')}. Mean ${format(mean)}; median ${format(median)}.`} className="w-full mt-4">
        <line x1="20" x2="340" y1="48" y2="48" stroke="#9ca3af" />
        {[-10, 0, 10, 20, 30].map(tick => <g key={tick}><line x1={position(tick)} x2={position(tick)} y1="45" y2="52" stroke="#9ca3af" /><text x={position(tick)} y="68" textAnchor="middle" fontSize="11" fill="#374151">{tick}</text></g>)}
        {values.map((value, index) => <circle key={index} cx={position(value)} cy={36 - values.slice(0, index).filter(v => v === value).length * 13} r="5" fill={index === 4 ? '#0f766e' : '#4b5563'} />)}
        <line x1={position(mean)} x2={position(mean)} y1="7" y2="51" stroke="#0f766e" strokeWidth="2" strokeDasharray="3 3" />
        <text x="180" y="87" textAnchor="middle" fontSize="11" fill="#374151">Dashed line = mean · Teal dot = value you control</text>
      </svg>
      <div aria-live="polite" aria-atomic="true">
        <dl className="grid grid-cols-3 gap-2 my-4">
          {[['Mean', mean], ['Median', median], ['Sample SD', stdDev]].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-platinum/60 p-2 sm:p-3"><dt className="text-xs sm:text-sm text-darkGrey">{label}</dt><dd className="text-xl sm:text-2xl font-bold text-darkTeal mt-1">{format(value)}</dd></div>
          ))}
        </dl>
        <p className="text-sm text-darkGrey/80 min-h-[4.5rem]">{explanation}</p>
      </div>
      <Link to="/calculators/statistics" className="inline-flex items-center gap-2 mt-4 font-semibold text-darkTeal underline">Try the statistics calculator <ArrowRight size={18} aria-hidden="true" /></Link>
      <a href="#calculator-coach" className="flex items-center gap-2 mt-5 pt-5 border-t border-platinum font-semibold text-darkTeal underline"><Compass size={18} aria-hidden="true" /> Help me choose a calculator</a>
    </div>
  );
}
