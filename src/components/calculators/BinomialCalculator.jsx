/**
 * BinomialCalculator.jsx
 * 
 * Interactive calculator for binomial probability distributions.
 * Provides real-time visualization and calculation of probabilities
 * for discrete binary outcome experiments.
 * 
 * Dependencies: Chart.js, jStat, React
 * 
 * @component
 * @version 1.0.0
 */

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { jStat } from 'jstat';
import InfoIcon from './InfoIcon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFocusTrap from '../../hooks/useFocusTrap';
import { announcePolite } from '../../utils/announce';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Color configuration for chart visualization
 * Default: unhighlighted probability bars
 * Highlight: selected probability values based on calculation type
 */
const CHART_COLORS = {
  default: {
    background: 'rgba(78, 205, 196, 0.6)',
    border: 'rgba(78, 205, 196, 1)'
  },
  highlight: {
    background: 'rgba(217, 119, 6, 0.8)',
    border: 'rgba(180, 83, 9, 1)'
  }
};

/**
 * Predefined scenarios demonstrating different distribution shapes
 * Each scenario represents a common real-world application
 */
const PRESET_SCENARIOS = [
  {
    name: 'Fair Coin Flips',
    n: 10, p: 0.5, x: 5, type: 'exact',
    description: 'Flip a fair coin 10 times — what is the chance of exactly 5 heads?',
    expectedOutcome: 'About 24.6% — even the "expected" outcome happens only 1 time in 4! The distribution is perfectly symmetric because p = 0.5.'
  },
  {
    name: 'Free Throw Shooter',
    n: 12, p: 0.75, x: 9, type: 'atLeast',
    description: 'A 75% free-throw shooter takes 12 shots — chance of making at least 9?',
    expectedOutcome: 'About 65% — at least the expected number (μ = 9) happens more often than not. Note the left skew: p > 0.5 piles outcomes toward high counts.'
  },
  {
    name: 'Guessing a Multiple-Choice Test',
    n: 20, p: 0.25, x: 12, type: 'atLeast',
    description: 'Pure guessing on 20 questions with 4 options each — chance of passing with at least 12 correct?',
    expectedOutcome: 'Under 0.1% — guessing simply cannot rescue you. The expected score is only μ = 5, and 12 is more than 3 standard deviations above it.'
  },
  {
    name: 'Quality Control Inspection',
    n: 30, p: 0.05, x: 2, type: 'atMost',
    description: 'Inspect 30 items from a line with a 5% defect rate — chance of finding at most 2 defects?',
    expectedOutcome: 'About 81% — small p makes the distribution right-skewed, bunched near 0 with a tail stretching right.'
  },
  {
    name: 'Email Campaign Conversions',
    n: 40, p: 0.10, x: 4, type: 'exact',
    description: 'Send 40 emails with a 10% reply rate — chance of exactly 4 replies?',
    expectedOutcome: 'About 20.6% — exactly the mean (μ = 4) is the single most likely outcome, yet it still misses 4 times out of 5.'
  }
];

/**
 * Valid parameter ranges for the calculator
 * Limits chosen for computational efficiency and visual clarity
 */
const PARAMETER_RANGES = {
  n: { min: 1, max: 50 },
  p: { min: 0, max: 1, step: 0.01 }
};

/**
 * Binomial coefficient C(n, k) — number of ways to choose k successes from n trials.
 * Computed multiplicatively to stay exact within double precision for n ≤ 50.
 */
const binomialCoefficient = (n, k) => {
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = (result * (n - k + i)) / i;
  }
  return Math.round(result);
};

/**
 * Format a probability for display: fixed decimals normally,
 * scientific notation when the value is vanishingly small
 */
const formatProbability = (value) => {
  if (value === 0) return '0';
  return value >= 0.0001 ? value.toFixed(4) : value.toExponential(2);
};

/**
 * Main BinomialCalculator component
 * Manages state, calculations, and rendering of the probability interface
 */
