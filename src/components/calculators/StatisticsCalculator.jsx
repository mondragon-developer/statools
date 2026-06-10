/**
 * StatisticsCalculator.jsx
 * 
 * Comprehensive descriptive statistics calculator with multiple visualization options.
 * Calculates central tendency, dispersion measures, and identifies outliers.
 * Supports histogram, bar chart, and box plot visualizations.
 * 
 * Dependencies: Chart.js, react-chartjs-2
 * 
 * @component
 * @version 1.0.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import InfoIcon from "./InfoIcon";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useFocusTrap from "../../hooks/useFocusTrap";
import { announcePolite } from "../../utils/announce";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * Configuration constants
 */
const CHART_TYPES = {
  HISTOGRAM: 'histogram',
  BAR: 'bar',
  BOXPLOT: 'boxplot'
};

const CHART_COLORS = {
  normal: {
    background: 'rgba(78, 205, 196, 0.6)',
    border: 'rgba(78, 205, 196, 1)'
  },
  outlier: {
    background: 'rgba(255, 0, 0, 0.6)',
    border: 'rgba(255, 0, 0, 1)'
  }
};

// Box and border colors for each dataset row in the SVG box plot
const BOXPLOT_GROUP_COLORS = {
  A: { fill: 'rgba(78, 205, 196, 0.35)', border: '#0F766E' },
  B: { fill: 'rgba(245, 158, 11, 0.35)', border: '#B45309' }
};

const SAMPLE_DATASETS = [
  {
    name: "Normal Distribution (Heights in inches)",
    data: "68, 72, 75, 70, 74, 71, 69, 73, 76, 72, 70, 74, 71, 73, 75, 69, 72, 74, 71, 73",
    description: "Typical bell curve distribution",
    expectedOutcome: "Mean ≈ Median ≈ 72 → symmetric shape, low spread (Std Dev ≈ 2.2), no outliers"
  },
  {
    name: "Symmetric Distribution",
    data: "5, 5, 5, 4, 4, 6, 6, 3, 3, 7, 7, 2, 2, 8, 8, 1, 1, 9, 9, 5, 5, 5",
    description: "Balanced around center",
    expectedOutcome: "Mean = Median = Mode = 5 → all three centers agree when data is symmetric"
  },
  {
    name: "Right-Skewed (Income Data)",
    data: "1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8, 9, 15, 20, 25, 30",
    description: "Long tail to the right",
    expectedOutcome: "Mean (7.3) > Median (4) → a few large values pull the mean up; median describes the typical case better"
  },
  {
    name: "Left-Skewed (Exam Scores)",
    data: "98, 95, 94, 93, 92, 92, 91, 90, 90, 89, 88, 88, 87, 85, 84, 82, 78, 70, 55, 42",
    description: "Long tail to the left",
    expectedOutcome: "Mean (84.2) < Median (88.5) → a few low scores drag the mean down; most students did well"
  },
  {
    name: "Data with an Outlier (Reaction Times, ms)",
    data: "210, 215, 220, 225, 218, 222, 219, 217, 224, 221, 216, 223, 480",
    description: "One extreme value",
    expectedOutcome: "The 480 ms value falls beyond Q3 + 1.5×IQR → flagged as an outlier (shown red in the chart); notice how it inflates the mean and std dev but barely moves the median"
  }
];

const MAX_INPUT_COUNT = 1000;
const DEFAULT_BIN_COUNT = 5;
const MIN_BINS = 3;
const MAX_BINS = 15;

// Colors for dataset B when comparing two datasets
const COMPARE_COLORS = {
  background: 'rgba(245, 158, 11, 0.6)',
  border: 'rgba(217, 119, 6, 1)'
};

// Display order and labels for the measures table and clipboard export
const MEASURE_ROWS = [
  ['count', 'Count (n)'],
  ['min', 'Min'],
  ['max', 'Max'],
  ['range', 'Range'],
  ['mean', 'Mean'],
  ['median', 'Median'],
  ['mode', 'Mode'],
  ['stdDev', 'Std Dev'],
  ['variance', 'Variance'],
  ['q1', 'Q1 (25th percentile)'],
  ['q3', 'Q3 (75th percentile)'],
  ['iqr', 'IQR'],
  ['outlierMin', 'Lower Outlier Fence'],
  ['outlierMax', 'Upper Outlier Fence']
];

/**
 * Format a number for display on the box plot, trimming trailing zeros
 */
const formatStatValue = (v) => Number(v.toFixed(2)).toString();

/**
 * Generate evenly spaced "nice" axis tick values (steps of 1, 2, or 5 × 10^k)
 */
const niceTicks = (min, max, count = 7) => {
  const span = max - min;
  if (span <= 0) return [min];
  const rawStep = span / count;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;
  const step = (normalized >= 5 ? 5 : normalized >= 2 ? 2 : 1) * magnitude;
  const ticks = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-6; v += step) {
    ticks.push(Number(v.toFixed(10)));
  }
  return ticks;
};

/**
 * Clean horizontal box plot rendered as SVG.
 * Boxes sit on a shared number line with the five-number summary labeled
 * directly on the plot, a diamond marker for the mean, and red dots for outliers.
 *
 * @param {Array} groups - [{ label, stats, values, colors: {fill, border} }]
 * @param {boolean} showOutliers - Render outlier dots beyond the whiskers
 * @param {Object} svgRef - Optional ref to the <svg> element (used for PNG export)
 */
