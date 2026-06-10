/**
 * TwoSampleCalculator.jsx
 *
 * Two-sample comparison calculator: tests whether two independent groups
 * differ in their means (Welch's t-test) or proportions (pooled z-test).
 * Shows the rejection-region curve, a group comparison chart, a confidence
 * interval for the difference, effect size, and plain-language conclusions.
 *
 * Dependencies: Chart.js, react-chartjs-2, jStat
 *
 * @component
 * @version 1.0.0
 */

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { jStat } from 'jstat';
import InfoIcon from './InfoIcon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFocusTrap from '../../hooks/useFocusTrap';
import { announcePolite } from '../../utils/announce';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

/**
 * Configuration constants
 */
const MODES = {
  MEANS: 'means',
  PROPORTIONS: 'proportions'
};

const TAIL_TYPES = {
  TWO: 'two-tailed',
  RIGHT: 'right-tailed',
  LEFT: 'left-tailed'
};

const CHART_COLORS = {
  rejection: {
    line: 'rgba(255, 99, 71, 0.8)',
    fill: 'rgba(255, 99, 71, 0.2)'
  },
  acceptance: {
    line: 'rgba(78, 205, 196, 0.8)',
    fill: 'rgba(78, 205, 196, 0.2)'
  },
  testStatistic: 'rgba(180, 83, 9, 1)',
  criticalValue: 'rgba(138, 43, 226, 1)',
  group1: {
    background: 'rgba(78, 205, 196, 0.6)',
    border: 'rgba(78, 205, 196, 1)'
  },
  group2: {
    background: 'rgba(245, 158, 11, 0.6)',
    border: 'rgba(217, 119, 6, 1)'
  }
};

const DEFAULT_VALUES = {
  means: {
    mean1: 78, stdDev1: 8, n1: 35,
    mean2: 72, stdDev2: 9, n2: 40,
    significanceLevel: 0.05
  },
  proportions: {
    successes1: 48, n1: 200,
    successes2: 30, n2: 200,
    significanceLevel: 0.05
  }
};

/**
 * Story-based example scenarios with their expected conclusions,
 * so students can predict the outcome before pressing Calculate
 */
const PRESET_SCENARIOS = [
  {
    name: 'New Drug vs Placebo',
    mode: MODES.PROPORTIONS,
    tailType: TAIL_TYPES.TWO,
    inputs: { successes1: 48, n1: 200, successes2: 30, n2: 200, significanceLevel: 0.05 },
    description: '48 of 200 patients improve on the drug vs 30 of 200 on placebo. Does the drug work?',
    expectedOutcome: 'Reject — z ≈ 2.27, p ≈ 0.02. A 24% vs 15% improvement rate is unlikely to be chance with 200 patients per group.'
  },
  {
    name: 'Two Teaching Methods',
    mode: MODES.MEANS,
    tailType: TAIL_TYPES.TWO,
    inputs: { mean1: 78, stdDev1: 8, n1: 35, mean2: 72, stdDev2: 9, n2: 40, significanceLevel: 0.05 },
    description: 'Method A class averages 78 (s = 8, n = 35); Method B averages 72 (s = 9, n = 40). Real difference?',
    expectedOutcome: 'Reject — t ≈ 3.06, p ≈ 0.003, and a medium-to-large effect size (d ≈ 0.70). The 6-point gap is both significant and practically meaningful.'
  },
  {
    name: 'A/B Website Test',
    mode: MODES.PROPORTIONS,
    tailType: TAIL_TYPES.TWO,
    inputs: { successes1: 52, n1: 1000, successes2: 44, n2: 1000, significanceLevel: 0.05 },
    description: 'Design A converts 52 of 1000 visitors; design B converts 44 of 1000. Is A really better?',
    expectedOutcome: 'Fail to reject — z ≈ 0.84, p ≈ 0.40. Even an 18% relative lift can be pure noise at these counts; the CI for the difference includes 0.'
  },
  {
    name: 'Two Battery Brands',
    mode: MODES.MEANS,
    tailType: TAIL_TYPES.TWO,
    inputs: { mean1: 9.9, stdDev1: 1.1, n1: 25, mean2: 10.2, stdDev2: 1.3, n2: 25, significanceLevel: 0.05 },
    description: 'Brand A lasts 9.9 h on average (s = 1.1); Brand B lasts 10.2 h (s = 1.3); 25 units each. Different?',
    expectedOutcome: 'Fail to reject — t ≈ −0.88, p ≈ 0.38. A 0.3-hour gap is well within sampling noise for samples this small.'
  }
];

/**
 * Main TwoSampleCalculator component
 */