const BinomialCalculator = () => {
  useDocumentTitle('Binomial Distribution Calculator');
  // Core state variables
  const [n, setN] = useState(10);                    // Number of trials
  const [p, setP] = useState(0.5);                   // Probability of success
  const [x, setX] = useState(5);                     // Target value
  const [probabilityType, setProbabilityType] = useState('exact');  // Calculation type
  const [showTable, setShowTable] = useState(false); // Probability table visibility
  const [showChartModal, setShowChartModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const chartRef = useRef(null);

  const chartModalTrapRef = useFocusTrap(showChartModal);

  const handleChartModalKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setShowChartModal(false);
  }, []);

  /**
   * Calculate distribution statistics
   * Memoized to prevent unnecessary recalculation
   * Formulas: μ = np, σ² = np(1-p), σ = √(σ²)
   */
  const statistics = useMemo(() => {
    const mean = n * p;
    const variance = n * p * (1 - p);
    const standardDeviation = Math.sqrt(variance);
    
    return { mean, variance, standardDeviation };
  }, [n, p]);

  /**
   * Calculate requested probability based on type
   * - exact: P(X = x) using probability mass function
   * - atMost: P(X ≤ x) using cumulative distribution function
   * - atLeast: P(X ≥ x) = 1 - P(X ≤ x-1)
   */
  const probability = useMemo(() => {
    switch (probabilityType) {
      case 'exact':
        return jStat.binomial.pdf(x, n, p);
      case 'atMost':
        return jStat.binomial.cdf(x, n, p);
      case 'atLeast':
        return 1 - jStat.binomial.cdf(x - 1, n, p);
      default:
        return 0;
    }
  }, [n, p, x, probabilityType]);

  /**
   * All three probabilities for the current x, so students can see
   * how exact, cumulative, and complement relate to each other
   */
  const probabilityTrio = useMemo(() => ({
    exact: jStat.binomial.pdf(x, n, p),
    atMost: jStat.binomial.cdf(x, n, p),
    atLeast: 1 - jStat.binomial.cdf(x - 1, n, p)
  }), [n, p, x]);

  /**
   * Full probability table: P(X = k), P(X ≤ k), and P(X ≥ k) for every k
   */
  const distributionTable = useMemo(() => {
    const rows = [];
    for (let k = 0; k <= n; k++) {
      rows.push({
        k,
        pmf: jStat.binomial.pdf(k, n, p),
        cdf: jStat.binomial.cdf(k, n, p),
        ccdf: 1 - jStat.binomial.cdf(k - 1, n, p)
      });
    }
    return rows;
  }, [n, p]);

  /**
   * Pieces of the binomial formula for the "show the math" panel
   */
  const formulaBreakdown = useMemo(() => {
    const coefficient = binomialCoefficient(n, x);
    const successPart = Math.pow(p, x);
    const failurePart = Math.pow(1 - p, n - x);
    return { coefficient, successPart, failurePart, product: coefficient * successPart * failurePart };
  }, [n, p, x]);

  /**
   * Generate chart data with appropriate highlighting
   * Creates bars for each possible outcome (0 to n)
   * Highlights bars based on selected probability type
   */
  const chartData = useMemo(() => {
    const labels = [];
    const probabilities = [];
    const backgroundColors = [];
    const borderColors = [];

    // Generate probability data for each possible outcome
    for (let k = 0; k <= n; k++) {
      labels.push(k.toString());
      probabilities.push(jStat.binomial.pdf(k, n, p));

      // Determine highlighting based on probability type
      const shouldHighlight = 
        (probabilityType === 'exact' && k === x) ||
        (probabilityType === 'atMost' && k <= x) ||
        (probabilityType === 'atLeast' && k >= x);

      const colors = shouldHighlight ? CHART_COLORS.highlight : CHART_COLORS.default;
      backgroundColors.push(colors.background);
      borderColors.push(colors.border);
    }

    return {
      labels,
      datasets: [{
        label: 'Probability',
        data: probabilities,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
      }]
    };
  }, [n, p, x, probabilityType]);

  /**
   * Chart display configuration
   * Customizes axes, tooltips, and general appearance
   */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `P(X = ${context.label}) = ${context.parsed.y.toFixed(4)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Probability' }
      },
      x: {
        title: { display: true, text: 'Number of Successes (k)' }
      }
    }
  };

  /**
   * Apply preset scenario values
   * Updates all parameters simultaneously
   */
  const applyPreset = (preset) => {
    setN(preset.n);
    setP(preset.p);
    setX(preset.x);
    setProbabilityType(preset.type);
    announcePolite('Loaded preset: ' + preset.name);
  };

  /**
   * Copy parameters, probabilities, and statistics as tab-separated text
   * (pastes cleanly into Excel, Google Sheets, and Word)
   */
  const copyResultsToClipboard = async () => {
    const typeLabel = probabilityType === 'exact' ? `P(X = ${x})` : probabilityType === 'atMost' ? `P(X ≤ ${x})` : `P(X ≥ ${x})`;
    const rows = [
      ['Binomial Distribution', ''],
      ['Trials (n)', String(n)],
      ['Success probability (p)', p.toFixed(2)],
      ['Target value (x)', String(x)],
      [`Selected: ${typeLabel}`, formatProbability(probability)],
      [`P(X = ${x})`, formatProbability(probabilityTrio.exact)],
      [`P(X ≤ ${x})`, formatProbability(probabilityTrio.atMost)],
      [`P(X ≥ ${x})`, formatProbability(probabilityTrio.atLeast)],
      ['Mean (μ = np)', statistics.mean.toFixed(4)],
      ['Variance (σ² = np(1−p))', statistics.variance.toFixed(4)],
      ['Std Dev (σ)', statistics.standardDeviation.toFixed(4)]
    ];
    const text = rows.map(row => row.join('\t')).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      announcePolite('Results copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      announcePolite('Could not access the clipboard.');
    }
  };

  /**
   * Download the distribution chart as a PNG on a white background
   */
  const downloadChartPNG = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const source = chart.canvas;
    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `binomial-n${n}-p${p.toFixed(2)}.png`;
    link.click();
    announcePolite('Chart image downloaded.');
  };

  /**
   * Update parameter with validation
   * Ensures x value remains within valid range when n changes
   */
  const updateParameter = (param, value) => {
    switch (param) {
      case 'n':
        setN(value);
        if (x > value) setX(value);  // Constrain x to valid range
        break;
      case 'p':
        setP(value);
        break;
      case 'x':
        setX(value);
        break;
    }
  };

  /**
   * Generate gradient style for slider tracks
   * Creates visual fill effect based on current value
   */
  const getSliderStyle = (value, min, max, color = '#0F766E') => ({
    background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #e0e0e0 ${((value - min) / (max - min)) * 100}%, #e0e0e0 100%)`
  });

  // Plain-language pieces for the interpretation panel
  const typePhrase = probabilityType === 'exact' ? `exactly ${x}` : probabilityType === 'atMost' ? `${x} or fewer` : `${x} or more`;
  const oneInOdds = probability > 0 && probability < 1 ? Math.round(1 / probability) : null;
  const zScore = statistics.standardDeviation > 0 ? (x - statistics.mean) / statistics.standardDeviation : 0;
  const typicalLow = Math.max(0, statistics.mean - statistics.standardDeviation);
  const typicalHigh = Math.min(n, statistics.mean + statistics.standardDeviation);
  const normalApproxOk = n * p >= 5 && n * (1 - p) >= 5;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-darkGrey mb-2">
          Binomial Distribution Calculator
        </h2>
        
        {/* Educational explanation section for students */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-darkGrey mb-2">
            📚 Understanding Binomial Distribution
          </h3>
          <p className="text-darkGrey mb-3">
            Think of the binomial distribution as your probability toolkit for yes/no experiments! 
            It's like flipping a coin multiple times and asking: <em>"What are the chances of getting exactly 7 heads in 10 flips?"</em>
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm text-darkGrey">
            <div>
              <h4 className="font-semibold mb-1">🎯 When to Use:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Fixed number of trials (n)</li>
                <li>Only two outcomes per trial</li>
                <li>Same probability each time</li>
                <li>Independent trials</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">🌟 Real Examples:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Multiple choice test scores</li>
                <li>Quality control sampling</li>
                <li>Free throw success rates</li>
                <li>Customer conversion rates</li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm text-darkGrey mt-3 italic">
            💡 <strong>Pro tip:</strong> The mean tells you the "expected" number of successes,
            while standard deviation shows how spread out the results typically are!
          </p>

          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200 text-sm text-darkGrey">
            <h4 className="font-semibold mb-2">✏️ Worked Example: exactly 3 heads in 5 coin flips</h4>
            <p className="font-mono text-center my-2">P(X = k) = C(n, k) × p<sup>k</sup> × (1−p)<sup>n−k</sup></p>
            <ul className="space-y-1">
              <li><strong>C(5, 3) = 10</strong> — there are 10 different orders in which 3 heads can appear among 5 flips (HHHTT, HHTHT, …).</li>
              <li><strong>0.5³ = 0.125</strong> — the chance the 3 heads happen.</li>
              <li><strong>0.5² = 0.25</strong> — the chance the other 2 flips are tails.</li>
              <li><strong>P(X = 3) = 10 × 0.125 × 0.25 = 0.3125</strong> — about a 31% chance.</li>
            </ul>
            <p className="mt-2 italic">
              Try it yourself: set n = 5, p = 0.50, X = 5 and the formula collapses to 0.5⁵ ≈ 0.03 — only one order
              gives all heads, which is why "all successes" is so much rarer than "mostly successes."
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Control panel section */}
          <div className="space-y-4">
            {/* Parameter controls */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4">Parameters</h3>
              
              <div className="space-y-4">
                {/* Number of trials slider */}
                <div>
                  <label htmlFor="binom-n" className="flex items-center text-darkGrey font-medium mb-2">
                    Number of trials (n): {n}
                    <InfoIcon info="Total number of independent trials or experiments" />
                  </label>
                  <input
                    id="binom-n"
                    type="range"
                    min={PARAMETER_RANGES.n.min}
                    max={PARAMETER_RANGES.n.max}
                    value={n}
                    onChange={(e) => updateParameter('n', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={getSliderStyle(n, PARAMETER_RANGES.n.min, PARAMETER_RANGES.n.max)}
                    aria-label="Number of trials"
                    aria-valuetext={n + " trials"}
                  />
                </div>

                {/* Probability slider */}
                <div>
                  <label htmlFor="binom-p" className="flex items-center text-darkGrey font-medium mb-2">
                    Probability of success (p): {p.toFixed(2)}
                    <InfoIcon info="Probability of success in a single trial" />
                  </label>
                  <input
                    id="binom-p"
                    type="range"
                    min={PARAMETER_RANGES.p.min}
                    max={PARAMETER_RANGES.p.max}
                    step={PARAMETER_RANGES.p.step}
                    value={p}
                    onChange={(e) => updateParameter('p', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={getSliderStyle(p, PARAMETER_RANGES.p.min, PARAMETER_RANGES.p.max)}
                    aria-label="Probability of success"
                    aria-valuetext={p.toFixed(2)}
                  />
                </div>

                {/* Target value slider */}
                <div>
                  <label htmlFor="binom-x" className="flex items-center text-darkGrey font-medium mb-2">
                    X value: {x}
                    <InfoIcon info="Number of successes of interest" />
                  </label>
                  <input
                    id="binom-x"
                    type="range"
                    min={0}
                    max={n}
                    value={x}
                    onChange={(e) => updateParameter('x', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={getSliderStyle(x, 0, n, '#D97706')}
                    aria-label="Target value"
                    aria-valuetext={x + " successes"}
                  />
                </div>
              </div>
            </div>

            {/* Probability type selection */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4">Probability Type</h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="exact"
                    checked={probabilityType === 'exact'}
                    onChange={(e) => setProbabilityType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-darkGrey">P(X = {x}) - Exactly {x}</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="atMost"
                    checked={probabilityType === 'atMost'}
                    onChange={(e) => setProbabilityType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-darkGrey">P(X ≤ {x}) - At most {x}</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="atLeast"
                    checked={probabilityType === 'atLeast'}
                    onChange={(e) => setProbabilityType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-darkGrey">P(X ≥ {x}) - At least {x}</span>
                </label>
              </div>
            </div>

            {/* Results display */}
            <div className="bg-accent/20 border-2 border-accent p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-2">Results</h3>
              <div className="space-y-2 text-darkGrey">
                <p className="text-lg font-semibold">
                  {probabilityType === 'exact' ? `P(X = ${x})` : probabilityType === 'atMost' ? `P(X ≤ ${x})` : `P(X ≥ ${x})`} = {formatProbability(probability)}
                  <span className="font-normal"> ({(probability * 100).toFixed(2)}%{oneInOdds && oneInOdds > 1 ? ` — roughly 1 in ${oneInOdds.toLocaleString()}` : ''})</span>
                </p>

                {/* All three probabilities for the same x — selected row highlighted */}
                <table className="w-full text-sm my-2">
                  <tbody>
                    <tr className={probabilityType === 'exact' ? 'bg-accent/40 font-semibold' : ''}>
                      <td className="p-1">Exactly {x}</td>
                      <td className="p-1 font-mono text-right">P(X = {x}) = {formatProbability(probabilityTrio.exact)}</td>
                    </tr>
                    <tr className={probabilityType === 'atMost' ? 'bg-accent/40 font-semibold' : ''}>
                      <td className="p-1">At most {x}</td>
                      <td className="p-1 font-mono text-right">P(X ≤ {x}) = {formatProbability(probabilityTrio.atMost)}</td>
                    </tr>
                    <tr className={probabilityType === 'atLeast' ? 'bg-accent/40 font-semibold' : ''}>
                      <td className="p-1">At least {x}</td>
                      <td className="p-1 font-mono text-right">P(X ≥ {x}) = {formatProbability(probabilityTrio.atLeast)}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs text-darkGrey/70">
                  Check: P(X ≤ {x}) + P(X ≥ {x}) − P(X = {x}) = 1 — the three are always linked.
                </p>

                <p className="flex items-center">
                  Mean (μ): {statistics.mean.toFixed(4)}
                  <InfoIcon info="Expected value: μ = n × p" />
                </p>
                <p className="flex items-center">
                  Variance (σ²): {statistics.variance.toFixed(4)}
                  <InfoIcon info="Variance: σ² = n × p × (1 - p)" />
                </p>
                <p className="flex items-center">
                  Standard Dev (σ): {statistics.standardDeviation.toFixed(4)}
                  <InfoIcon info="Standard deviation: σ = √(variance)" />
                </p>
              </div>
            </div>

            {/* Show the math for the current parameters */}
            <div className="bg-white border-2 border-darkGrey/20 p-4 rounded-lg text-sm text-darkGrey">
              <h3 className="text-lg font-bold text-darkGrey mb-2">🧮 The Math, Step by Step</h3>
              {probabilityType === 'exact' ? (
                <>
                  <p className="font-mono text-center mb-2">P(X = {x}) = C({n}, {x}) × {p.toFixed(2)}<sup>{x}</sup> × {(1 - p).toFixed(2)}<sup>{n - x}</sup></p>
                  <ul className="space-y-1">
                    <li><strong>C({n}, {x}) = {formulaBreakdown.coefficient.toLocaleString()}</strong> — the number of different orders {x} success{x === 1 ? '' : 'es'} can occur in {n} trials.</li>
                    <li><strong>{p.toFixed(2)}<sup>{x}</sup> = {formatProbability(formulaBreakdown.successPart)}</strong> — the chance of the {x} success{x === 1 ? '' : 'es'}.</li>
                    <li><strong>{(1 - p).toFixed(2)}<sup>{n - x}</sup> = {formatProbability(formulaBreakdown.failurePart)}</strong> — the chance of the {n - x} failure{n - x === 1 ? '' : 's'}.</li>
                    <li><strong>Multiply: {formulaBreakdown.coefficient.toLocaleString()} × {formatProbability(formulaBreakdown.successPart)} × {formatProbability(formulaBreakdown.failurePart)} = {formatProbability(formulaBreakdown.product)}</strong></li>
                  </ul>
                </>
              ) : probabilityType === 'atMost' ? (
                <>
                  <p className="font-mono text-center mb-2">P(X ≤ {x}) = P(X = 0) + P(X = 1) + … + P(X = {x})</p>
                  <p>
                    A cumulative probability adds the exact probability of every outcome from 0 up to {x} — the {x + 1} highlighted
                    bars in the chart. Adding the rows of the probability table (below the chart) from k = 0 to k = {x} gives {formatProbability(probability)}.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-mono text-center mb-2">P(X ≥ {x}) = 1 − P(X ≤ {x - 1})</p>
                  <p>
                    Adding every bar from {x} to {n} works, but the shortcut is the <strong>complement rule</strong>: take the
                    probability of the opposite event ({x - 1} or fewer successes, which is {formatProbability(1 - probability)}) and
                    subtract it from 1, giving {formatProbability(probability)}.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Visualization panel */}
          <div className="bg-platinum p-4 rounded-lg">
            <h3 className="text-xl font-bold text-darkGrey mb-4">Distribution Visualization</h3>
            <div className="h-96">
              <div role="img" className="h-full" aria-label="Binomial distribution bar chart showing probability for each number of successes">
                <Bar ref={chartRef} data={chartData} options={chartOptions} />
              </div>
            </div>
            <p className="text-xs text-darkGrey opacity-70 mt-2 text-center">
              Amber bars are the outcomes included in {probabilityType === 'exact' ? `P(X = ${x})` : probabilityType === 'atMost' ? `P(X ≤ ${x})` : `P(X ≥ ${x})`} — all bar heights together add up to 1.
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowChartModal(true)}
                className="flex-1 bg-darkTeal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-darkTeal/80 transition-colors"
              >
                🔍 View Larger Chart
              </button>
              <button
                onClick={copyResultsToClipboard}
                className="flex-1 bg-darkTeal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-darkTeal/80 transition-colors"
              >
                {copied ? '✓ Copied!' : '📋 Copy Results'}
              </button>
              <button
                onClick={downloadChartPNG}
                className="flex-1 bg-darkTeal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-darkTeal/80 transition-colors"
              >
                🖼️ Download PNG
              </button>
            </div>

            {/* Full probability table, like the printed tables in textbooks */}
            <button
              onClick={() => { setShowTable(!showTable); announcePolite(showTable ? 'Probability table hidden.' : 'Probability table shown.'); }}
              className="mt-2 w-full bg-white border-2 border-darkGrey/20 text-darkGrey px-4 py-2 rounded-lg text-sm font-medium hover:bg-darkTeal/10 transition-colors"
              aria-expanded={showTable}
            >
              {showTable ? '▲ Hide Probability Table' : '▼ Show Probability Table'}
            </button>
            {showTable && (
              <div className="mt-2 max-h-64 overflow-y-auto bg-white rounded-lg border border-darkGrey/20">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-platinum">
                    <tr className="border-b-2 border-darkGrey/20">
                      <th scope="col" className="p-2 text-left">k</th>
                      <th scope="col" className="p-2 text-right">P(X = k)</th>
                      <th scope="col" className="p-2 text-right">P(X ≤ k)</th>
                      <th scope="col" className="p-2 text-right">P(X ≥ k)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributionTable.map(row => (
                      <tr key={row.k} className={`border-b border-darkGrey/10 ${row.k === x ? 'bg-accent/30 font-semibold' : ''}`}>
                        <td className="p-2">{row.k}{row.k === x ? ' ◀' : ''}</td>
                        <td className="p-2 text-right font-mono">{formatProbability(row.pmf)}</td>
                        <td className="p-2 text-right font-mono">{formatProbability(row.cdf)}</td>
                        <td className="p-2 text-right font-mono">{formatProbability(row.ccdf)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Plain-language interpretation of the current scenario */}
        <div className="mt-6 bg-accent/10 border-2 border-accentDark/40 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-darkGrey mb-2">📖 What Your Results Mean</h3>
          <ul className="text-sm text-darkGrey space-y-2">
            <li>
              <strong>In plain words:</strong> If you run {n} trials where each succeeds {(p * 100).toFixed(0)}% of the time,
              there is a {(probability * 100).toFixed(2)}% chance of seeing {typePhrase} success{x === 1 && probabilityType === 'exact' ? '' : 'es'}
              {oneInOdds && oneInOdds > 1 ? ` — roughly 1 in ${oneInOdds.toLocaleString()} ${oneInOdds >= 4 ? 'attempts' : ''}` : ''}.
            </li>
            <li>
              <strong>What to expect:</strong> On average you would get about {statistics.mean.toFixed(1)} successes,
              and most runs land between {typicalLow.toFixed(1)} and {typicalHigh.toFixed(1)} (μ ± σ).
            </li>
            <li>
              <strong>Is {x} unusual?</strong>{' '}
              {statistics.standardDeviation === 0
                ? 'With p at 0 or 1 there is no randomness — every run gives the same count.'
                : Math.abs(zScore) > 2
                  ? `Yes — ${x} is ${Math.abs(zScore).toFixed(1)} standard deviations ${zScore > 0 ? 'above' : 'below'} the mean. Seeing it should make you question whether p is really ${p.toFixed(2)} (this is the core idea behind hypothesis testing).`
                  : Math.abs(zScore) > 1
                    ? `Somewhat — ${x} is ${Math.abs(zScore).toFixed(1)} standard deviations ${zScore > 0 ? 'above' : 'below'} the mean: away from the center, but not surprising.`
                    : `No — ${x} sits within one standard deviation of the mean, right in the typical range.`}
            </li>
            <li>
              <strong>Shape:</strong>{' '}
              {p === 0.5
                ? 'With p = 0.50 the distribution is perfectly symmetric around the mean.'
                : p < 0.5
                  ? `With p = ${p.toFixed(2)} < 0.5 the distribution is right-skewed — outcomes bunch at low counts with a tail stretching toward higher ones.`
                  : `With p = ${p.toFixed(2)} > 0.5 the distribution is left-skewed — outcomes bunch at high counts with a tail stretching toward lower ones.`}
              {' '}{normalApproxOk
                ? `Since np = ${(n * p).toFixed(1)} and n(1−p) = ${(n * (1 - p)).toFixed(1)} are both ≥ 5, the bell-curve (normal) approximation would be reasonable here.`
                : `Since np = ${(n * p).toFixed(1)} or n(1−p) = ${(n * (1 - p)).toFixed(1)} is below 5, the bell-curve (normal) approximation would NOT be reliable here.`}
            </li>
          </ul>
        </div>

        {/* Preset scenarios */}
        <div className="mt-6 bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-darkGrey mb-2">Common Examples</h3>
          <p className="text-xs text-darkGrey/70 mb-2">
            Each example predicts what you should see — load one and check the prediction against the results and the chart shape.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {PRESET_SCENARIOS.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="p-3 text-left bg-platinum hover:bg-darkTeal/20 rounded transition-colors text-sm text-darkGrey"
                aria-label={`Apply ${preset.name} scenario`}
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-darkGrey/70 mt-1">{preset.description}</div>
                <div className="text-xs text-darkTeal mt-1 italic">What to expect: {preset.expectedOutcome}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Enlarged chart modal */}
        {showChartModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onKeyDown={handleChartModalKeyDown}>
            <div ref={chartModalTrapRef} role="dialog" aria-modal="true" aria-labelledby="binom-chart-modal-title" className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-5xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 id="binom-chart-modal-title" className="text-2xl font-bold text-darkGrey">
                  Binomial Distribution — n = {n}, p = {p.toFixed(2)}
                </h3>
                <button
                  onClick={() => setShowChartModal(false)}
                  className="text-darkGrey hover:text-red-500 text-2xl font-bold"
                  aria-label="Close enlarged chart"
                >
                  ×
                </button>
              </div>

              {/* How to read this chart */}
              <div className="mb-4 p-4 bg-blue-50 rounded">
                <h4 className="font-semibold text-darkGrey mb-2">
                  📊 How to Read This Chart:
                </h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-darkGrey">
                  <div>
                    <p>• <span className="font-semibold">Each Bar:</span> One possible outcome k — its height is P(X = k), the chance of exactly k successes</p>
                    <p>• <span className="font-semibold" style={{color: 'rgba(180, 83, 9, 1)'}}>Amber Bars:</span> The outcomes counted in your selected probability ({probabilityType === 'exact' ? `only k = ${x}` : probabilityType === 'atMost' ? `k = 0 through ${x}` : `k = ${x} through ${n}`})</p>
                  </div>
                  <div>
                    <p>• <span className="font-semibold">All bars together add up to 1</span> — some number of successes must happen</p>
                    <p>• <span className="font-semibold">The peak</span> sits at or next to the mean μ = {statistics.mean.toFixed(1)}; bars shrink as outcomes get further from it</p>
                  </div>
                </div>
              </div>

              {/* Enlarged chart */}
              <div className="h-96 mb-4">
                <div role="img" className="h-full" aria-label="Enlarged binomial distribution chart">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Key numbers strip */}
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold text-darkGrey mb-2">Key Numbers:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">{probabilityType === 'exact' ? `P(X = ${x})` : probabilityType === 'atMost' ? `P(X ≤ ${x})` : `P(X ≥ ${x})`}</p>
                    <p className="font-mono font-bold">{formatProbability(probability)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Mean (μ)</p>
                    <p className="font-mono font-bold">{statistics.mean.toFixed(4)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Variance (σ²)</p>
                    <p className="font-mono font-bold">{statistics.variance.toFixed(4)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Std Dev (σ)</p>
                    <p className="font-mono font-bold">{statistics.standardDeviation.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BinomialCalculator;