const BoxPlotSVG = ({ groups, showOutliers, svgRef }) => {
  const W = 860;
  const M_LEFT = 28, M_RIGHT = 28, M_TOP = 8;
  const ROW_H = 124, AXIS_H = 50;
  const H = M_TOP + groups.length * ROW_H + AXIS_H;
  const innerW = W - M_LEFT - M_RIGHT;

  // Whisker ends and outliers per group, plus the shared value domain
  let dMin = Infinity, dMax = -Infinity;
  const prepared = groups.map(g => {
    const { stats, values } = g;
    const outliers = values.filter(v => v < stats.outlierMin || v > stats.outlierMax);
    const inliers = values.filter(v => v >= stats.outlierMin && v <= stats.outlierMax);
    const whiskerMin = inliers.length > 0 ? Math.min(...inliers) : stats.min;
    const whiskerMax = inliers.length > 0 ? Math.max(...inliers) : stats.max;
    const lo = showOutliers && outliers.length > 0 ? Math.min(stats.min, whiskerMin) : whiskerMin;
    const hi = showOutliers && outliers.length > 0 ? Math.max(stats.max, whiskerMax) : whiskerMax;
    dMin = Math.min(dMin, lo);
    dMax = Math.max(dMax, hi);
    return { ...g, outliers, whiskerMin, whiskerMax };
  });

  if (prepared.length === 0 || !isFinite(dMin)) return null;
  if (dMax === dMin) { dMin -= 1; dMax += 1; }
  const pad = (dMax - dMin) * 0.07;
  dMin -= pad;
  dMax += pad;

  const x = (v) => M_LEFT + ((v - dMin) / (dMax - dMin)) * innerW;
  const ticks = niceTicks(dMin, dMax);
  const axisY = M_TOP + groups.length * ROW_H + 4;

  const ariaLabel = prepared.map(g => {
    const s = g.stats;
    return `${g.label}: minimum ${formatStatValue(s.min)}, first quartile ${formatStatValue(s.q1)}, median ${formatStatValue(s.median)}, third quartile ${formatStatValue(s.q3)}, maximum ${formatStatValue(s.max)}, mean ${formatStatValue(s.mean)}${g.outliers.length > 0 ? `, ${g.outliers.length} outlier${g.outliers.length === 1 ? '' : 's'}` : ''}`;
  }).join('. ');

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Box plot. ${ariaLabel}`}
    >
      {/* Vertical gridlines and axis tick labels */}
      {ticks.map(t => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={M_TOP} y2={axisY} stroke="#E5E7EB" strokeWidth="1" />
          <text x={x(t)} y={axisY + 20} textAnchor="middle" fontSize="13" fill="#4B5563">{formatStatValue(t)}</text>
        </g>
      ))}
      <line x1={M_LEFT} x2={W - M_RIGHT} y1={axisY} y2={axisY} stroke="#2A2A2A" strokeWidth="1.5" />
      <text x={W / 2} y={axisY + 40} textAnchor="middle" fontSize="13" fontWeight="600" fill="#2A2A2A">Values</text>

      {prepared.map((g, gi) => {
        const rowTop = M_TOP + gi * ROW_H;
        const cy = rowTop + 68;
        const boxH = 38;
        const boxTop = cy - boxH / 2;
        const boxBottom = cy + boxH / 2;
        const s = g.stats;
        return (
          <g key={g.label}>
            {/* Group name with color chip */}
            <rect x={M_LEFT} y={rowTop + 6} width="11" height="11" fill={g.colors.fill} stroke={g.colors.border} strokeWidth="1.5" />
            <text x={M_LEFT + 17} y={rowTop + 16} fontSize="13.5" fontWeight="700" fill="#2A2A2A">{g.label}</text>

            {/* Whiskers with end caps */}
            <line x1={x(g.whiskerMin)} x2={x(s.q1)} y1={cy} y2={cy} stroke="#4B5563" strokeWidth="2">
              <title>{`Lower whisker: ${formatStatValue(g.whiskerMin)} to Q1 ${formatStatValue(s.q1)}`}</title>
            </line>
            <line x1={x(s.q3)} x2={x(g.whiskerMax)} y1={cy} y2={cy} stroke="#4B5563" strokeWidth="2">
              <title>{`Upper whisker: Q3 ${formatStatValue(s.q3)} to ${formatStatValue(g.whiskerMax)}`}</title>
            </line>
            <line x1={x(g.whiskerMin)} x2={x(g.whiskerMin)} y1={cy - 11} y2={cy + 11} stroke="#4B5563" strokeWidth="2" />
            <line x1={x(g.whiskerMax)} x2={x(g.whiskerMax)} y1={cy - 11} y2={cy + 11} stroke="#4B5563" strokeWidth="2" />

            {/* IQR box */}
            <rect
              x={x(s.q1)}
              y={boxTop}
              width={Math.max(x(s.q3) - x(s.q1), 2)}
              height={boxH}
              fill={g.colors.fill}
              stroke={g.colors.border}
              strokeWidth="2.5"
              rx="3"
            >
              <title>{`${g.label} — middle 50% of the data: Q1 ${formatStatValue(s.q1)} to Q3 ${formatStatValue(s.q3)} (IQR ${formatStatValue(s.iqr)})`}</title>
            </rect>

            {/* Median line */}
            <line x1={x(s.median)} x2={x(s.median)} y1={boxTop - 5} y2={boxBottom + 5} stroke="#2A2A2A" strokeWidth="3.5">
              <title>{`Median: ${formatStatValue(s.median)}`}</title>
            </line>

            {/* Mean diamond */}
            <polygon
              points={`${x(s.mean)},${cy - 8} ${x(s.mean) + 8},${cy} ${x(s.mean)},${cy + 8} ${x(s.mean) - 8},${cy}`}
              fill="#FFFFFF"
              stroke="#2A2A2A"
              strokeWidth="2"
            >
              <title>{`Mean: ${formatStatValue(s.mean)}`}</title>
            </polygon>

            {/* Direct value labels */}
            <text x={x(s.median)} y={boxTop - 11} textAnchor="middle" fontSize="13" fontWeight="700" fill="#2A2A2A">{`Median ${formatStatValue(s.median)}`}</text>
            <text x={x(s.q1)} y={boxBottom + 19} textAnchor="middle" fontSize="12.5" fill="#374151">{`Q1 ${formatStatValue(s.q1)}`}</text>
            <text x={x(s.q3)} y={boxBottom + 35} textAnchor="middle" fontSize="12.5" fill="#374151">{`Q3 ${formatStatValue(s.q3)}`}</text>
            <text x={x(g.whiskerMin) - 7} y={cy + 4.5} textAnchor="end" fontSize="12.5" fill="#374151">{formatStatValue(g.whiskerMin)}</text>
            <text x={x(g.whiskerMax) + 7} y={cy + 4.5} textAnchor="start" fontSize="12.5" fill="#374151">{formatStatValue(g.whiskerMax)}</text>

            {/* Outliers */}
            {showOutliers && g.outliers.map((v, i) => (
              <circle key={`${v}-${i}`} cx={x(v)} cy={cy + ((i % 3) - 1) * 10} r="5.5" fill="rgba(220, 38, 38, 0.85)" stroke="#991B1B" strokeWidth="1.5">
                <title>{`Outlier: ${formatStatValue(v)} (beyond the 1.5×IQR fence)`}</title>
              </circle>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Main StatisticsCalculator component
 * Handles statistical calculations and data visualization
 */
const StatisticsCalculator = () => {
  useDocumentTitle('Basic Statistics Calculator');

  // State management
  const [input, setInput] = useState("");
  const [result, setResult] = useState({});
  const [chartType, setChartType] = useState(CHART_TYPES.HISTOGRAM);
  const [binCount, setBinCount] = useState(DEFAULT_BIN_COUNT);
  const [classWidth, setClassWidth] = useState(10);
  const [minBoundary, setMinBoundary] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [frequencyTable, setFrequencyTable] = useState([]);
  const [showOutliers, setShowOutliers] = useState(true);
  const [showChartModal, setShowChartModal] = useState(false);
  const [error, setError] = useState("");
  const [rawStats, setRawStats] = useState(null);
  const [inputB, setInputB] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [resultB, setResultB] = useState({});
  const [rawStatsB, setRawStatsB] = useState(null);
  const [varianceMode, setVarianceMode] = useState('sample');
  const [draggingTarget, setDraggingTarget] = useState(null);
  const [copied, setCopied] = useState(false);
  // Snapshot of the values used in the last calculation, so the box plot
  // stays consistent while the user edits the textareas
  const [calcNumbers, setCalcNumbers] = useState([]);
  const [calcNumbersB, setCalcNumbersB] = useState([]);
  const chartRef = useRef(null);
  const boxPlotRef = useRef(null);
  const fileInputRef = useRef(null);
  const fileInputBRef = useRef(null);

  const chartModalTrapRef = useFocusTrap(showChartModal);

  const handleChartModalKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setShowChartModal(false);
  }, []);

  /**
   * Update visualizations when parameters change
   * Triggered by changes to histogram configuration
   */
  useEffect(() => {
    if (rawStats) {
      const numbers = parseInputNumbers();
      if (numbers.length > 0) {
        const numbersB = compareMode && rawStatsB ? parseInputNumbersB() : [];
        generateChartData(numbers, rawStats.outlierMin, rawStats.outlierMax, numbersB);
      }
    }
  }, [binCount, classWidth, minBoundary, chartType, rawStats, rawStatsB, compareMode]);

  /**
   * Recalculate measures when switching between sample and population formulas
   */
  useEffect(() => {
    if (!rawStats) return;
    const numbers = parseInputNumbers();
    if (numbers.length > 0) {
      const stats = calculateAllStatistics(numbers);
      setRawStats(stats);
      setResult(formatResult(stats));
    }
    if (compareMode && rawStatsB) {
      const numbersB = parseInputNumbersB();
      if (numbersB.length > 0) {
        const statsB = calculateAllStatistics(numbersB);
        setRawStatsB(statsB);
        setResultB(formatResult(statsB));
      }
    }
  }, [varianceMode]);

  /**
   * Parse input string into array of numbers
   * @returns {number[]} Array of parsed numbers
   */
  const extractNumbers = (text) => {
    return text
      .trim()
      .split(/[\s,;]+/)
      .filter(token => token !== "")
      .map(Number)
      .filter(n => !isNaN(n));
  };

  const parseInputNumbers = () => extractNumbers(input);
  const parseInputNumbersB = () => extractNumbers(inputB);

  /**
   * Load numbers from a CSV or text file into the chosen dataset.
   * Non-numeric tokens (e.g., header rows) are skipped automatically.
   */
  const loadFileIntoDataset = (file, target) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const numbers = extractNumbers(String(e.target.result));
      if (numbers.length === 0) {
        setError(`No numbers found in "${file.name}". Make sure the file contains numeric values.`);
        return;
      }
      const truncated = numbers.length > MAX_INPUT_COUNT;
      const values = numbers.slice(0, MAX_INPUT_COUNT);
      const text = values.join(", ");
      if (target === 'B') {
        setInputB(text);
      } else {
        setInput(text);
      }
      setError("");
      announcePolite(
        `Loaded ${values.length} values from ${file.name} into dataset ${target}.` +
        (truncated ? ` File had more values; only the first ${MAX_INPUT_COUNT} were kept.` : '')
      );
    };
    reader.onerror = () => setError(`Could not read "${file.name}".`);
    reader.readAsText(file);
  };

  const handleDrop = (e, target) => {
    e.preventDefault();
    setDraggingTarget(null);
    loadFileIntoDataset(e.dataTransfer.files?.[0], target);
  };

  const handleDragOver = (e, target) => {
    e.preventDefault();
    setDraggingTarget(target);
  };

  /**
   * Copy the measures table to the clipboard as tab-separated text
   * (pastes cleanly into Excel, Google Sheets, and Word)
   */
  const copyResultsToClipboard = async () => {
    const comparing = compareMode && resultB.mean !== undefined;
    const header = comparing ? ['Measure', 'Dataset A', 'Dataset B'] : ['Measure', 'Value'];
    const stdDevLabel = varianceMode === 'population' ? 'Std Dev (σ, population)' : 'Std Dev (s, sample)';
    const rows = MEASURE_ROWS.map(([key, label]) => {
      const displayLabel = key === 'stdDev' ? stdDevLabel : label;
      return comparing
        ? [displayLabel, result[key], resultB[key]]
        : [displayLabel, result[key]];
    });
    const text = [header, ...rows].map(row => row.join('\t')).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      announcePolite('Results copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not access the clipboard. Try copying manually.');
    }
  };

  /**
   * Download the current chart as a PNG image
   */
  const downloadChartPNG = () => {
    const fileName = `statistics-${chartType}${compareMode && rawStatsB ? '-comparison' : ''}.png`;

    const downloadCanvas = (canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = fileName;
      link.click();
      announcePolite('Chart image downloaded.');
    };

    // The box plot is an SVG — rasterize it at 2x for a crisp image
    if (chartType === CHART_TYPES.BOXPLOT) {
      const svg = boxPlotRef.current;
      if (!svg) return;
      const width = Number(svg.getAttribute('width'));
      const height = Number(svg.getAttribute('height'));
      const xml = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * 2;
        canvas.height = height * 2;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        downloadCanvas(canvas);
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
      return;
    }

    const chart = chartRef.current;
    if (!chart) return;
    // Composite onto a white background so the PNG is readable everywhere
    const source = chart.canvas;
    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0);
    downloadCanvas(canvas);
  };

  /**
   * Main calculation function
   * Computes all statistical measures and initiates visualization
   */
  const calculateStatistics = () => {
    const numbers = parseInputNumbers();
    setError("");

    // Input validation
    if (numbers.length === 0) {
      setError("Please enter valid numbers separated by commas, spaces, or new lines.");
      return;
    }

    if (numbers.length > MAX_INPUT_COUNT) {
      setError(`Please enter no more than ${MAX_INPUT_COUNT} numbers.`);
      return;
    }

    // Validate dataset B when comparison mode is active
    let numbersB = [];
    if (compareMode) {
      numbersB = parseInputNumbersB();
      if (numbersB.length === 0) {
        setError("Dataset B is empty or has no valid numbers. Add data or turn off comparison.");
        return;
      }
      if (numbersB.length > MAX_INPUT_COUNT) {
        setError(`Dataset B exceeds the maximum of ${MAX_INPUT_COUNT} numbers.`);
        return;
      }
    }

    // Calculate statistical measures
    const stats = calculateAllStatistics(numbers);
    setRawStats(stats);
    setResult(formatResult(stats));

    let statsB = null;
    if (compareMode) {
      statsB = calculateAllStatistics(numbersB);
      setRawStatsB(statsB);
      setResultB(formatResult(statsB));
    } else {
      setRawStatsB(null);
      setResultB({});
    }

    // Set intelligent defaults for histogram, covering both datasets when comparing
    const combinedMin = statsB ? Math.min(stats.min, statsB.min) : stats.min;
    const combinedMax = statsB ? Math.max(stats.max, statsB.max) : stats.max;
    const suggestedMin = Math.floor(combinedMin / 10) * 10;
    setMinBoundary(suggestedMin);

    const suggestedWidth = Math.ceil((combinedMax - suggestedMin) / binCount) || 1;
    setClassWidth(suggestedWidth);

    // Generate visualization
    setCalcNumbers(numbers);
    setCalcNumbersB(compareMode ? numbersB : []);
    generateChartData(numbers, stats.outlierMin, stats.outlierMax, numbersB);
    setShowChart(true);
    const announcement = statsB
      ? `Compared two datasets. Dataset A: ${numbers.length} values, mean ${stats.mean.toFixed(2)}. Dataset B: ${numbersB.length} values, mean ${statsB.mean.toFixed(2)}.`
      : `Calculated statistics for ${numbers.length} values. Mean: ${stats.mean.toFixed(2)}, Median: ${stats.median.toFixed(2)}, Standard deviation: ${stats.stdDev.toFixed(2)}.`;
    announcePolite(announcement);
  };

  /**
   * Calculate all statistical measures
   * @param {number[]} numbers - Input data array
   * @returns {Object} Object containing all statistical measures
   */
  const calculateAllStatistics = (numbers) => {
    const sorted = [...numbers].sort((a, b) => a - b);
    const n = numbers.length;
    
    // Basic measures
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    
    // Median calculation
    const median = n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];
    
    // Variance and standard deviation (sample uses n-1, population uses n)
    const divisor = varianceMode === 'population' ? n : n - 1;
    const variance = divisor > 0
      ? numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / divisor
      : 0;
    const stdDev = Math.sqrt(variance);
    
    // Mode calculation (can be multimodal)
    const freqMap = {};
    numbers.forEach(num => {
      freqMap[num] = (freqMap[num] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(freqMap));
    let modeValues = Object.keys(freqMap).filter(key => freqMap[key] === maxFreq);
    if (modeValues.length === Object.keys(freqMap).length) {
      modeValues = ["No mode"];
    } else {
      modeValues = modeValues.map(v => Number(v));
    }

    // Quartiles
    const q1 = calculatePercentile(sorted, 0.25);
    const q3 = calculatePercentile(sorted, 0.75);
    const iqr = q3 - q1;
    
    // Outlier boundaries (1.5 * IQR method)
    const outlierMin = q1 - 1.5 * iqr;
    const outlierMax = q3 + 1.5 * iqr;
    const outlierCount = numbers.filter(num => num < outlierMin || num > outlierMax).length;

    return {
      min, max, range, mean, median, mode: modeValues,
      stdDev, variance, q1, q3, iqr, outlierMin, outlierMax,
      count: n, outlierCount
    };
  };

  /**
   * Calculate percentile using linear interpolation
   * @param {number[]} sortedNumbers - Sorted array of numbers
   * @param {number} percentile - Percentile value (0-1)
   * @returns {number} Calculated percentile value
   */
  const calculatePercentile = (sortedNumbers, percentile) => {
    const index = percentile * (sortedNumbers.length - 1);
    const lower = Math.floor(index);
    const upper = lower + 1;
    const weight = index % 1;

    if (upper >= sortedNumbers.length) return sortedNumbers[lower];
    return sortedNumbers[lower] * (1 - weight) + sortedNumbers[upper] * weight;
  };

  /**
   * Format statistical results to 4 decimal places
   * @param {Object} stats - Raw statistical values
   * @returns {Object} Formatted values
   */
  const formatResult = (stats) => {
    const formatted = {};
    Object.keys(stats).forEach(key => {
      if (key === 'count' || key === 'outlierCount') {
        formatted[key] = String(stats[key]);
      } else if (typeof stats[key] === 'number') {
        formatted[key] = stats[key].toFixed(4);
      } else if (Array.isArray(stats[key])) {
        formatted[key] = stats[key].map(val =>
          typeof val === 'number' ? val.toFixed(4) : val
        ).join(', ');
      } else {
        formatted[key] = stats[key];
      }
    });
    return formatted;
  };

  /**
   * Generate appropriate chart data based on selected type
   * @param {number[]} numbers - Input data
   * @param {number} outlierMin - Lower outlier boundary
   * @param {number} outlierMax - Upper outlier boundary
   */
  const generateChartData = (numbers, outlierMin, outlierMax, numbersB = []) => {
    switch (chartType) {
      case CHART_TYPES.HISTOGRAM:
        generateHistogram(numbers, outlierMin, outlierMax, numbersB);
        break;
      case CHART_TYPES.BAR:
        generateBarChart(numbers, outlierMin, outlierMax, numbersB);
        break;
      // Box plots are rendered directly from the stats by BoxPlotSVG — no Chart.js data needed
    }
  };

  /**
   * Generate histogram data with frequency distribution
   * Creates bins and calculates frequencies for each class interval
   */
  const generateHistogram = (numbers, outlierMin, outlierMax, numbersB = []) => {
    const comparing = numbersB.length > 0;

    // Distribute a dataset into the shared class intervals
    const distributeIntoBins = (data) => {
      const bins = new Array(binCount).fill(0);
      data.forEach(num => {
        const binIndex = Math.floor((num - minBoundary) / classWidth);
        if (binIndex >= 0 && binIndex < binCount) {
          bins[binIndex]++;
        } else if (binIndex >= binCount) {
          bins[binCount - 1]++; // Place in last bin if beyond range
        }
      });
      return bins;
    };

    const bins = distributeIntoBins(numbers);
    const binsB = comparing ? distributeIntoBins(numbersB) : [];
    const binLabels = [];
    const backgroundColors = [];
    const borderColors = [];
    const tableData = [];
    const totalCount = numbers.length;
    let cumulativeFreq = 0;

    // Generate labels and frequency table
    for (let i = 0; i < binCount; i++) {
      const lowerBound = minBoundary + i * classWidth;
      const upperBound = lowerBound + classWidth;
      const midpoint = (lowerBound + upperBound) / 2;
      const frequency = bins[i];
      const relativeFreq = (frequency / totalCount) * 100;
      cumulativeFreq += relativeFreq;

      binLabels.push(`${lowerBound}-${upperBound}`);

      // Color coding based on outlier status
      const isOutlier = midpoint < outlierMin || midpoint > outlierMax;
      backgroundColors.push(isOutlier ? CHART_COLORS.outlier.background : CHART_COLORS.normal.background);
      borderColors.push(isOutlier ? CHART_COLORS.outlier.border : CHART_COLORS.normal.border);

      // Build frequency table
      tableData.push({
        class: `${lowerBound} - ${upperBound}`,
        frequency: frequency,
        relativeFreq: relativeFreq.toFixed(2),
        cumulativeFreq: cumulativeFreq.toFixed(2),
        midpoint: midpoint.toFixed(2)
      });
    }

    setFrequencyTable(comparing ? [] : tableData);

    if (comparing) {
      // Grouped bars with one solid color per dataset (outlier coloring is per-dataset, so it is skipped here)
      setChartData({
        labels: binLabels,
        datasets: [
          {
            label: `Dataset A (n=${numbers.length})`,
            data: bins,
            backgroundColor: CHART_COLORS.normal.background,
            borderColor: CHART_COLORS.normal.border,
            borderWidth: 1
          },
          {
            label: `Dataset B (n=${numbersB.length})`,
            data: binsB,
            backgroundColor: COMPARE_COLORS.background,
            borderColor: COMPARE_COLORS.border,
            borderWidth: 1
          }
        ]
      });
      return;
    }

    setChartData({
      labels: binLabels,
      datasets: [{
        label: 'Frequency',
        data: bins,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
        barPercentage: 1.0,
        categoryPercentage: 1.0
      }]
    });
  };

  /**
   * Generate bar chart for discrete values
   * Shows frequency of each unique value
   */
  const generateBarChart = (numbers, outlierMin, outlierMax, numbersB = []) => {
    const comparing = numbersB.length > 0;

    // Count frequencies
    const countFrequencies = (data) => {
      const map = {};
      data.forEach(num => {
        map[num] = (map[num] || 0) + 1;
      });
      return map;
    };

    const frequencyMap = countFrequencies(numbers);
    const frequencyMapB = comparing ? countFrequencies(numbersB) : {};

    // Union of values across both datasets so the bars share one axis
    const uniqueValues = [...new Set([
      ...Object.keys(frequencyMap),
      ...Object.keys(frequencyMapB)
    ])].map(Number).sort((a, b) => a - b);

    if (comparing) {
      setChartData({
        labels: uniqueValues.map(val => val.toString()),
        datasets: [
          {
            label: `Dataset A (n=${numbers.length})`,
            data: uniqueValues.map(val => frequencyMap[val] || 0),
            backgroundColor: CHART_COLORS.normal.background,
            borderColor: CHART_COLORS.normal.border,
            borderWidth: 2
          },
          {
            label: `Dataset B (n=${numbersB.length})`,
            data: uniqueValues.map(val => frequencyMapB[val] || 0),
            backgroundColor: COMPARE_COLORS.background,
            borderColor: COMPARE_COLORS.border,
            borderWidth: 2
          }
        ]
      });
      return;
    }

    const frequencies = uniqueValues.map(val => frequencyMap[val]);

    // Color based on outlier status
    const backgroundColors = uniqueValues.map(val =>
      val < outlierMin || val > outlierMax
        ? CHART_COLORS.outlier.background
        : CHART_COLORS.normal.background
    );

    const borderColors = uniqueValues.map(val =>
      val < outlierMin || val > outlierMax
        ? CHART_COLORS.outlier.border
        : CHART_COLORS.normal.border
    );

    setChartData({
      labels: uniqueValues.map(val => val.toString()),
      datasets: [{
        label: 'Frequency',
        data: frequencies,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2
      }]
    });
  };

  /**
   * Generate box plot visualization
   * Creates a visually distinct box plot with proper rectangular box
   */
  /**
   * Dataset rows for the SVG box plot, built from the last calculation
   */
  const boxPlotGroups = useMemo(() => {
    if (!rawStats || calcNumbers.length === 0) return [];
    const comparing = compareMode && rawStatsB && calcNumbersB.length > 0;
    const groups = [{
      label: comparing ? 'Dataset A' : 'Your Data',
      stats: rawStats,
      values: calcNumbers,
      colors: BOXPLOT_GROUP_COLORS.A
    }];
    if (comparing) {
      groups.push({
        label: 'Dataset B',
        stats: rawStatsB,
        values: calcNumbersB,
        colors: BOXPLOT_GROUP_COLORS.B
      });
    }
    return groups;
  }, [rawStats, rawStatsB, compareMode, calcNumbers, calcNumbersB]);

  /**
   * Chart configuration options
   */
  const chartOptions = useMemo(() => {
    const comparing = compareMode && !!rawStatsB;
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: comparing,
          position: 'bottom'
        },
        title: {
          display: true,
          text: chartType === CHART_TYPES.HISTOGRAM
            ? (comparing ? 'Frequency Histogram — Dataset A vs B' : 'Frequency Histogram')
            : (comparing ? 'Value Frequencies — Dataset A vs B' : 'Value Frequencies'),
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            title: (context) => chartType === CHART_TYPES.HISTOGRAM
              ? `Class: ${context[0].label}`
              : `Value: ${context[0].label}`,
            label: (context) => `Frequency: ${context.parsed.y}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frequency'
          }
        },
        x: {
          title: {
            display: true,
            text: chartType === CHART_TYPES.HISTOGRAM ? 'Classes' : 'Values'
          }
        }
      }
    };
  }, [chartType, compareMode, rawStatsB]);

  /**
   * Generate slider gradient style
   */
  const getSliderStyle = (value, min, max) => ({
    background: `linear-gradient(to right, #0F766E 0%, #0F766E ${(value - min) / (max - min) * 100}%, #e0e0e0 ${(value - min) / (max - min) * 100}%, #e0e0e0 100%)`
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-darkGrey mb-2">
          Basic Statistics Calculator
        </h2>
        
        {/* Educational explanation section */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-darkGrey mb-2">
            📊 Understanding Descriptive Statistics
          </h3>
          <p className="text-darkGrey mb-3">
            Think of descriptive statistics as your data's personality profile! Just like describing a person's height, 
            mood, and quirks, we describe data's center, spread, and unusual values.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm text-darkGrey">
            <div>
              <h4 className="font-semibold mb-1">📍 Center Measures:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Mean:</strong> The balance point</li>
                <li><strong>Median:</strong> The middle value</li>
                <li><strong>Mode:</strong> Most frequent value</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">📏 Spread Measures:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Range:</strong> Total spread</li>
                <li><strong>IQR:</strong> Middle 50% spread</li>
                <li><strong>Std Dev:</strong> Typical distance from mean</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">🎯 Position Measures:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Quartiles:</strong> 25%, 50%, 75% marks</li>
                <li><strong>Outliers:</strong> Unusual values</li>
                <li><strong>Min/Max:</strong> Extreme values</li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm text-darkGrey mt-3 italic">
            💡 <strong>Box Plot Insight:</strong> The box plot is like an X-ray of your data - it shows the skeleton
            (quartiles), the heart (median), and any unusual symptoms (outliers) all in one view!
          </p>

          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200 text-sm text-darkGrey">
            <h4 className="font-semibold mb-2">✏️ Worked Example: 2, 4, 4, 6, 9</h4>
            <ul className="space-y-1">
              <li><strong>Mean</strong> = (2 + 4 + 4 + 6 + 9) ÷ 5 = <span className="font-mono">5</span> — the balance point of the data.</li>
              <li><strong>Median</strong> = the middle of 2, 4, <u>4</u>, 6, 9 = <span className="font-mono">4</span> — half the values are below, half above.</li>
              <li><strong>Mode</strong> = <span className="font-mono">4</span> — it appears twice, more than any other value.</li>
              <li><strong>Range</strong> = 9 − 2 = <span className="font-mono">7</span> — the full spread from smallest to largest.</li>
              <li><strong>Sample Std Dev</strong> ≈ <span className="font-mono">2.65</span> — on average, values sit about 2.65 units from the mean.</li>
            </ul>
            <p className="mt-2 italic">
              Notice the mean (5) is higher than the median (4): the single large value 9 pulls the mean toward it.
              That gap is your first clue that data is <strong>skewed</strong>. Try this dataset yourself, then add a
              25 to the end and watch the mean jump while the median barely moves!
            </p>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input and Controls Panel */}
          <div className="space-y-4">
            <div
              onDrop={(e) => handleDrop(e, 'A')}
              onDragOver={(e) => handleDragOver(e, 'A')}
              onDragLeave={() => setDraggingTarget(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="stats-data-input" className="text-darkGrey font-medium">
                  {compareMode ? 'Dataset A' : 'Your Data'}
                  <InfoIcon info="Paste up to 1000 numbers. You can separate them with commas, spaces, semicolons, or new lines — great for pasting straight from Excel or Google Sheets. You can also drop a CSV or text file here." />
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm px-3 py-1 bg-darkTeal text-white rounded-lg hover:bg-darkTeal/80 transition-colors"
                >
                  📁 Upload CSV/TXT
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt,text/csv,text/plain"
                  className="sr-only"
                  aria-label="Upload a CSV or text file for dataset A"
                  onChange={(e) => { loadFileIntoDataset(e.target.files?.[0], 'A'); e.target.value = ''; }}
                />
              </div>
              <textarea
                id="stats-data-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter up to 1000 numbers separated by commas, spaces, or new lines (e.g., 12, 15.5, 18, 22) — or drop a CSV file here"
                className={`w-full p-4 border-2 rounded-lg focus:border-darkTeal outline-none transition-colors ${draggingTarget === 'A' ? 'border-darkTeal bg-darkTeal/10 border-dashed' : 'border-darkGrey/20'}`}
                rows="4"
                aria-invalid={!!error}
                aria-describedby="stats-error stats-value-count"
              />
              <p id="stats-value-count" className="text-sm text-darkGrey/70 mt-1" aria-live="polite">
                {input.trim()
                  ? `${parseInputNumbers().length} valid number${parseInputNumbers().length === 1 ? '' : 's'} detected (max ${MAX_INPUT_COUNT})`
                  : `Tip: paste a column of numbers from a spreadsheet, or drag a .csv file onto the box — header rows are skipped automatically.`}
              </p>
            </div>

            {/* Comparison mode toggle and Dataset B input */}
            <div className="bg-white border-2 border-darkGrey/20 p-3 rounded-lg">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={compareMode}
                  onChange={(e) => {
                    setCompareMode(e.target.checked);
                    if (!e.target.checked) {
                      setRawStatsB(null);
                      setResultB({});
                    }
                    announcePolite(e.target.checked ? 'Comparison mode on. A second dataset input is now available.' : 'Comparison mode off.');
                  }}
                  className="w-4 h-4 text-darkTeal rounded focus:ring-darkTeal"
                />
                <span className="text-darkGrey font-medium">Compare with a second dataset</span>
                <InfoIcon info="Analyze two datasets side by side — for example, test scores from Class A vs Class B. Both appear together in the charts and the results table." />
              </label>

              {compareMode && (
                <div
                  className="mt-3"
                  onDrop={(e) => handleDrop(e, 'B')}
                  onDragOver={(e) => handleDragOver(e, 'B')}
                  onDragLeave={() => setDraggingTarget(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="stats-data-input-b" className="text-darkGrey font-medium">
                      Dataset B
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputBRef.current?.click()}
                      className="text-sm px-3 py-1 bg-darkTeal text-white rounded-lg hover:bg-darkTeal/80 transition-colors"
                    >
                      📁 Upload CSV/TXT
                    </button>
                    <input
                      ref={fileInputBRef}
                      type="file"
                      accept=".csv,.txt,text/csv,text/plain"
                      className="sr-only"
                      aria-label="Upload a CSV or text file for dataset B"
                      onChange={(e) => { loadFileIntoDataset(e.target.files?.[0], 'B'); e.target.value = ''; }}
                    />
                  </div>
                  <textarea
                    id="stats-data-input-b"
                    value={inputB}
                    onChange={(e) => setInputB(e.target.value)}
                    placeholder="Enter the second dataset — or drop a CSV file here"
                    className={`w-full p-4 border-2 rounded-lg focus:border-darkTeal outline-none transition-colors ${draggingTarget === 'B' ? 'border-darkTeal bg-darkTeal/10 border-dashed' : 'border-darkGrey/20'}`}
                    rows="3"
                    aria-describedby="stats-value-count-b"
                  />
                  <p id="stats-value-count-b" className="text-sm text-darkGrey/70 mt-1" aria-live="polite">
                    {inputB.trim()
                      ? `${parseInputNumbersB().length} valid number${parseInputNumbersB().length === 1 ? '' : 's'} detected (max ${MAX_INPUT_COUNT})`
                      : 'Dataset B is shown in amber in the charts.'}
                  </p>
                </div>
              )}
            </div>

            {/* Sample vs population standard deviation */}
            <fieldset className="bg-white border-2 border-darkGrey/20 p-3 rounded-lg">
              <legend className="text-darkGrey font-medium px-1 flex items-center">
                Standard Deviation Formula
                <InfoIcon info="Use Sample (s) when your data is a subset drawn from a larger group — it divides by n−1 to correct for the underestimate. Use Population (σ) when your data is the entire group you care about — it divides by N." />
              </legend>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-1">
                <label className="flex items-center space-x-2 cursor-pointer text-sm text-darkGrey">
                  <input
                    type="radio"
                    name="variance-mode"
                    value="sample"
                    checked={varianceMode === 'sample'}
                    onChange={() => setVarianceMode('sample')}
                    className="w-4 h-4 text-darkTeal focus:ring-darkTeal"
                  />
                  <span><strong>Sample (s)</strong> — divides by n−1; for data drawn from a larger group</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-sm text-darkGrey">
                  <input
                    type="radio"
                    name="variance-mode"
                    value="population"
                    checked={varianceMode === 'population'}
                    onChange={() => setVarianceMode('population')}
                    className="w-4 h-4 text-darkTeal focus:ring-darkTeal"
                  />
                  <span><strong>Population (σ)</strong> — divides by N; for complete groups</span>
                </label>
              </div>
            </fieldset>
            
            {/* Visualization Options */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-lg font-bold text-darkGrey mb-3">Visualization Options</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="stats-chart-type" className="block text-darkGrey font-medium mb-2">Chart Type</label>
                  <select
                    id="stats-chart-type"
                    value={chartType}
                    onChange={(e) => { setChartType(e.target.value); announcePolite('Chart type changed to ' + e.target.value); }}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                  >
                    <option value={CHART_TYPES.HISTOGRAM}>Histogram</option>
                    <option value={CHART_TYPES.BAR}>Bar Chart</option>
                    <option value={CHART_TYPES.BOXPLOT}>Box Plot</option>
                  </select>
                </div>
                
                {/* Histogram-specific controls */}
                {chartType === CHART_TYPES.HISTOGRAM && result.mean !== undefined && (
                  <>
                    <div>
                      <label htmlFor="stats-bin-count" className="flex items-center text-darkGrey font-medium mb-2">
                        Number of Classes: {binCount}
                        <InfoIcon info="The number of intervals to group your data into" />
                      </label>
                      <input
                        id="stats-bin-count"
                        type="range"
                        min={MIN_BINS}
                        max={MAX_BINS}
                        value={binCount}
                        onChange={(e) => setBinCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={getSliderStyle(binCount, MIN_BINS, MAX_BINS)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="stats-min-boundary" className="block text-darkGrey font-medium mb-2">
                        Lower Boundary of First Class
                      </label>
                      <input
                        id="stats-min-boundary"
                        type="number"
                        value={minBoundary}
                        onChange={(e) => setMinBoundary(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="stats-class-width" className="block text-darkGrey font-medium mb-2">
                        Class Width
                      </label>
                      <input
                        id="stats-class-width"
                        type="number"
                        value={classWidth}
                        onChange={(e) => setClassWidth(parseFloat(e.target.value) || 1)}
                        className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                      />
                    </div>
                  </>
                )}
                {/* Box Plot specific controls */}
                {chartType === CHART_TYPES.BOXPLOT && (
                  <div className="mt-3 p-3 bg-accent/10 rounded">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOutliers}
                        onChange={(e) => setShowOutliers(e.target.checked)}
                        className="w-4 h-4 text-darkTeal rounded focus:ring-darkTeal"
                      />
                      <span className="text-darkGrey font-medium">Show Outliers</span>
                      <InfoIcon info="Display values beyond 1.5×IQR as outliers" />
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={calculateStatistics}
              className="w-full bg-accent border-2 border-darkGrey text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all"
            >
              Calculate Statistics
            </button>

            <p id="stats-error" className="text-red-500 text-sm mt-2" role="status">{error || ''}</p>

            {/* Sample Data Sets */}
            <div className="bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-darkGrey mb-2">Example Data Sets</h3>
              <p className="text-xs text-darkGrey/70 mb-2">
                Each example predicts what you should see — load one, press Calculate, and check the prediction against the results.
              </p>
              <div className="space-y-2">
                {SAMPLE_DATASETS.map((dataset, index) => (
                  <button
                    key={index}
                    onClick={() => { setInput(dataset.data); announcePolite('Loaded sample: ' + dataset.name); }}
                    className="w-full text-left text-sm p-2 bg-platinum hover:bg-darkTeal/20 rounded transition-colors"
                  >
                    <div className="font-medium">{dataset.name}</div>
                    <div className="text-xs text-darkGrey/70">{dataset.description}</div>
                    <div className="text-xs text-darkTeal mt-1 italic">What to expect: {dataset.expectedOutcome}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results and Visualization Panel */}
          <div className="space-y-4">
            {result.mean !== undefined && (
              <>
                {/* Statistical Measures — side-by-side table when comparing, grid otherwise */}
                {compareMode && resultB.mean !== undefined ? (
                <div className="bg-platinum p-4 rounded-lg overflow-x-auto">
                  <h3 className="text-lg font-bold text-darkGrey mb-3">Statistical Measures — A vs B</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-darkGrey/20">
                        <th scope="col" className="text-left p-2">Measure</th>
                        <th scope="col" className="text-right p-2">
                          <span className="inline-block w-3 h-3 rounded mr-1 align-middle" style={{backgroundColor: 'rgba(78, 205, 196, 1)'}}></span>
                          Dataset A
                        </th>
                        <th scope="col" className="text-right p-2">
                          <span className="inline-block w-3 h-3 rounded mr-1 align-middle" style={{backgroundColor: 'rgba(217, 119, 6, 1)'}}></span>
                          Dataset B
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {MEASURE_ROWS.map(([key, label]) => (
                        <tr key={key} className="border-b border-darkGrey/10">
                          <td className="p-2 font-medium">
                            {key === 'stdDev' ? `Std Dev (${varianceMode === 'population' ? 'σ' : 's'})` : label}
                          </td>
                          <td className="text-right p-2 font-mono">{result[key]}</td>
                          <td className="text-right p-2 font-mono">{resultB[key]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                ) : (
                <div className="bg-platinum p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-darkGrey mb-3">Statistical Measures</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <p className="flex items-center">
                      <span className="font-medium">Min:</span>
                      <span className="ml-auto font-mono">{result.min}</span>
                      <InfoIcon info="Smallest value in the dataset" />
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Max:</span>
                      <span className="ml-auto font-mono">{result.max}</span>
                      <InfoIcon info="Largest value in the dataset" />
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Range:</span>
                      <span className="ml-auto font-mono">{result.range}</span>
                      <InfoIcon info="Difference between max and min" />
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Mean:</span>
                      <span className="ml-auto font-mono">{result.mean}</span>
                      <InfoIcon info="Average of all values" />
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Median:</span>
                      <span className="ml-auto font-mono">{result.median}</span>
                      <InfoIcon info="Middle value when sorted" />
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Mode:</span>
                      <span className="ml-auto font-mono">{result.mode}</span>
                      <InfoIcon info="Most frequent value(s)" />
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Std Dev ({varianceMode === 'population' ? 'σ' : 's'}):</span>
                      <span className="ml-auto font-mono">{result.stdDev}</span>
                      <InfoIcon info={varianceMode === 'population' ? 'Typical distance from mean (population formula, divides by N)' : 'Typical distance from mean (sample formula, divides by n−1)'} />
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Variance:</span>
                      <span className="ml-auto font-mono">{result.variance}</span>
                      <InfoIcon info="Square of standard deviation" />
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Q1:</span>
                      <span className="ml-auto font-mono">{result.q1}</span>
                      <InfoIcon info="25th percentile" />
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">Q3:</span>
                      <span className="ml-auto font-mono">{result.q3}</span>
                      <InfoIcon info="75th percentile" />
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium">IQR:</span>
                      <span className="ml-auto font-mono">{result.iqr}</span>
                      <InfoIcon info="Q3 - Q1" />
                    </p>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-darkGrey/20">
                    <p className="text-sm font-medium text-darkGrey mb-1">Outlier Boundaries:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-darkGrey opacity-80">
                        Lower: {result.outlierMin}
                      </p>
                      <p className="text-darkGrey opacity-80">
                        Upper: {result.outlierMax}
                      </p>
                    </div>
                  </div>
                </div>
                )}

                {/* Comparative interpretation when two datasets are loaded */}
                {rawStats && compareMode && rawStatsB && (
                  <div className="bg-accent/10 border-2 border-accentDark/40 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-darkGrey mb-2">📖 Comparing the Two Datasets</h3>
                    <ul className="text-sm text-darkGrey space-y-2">
                      <li>
                        <strong>Center:</strong>{' '}
                        {Math.abs(rawStats.mean - rawStatsB.mean) < 1e-9
                          ? `Both datasets have the same mean (${rawStats.mean.toFixed(2)}).`
                          : `Dataset ${rawStats.mean > rawStatsB.mean ? 'A' : 'B'} has the higher mean (${Math.max(rawStats.mean, rawStatsB.mean).toFixed(2)} vs ${Math.min(rawStats.mean, rawStatsB.mean).toFixed(2)}) — on average its values are ${Math.abs(rawStats.mean - rawStatsB.mean).toFixed(2)} units larger.`}
                        {' '}Medians: A = {rawStats.median.toFixed(2)}, B = {rawStatsB.median.toFixed(2)}.
                      </li>
                      <li>
                        <strong>Consistency:</strong>{' '}
                        {Math.abs(rawStats.stdDev - rawStatsB.stdDev) < 1e-9
                          ? `Both datasets have the same standard deviation (${rawStats.stdDev.toFixed(2)}).`
                          : `Dataset ${rawStats.stdDev < rawStatsB.stdDev ? 'A' : 'B'} is more consistent — its standard deviation (${Math.min(rawStats.stdDev, rawStatsB.stdDev).toFixed(2)}) is smaller than the other's (${Math.max(rawStats.stdDev, rawStatsB.stdDev).toFixed(2)}), so its values cluster more tightly.`}
                      </li>
                      <li>
                        <strong>Middle 50%:</strong> A spans {rawStats.q1.toFixed(2)} to {rawStats.q3.toFixed(2)} (IQR {rawStats.iqr.toFixed(2)}); B spans {rawStatsB.q1.toFixed(2)} to {rawStatsB.q3.toFixed(2)} (IQR {rawStatsB.iqr.toFixed(2)}).
                        {rawStats.q1 > rawStatsB.q3 || rawStatsB.q1 > rawStats.q3
                          ? ' The two middle halves do not overlap at all — a strong sign the datasets genuinely differ.'
                          : ' The middle halves overlap, so the difference between datasets may be modest relative to their spread.'}
                      </li>
                      <li>
                        <strong>Outliers:</strong> Dataset A has {rawStats.outlierCount}, Dataset B has {rawStatsB.outlierCount} (1.5×IQR rule, each computed against its own fences).
                      </li>
                      <li>
                        <strong>Sample sizes:</strong> A has {rawStats.count} values, B has {rawStatsB.count}.
                        {rawStats.count !== rawStatsB.count && ' Unequal sizes are fine for comparing shapes and centers, but keep them in mind when judging reliability.'}
                      </li>
                    </ul>
                  </div>
                )}

                {/* Plain-language interpretation of the results */}
                {rawStats && !(compareMode && rawStatsB) && (
                  <div className="bg-accent/10 border-2 border-accentDark/40 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-darkGrey mb-2">📖 What Your Results Mean</h3>
                    <ul className="text-sm text-darkGrey space-y-2">
                      <li>
                        <strong>Sample size:</strong> You analyzed {rawStats.count} value{rawStats.count === 1 ? '' : 's'}.
                        {rawStats.count < 30 && ' Small samples (under 30) make statistics like the mean and std dev less stable — interpret with care.'}
                      </li>
                      <li>
                        <strong>Shape:</strong>{' '}
                        {Math.abs(rawStats.mean - rawStats.median) <= 0.05 * (rawStats.stdDev || 1)
                          ? `Mean (${rawStats.mean.toFixed(2)}) and median (${rawStats.median.toFixed(2)}) are nearly equal — your data looks roughly symmetric.`
                          : rawStats.mean > rawStats.median
                            ? `Mean (${rawStats.mean.toFixed(2)}) is greater than the median (${rawStats.median.toFixed(2)}) — the data is right-skewed: a few large values pull the mean up. The median is the better "typical value" here.`
                            : `Mean (${rawStats.mean.toFixed(2)}) is less than the median (${rawStats.median.toFixed(2)}) — the data is left-skewed: a few small values pull the mean down. The median is the better "typical value" here.`}
                      </li>
                      {rawStats.mean !== 0 && (
                        <li>
                          <strong>Variability:</strong> The coefficient of variation (Std Dev ÷ Mean) is{' '}
                          {(Math.abs(rawStats.stdDev / rawStats.mean) * 100).toFixed(1)}%
                          {Math.abs(rawStats.stdDev / rawStats.mean) < 0.15
                            ? ' — low: values cluster tightly around the mean.'
                            : Math.abs(rawStats.stdDev / rawStats.mean) < 0.35
                              ? ' — moderate: a noticeable but typical amount of spread.'
                              : ' — high: values are widely scattered, so the mean alone tells an incomplete story.'}
                        </li>
                      )}
                      <li>
                        <strong>Outliers:</strong>{' '}
                        {rawStats.outlierCount === 0
                          ? `No values fall outside the 1.5×IQR fences (${rawStats.outlierMin.toFixed(2)} to ${rawStats.outlierMax.toFixed(2)}).`
                          : `${rawStats.outlierCount} value${rawStats.outlierCount === 1 ? ' falls' : 's fall'} outside the 1.5×IQR fences (below ${rawStats.outlierMin.toFixed(2)} or above ${rawStats.outlierMax.toFixed(2)}). Check whether ${rawStats.outlierCount === 1 ? 'it is a data-entry error or a genuinely unusual case' : 'they are data-entry errors or genuinely unusual cases'} before drawing conclusions.`}
                      </li>
                      <li>
                        <strong>Middle 50%:</strong> Half of your data lies between Q1 ({rawStats.q1.toFixed(2)}) and Q3 ({rawStats.q3.toFixed(2)}) — an IQR of {rawStats.iqr.toFixed(2)}.
                      </li>
                    </ul>
                  </div>
                )}
                
                {/* Chart Visualization */}
                {showChart && (chartType === CHART_TYPES.BOXPLOT ? boxPlotGroups.length > 0 : !!chartData) && (
                  <div className="bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
                    {chartType === CHART_TYPES.BOXPLOT ? (
                      <>
                        <p className="text-center font-semibold text-darkGrey mb-1">
                          Box Plot — Five-Number Summary{compareMode && rawStatsB ? ' (A vs B)' : ''}
                        </p>
                        <div className="h-64 flex items-center justify-center">
                          <BoxPlotSVG groups={boxPlotGroups} showOutliers={showOutliers} svgRef={boxPlotRef} />
                        </div>
                        <p className="text-xs text-darkGrey opacity-60 mt-2 text-center">
                          Box = middle 50% of the data · thick dark line = median · ◇ = mean · red dots = outliers
                        </p>
                      </>
                    ) : (
                      <div className="h-64">
                        <div role="img" className="h-full" aria-label={chartType === CHART_TYPES.HISTOGRAM ? 'Histogram showing frequency distribution of data' : 'Bar chart showing frequency of each value'}>
                          <Bar ref={chartRef} data={chartData} options={chartOptions} />
                        </div>
                      </div>
                    )}
                    {chartType !== CHART_TYPES.BOXPLOT && !(compareMode && rawStatsB) && (
                      <p className="text-xs text-darkGrey opacity-60 mt-2 text-center">
                        Red indicates potential outliers (1.5 × IQR method)
                      </p>
                    )}
                    <button
                      onClick={() => setShowChartModal(true)}
                      className="mt-3 w-full bg-darkTeal text-white px-4 py-2 rounded hover:bg-darkTeal/80 transition-colors"
                    >
                      🔍 View Larger Chart
                    </button>
                    {/* Export actions */}
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={copyResultsToClipboard}
                        className="flex-1 bg-darkTeal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-darkTeal/80 transition-colors"
                      >
                        {copied ? '✓ Copied!' : '📋 Copy Results Table'}
                      </button>
                      <button
                        onClick={downloadChartPNG}
                        className="flex-1 bg-darkTeal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-darkTeal/80 transition-colors"
                      >
                        🖼️ Download Chart (PNG)
                      </button>
                    </div>
                    <p className="text-xs text-darkGrey opacity-60 mt-1 text-center">
                      The copied table pastes directly into Excel, Google Sheets, or Word.
                    </p>
                  </div>
                )}
                
                {/* Enlarged chart modal (all chart types) */}
                {showChartModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onKeyDown={handleChartModalKeyDown}>
                    <div ref={chartModalTrapRef} role="dialog" aria-modal="true" aria-labelledby="chart-modal-title" className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-5xl max-h-screen overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 id="chart-modal-title" className="text-2xl font-bold text-darkGrey">
                          {chartType === CHART_TYPES.BOXPLOT ? 'Box Plot Analysis' : chartType === CHART_TYPES.HISTOGRAM ? 'Histogram Analysis' : 'Bar Chart Analysis'}
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
                      {chartType === CHART_TYPES.BOXPLOT ? (
                        <div className="mb-4 p-4 bg-blue-50 rounded">
                          <h4 className="font-semibold text-darkGrey mb-2">
                            📊 How to Read This Box Plot:
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3 text-sm text-darkGrey">
                            <div>
                              <p>• <span className="font-semibold">The Box:</span> Spans Q1 to Q3 — the middle 50% of your data sits inside it</p>
                              <p>• <span className="font-semibold">Thick Dark Line:</span> The median — half the values lie to its left, half to its right</p>
                              <p>• <span className="font-semibold">◇ Diamond:</span> The mean — when it sits away from the median line, the data is skewed toward that side</p>
                            </div>
                            <div>
                              <p>• <span className="font-semibold">Whisker Lines:</span> Reach the smallest and largest values that are not outliers</p>
                              <p>• <span className="font-semibold" style={{color: 'rgba(220, 38, 38, 1)'}}>Red Dots:</span> Outliers — values beyond 1.5×IQR from the box</p>
                              <p>• <span className="font-semibold">Wider box or longer whiskers</span> = more spread-out data</p>
                            </div>
                          </div>
                          {compareMode && rawStatsB && (
                            <p className="text-sm text-darkGrey mt-2 italic">
                              Comparing: both boxes share the same number line — a box further right has larger values; a longer box has a more variable middle half.
                            </p>
                          )}
                        </div>
                      ) : chartType === CHART_TYPES.HISTOGRAM ? (
                        <div className="mb-4 p-4 bg-blue-50 rounded">
                          <h4 className="font-semibold text-darkGrey mb-2">
                            📊 How to Read This Histogram:
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3 text-sm text-darkGrey">
                            <div>
                              <p>• <span className="font-semibold">Each Bar:</span> One class interval — its width is the Class Width you set</p>
                              <p>• <span className="font-semibold">Bar Height:</span> How many values fall inside that interval</p>
                            </div>
                            <div>
                              <p>• <span className="font-semibold">Shape:</span> A central peak suggests symmetry; a long tail to one side means the data is skewed that way</p>
                              {compareMode && rawStatsB ? (
                                <p>• <span className="font-semibold">Colors:</span> Turquoise = Dataset A, amber = Dataset B, sharing the same class intervals</p>
                              ) : (
                                <p>• <span className="font-semibold" style={{color: 'rgba(255, 0, 0, 1)'}}>Red Bars:</span> Classes whose midpoint lies beyond the outlier fences</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-4 bg-blue-50 rounded">
                          <h4 className="font-semibold text-darkGrey mb-2">
                            📊 How to Read This Bar Chart:
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3 text-sm text-darkGrey">
                            <div>
                              <p>• <span className="font-semibold">Each Bar:</span> One exact value found in your data</p>
                              <p>• <span className="font-semibold">Bar Height:</span> How many times that value appears — the tallest bar is the mode</p>
                            </div>
                            <div>
                              <p>• <span className="font-semibold">vs Histogram:</span> Values are not grouped into intervals — best for small sets of repeated values</p>
                              {compareMode && rawStatsB ? (
                                <p>• <span className="font-semibold">Colors:</span> Turquoise = Dataset A, amber = Dataset B</p>
                              ) : (
                                <p>• <span className="font-semibold" style={{color: 'rgba(255, 0, 0, 1)'}}>Red Bars:</span> Values beyond the outlier fences</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Enlarged chart */}
                      <div className="h-96 mb-4">
                        {chartType === CHART_TYPES.BOXPLOT ? (
                          <div className="h-full flex items-center justify-center">
                            <BoxPlotSVG groups={boxPlotGroups} showOutliers={showOutliers} />
                          </div>
                        ) : (
                          <div role="img" className="h-full" aria-label="Enlarged chart">
                            <Bar data={chartData} options={chartOptions} />
                          </div>
                        )}
                      </div>

                      {/* Summary Statistics */}
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-semibold text-darkGrey mb-2">Summary Statistics{compareMode && rawStatsB ? ' (Dataset A)' : ''}:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-gray-600">Min</p>
                            <p className="font-mono font-bold">{result.min}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Q1</p>
                            <p className="font-mono font-bold">{result.q1}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Median</p>
                            <p className="font-mono font-bold">{result.median}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Mode</p>
                            <p className="font-mono font-bold">{result.mode}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Q3</p>
                            <p className="font-mono font-bold">{result.q3}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Max</p>
                            <p className="font-mono font-bold">{result.max}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Frequency Table for Histogram */}
                {chartType === CHART_TYPES.HISTOGRAM && frequencyTable.length > 0 && (
                  <div className="bg-white border-2 border-darkGrey/20 p-4 rounded-lg overflow-x-auto">
                    <h3 className="text-lg font-bold text-darkGrey mb-3">Frequency Distribution Table</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-darkGrey/20">
                          <th scope="col" className="text-left p-2">Class</th>
                          <th scope="col" className="text-center p-2">Frequency</th>
                          <th scope="col" className="text-center p-2">Relative (%)</th>
                          <th scope="col" className="text-center p-2">Cumulative (%)</th>
                          <th scope="col" className="text-center p-2">Midpoint</th>
                        </tr>
                      </thead>
                      <tbody>
                        {frequencyTable.map((row, index) => (
                          <tr key={index} className="border-b border-darkGrey/10">
                            <td className="p-2">{row.class}</td>
                            <td className="text-center p-2">{row.frequency}</td>
                            <td className="text-center p-2">{row.relativeFreq}%</td>
                            <td className="text-center p-2">{row.cumulativeFreq}%</td>
                            <td className="text-center p-2">{row.midpoint}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCalculator;