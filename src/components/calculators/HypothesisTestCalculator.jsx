/**
 * HypothesisTestCalculator.jsx
 * 
 * Statistical hypothesis testing calculator with visual representation.
 * Supports one-sample tests for proportions and means with interactive
 * visualization of rejection regions and test statistics.
 * 
 * Dependencies: Chart.js, react-chartjs-2, jStat
 * 
 * @component
 * @version 1.0.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { jStat } from 'jstat';
import InfoIcon from './InfoIcon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFocusTrap from '../../hooks/useFocusTrap';
import { announcePolite } from '../../utils/announce';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

/**
 * Configuration constants
 */
const TEST_TYPES = {
  PROPORTION: 'proportion',
  MEAN: 'mean'
};

const TAIL_TYPES = {
  TWO: 'two-tailed',
  RIGHT: 'right-tailed',
  LEFT: 'left-tailed'
};

const DISTRIBUTION_TYPES = {
  Z: 'z',
  T: 't'
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
  criticalValue: 'rgba(138, 43, 226, 1)'
};

// Default input values for better UX
const DEFAULT_VALUES = {
  proportion: {
    sampleProportion: 0.65,
    hypothesizedProportion: 0.5,
    sampleSize: 100,
    significanceLevel: 0.05
  },
  mean: {
    sampleMean: 25.5,
    hypothesizedMean: 24,
    sampleSize: 30,
    stdDev: 3.5,
    significanceLevel: 0.05,
    stdDevType: 'unknown'
  }
};

/**
 * Story-based example scenarios with their expected conclusions,
 * so students can predict the outcome before pressing Calculate
 */
const PRESET_SCENARIOS = [
  {
    name: 'Is This Coin Fair?',
    testType: TEST_TYPES.PROPORTION,
    tailType: TAIL_TYPES.TWO,
    inputs: { sampleProportion: 0.58, hypothesizedProportion: 0.5, sampleSize: 100, significanceLevel: 0.05 },
    description: 'You flip a coin 100 times and get 58 heads. Is the coin biased?',
    expectedOutcome: 'Fail to reject — z ≈ 1.60, p ≈ 0.11. Even 58/100 heads is within what a fair coin can do by chance. Watch how the test statistic lands inside the teal region.'
  },
  {
    name: 'Battery Life Claim',
    testType: TEST_TYPES.MEAN,
    tailType: TAIL_TYPES.LEFT,
    inputs: { sampleMean: 9.6, hypothesizedMean: 10, sampleSize: 40, stdDev: 1.2, significanceLevel: 0.05, stdDevType: 'unknown' },
    description: 'A maker claims 10-hour battery life. Your 40-unit sample averages 9.6 h (s = 1.2). Do batteries fall short?',
    expectedOutcome: 'Reject — t ≈ −2.11, p ≈ 0.02. A left-tailed test puts all the rejection area on the low side, and the sample mean is far enough below 10 to land in it.'
  },
  {
    name: 'Election Polling Edge',
    testType: TEST_TYPES.PROPORTION,
    tailType: TAIL_TYPES.RIGHT,
    inputs: { sampleProportion: 0.54, hypothesizedProportion: 0.5, sampleSize: 600, significanceLevel: 0.05 },
    description: 'A poll of 600 voters shows 54% support. Is support really above 50%?',
    expectedOutcome: 'Reject, just barely — z ≈ 1.96 against a critical value of 1.645, p ≈ 0.025. Note how the large sample (n = 600) makes a small 4-point edge detectable.'
  }
];

/**
 * Main HypothesisTestCalculator component
 * Handles hypothesis testing calculations and visualizations
 */