const TwoSampleCalculator = () => {
  useDocumentTitle('Two-Sample Comparison Calculator');

  // State management
  const [mode, setMode] = useState(MODES.MEANS);
  const [tailType, setTailType] = useState(TAIL_TYPES.TWO);
  const [inputs, setInputs] = useState(DEFAULT_VALUES.means);
  const [result, setResult] = useState({});
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");
  const [showChartModal, setShowChartModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const chartRef = useRef(null);

  const chartModalTrapRef = useFocusTrap(showChartModal);

  const handleChartModalKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setShowChartModal(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setMode(newMode);
    setInputs(DEFAULT_VALUES[newMode]);
    setResult({});
    setChartData(null);
    setError("");
  };

  const applyPreset = (preset) => {
    setMode(preset.mode);
    setTailType(preset.tailType);
    setInputs(preset.inputs);
    setResult({});
    setChartData(null);
    setError("");
    announcePolite('Loaded scenario: ' + preset.name + '. Press Compare Groups to run it.');
  };

  /**
   * Critical value for the given distribution and tail type
   */
  const getCriticalValue = (alpha, useT, tail, df = null) => {
    const dist = useT ? jStat.studentt : jStat.normal;
    const params = useT ? [df] : [0, 1];
    switch (tail) {
      case TAIL_TYPES.TWO:
        return -Math.abs(dist.inv(alpha / 2, ...params));
      case TAIL_TYPES.RIGHT:
        return dist.inv(1 - alpha, ...params);
      case TAIL_TYPES.LEFT:
        return dist.inv(alpha, ...params);
      default:
        return 0;
    }
  };

  /**
   * P-value for the given test statistic and tail type
   */
  const getPValue = (testStatistic, useT, tail, df = null) => {
    const dist = useT ? jStat.studentt : jStat.normal;
    const params = useT ? [df] : [0, 1];
    switch (tail) {
      case TAIL_TYPES.TWO:
        return 2 * (1 - dist.cdf(Math.abs(testStatistic), ...params));
      case TAIL_TYPES.RIGHT:
        return 1 - dist.cdf(testStatistic, ...params);
      case TAIL_TYPES.LEFT:
        return dist.cdf(testStatistic, ...params);
      default:
        return 0;
    }
  };

  const calculate = () => {
    if (mode === MODES.MEANS) {
      calculateMeansTest();
    } else {
      calculateProportionsTest();
    }
  };

  /**
   * Welch's two-sample t-test for independent means.
   * Uses unpooled variances and the Welch–Satterthwaite degrees of freedom,
   * which stays valid even when the two groups have unequal spreads.
   */
  const calculateMeansTest = () => {
    const m1 = parseFloat(inputs.mean1);
    const s1 = parseFloat(inputs.stdDev1);
    const n1 = parseInt(inputs.n1);
    const m2 = parseFloat(inputs.mean2);
    const s2 = parseFloat(inputs.stdDev2);
    const n2 = parseInt(inputs.n2);
    const alpha = parseFloat(inputs.significanceLevel);

    setError("");
    if ([m1, s1, n1, m2, s2, n2, alpha].some(v => isNaN(v))) {
      setError("Please fill in all fields with valid numbers for both groups.");
      return;
    }
    if (s1 <= 0 || s2 <= 0) {
      setError("Standard deviations must be greater than 0.");
      return;
    }
    if (n1 < 2 || n2 < 2) {
      setError("Each sample size must be at least 2.");
      return;
    }
    if (alpha <= 0 || alpha >= 1) {
      setError("Significance level must be between 0 and 1 (commonly 0.05).");
      return;
    }

    const diff = m1 - m2;
    const v1 = (s1 * s1) / n1;
    const v2 = (s2 * s2) / n2;
    const standardError = Math.sqrt(v1 + v2);
    const t = diff / standardError;

    // Welch–Satterthwaite degrees of freedom
    const df = Math.pow(v1 + v2, 2) / ((v1 * v1) / (n1 - 1) + (v2 * v2) / (n2 - 1));

    const criticalValue = getCriticalValue(alpha, true, tailType, df);
    const pValue = getPValue(t, true, tailType, df);

    // Confidence interval for the difference (always two-sided)
    const tCritCI = Math.abs(getCriticalValue(alpha, true, TAIL_TYPES.TWO, df));
    const marginOfError = tCritCI * standardError;
    const confidenceInterval = [diff - marginOfError, diff + marginOfError];

    // Cohen's d effect size with pooled standard deviation
    const pooledSD = Math.sqrt(((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2));
    const cohensD = diff / pooledSD;

    const reject = tailType === TAIL_TYPES.TWO
      ? Math.abs(t) > Math.abs(criticalValue)
      : (tailType === TAIL_TYPES.RIGHT ? t > criticalValue : t < criticalValue);

    setResult({
      mode: MODES.MEANS,
      tail: tailType,
      group1Value: m1,
      group2Value: m2,
      difference: diff,
      standardError,
      testStatistic: t,
      statName: 't',
      df,
      criticalValue,
      pValue,
      confidenceInterval,
      cohensD,
      alpha,
      reject,
      steps: {
        seFormula: `SE = √(s₁²/n₁ + s₂²/n₂) = √(${s1}²/${n1} + ${s2}²/${n2})`,
        statFormula: `t = (x̄₁ − x̄₂) / SE = (${m1} − ${m2}) / ${standardError.toFixed(4)}`
      },
      assumptions: [
        {
          label: n1 >= 30 && n2 >= 30
            ? `Both samples are large (n₁ = ${n1}, n₂ = ${n2} ≥ 30), so the Central Limit Theorem covers non-normal populations`
            : `Small sample${n1 < 30 && n2 < 30 ? 's' : ''} (n₁ = ${n1}, n₂ = ${n2}) — each population should be roughly normal for this test to be reliable`,
          pass: n1 >= 30 && n2 >= 30 ? true : null
        },
        {
          label: 'Welch\'s test is used, so the two groups do NOT need equal spreads (a safer default than the pooled t-test)',
          pass: true
        },
        {
          label: 'The two groups must be independent — different subjects in each. For before/after data on the same subjects, use a paired t-test instead',
          pass: null
        }
      ]
    });

    createCurveVisualization(t, criticalValue, true, df);
    announcePolite(`Comparison complete. t = ${t.toFixed(4)}, p-value ${pValue.toFixed(4)}. ${reject ? 'Reject' : 'Fail to reject'} the hypothesis of equal means.`);
  };

  /**
   * Two-proportion z-test using the pooled proportion for the standard error
   * (standard approach when testing H₀: p₁ = p₂)
   */
  const calculateProportionsTest = () => {
    const x1 = parseInt(inputs.successes1);
    const n1 = parseInt(inputs.n1);
    const x2 = parseInt(inputs.successes2);
    const n2 = parseInt(inputs.n2);
    const alpha = parseFloat(inputs.significanceLevel);

    setError("");
    if ([x1, n1, x2, n2, alpha].some(v => isNaN(v))) {
      setError("Please fill in all fields with valid numbers for both groups.");
      return;
    }
    if (n1 < 1 || n2 < 1) {
      setError("Each sample size must be at least 1.");
      return;
    }
    if (x1 < 0 || x1 > n1 || x2 < 0 || x2 > n2) {
      setError("Successes must be between 0 and the group's sample size.");
      return;
    }
    if (alpha <= 0 || alpha >= 1) {
      setError("Significance level must be between 0 and 1 (commonly 0.05).");
      return;
    }

    const p1 = x1 / n1;
    const p2 = x2 / n2;
    const diff = p1 - p2;
    const pooled = (x1 + x2) / (n1 + n2);
    const standardError = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2));

    if (standardError === 0) {
      setError("The pooled proportion is 0 or 1, so the test cannot be computed — there is no variability to compare.");
      return;
    }

    const z = diff / standardError;
    const criticalValue = getCriticalValue(alpha, false, tailType);
    const pValue = getPValue(z, false, tailType);

    // CI for the difference uses the UNpooled standard error
    const seCI = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2);
    const zCritCI = Math.abs(getCriticalValue(alpha, false, TAIL_TYPES.TWO));
    const marginOfError = zCritCI * seCI;
    const confidenceInterval = [diff - marginOfError, diff + marginOfError];

    const reject = tailType === TAIL_TYPES.TWO
      ? Math.abs(z) > Math.abs(criticalValue)
      : (tailType === TAIL_TYPES.RIGHT ? z > criticalValue : z < criticalValue);

    setResult({
      mode: MODES.PROPORTIONS,
      tail: tailType,
      group1Value: p1,
      group2Value: p2,
      difference: diff,
      standardError,
      testStatistic: z,
      statName: 'z',
      df: null,
      criticalValue,
      pValue,
      confidenceInterval,
      pooled,
      alpha,
      reject,
      steps: {
        seFormula: `SE = √(p̄(1−p̄)(1/n₁ + 1/n₂)) with pooled p̄ = (${x1} + ${x2})/(${n1} + ${n2}) = ${pooled.toFixed(4)}`,
        statFormula: `z = (p̂₁ − p̂₂) / SE = (${p1.toFixed(4)} − ${p2.toFixed(4)}) / ${standardError.toFixed(4)}`
      },
      assumptions: [
        {
          label: `Group 1 has ${x1} successes and ${n1 - x1} failures (both should be ≥ 10)`,
          pass: x1 >= 10 && (n1 - x1) >= 10
        },
        {
          label: `Group 2 has ${x2} successes and ${n2 - x2} failures (both should be ≥ 10)`,
          pass: x2 >= 10 && (n2 - x2) >= 10
        },
        {
          label: 'The two groups must be independent — different subjects in each group',
          pass: null
        }
      ]
    });

    createCurveVisualization(z, criticalValue, false);
    announcePolite(`Comparison complete. z = ${z.toFixed(4)}, p-value ${pValue.toFixed(4)}. ${reject ? 'Reject' : 'Fail to reject'} the hypothesis of equal proportions.`);
  };

  /**
   * Build the rejection-region curve (z or t distribution)
   */
  const createCurveVisualization = (testStatistic, criticalValue, useT, df = null) => {
    const xMin = -4;
    const xMax = 4;
    const points = 300;
    const step = (xMax - xMin) / points;

    const xValues = [];
    const yValues = [];
    const rejectionRegion = [];
    const acceptanceRegion = [];

    for (let i = 0; i <= points; i++) {
      const xVal = xMin + i * step;
      xValues.push(xVal);
      const y = useT ? jStat.studentt.pdf(xVal, df) : jStat.normal.pdf(xVal, 0, 1);
      yValues.push(y);

      let inRejection = false;
      if (tailType === TAIL_TYPES.TWO) {
        inRejection = xVal <= -Math.abs(criticalValue) || xVal >= Math.abs(criticalValue);
      } else if (tailType === TAIL_TYPES.LEFT) {
        inRejection = xVal <= criticalValue;
      } else {
        inRejection = xVal >= criticalValue;
      }
      rejectionRegion.push(inRejection ? y : null);
      acceptanceRegion.push(inRejection ? null : y);
    }

    const datasets = [
      {
        label: 'Acceptance Region',
        data: acceptanceRegion,
        borderColor: CHART_COLORS.acceptance.line,
        backgroundColor: CHART_COLORS.acceptance.fill,
        fill: true,
        pointRadius: 0,
        tension: 0.4,
        order: 3
      },
      {
        label: 'Rejection Region',
        data: rejectionRegion,
        borderColor: CHART_COLORS.rejection.line,
        backgroundColor: CHART_COLORS.rejection.fill,
        fill: true,
        pointRadius: 0,
        tension: 0.4,
        order: 2
      }
    ];

    // Vertical bars marking the critical value(s)
    const criticalMarkers = tailType === TAIL_TYPES.TWO
      ? [-Math.abs(criticalValue), Math.abs(criticalValue)]
      : [criticalValue];

    criticalMarkers.forEach((cv, index) => {
      const cvIndex = xValues.findIndex(xVal => Math.abs(xVal - cv) < step / 2);
      if (cvIndex !== -1) {
        const verticalLine = new Array(xValues.length).fill(null);
        verticalLine[cvIndex] = yValues[cvIndex];
        datasets.push({
          label: index === 0 ? 'Critical Value(s)' : '',
          data: verticalLine,
          borderColor: CHART_COLORS.criticalValue,
          backgroundColor: CHART_COLORS.criticalValue,
          borderWidth: 3,
          pointRadius: 0,
          type: 'bar',
          barThickness: 2,
          order: 0
        });
      }
    });

    // Triangle marking where the test statistic landed
    const clamped = Math.max(xMin, Math.min(xMax, testStatistic));
    const testStatIndex = xValues.findIndex(xVal => Math.abs(xVal - clamped) < step / 2);
    if (testStatIndex !== -1) {
      const testStatData = new Array(xValues.length).fill(null);
      testStatData[testStatIndex] = 0;
      datasets.push({
        label: 'Test Statistic',
        data: testStatData,
        borderColor: CHART_COLORS.testStatistic,
        backgroundColor: CHART_COLORS.testStatistic,
        pointRadius: 8,
        pointStyle: 'triangle',
        pointBorderWidth: 2,
        type: 'scatter',
        order: -1
      });
    }

    setChartData({
      labels: xValues.map(xVal => xVal.toFixed(2)),
      datasets
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          filter: (item) => item.text !== '',
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Test Statistic') {
              return `Test Statistic: ${result.testStatistic?.toFixed(4)}`;
            }
            if (context.dataset.label.includes('Critical')) {
              return `Critical Value: ${result.criticalValue?.toFixed(4)}`;
            }
            return context.dataset.label;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Standardized Values' }
      },
      y: {
        title: { display: true, text: 'Probability Density' }
      }
    }
  };

  /**
   * Side-by-side bar chart of the two group values
   */
  const comparisonChartData = useMemo(() => {
    if (result.group1Value === undefined) return null;
    const isProportions = result.mode === MODES.PROPORTIONS;
    return {
      labels: ['Group 1', 'Group 2'],
      datasets: [{
        label: isProportions ? 'Proportion' : 'Mean',
        data: [result.group1Value, result.group2Value],
        backgroundColor: [CHART_COLORS.group1.background, CHART_COLORS.group2.background],
        borderColor: [CHART_COLORS.group1.border, CHART_COLORS.group2.border],
        borderWidth: 2
      }]
    };
  }, [result]);

  const comparisonChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: result.mode === MODES.PROPORTIONS ? 'Sample Proportions' : 'Sample Means',
        font: { size: 14 }
      },
      tooltip: {
        callbacks: {
          label: (context) => result.mode === MODES.PROPORTIONS
            ? `${(context.parsed.y * 100).toFixed(2)}%`
            : context.parsed.y.toFixed(4)
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: result.mode === MODES.PROPORTIONS ? 'Proportion' : 'Value' }
      }
    }
  }), [result.mode]);

  /**
   * Word the strength of evidence based on the p-value
   */
  const evidenceStrength = (pVal) =>
    pVal < 0.01 ? 'very strong' : pVal < 0.05 ? 'strong' : pVal < 0.10 ? 'moderate' : 'weak or no';

  /**
   * Interpret Cohen's d in words
   */
  const effectSizeWords = (d) => {
    const abs = Math.abs(d);
    if (abs < 0.2) return 'negligible';
    if (abs < 0.5) return 'small';
    if (abs < 0.8) return 'medium';
    return 'large';
  };

  const paramSymbol = mode === MODES.MEANS ? 'μ' : 'p';
  const tailSymbol = tailType === TAIL_TYPES.TWO ? '≠' : tailType === TAIL_TYPES.RIGHT ? '>' : '<';

  /**
   * Plain-English conclusion sentence for the completed test
   */
  const conclusionText = () => {
    const param = result.mode === MODES.MEANS ? 'mean' : 'proportion';
    const direction = result.tail === TAIL_TYPES.TWO ? 'differs from'
      : result.tail === TAIL_TYPES.RIGHT ? 'is greater than' : 'is less than';
    return result.reject
      ? `At the ${(result.alpha * 100).toFixed(0)}% significance level, the data provides sufficient evidence that Group 1's ${param} ${direction} Group 2's.`
      : `At the ${(result.alpha * 100).toFixed(0)}% significance level, the data does NOT provide sufficient evidence that Group 1's ${param} ${direction} Group 2's.`;
  };

  const formatValue = (v) => result.mode === MODES.PROPORTIONS ? `${(v * 100).toFixed(2)}%` : v.toFixed(4);

  /**
   * Copy the full comparison summary as tab-separated text
   */
  const copyResultsToClipboard = async () => {
    const isProportions = result.mode === MODES.PROPORTIONS;
    const rows = [
      ['Two-Sample Comparison', isProportions ? 'Two proportions (pooled z-test)' : "Two means (Welch's t-test)"],
      ['H₀', `${paramSymbol}₁ = ${paramSymbol}₂`],
      ['H₁', `${paramSymbol}₁ ${tailSymbol} ${paramSymbol}₂`],
      ['Group 1', formatValue(result.group1Value)],
      ['Group 2', formatValue(result.group2Value)],
      ['Difference (1 − 2)', formatValue(result.difference)],
      ['Standard error', result.standardError.toFixed(4)],
      [`Test statistic (${result.statName})`, result.testStatistic.toFixed(4)],
      ...(result.df ? [['Degrees of freedom (Welch)', result.df.toFixed(2)]] : []),
      ['Critical value', result.criticalValue.toFixed(4)],
      ['P-value', result.pValue.toFixed(4)],
      [`${((1 - result.alpha) * 100).toFixed(0)}% CI for difference`, `[${formatValue(result.confidenceInterval[0])}, ${formatValue(result.confidenceInterval[1])}]`],
      ...(result.cohensD !== undefined ? [["Cohen's d", `${result.cohensD.toFixed(3)} (${effectSizeWords(result.cohensD)})`]] : []),
      ['Decision', result.reject ? 'Reject H₀' : 'Fail to reject H₀'],
      ['Conclusion', conclusionText()]
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
   * Download the rejection-region chart as a PNG on a white background
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
    link.download = `two-sample-${result.mode}.png`;
    link.click();
    announcePolite('Chart image downloaded.');
  };

  const inputClass = "w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-darkGrey mb-2">
          Two-Sample Comparison Calculator
        </h2>
        <p className="text-darkGrey opacity-80 mb-4">Compare two means (Welch's t-test) or two proportions (z-test)</p>

        {/* Educational explanation section */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-darkGrey mb-2">
            ⚖️ Comparing Two Groups
          </h3>
          <p className="text-darkGrey mb-3">
            The one-sample test asks "does my group match a known value?" — this calculator asks the more common
            question: <em>"are these two groups actually different from each other?"</em> Drug vs placebo, method A vs
            method B, design A vs design B.
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-darkGrey">
            <div>
              <h4 className="font-semibold mb-1">🔑 The Key Idea:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>H₀ says the groups are equal: μ₁ = μ₂ (or p₁ = p₂)</li>
                <li>Two samples will <em>always</em> differ a little by chance</li>
                <li>The test asks: is the observed gap bigger than chance can explain?</li>
                <li>The CI shows the plausible range for the true difference</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1">⚠️ Independent vs Paired:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>This calculator assumes <strong>independent</strong> groups — different subjects in each</li>
                <li>Same subjects measured twice (before/after)? That's <strong>paired</strong> data — use a paired t-test instead</li>
                <li>Mixing them up is one of the most common statistics mistakes!</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200 text-sm text-darkGrey">
            <h4 className="font-semibold mb-2">✏️ Worked Example: two proportions</h4>
            <p>
              Drug: 48/200 improve (p̂₁ = 0.24). Placebo: 30/200 improve (p̂₂ = 0.15). Pool everything:
              p̄ = 78/400 = 0.195. Then SE = √(0.195 × 0.805 × (1/200 + 1/200)) ≈ 0.0396, and
              z = (0.24 − 0.15) / 0.0396 ≈ <strong>2.27</strong>. Since 2.27 {">"} 1.96 (the two-tailed cutoff at α = 0.05),
              the 9-point gap is statistically significant — load this exact scenario from the examples below and verify!
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div className="space-y-4">
            {/* Test Configuration */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4">Test Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="ts-mode" className="block text-darkGrey font-medium mb-2">What are you comparing?</label>
                  <select
                    id="ts-mode"
                    value={mode}
                    onChange={handleModeChange}
                    className={inputClass}
                  >
                    <option value={MODES.MEANS}>Two Means (Welch's t-test)</option>
                    <option value={MODES.PROPORTIONS}>Two Proportions (z-test)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ts-tail-type" className="block text-darkGrey font-medium mb-2">Tail Type</label>
                  <select
                    id="ts-tail-type"
                    value={tailType}
                    onChange={(e) => setTailType(e.target.value)}
                    className={inputClass}
                  >
                    <option value={TAIL_TYPES.TWO}>Two-Tailed (Group 1 ≠ Group 2)</option>
                    <option value={TAIL_TYPES.RIGHT}>Right-Tailed (Group 1 {">"} Group 2)</option>
                    <option value={TAIL_TYPES.LEFT}>Left-Tailed (Group 1 {"<"} Group 2)</option>
                  </select>
                </div>

                {/* Live hypotheses preview */}
                <div className="p-3 bg-white rounded-lg border-2 border-darkTeal/30">
                  <p className="text-sm font-semibold text-darkGrey mb-1">Your Hypotheses:</p>
                  <p className="font-mono text-darkGrey">H₀: {paramSymbol}₁ = {paramSymbol}₂ (no difference)</p>
                  <p className="font-mono text-darkGrey">H₁: {paramSymbol}₁ {tailSymbol} {paramSymbol}₂</p>
                </div>
              </div>
            </div>

            {/* Input Values */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4">Input Values</h3>

              {mode === MODES.MEANS ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <p className="font-semibold text-darkGrey flex items-center">
                      <span className="inline-block w-3 h-3 rounded mr-2" style={{backgroundColor: CHART_COLORS.group1.border}}></span>
                      Group 1
                    </p>
                    <div>
                      <label htmlFor="ts-mean1" className="block text-darkGrey text-sm font-medium mb-1">Mean (x̄₁)</label>
                      <input id="ts-mean1" type="number" step="any" name="mean1" value={inputs.mean1 ?? ""} onChange={handleChange} className={inputClass} aria-invalid={!!error} aria-describedby="ts-error" />
                    </div>
                    <div>
                      <label htmlFor="ts-sd1" className="block text-darkGrey text-sm font-medium mb-1">Std Dev (s₁)</label>
                      <input id="ts-sd1" type="number" step="any" name="stdDev1" value={inputs.stdDev1 ?? ""} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="ts-n1" className="block text-darkGrey text-sm font-medium mb-1">Sample Size (n₁)</label>
                      <input id="ts-n1" type="number" name="n1" value={inputs.n1 ?? ""} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="font-semibold text-darkGrey flex items-center">
                      <span className="inline-block w-3 h-3 rounded mr-2" style={{backgroundColor: CHART_COLORS.group2.border}}></span>
                      Group 2
                    </p>
                    <div>
                      <label htmlFor="ts-mean2" className="block text-darkGrey text-sm font-medium mb-1">Mean (x̄₂)</label>
                      <input id="ts-mean2" type="number" step="any" name="mean2" value={inputs.mean2 ?? ""} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="ts-sd2" className="block text-darkGrey text-sm font-medium mb-1">Std Dev (s₂)</label>
                      <input id="ts-sd2" type="number" step="any" name="stdDev2" value={inputs.stdDev2 ?? ""} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="ts-n2" className="block text-darkGrey text-sm font-medium mb-1">Sample Size (n₂)</label>
                      <input id="ts-n2" type="number" name="n2" value={inputs.n2 ?? ""} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <p className="font-semibold text-darkGrey flex items-center">
                      <span className="inline-block w-3 h-3 rounded mr-2" style={{backgroundColor: CHART_COLORS.group1.border}}></span>
                      Group 1
                    </p>
                    <div>
                      <label htmlFor="ts-x1" className="flex items-center text-darkGrey text-sm font-medium mb-1">
                        Successes (x₁)
                        <InfoIcon info="The COUNT of successes, not a proportion — e.g., 48 patients improved" />
                      </label>
                      <input id="ts-x1" type="number" name="successes1" value={inputs.successes1 ?? ""} onChange={handleChange} className={inputClass} aria-invalid={!!error} aria-describedby="ts-error" />
                    </div>
                    <div>
                      <label htmlFor="ts-pn1" className="block text-darkGrey text-sm font-medium mb-1">Sample Size (n₁)</label>
                      <input id="ts-pn1" type="number" name="n1" value={inputs.n1 ?? ""} onChange={handleChange} className={inputClass} />
                    </div>
                    {inputs.successes1 !== "" && inputs.n1 > 0 && (
                      <p className="text-xs text-darkGrey/70">p̂₁ = {inputs.successes1}/{inputs.n1} = {(inputs.successes1 / inputs.n1).toFixed(4)}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <p className="font-semibold text-darkGrey flex items-center">
                      <span className="inline-block w-3 h-3 rounded mr-2" style={{backgroundColor: CHART_COLORS.group2.border}}></span>
                      Group 2
                    </p>
                    <div>
                      <label htmlFor="ts-x2" className="block text-darkGrey text-sm font-medium mb-1">Successes (x₂)</label>
                      <input id="ts-x2" type="number" name="successes2" value={inputs.successes2 ?? ""} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="ts-pn2" className="block text-darkGrey text-sm font-medium mb-1">Sample Size (n₂)</label>
                      <input id="ts-pn2" type="number" name="n2" value={inputs.n2 ?? ""} onChange={handleChange} className={inputClass} />
                    </div>
                    {inputs.successes2 !== "" && inputs.n2 > 0 && (
                      <p className="text-xs text-darkGrey/70">p̂₂ = {inputs.successes2}/{inputs.n2} = {(inputs.successes2 / inputs.n2).toFixed(4)}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label htmlFor="ts-alpha" className="flex items-center text-darkGrey font-medium mb-1">
                  Significance Level (α)
                  <InfoIcon info="The probability of a Type I error — declaring a difference when there is none (typically 0.05)" />
                </label>
                <input id="ts-alpha" type="number" step="0.01" name="significanceLevel" value={inputs.significanceLevel ?? ""} onChange={handleChange} placeholder="e.g., 0.05" className={inputClass} />
              </div>

              <button
                onClick={calculate}
                className="mt-4 w-full bg-accent border-2 border-darkGrey text-darkGrey px-4 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all"
              >
                Compare Groups
              </button>
              <p id="ts-error" className="text-red-500 text-sm mt-2" role="status">{error || ''}</p>
            </div>
          </div>

          {/* Results and Visualization */}
          <div className="space-y-4">
            {result.testStatistic !== undefined && (
              <>
                {/* Group comparison bars */}
                {comparisonChartData && (
                  <div className="bg-platinum p-4 rounded-lg">
                    <div className="h-44">
                      <div role="img" className="h-full" aria-label={`Bar chart comparing the two groups: Group 1 ${formatValue(result.group1Value)}, Group 2 ${formatValue(result.group2Value)}`}>
                        <Bar data={comparisonChartData} options={comparisonChartOptions} />
                      </div>
                    </div>
                    <p className="text-xs text-darkGrey opacity-70 mt-1 text-center">
                      Observed difference (Group 1 − Group 2): {formatValue(result.difference)}
                    </p>
                  </div>
                )}

                {/* Rejection-region curve */}
                <div className="bg-platinum p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-darkGrey mb-4">Test Visualization</h3>
                  <div className="h-64">
                    {chartData && <div role="img" className="h-full" aria-label="Distribution curve showing rejection and acceptance regions with the test statistic marker"><Line ref={chartRef} data={chartData} options={chartOptions} /></div>}
                  </div>
                  <p className="mt-2 text-xs text-darkGrey">
                    <span className="text-red-500">Red area:</span> Rejection region |
                    <span className="text-darkTeal ml-2">Teal area:</span> Acceptance region |
                    <span className="ml-2" style={{color: CHART_COLORS.testStatistic}}>▲</span> Your test statistic
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
                </div>

                {/* Decision Box */}
                <div className={`p-4 rounded-lg border-2 ${result.reject ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                  <h3 className="text-xl font-bold text-darkGrey mb-2">Statistical Decision</h3>
                  <p className="text-lg font-semibold text-darkGrey">
                    {result.reject ? '✓ Reject the null hypothesis — the groups differ' : '✗ Fail to reject — no significant difference detected'}
                  </p>
                  <p className="text-sm text-darkGrey mt-2">
                    <strong>In plain words:</strong> {conclusionText()}
                  </p>
                  <p className="text-sm text-darkGrey opacity-80 mt-1">
                    The p-value of {result.pValue.toFixed(4)} indicates <strong>{evidenceStrength(result.pValue)}</strong> evidence against "the groups are equal".
                  </p>
                </div>

                {/* Test Results */}
                <div className="bg-accent/20 border-2 border-accent p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-darkGrey mb-3">Test Results</h3>
                  <div className="space-y-2 text-darkGrey text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Group 1 {result.mode === MODES.PROPORTIONS ? '(p̂₁)' : '(x̄₁)'}:</span>
                      <span className="font-mono font-bold">{formatValue(result.group1Value)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Group 2 {result.mode === MODES.PROPORTIONS ? '(p̂₂)' : '(x̄₂)'}:</span>
                      <span className="font-mono font-bold">{formatValue(result.group2Value)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Difference (1 − 2):</span>
                      <span className="font-mono font-bold">{formatValue(result.difference)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Test Statistic ({result.statName}):</span>
                      <span className="font-mono font-bold">{result.testStatistic.toFixed(4)}</span>
                    </div>
                    {result.df && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center">
                          Degrees of Freedom:
                          <InfoIcon info="Welch–Satterthwaite approximation — usually not a whole number, and that's fine" />
                        </span>
                        <span className="font-mono font-bold">{result.df.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Critical Value:</span>
                      <span className="font-mono font-bold">{result.criticalValue.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center">
                        P-Value:
                        <InfoIcon info="Probability of a gap this large (or larger) if the groups were truly equal" />
                      </span>
                      <span className="font-mono font-bold">{result.pValue.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center">
                        {((1 - result.alpha) * 100).toFixed(0)}% CI for Difference:
                        <InfoIcon info="The plausible range for the TRUE difference between the groups. If 0 is inside, equality is plausible." />
                      </span>
                      <span className="font-mono font-bold">[{formatValue(result.confidenceInterval[0])}, {formatValue(result.confidenceInterval[1])}]</span>
                    </div>
                    {result.cohensD !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center">
                          Effect Size (Cohen's d):
                          <InfoIcon info="The difference measured in standard deviations — how big the gap is in practical terms, independent of sample size" />
                        </span>
                        <span className="font-mono font-bold">{result.cohensD.toFixed(3)} ({effectSizeWords(result.cohensD)})</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-accent/50 text-xs text-darkGrey">
                    <p>
                      <strong>CI insight:</strong> {result.confidenceInterval[0] > 0 || result.confidenceInterval[1] < 0
                        ? `Zero is NOT inside the interval — consistent with rejecting "no difference". The true gap is plausibly between ${formatValue(result.confidenceInterval[0])} and ${formatValue(result.confidenceInterval[1])}.`
                        : 'Zero IS inside the interval — a true difference of zero remains plausible, matching the test decision for a two-tailed test.'}
                    </p>
                  </div>
                </div>

                {/* The math, step by step */}
                <div className="bg-white border-2 border-darkGrey/20 p-4 rounded-lg text-sm text-darkGrey">
                  <h3 className="text-lg font-bold text-darkGrey mb-2">🧮 The Math, Step by Step</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      <strong>Standard error of the difference</strong> — the combined wobble of both samples:
                      <p className="font-mono ml-5">{result.steps.seFormula} = {result.standardError.toFixed(4)}</p>
                    </li>
                    <li>
                      <strong>Test statistic</strong> — how many standard errors the observed gap is from zero:
                      <p className="font-mono ml-5">{result.steps.statFormula} = {result.testStatistic.toFixed(4)}</p>
                    </li>
                    <li>
                      <strong>Compare</strong> — {result.statName} = {result.testStatistic.toFixed(4)} vs critical value {result.criticalValue.toFixed(4)}
                      {result.df ? ` (t-distribution, df ≈ ${result.df.toFixed(2)})` : ' (standard normal)'}:
                      the statistic {result.reject ? 'falls in the rejection region → reject H₀' : 'stays outside the rejection region → fail to reject H₀'}.
                    </li>
                  </ol>
                </div>

                {/* Conditions check */}
                <div className="bg-white border-2 border-darkGrey/20 p-4 rounded-lg text-sm text-darkGrey">
                  <h3 className="text-lg font-bold text-darkGrey mb-2">✅ Conditions Check</h3>
                  <ul className="space-y-1">
                    {result.assumptions.map((assumption, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span aria-hidden="true">{assumption.pass === true ? '✓' : assumption.pass === false ? '⚠️' : 'ℹ️'}</span>
                        <span className={assumption.pass === false ? 'text-red-700 font-medium' : ''}>{assumption.label}</span>
                      </li>
                    ))}
                  </ul>
                  {result.assumptions.some(a => a.pass === false) && (
                    <p className="mt-2 text-red-700 text-xs font-medium">
                      One or more conditions fail — the p-value may not be trustworthy. Consider larger samples or an exact test.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Story-based example scenarios */}
        <div className="mt-6 bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-darkGrey mb-2">Try a Real Scenario</h3>
          <p className="text-xs text-darkGrey/70 mb-2">
            Each scenario predicts its outcome — load one, press Compare Groups, and check the prediction against the decision and the chart.
          </p>
          <div className="grid md:grid-cols-2 gap-2">
            {PRESET_SCENARIOS.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="p-3 text-left bg-platinum hover:bg-darkTeal/20 rounded transition-colors text-sm text-darkGrey"
                aria-label={`Load ${preset.name} scenario`}
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-darkGrey/70 mt-1">{preset.description}</div>
                <div className="text-xs text-darkTeal mt-1 italic">What to expect: {preset.expectedOutcome}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Enlarged chart modal */}
        {showChartModal && chartData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onKeyDown={handleChartModalKeyDown}>
            <div ref={chartModalTrapRef} role="dialog" aria-modal="true" aria-labelledby="ts-chart-modal-title" className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-5xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 id="ts-chart-modal-title" className="text-2xl font-bold text-darkGrey">
                  Two-Sample Test — {result.df ? `t-distribution (df ≈ ${result.df.toFixed(2)})` : 'Standard Normal (z)'}
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
                    <p>• <span className="font-semibold">The Curve:</span> Where the test statistic would land if the two groups were truly EQUAL</p>
                    <p>• <span className="font-semibold text-red-500">Red Region:</span> Gaps too large to blame on chance — total area is α = {result.alpha}</p>
                    <p>• <span className="font-semibold text-darkTeal">Teal Region:</span> Gaps that ordinary sampling noise can explain</p>
                  </div>
                  <div>
                    <p>• <span className="font-semibold" style={{color: CHART_COLORS.testStatistic}}>Amber Triangle:</span> YOUR standardized gap ({result.testStatistic.toFixed(4)})</p>
                    <p>• <span className="font-semibold" style={{color: CHART_COLORS.criticalValue}}>Purple Line(s):</span> Critical value(s) ({result.criticalValue.toFixed(4)}) — the chance-vs-real boundary</p>
                  </div>
                </div>
              </div>

              {/* Enlarged chart */}
              <div className="h-96 mb-4">
                <div role="img" className="h-full" aria-label="Enlarged two-sample test distribution curve">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Key numbers strip */}
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold text-darkGrey mb-2">Key Numbers:</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Group 1</p>
                    <p className="font-mono font-bold">{formatValue(result.group1Value)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Group 2</p>
                    <p className="font-mono font-bold">{formatValue(result.group2Value)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Test Statistic</p>
                    <p className="font-mono font-bold">{result.testStatistic.toFixed(4)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">P-Value</p>
                    <p className="font-mono font-bold">{result.pValue.toFixed(4)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Decision</p>
                    <p className="font-bold">{result.reject ? 'Reject H₀' : 'Fail to reject H₀'}</p>
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

export default TwoSampleCalculator;