const HypothesisTestCalculator = () => {
  useDocumentTitle('Hypothesis Testing Calculator');

  // State management
  const [testType, setTestType] = useState(TEST_TYPES.PROPORTION);
  const [tailType, setTailType] = useState(TAIL_TYPES.TWO);
  const [includeConfidenceInterval, setIncludeConfidenceInterval] = useState(false);
  const [inputs, setInputs] = useState(DEFAULT_VALUES.proportion);
  const [result, setResult] = useState({});
  const [chartData, setChartData] = useState(null);
  const [showErrorExplanation, setShowErrorExplanation] = useState(false);
  const [error, setError] = useState("");
  const [showChartModal, setShowChartModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const chartRef = useRef(null);

  const chartModalTrapRef = useFocusTrap(showChartModal);

  const handleChartModalKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setShowChartModal(false);
  }, []);

  /**
   * Load a story scenario: sets test type, tail, and all inputs at once
   */
  const applyPreset = (preset) => {
    setTestType(preset.testType);
    setTailType(preset.tailType);
    setInputs(preset.inputs);
    setResult({});
    setChartData(null);
    announcePolite('Loaded scenario: ' + preset.name + '. Press Calculate Test to run it.');
  };

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs({
      ...inputs,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /**
   * Handle test type change and reset inputs
   * @param {Event} e - Select change event
   */
  const handleTestTypeChange = (e) => {
    const newType = e.target.value;
    setTestType(newType);
    setInputs(DEFAULT_VALUES[newType]);
    setResult({});
    setChartData(null);
  };

  /**
   * Main calculation orchestrator
   */
  const calculate = () => {
    if (testType === TEST_TYPES.PROPORTION) {
      calculateProportionTest();
    } else {
      calculateMeanTest();
    }
  };

  /**
   * Calculate critical value based on distribution and tail type
   * @param {number} alpha - Significance level
   * @param {string} distribution - Distribution type (z or t)
   * @param {string} tailType - Test tail type
   * @param {number} df - Degrees of freedom (for t-distribution)
   * @returns {number} Critical value
   */
  const getCriticalValue = (alpha, distribution, tailType, df = null) => {
    const isZ = distribution === DISTRIBUTION_TYPES.Z;
    const dist = isZ ? jStat.normal : jStat.studentt;
    const params = isZ ? [0, 1] : [df];
    
    switch (tailType) {
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
   * Calculate p-value based on test statistic
   * @param {number} testStatistic - Calculated test statistic
   * @param {string} distribution - Distribution type
   * @param {string} tailType - Test tail type
   * @param {number} df - Degrees of freedom
   * @returns {number} P-value
   */
  const getPValue = (testStatistic, distribution, tailType, df = null) => {
    const isZ = distribution === DISTRIBUTION_TYPES.Z;
    const dist = isZ ? jStat.normal : jStat.studentt;
    const params = isZ ? [0, 1] : [df];
    
    switch (tailType) {
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

  /**
   * Perform proportion hypothesis test
   * Z-test for population proportion
   */
  const calculateProportionTest = () => {
    const { sampleProportion, hypothesizedProportion, sampleSize, significanceLevel } = inputs;
    
    // Parse inputs
    const p_hat = parseFloat(sampleProportion);
    const p_0 = parseFloat(hypothesizedProportion);
    const n = parseInt(sampleSize);
    const alpha = parseFloat(significanceLevel);

    // Validate inputs
    setError("");
    if (isNaN(p_hat) || isNaN(p_0) || isNaN(n) || isNaN(alpha)) {
      setError("Please fill in all fields with valid numbers (e.g., proportion 0.5, sample size 100, significance 0.05).");
      return;
    }
    if (p_hat < 0 || p_hat > 1 || p_0 <= 0 || p_0 >= 1) {
      setError("Proportions must be between 0 and 1 (and p₀ strictly between them). For 65%, enter 0.65.");
      return;
    }
    if (n < 1) {
      setError("Sample size must be at least 1.");
      return;
    }
    if (alpha <= 0 || alpha >= 1) {
      setError("Significance level must be between 0 and 1 (commonly 0.05).");
      return;
    }

    // Calculate test statistic: z = (p̂ - p₀) / √(p₀(1-p₀)/n)
    const standardError = Math.sqrt((p_0 * (1 - p_0)) / n);
    const z = (p_hat - p_0) / standardError;
    
    // Get critical value and p-value
    const criticalValue = getCriticalValue(alpha, DISTRIBUTION_TYPES.Z, tailType);
    const pValue = getPValue(z, DISTRIBUTION_TYPES.Z, tailType);

    // Calculate confidence interval if requested
    let confidenceInterval = null;
    if (includeConfidenceInterval) {
      const zCritical = Math.abs(getCriticalValue(alpha, DISTRIBUTION_TYPES.Z, TAIL_TYPES.TWO));
      const marginOfError = zCritical * Math.sqrt((p_hat * (1 - p_hat)) / n);
      confidenceInterval = [
        Math.max(0, p_hat - marginOfError).toFixed(4),
        Math.min(1, p_hat + marginOfError).toFixed(4),
      ];
    }

    // Determine rejection
    const reject = tailType === TAIL_TYPES.TWO 
      ? Math.abs(z) > Math.abs(criticalValue)
      : (tailType === TAIL_TYPES.RIGHT ? z > criticalValue : z < criticalValue);

    setResult({
      testStatistic: z.toFixed(4),
      criticalValue: criticalValue.toFixed(4),
      pValue: pValue.toFixed(4),
      confidenceInterval,
      reject,
      distribution: DISTRIBUTION_TYPES.Z,
      pValueNum: pValue,
      h0Value: p_0,
      alphaNum: alpha,
      calcTestType: TEST_TYPES.PROPORTION,
      calcTailType: tailType,
      steps: {
        seFormula: `SE = √(p₀(1−p₀)/n) = √(${p_0.toFixed(2)} × ${(1 - p_0).toFixed(2)} / ${n})`,
        seValue: standardError,
        statFormula: `z = (p̂ − p₀) / SE = (${p_hat} − ${p_0}) / ${standardError.toFixed(4)}`,
        statName: 'z'
      },
      assumptions: [
        {
          label: `Expected successes np₀ = ${(n * p_0).toFixed(1)} ≥ 10`,
          pass: n * p_0 >= 10
        },
        {
          label: `Expected failures n(1−p₀) = ${(n * (1 - p_0)).toFixed(1)} ≥ 10`,
          pass: n * (1 - p_0) >= 10
        },
        {
          label: 'Random, independent sample (you must judge this from how the data was collected)',
          pass: null
        }
      ]
    });

    createVisualization(z, criticalValue, DISTRIBUTION_TYPES.Z);
    announcePolite(`Proportion test complete. Test statistic: ${z.toFixed(4)}, p-value: ${pValue.toFixed(4)}. ${reject ? 'Reject' : 'Fail to reject'} the null hypothesis.`);
  };

  /**
   * Perform mean hypothesis test
   * Z-test or t-test for population mean
   */
  const calculateMeanTest = () => {
    const { sampleMean, hypothesizedMean, sampleSize, stdDev, significanceLevel, stdDevType } = inputs;
    
    // Parse inputs
    const x_bar = parseFloat(sampleMean);
    const mu_0 = parseFloat(hypothesizedMean);
    const n = parseInt(sampleSize);
    const s = parseFloat(stdDev);
    const alpha = parseFloat(significanceLevel);

    // Validate inputs
    setError("");
    if (isNaN(x_bar) || isNaN(mu_0) || isNaN(n) || isNaN(s) || isNaN(alpha)) {
      setError("Please fill in all fields with valid numbers (e.g., mean 50, std dev 10, sample size 30, significance 0.05).");
      return;
    }
    if (s <= 0) {
      setError("Standard deviation must be greater than 0.");
      return;
    }
    if (n < 2) {
      setError("Sample size must be at least 2.");
      return;
    }
    if (alpha <= 0 || alpha >= 1) {
      setError("Significance level must be between 0 and 1 (commonly 0.05).");
      return;
    }

    // Determine distribution type
    const distribution = stdDevType === 'known' ? DISTRIBUTION_TYPES.Z : DISTRIBUTION_TYPES.T;
    const df = n - 1;

    // Calculate test statistic: t = (x̄ - μ₀) / (s/√n)
    const standardError = s / Math.sqrt(n);
    const testStat = (x_bar - mu_0) / standardError;
    
    // Get critical value and p-value
    const criticalValue = getCriticalValue(alpha, distribution, tailType, df);
    const pValue = getPValue(testStat, distribution, tailType, df);

    // Calculate confidence interval if requested
    let confidenceInterval = null;
    if (includeConfidenceInterval) {
      const criticalForCI = Math.abs(getCriticalValue(alpha, distribution, TAIL_TYPES.TWO, df));
      const marginOfError = criticalForCI * standardError;
      confidenceInterval = [
        (x_bar - marginOfError).toFixed(4),
        (x_bar + marginOfError).toFixed(4),
      ];
    }

    // Determine rejection
    const reject = tailType === TAIL_TYPES.TWO 
      ? Math.abs(testStat) > Math.abs(criticalValue)
      : (tailType === TAIL_TYPES.RIGHT ? testStat > criticalValue : testStat < criticalValue);

    setResult({
      testStatistic: testStat.toFixed(4),
      criticalValue: criticalValue.toFixed(4),
      pValue: pValue.toFixed(4),
      confidenceInterval,
      reject,
      distribution,
      df: distribution === DISTRIBUTION_TYPES.T ? df : null,
      pValueNum: pValue,
      h0Value: mu_0,
      alphaNum: alpha,
      calcTestType: TEST_TYPES.MEAN,
      calcTailType: tailType,
      steps: {
        seFormula: `SE = ${stdDevType === 'known' ? 'σ' : 's'}/√n = ${s} / √${n}`,
        seValue: standardError,
        statFormula: `${distribution === DISTRIBUTION_TYPES.Z ? 'z' : 't'} = (x̄ − μ₀) / SE = (${x_bar} − ${mu_0}) / ${standardError.toFixed(4)}`,
        statName: distribution === DISTRIBUTION_TYPES.Z ? 'z' : 't'
      },
      assumptions: [
        {
          label: n >= 30
            ? `Sample size n = ${n} ≥ 30, so the Central Limit Theorem covers non-normal populations`
            : `Sample size n = ${n} < 30 — the population should be roughly normal for this test to be reliable`,
          pass: n >= 30 ? true : null
        },
        {
          label: stdDevType === 'known'
            ? 'Population σ is truly known (rare in practice — if it came from the sample, use t instead)'
            : `Using the t-distribution with ${df} degrees of freedom to account for estimating s from the sample`,
          pass: stdDevType === 'known' ? null : true
        },
        {
          label: 'Random, independent sample (you must judge this from how the data was collected)',
          pass: null
        }
      ]
    });

    createVisualization(testStat, criticalValue, distribution, df);
    announcePolite(`Mean test complete. Test statistic: ${testStat.toFixed(4)}, p-value: ${pValue.toFixed(4)}. ${reject ? 'Reject' : 'Fail to reject'} the null hypothesis.`);
  };

  /**
   * Create visualization data for the hypothesis test
   * @param {number} testStatistic - Calculated test statistic
   * @param {number} criticalValue - Critical value(s)
   * @param {string} distribution - Distribution type
   * @param {number} df - Degrees of freedom
   */
  const createVisualization = (testStatistic, criticalValue, distribution, df = null) => {
    const xMin = -4;
    const xMax = 4;
    const points = 300;
    const step = (xMax - xMin) / points;
    
    const xValues = [];
    const yValues = [];
    const rejectionRegion = [];
    const acceptanceRegion = [];
    
    // Generate distribution curve
    for (let i = 0; i <= points; i++) {
      const x = xMin + i * step;
      xValues.push(x);
      
      // Calculate probability density
      const y = distribution === DISTRIBUTION_TYPES.Z
        ? jStat.normal.pdf(x, 0, 1)
        : jStat.studentt.pdf(x, df);
      yValues.push(y);
      
      // Determine regions based on tail type
      let inRejection = false;
      if (tailType === TAIL_TYPES.TWO) {
        inRejection = x <= -Math.abs(criticalValue) || x >= Math.abs(criticalValue);
      } else if (tailType === TAIL_TYPES.LEFT) {
        inRejection = x <= criticalValue;
      } else {
        inRejection = x >= criticalValue;
      }
      
      rejectionRegion.push(inRejection ? y : null);
      acceptanceRegion.push(inRejection ? null : y);
    }

    // Create datasets for visualization
    const datasets = [
      // Acceptance region
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
      // Rejection region
      {
        label: 'Rejection Region',
        data: rejectionRegion,
        borderColor: CHART_COLORS.rejection.line,
        backgroundColor: CHART_COLORS.rejection.fill,
        fill: true,
        pointRadius: 0,
        tension: 0.4,
        order: 2
      },
      // Distribution curve outline
      {
        label: 'Distribution Curve',
        data: yValues,
        borderColor: 'rgba(100, 100, 100, 0.8)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0.4,
        order: 1
      }
    ];

    // Add critical value markers
    const criticalMarkers = [];
    if (tailType === TAIL_TYPES.TWO) {
      criticalMarkers.push(-Math.abs(criticalValue), Math.abs(criticalValue));
    } else {
      criticalMarkers.push(criticalValue);
    }

    // Add vertical lines for critical values
    criticalMarkers.forEach((cv, index) => {
      // Find the closest x-value index
      const cvIndex = xValues.findIndex(x => Math.abs(x - cv) < step/2);
      if (cvIndex !== -1) {
        // Create vertical line data
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

  // Add test statistic marker on x-axis
  const testStatIndex = xValues.findIndex(x => Math.abs(x - testStatistic) < step/2);
  if (testStatIndex !== -1) {
    const testStatData = new Array(xValues.length).fill(null);
    testStatData[testStatIndex] = 0; // Place at y=0 (x-axis)
    
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
      labels: xValues.map(x => x.toFixed(2)),
      datasets
    });
  };

  /**
   * Chart configuration options
   */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          filter: (item) => item.text !== '' && !item.text.includes('Distribution Curve'),
          usePointStyle: true
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Test Statistic') {
              return `Test Statistic: ${result.testStatistic}`;
            }
            if (context.dataset.label.includes('Critical')) {
              return `Critical Value: ${result.criticalValue}`;
            }
            return context.dataset.label;
          }
        }
      },
      annotation: {
        annotations: {
          testStatLine: {
            type: 'line',
            xMin: result.testStatistic,
            xMax: result.testStatistic,
            borderColor: CHART_COLORS.testStatistic,
            borderWidth: 2,
            label: {
              content: `Test Stat: ${result.testStatistic}`,
              enabled: true,
              position: 'start'
            }
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Standardized Values'
        },
        ticks: {
          callback: function(value, index) {
            // Highlight critical values and test statistic
            const xVal = parseFloat(this.getLabelForValue(index));
            if (result.testStatistic && Math.abs(xVal - parseFloat(result.testStatistic)) < 0.1) {
              return `[${xVal}]`;
            }
            if (result.criticalValue) {
              const cv = parseFloat(result.criticalValue);
              if (tailType === TAIL_TYPES.TWO && (Math.abs(xVal - cv) < 0.1 || Math.abs(xVal + cv) < 0.1)) {
                return `{${xVal}}`;
              } else if (Math.abs(xVal - cv) < 0.1) {
                return `{${xVal}}`;
              }
            }
            return xVal;
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Probability Density'
        }
      }
    }
  };

  // Symbols for the live hypotheses display
  const paramSymbol = testType === TEST_TYPES.PROPORTION ? 'p' : 'μ';
  const h0InputValue = testType === TEST_TYPES.PROPORTION ? inputs.hypothesizedProportion : inputs.hypothesizedMean;
  const tailSymbol = tailType === TAIL_TYPES.TWO ? '≠' : tailType === TAIL_TYPES.RIGHT ? '>' : '<';

  /**
   * Word the strength of evidence based on the p-value
   */
  const evidenceStrength = (pVal) =>
    pVal < 0.01 ? 'very strong' : pVal < 0.05 ? 'strong' : pVal < 0.10 ? 'moderate' : 'weak or no';

  /**
   * Plain-English conclusion sentence for the completed test
   */
  const conclusionText = () => {
    const param = result.calcTestType === TEST_TYPES.PROPORTION ? 'proportion' : 'mean';
    const direction = result.calcTailType === TAIL_TYPES.TWO ? 'different from'
      : result.calcTailType === TAIL_TYPES.RIGHT ? 'greater than' : 'less than';
    return result.reject
      ? `At the ${(result.alphaNum * 100).toFixed(0)}% significance level, the sample provides sufficient evidence that the true ${param} is ${direction} ${result.h0Value}.`
      : `At the ${(result.alphaNum * 100).toFixed(0)}% significance level, the sample does NOT provide sufficient evidence that the true ${param} is ${direction} ${result.h0Value}.`;
  };

  /**
   * Copy the full test summary as tab-separated text
   */
  const copyResultsToClipboard = async () => {
    const rows = [
      ['Hypothesis Test', result.calcTestType === TEST_TYPES.PROPORTION ? 'One-sample proportion (z)' : `One-sample mean (${result.distribution})`],
      ['H₀', `${paramSymbol} = ${result.h0Value}`],
      ['H₁', `${paramSymbol} ${tailSymbol} ${result.h0Value}`],
      ['Test statistic', result.testStatistic],
      ['Critical value', result.criticalValue],
      ['P-value', result.pValue],
      ...(result.df ? [['Degrees of freedom', String(result.df)]] : []),
      ...(result.confidenceInterval ? [[`${((1 - result.alphaNum) * 100).toFixed(0)}% CI`, `[${result.confidenceInterval[0]}, ${result.confidenceInterval[1]}]`]] : []),
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
   * Download the test visualization as a PNG on a white background
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
    link.download = `hypothesis-test-${result.calcTestType || testType}.png`;
    link.click();
    announcePolite('Chart image downloaded.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-darkGrey mb-2">
          Hypothesis Testing Calculator
        </h2>
        
        {/* Educational explanation section */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-darkGrey mb-2">
            🔬 Understanding Hypothesis Testing
          </h3>
          <p className="text-darkGrey mb-3">
            Think of hypothesis testing as a courtroom trial for data! The null hypothesis (H₀) is like the defendant - 
            innocent until proven guilty. We need strong evidence (small p-value) to reject it and accept the alternative (H₁).
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm text-darkGrey">
            <div>
              <h4 className="font-semibold mb-1">⚖️ The Court Analogy:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Null Hypothesis (H₀):</strong> Defendant is innocent</li>
                <li><strong>Alternative (H₁):</strong> Defendant is guilty</li>
                <li><strong>p-value:</strong> Strength of evidence against H₀</li>
                <li><strong>α level:</strong> Threshold for "beyond reasonable doubt"</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1">🎯 P-Value Interpretation:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>p {"<"} 0.01:</strong> Very strong evidence</li>
                <li><strong>p {"<"} 0.05:</strong> Strong evidence</li>
                <li><strong>p {"<"} 0.10:</strong> Moderate evidence</li>
                <li><strong>p {"≥"} 0.10:</strong> Weak/no evidence</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-300">
            <p className="text-sm font-semibold text-darkGrey mb-1">
              ⚠️ The Two Types of Errors:
            </p>
            <div className="grid md:grid-cols-2 gap-2 text-xs">
              <div>
                <strong>Type I Error (α):</strong> False positive - Convicting an innocent person
                <br />
                <em>Rejecting H₀ when it's actually true</em>
              </div>
              <div>
                <strong>Type II Error (β):</strong> False negative - Letting a guilty person go free
                <br />
                <em>Failing to reject H₀ when it's actually false</em>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-darkGrey mt-3 italic">
            💡 <strong>Remember:</strong> The p-value is the probability of seeing results as extreme as yours 
            (or more extreme) IF the null hypothesis were true. Small p-value = unlikely under H₀ = evidence against H₀!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div className="space-y-4">
            {/* Test Configuration */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4">Test Configuration</h3>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="hyp-test-type" className="block text-darkGrey font-medium mb-2">Test Type</label>
                  <select
                    id="hyp-test-type"
                    value={testType}
                    onChange={handleTestTypeChange}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                  >
                    <option value={TEST_TYPES.PROPORTION}>Proportion Test (Z-test)</option>
                    <option value={TEST_TYPES.MEAN}>Mean Test (Z or t-test)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="hyp-tail-type" className="block text-darkGrey font-medium mb-2">Tail Type</label>
                  <select
                    id="hyp-tail-type"
                    value={tailType}
                    onChange={(e) => setTailType(e.target.value)}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                  >
                    <option value={TAIL_TYPES.TWO}>Two-Tailed (≠)</option>
                    <option value={TAIL_TYPES.RIGHT}>Right-Tailed ({">"})</option>
                    <option value={TAIL_TYPES.LEFT}>Left-Tailed ({"<"})</option>
                  </select>
                </div>

                {/* Live hypotheses preview, updating as inputs change */}
                <div className="p-3 bg-white rounded-lg border-2 border-darkTeal/30">
                  <p className="text-sm font-semibold text-darkGrey mb-1">Your Hypotheses:</p>
                  <p className="font-mono text-darkGrey">H₀: {paramSymbol} = {h0InputValue || '?'}</p>
                  <p className="font-mono text-darkGrey">H₁: {paramSymbol} {tailSymbol} {h0InputValue || '?'}</p>
                  <p className="text-xs text-darkGrey/70 mt-1">
                    {tailType === TAIL_TYPES.TWO
                      ? 'Two-tailed: you suspect a difference in either direction, so α is split between both tails.'
                      : tailType === TAIL_TYPES.RIGHT
                        ? 'Right-tailed: you suspect the true value is HIGHER, so all of α sits in the right tail.'
                        : 'Left-tailed: you suspect the true value is LOWER, so all of α sits in the left tail.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Input Values */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4">Input Values</h3>
              
              {testType === TEST_TYPES.PROPORTION ? (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="hyp-sample-proportion" className="flex items-center text-darkGrey font-medium mb-1">
                      Sample Proportion (p̂)
                      <InfoIcon info="The observed proportion in your sample" />
                    </label>
                    <input
                      id="hyp-sample-proportion"
                      type="number"
                      step="0.0001"
                      name="sampleProportion"
                      value={inputs.sampleProportion || ""}
                      onChange={handleChange}
                      placeholder="e.g., 0.65"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                      aria-invalid={!!error}
                      aria-describedby="hyp-error"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hyp-hypothesized-proportion" className="flex items-center text-darkGrey font-medium mb-1">
                      Hypothesized Proportion (p₀)
                      <InfoIcon info="The proportion stated in the null hypothesis" />
                    </label>
                    <input
                      id="hyp-hypothesized-proportion"
                      type="number"
                      step="0.0001"
                      name="hypothesizedProportion"
                      value={inputs.hypothesizedProportion || ""}
                      onChange={handleChange}
                      placeholder="e.g., 0.50"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hyp-prop-sample-size" className="flex items-center text-darkGrey font-medium mb-1">
                      Sample Size (n)
                      <InfoIcon info="The number of observations in your sample" />
                    </label>
                    <input
                      id="hyp-prop-sample-size"
                      type="number"
                      name="sampleSize"
                      value={inputs.sampleSize || ""}
                      onChange={handleChange}
                      placeholder="e.g., 100"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hyp-prop-significance" className="flex items-center text-darkGrey font-medium mb-1">
                      Significance Level (α)
                      <InfoIcon info="The probability of Type I error (typically 0.05)" />
                    </label>
                    <input
                      id="hyp-prop-significance"
                      type="number"
                      step="0.01"
                      name="significanceLevel"
                      value={inputs.significanceLevel || ""}
                      onChange={handleChange}
                      placeholder="e.g., 0.05"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="hyp-sample-mean" className="flex items-center text-darkGrey font-medium mb-1">
                      Sample Mean (x̄)
                      <InfoIcon info="The average of your sample data" />
                    </label>
                    <input
                      id="hyp-sample-mean"
                      type="number"
                      step="0.0001"
                      name="sampleMean"
                      value={inputs.sampleMean || ""}
                      onChange={handleChange}
                      placeholder="e.g., 25.5"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hyp-hypothesized-mean" className="flex items-center text-darkGrey font-medium mb-1">
                      Hypothesized Mean (μ₀)
                      <InfoIcon info="The mean stated in the null hypothesis" />
                    </label>
                    <input
                      id="hyp-hypothesized-mean"
                      type="number"
                      step="0.0001"
                      name="hypothesizedMean"
                      value={inputs.hypothesizedMean || ""}
                      onChange={handleChange}
                      placeholder="e.g., 24.0"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hyp-mean-sample-size" className="flex items-center text-darkGrey font-medium mb-1">
                      Sample Size (n)
                      <InfoIcon info="The number of observations in your sample" />
                    </label>
                    <input
                      id="hyp-mean-sample-size"
                      type="number"
                      name="sampleSize"
                      value={inputs.sampleSize || ""}
                      onChange={handleChange}
                      placeholder="e.g., 30"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hyp-std-dev" className="flex items-center text-darkGrey font-medium mb-1">
                      Standard Deviation (σ or s)
                      <InfoIcon info="Population (σ) or sample (s) standard deviation" />
                    </label>
                    <input
                      id="hyp-std-dev"
                      type="number"
                      step="0.0001"
                      name="stdDev"
                      value={inputs.stdDev || ""}
                      onChange={handleChange}
                      placeholder="e.g., 3.5"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-darkGrey font-medium mb-2">Population Standard Deviation</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="stdDevType"
                          value="known"
                          checked={inputs.stdDevType === "known"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-darkGrey">Known (σ) - Use Z</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="stdDevType"
                          value="unknown"
                          checked={inputs.stdDevType === "unknown"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-darkGrey">Unknown (s) - Use t</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="hyp-mean-significance" className="flex items-center text-darkGrey font-medium mb-1">
                      Significance Level (α)
                      <InfoIcon info="The probability of Type I error (typically 0.05)" />
                    </label>
                    <input
                      id="hyp-mean-significance"
                      type="number"
                      step="0.01"
                      name="significanceLevel"
                      value={inputs.significanceLevel || ""}
                      onChange={handleChange}
                      placeholder="e.g., 0.05"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-4 space-y-2">
                <label className="flex items-center text-darkGrey">
                  <input
                    type="checkbox"
                    checked={includeConfidenceInterval}
                    onChange={(e) => setIncludeConfidenceInterval(e.target.checked)}
                    className="mr-2"
                  />
                  Include Confidence Interval
                </label>
                
                <label className="flex items-center text-darkGrey">
                  <input
                    type="checkbox"
                    checked={showErrorExplanation}
                    onChange={(e) => setShowErrorExplanation(e.target.checked)}
                    className="mr-2"
                  />
                  Show Error Type Explanation
                </label>
              </div>
              
              <button
                onClick={calculate}
                className="mt-4 w-full bg-accent border-2 border-darkGrey text-darkGrey px-4 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all"
              >
                Calculate Test
              </button>
              <p id="hyp-error" className="text-red-500 text-sm mt-2" role="status">{error || ''}</p>
            </div>
          </div>

          {/* Results and Visualization */}
          <div className="space-y-4">
            {result.testStatistic !== undefined && (
              <>
                {/* Visualization */}
                <div className="bg-platinum p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-darkGrey mb-4">
                    Hypothesis Test Visualization
                  </h3>
                  <div className="h-64">
                    {chartData && <div role="img" className="h-full" aria-label="Hypothesis test distribution curve showing rejection and acceptance regions"><Line ref={chartRef} data={chartData} options={chartOptions} /></div>}
                  </div>
                  <div className="mt-2 text-xs text-darkGrey">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <span className="inline-block w-3 h-3 mr-1" style={{backgroundColor: CHART_COLORS.testStatistic}}></span>
                        Test Statistic: {result.testStatistic}
                      </span>
                      <span className="flex items-center">
                        <span className="inline-block w-3 h-3 mr-1" style={{backgroundColor: CHART_COLORS.criticalValue}}></span>
                        Critical Value(s): {result.criticalValue}
                      </span>
                    </div>
                    <p className="mt-1">
                      <span className="text-red-500">Red area:</span> Rejection region |
                      <span className="text-darkTeal ml-2">Teal area:</span> Acceptance region
                    </p>
                  </div>
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
                  <h3 className="text-xl font-bold text-darkGrey mb-2">
                    Statistical Decision
                  </h3>
                  <p className="text-lg font-semibold text-darkGrey">
                    {result.reject ? '✓ Reject the null hypothesis' : '✗ Fail to reject the null hypothesis'}
                  </p>
                  <p className="text-sm text-darkGrey mt-2">
                    <strong>In plain words:</strong> {conclusionText()}
                  </p>
                  <p className="text-sm text-darkGrey opacity-80 mt-1">
                    The p-value of {result.pValue} indicates <strong>{evidenceStrength(result.pValueNum)}</strong> evidence against H₀.
                  </p>
                  {result.reject && (
                    <p className="text-sm text-darkGrey mt-2 italic">
                      Note: Rejecting H₀ doesn't prove H₁ is true - it means the data is unlikely under H₀
                    </p>
                  )}
                  {!result.reject && (
                    <p className="text-sm text-darkGrey mt-2 italic">
                      Note: Failing to reject H₀ is not proof that H₀ is true - the sample may simply be too small to detect a real difference
                    </p>
                  )}
                </div>

                {/* Test Results */}
                <div className="bg-accent/20 border-2 border-accent p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-darkGrey mb-3">Test Results</h3>
                  <div className="space-y-2 text-darkGrey">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Test Statistic:</span>
                      <span className="font-mono font-bold">{result.testStatistic}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Critical Value(s):</span>
                      <span className="font-mono font-bold">{result.criticalValue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center">
                        P-Value:
                        <InfoIcon info="Probability of seeing this result (or more extreme) if H₀ is true" />
                      </span>
                      <span className="font-mono font-bold">{result.pValue}</span>
                    </div>
                    {result.df && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Degrees of Freedom:</span>
                        <span className="font-mono font-bold">{result.df}</span>
                      </div>
                    )}
                    {result.confidenceInterval && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{((1 - inputs.significanceLevel) * 100).toFixed(0)}% CI:</span>
                        <span className="font-mono font-bold">
                          [{result.confidenceInterval[0]}, {result.confidenceInterval[1]}]
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* P-value interpretation guide */}
                  <div className="mt-3 pt-3 border-t border-accent/50">
                    <p className="text-sm font-medium text-darkGrey mb-1">P-Value Interpretation:</p>
                    <div className="text-xs text-darkGrey space-y-1">
                      <p>• If p-value {"<"} α: Reject H₀ (significant result)</p>
                      <p>• If p-value {"≥"} α: Fail to reject H₀ (not significant)</p>
                      <p className="font-semibold mt-1">
                        Your p-value ({result.pValue}) {parseFloat(result.pValue) < parseFloat(inputs.significanceLevel) ? '<' : '≥'} α ({inputs.significanceLevel})
                      </p>
                    </div>
                  </div>
                </div>

                {/* The math, step by step */}
                {result.steps && (
                  <div className="bg-white border-2 border-darkGrey/20 p-4 rounded-lg text-sm text-darkGrey">
                    <h3 className="text-lg font-bold text-darkGrey mb-2">🧮 The Math, Step by Step</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>
                        <strong>Standard error</strong> — how much sample results naturally wobble:
                        <p className="font-mono ml-5">{result.steps.seFormula} = {result.steps.seValue.toFixed(4)}</p>
                      </li>
                      <li>
                        <strong>Test statistic</strong> — how many standard errors the sample sits from H₀:
                        <p className="font-mono ml-5">{result.steps.statFormula} = {result.testStatistic}</p>
                      </li>
                      <li>
                        <strong>Compare</strong> — {result.steps.statName} = {result.testStatistic} vs critical value {result.criticalValue}
                        {result.df ? ` (t-distribution, df = ${result.df})` : ' (standard normal)'}:
                        the test statistic {result.reject ? 'falls in the rejection region → reject H₀' : 'stays outside the rejection region → fail to reject H₀'}.
                      </li>
                    </ol>
                  </div>
                )}

                {/* Assumption checks */}
                {result.assumptions && (
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
                        One or more conditions fail — the test's p-value may not be trustworthy. Consider a larger sample or an exact test.
                      </p>
                    )}
                  </div>
                )}

                {/* Error Type Explanation */}
                {showErrorExplanation && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <h3 className="text-lg font-bold text-darkGrey mb-2">
                      Understanding Type I and Type II Errors
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <h4 className="font-semibold text-red-700 mb-1">Type I Error (α)</h4>
                        <p className="text-darkGrey mb-2">
                          <strong>What:</strong> Rejecting H₀ when it's actually true
                        </p>
                        <p className="text-darkGrey mb-2">
                          <strong>Example:</strong> Concluding a coin is unfair when it's actually fair
                        </p>
                        <p className="text-darkGrey">
                          <strong>Control:</strong> Set by significance level (α = {inputs.significanceLevel})
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <h4 className="font-semibold text-blue-700 mb-1">Type II Error (β)</h4>
                        <p className="text-darkGrey mb-2">
                          <strong>What:</strong> Failing to reject H₀ when it's actually false
                        </p>
                        <p className="text-darkGrey mb-2">
                          <strong>Example:</strong> Concluding a coin is fair when it's actually biased
                        </p>
                        <p className="text-darkGrey">
                          <strong>Control:</strong> Increase sample size or effect size
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-darkGrey">
                      <strong>Trade-off:</strong> Decreasing α increases β (and vice versa). 
                      It's like adjusting a smoke detector - too sensitive causes false alarms (Type I), 
                      not sensitive enough misses real fires (Type II).
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Story-based example scenarios */}
        <div className="mt-6 bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-darkGrey mb-2">Try a Real Scenario</h3>
          <p className="text-xs text-darkGrey/70 mb-2">
            Each scenario predicts its outcome — load one, press Calculate Test, and check the prediction against the decision and the chart.
          </p>
          <div className="grid md:grid-cols-3 gap-2">
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
            <div ref={chartModalTrapRef} role="dialog" aria-modal="true" aria-labelledby="hyp-chart-modal-title" className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-5xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 id="hyp-chart-modal-title" className="text-2xl font-bold text-darkGrey">
                  Hypothesis Test — {result.distribution === DISTRIBUTION_TYPES.T ? `t-distribution (df = ${result.df})` : 'Standard Normal (z)'}
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
                    <p>• <span className="font-semibold">The Curve:</span> Where test statistics would land if H₀ were true — most results cluster near 0</p>
                    <p>• <span className="font-semibold text-red-500">Red Region:</span> The rejection region — its total area is exactly α = {result.alphaNum}</p>
                    <p>• <span className="font-semibold text-darkTeal">Teal Region:</span> Results consistent with H₀</p>
                  </div>
                  <div>
                    <p>• <span className="font-semibold" style={{color: CHART_COLORS.testStatistic}}>Amber Triangle:</span> YOUR test statistic ({result.testStatistic}) — the whole decision is just asking which region it landed in</p>
                    <p>• <span className="font-semibold" style={{color: CHART_COLORS.criticalValue}}>Purple Line(s):</span> Critical value(s) ({result.criticalValue}) — the boundary between the regions</p>
                  </div>
                </div>
              </div>

              {/* Enlarged chart */}
              <div className="h-96 mb-4">
                <div role="img" className="h-full" aria-label="Enlarged hypothesis test distribution curve">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Key numbers strip */}
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold text-darkGrey mb-2">Key Numbers:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Test Statistic</p>
                    <p className="font-mono font-bold">{result.testStatistic}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Critical Value</p>
                    <p className="font-mono font-bold">{result.criticalValue}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">P-Value</p>
                    <p className="font-mono font-bold">{result.pValue}</p>
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

export default HypothesisTestCalculator;