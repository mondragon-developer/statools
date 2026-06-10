import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { jStat } from 'jstat';
import InfoIcon from './InfoIcon';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { announcePolite } from '../../utils/announce';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

/**
 * Normal distribution calculator — computes probabilities and z-scores via jStat.
 * Supports P(X<x), P(X>x), P(a<X<b), and inverse lookups.
 */

// ========================================
// MATHEMATICAL ENGINE (Single Responsibility)
// ========================================
const NormalMath = {
  /**
   * Convert X value to Z-score
   * Z = (X - μ) / σ
   * Like converting local currency to a universal standard
   */
  toZScore: (x, mean, sd) => {
    if (sd === 0) return 0;
    return (x - mean) / sd;
  },

  /**
   * Convert Z-score to X value
   * X = μ + Z × σ
   * Like converting universal standard back to local currency
   */
  toXValue: (z, mean, sd) => {
    return mean + z * sd;
  },

  /**
   * Calculate probability density function
   * The height of the bell curve at any point
   */
  pdf: (x, mean, sd) => {
    return jStat.normal.pdf(x, mean, sd);
  },

  /**
   * Calculate cumulative distribution function
   * The area under the curve up to x
   */
  cdf: (x, mean, sd) => {
    return jStat.normal.cdf(x, mean, sd);
  },

  /**
   * Calculate inverse CDF (percentile to value)
   * Given a probability, find the corresponding x value
   */
  inv: (p, mean, sd) => {
    return jStat.normal.inv(p, mean, sd);
  }
};

// ========================================
// PRESET SCENARIOS
// ========================================
const NORMAL_EXAMPLES = [
  { 
    name: '📊 IQ Scores', 
    mean: 100, 
    sd: 15,
    description: 'Intelligence quotient distribution'
  },
  { 
    name: '📏 Adult Heights (inches)', 
    mean: 70, 
    sd: 3,
    description: 'Average human height distribution'
  },
  { 
    name: '🎓 SAT Scores', 
    mean: 1050, 
    sd: 200,
    description: 'Standardized test scores'
  },
  { 
    name: '🌡️ Body Temperature (°F)', 
    mean: 98.6, 
    sd: 0.7,
    description: 'Normal human body temperature'
  },
  { 
    name: '📈 Stock Returns (%)', 
    mean: 10, 
    sd: 20,
    description: 'Annual stock market returns'
  },
  {
    name: '⚖️ Standard Normal',
    mean: 0,
    sd: 1,
    description: 'Z-distribution (μ=0, σ=1)'
  }
];

// ========================================
// MAIN CALCULATOR COMPONENT
// ========================================
const NormalDistributionCalculator = () => {
  useDocumentTitle('Normal Distribution Calculator');
  // State management - with safe default values
  const [mean, setMean] = useState(0);
  const [sd, setSd] = useState(1);
  const [inputType, setInputType] = useState('x'); // 'x' or 'z'
  const [calcType, setCalcType] = useState('left');
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(1);
  const [showPercentiles, setShowPercentiles] = useState(true);
  const [showStandardDeviations, setShowStandardDeviations] = useState(true);
  const [inverseMode, setInverseMode] = useState(false);
  const [inverseProbability, setInverseProbability] = useState(0.5);

  // Safe parsing function to prevent NaN crashes
  const safeParse = (value, defaultValue = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // Calculate probabilities based on inputs
  const calculations = useMemo(() => {
    const safeMean = safeParse(mean, 0);
    const safeSd = Math.max(safeParse(sd, 1), 0.0001); // Prevent division by zero
    const safeValue1 = safeParse(value1, 0);
    const safeValue2 = safeParse(value2, 1);
    const safeInverseProb = Math.max(0.0001, Math.min(0.9999, safeParse(inverseProbability, 0.5)));

    // Inverse calculations
    let inverseResults = null;
    if (inverseMode) {
      const leftValue = NormalMath.inv(safeInverseProb, safeMean, safeSd);
      const rightValue = NormalMath.inv(1 - safeInverseProb, safeMean, safeSd);
      const leftZ = NormalMath.toZScore(leftValue, safeMean, safeSd);
      const rightZ = NormalMath.toZScore(rightValue, safeMean, safeSd);
      
      inverseResults = {
        probability: safeInverseProb,
        leftValue,
        rightValue,
        leftZ,
        rightZ,
        description: `Values where P(X ≤ value) = ${(safeInverseProb * 100).toFixed(1)}%`
      };
    }

    // Convert to X values if input is Z
    const x1 = inputType === 'z' ? NormalMath.toXValue(safeValue1, safeMean, safeSd) : safeValue1;
    const x2 = inputType === 'z' ? NormalMath.toXValue(safeValue2, safeMean, safeSd) : safeValue2;

    // Calculate Z-scores
    const z1 = NormalMath.toZScore(x1, safeMean, safeSd);
    const z2 = NormalMath.toZScore(x2, safeMean, safeSd);

    // Calculate probabilities based on type
    let probability = 0;
    let description = '';

    switch (calcType) {
      case 'left':
        probability = NormalMath.cdf(x1, safeMean, safeSd);
        description = `P(X ≤ ${x1.toFixed(2)})`;
        break;
      case 'right':
        probability = 1 - NormalMath.cdf(x1, safeMean, safeSd);
        description = `P(X > ${x1.toFixed(2)})`;
        break;
      case 'between':
        const lower = Math.min(x1, x2);
        const upper = Math.max(x1, x2);
        probability = NormalMath.cdf(upper, safeMean, safeSd) - NormalMath.cdf(lower, safeMean, safeSd);
        description = `P(${lower.toFixed(2)} < X < ${upper.toFixed(2)})`;
        break;
      case 'outside':
        const innerLower = Math.min(x1, x2);
        const innerUpper = Math.max(x1, x2);
        probability = 1 - (NormalMath.cdf(innerUpper, safeMean, safeSd) - NormalMath.cdf(innerLower, safeMean, safeSd));
        description = `P(X < ${innerLower.toFixed(2)} or X > ${innerUpper.toFixed(2)})`;
        break;
    }

    // Calculate important percentiles
    const percentiles = {
      p01: NormalMath.inv(0.01, safeMean, safeSd),
      p05: NormalMath.inv(0.05, safeMean, safeSd),
      p10: NormalMath.inv(0.10, safeMean, safeSd),
      p25: NormalMath.inv(0.25, safeMean, safeSd),
      p50: NormalMath.inv(0.50, safeMean, safeSd),
      p75: NormalMath.inv(0.75, safeMean, safeSd),
      p90: NormalMath.inv(0.90, safeMean, safeSd),
      p95: NormalMath.inv(0.95, safeMean, safeSd),
      p99: NormalMath.inv(0.99, safeMean, safeSd)
    };

    return {
      x1, x2, z1, z2,
      probability,
      description,
      percentiles,
      mean: safeMean,
      sd: safeSd,
      inverseResults
    };
  }, [mean, sd, inputType, calcType, value1, value2, inverseMode, inverseProbability]);

  // Generate chart data
  const chartData = useMemo(() => {
    const { mean: safeMean, sd: safeSd } = calculations;
    
    // Generate x values for the curve (μ ± 4σ)
    const xMin = safeMean - 4 * safeSd;
    const xMax = safeMean + 4 * safeSd;
    const points = 200;
    const step = (xMax - xMin) / points;

    const xValues = [];
    const yValues = [];
    const fillData = [];

    for (let i = 0; i <= points; i++) {
      const x = xMin + i * step;
      const y = NormalMath.pdf(x, safeMean, safeSd);
      xValues.push(x);
      yValues.push(y);

      // Determine if this point should be filled based on mode and calcType
      let shouldFill = false;
      
      if (inverseMode && calculations.inverseResults) {
        // In inverse mode, highlight the tails
        shouldFill = x <= calculations.inverseResults.leftValue || x >= calculations.inverseResults.rightValue;
      } else {
        switch (calcType) {
          case 'left':
            shouldFill = x <= calculations.x1;
            break;
          case 'right':
            shouldFill = x > calculations.x1;
            break;
          case 'between':
            shouldFill = x >= Math.min(calculations.x1, calculations.x2) && 
                        x <= Math.max(calculations.x1, calculations.x2);
            break;
          case 'outside':
            shouldFill = x < Math.min(calculations.x1, calculations.x2) || 
                        x > Math.max(calculations.x1, calculations.x2);
            break;
        }
      }
      fillData.push(shouldFill ? y : null);
    }

    const datasets = [
      {
        label: 'Normal Distribution',
        data: yValues,
        borderColor: 'rgba(42, 42, 42, 0.8)',
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.4,
        fill: false
      },
      {
        label: 'Selected Area',
        data: fillData,
        borderColor: 'transparent',
        backgroundColor: 'rgba(217, 119, 6, 0.5)',
        borderWidth: 0,
        pointRadius: 0,
        tension: 0.4,
        fill: true
      }
    ];

    // Add vertical lines for inverse values
    if (inverseMode && calculations.inverseResults) {
      const leftLineData = new Array(xValues.length).fill(null);
      const rightLineData = new Array(xValues.length).fill(null);
      
      const leftIndex = xValues.findIndex(x => x >= calculations.inverseResults.leftValue);
      const rightIndex = xValues.findIndex(x => x >= calculations.inverseResults.rightValue);
      
      if (leftIndex !== -1) leftLineData[leftIndex] = yValues[leftIndex];
      if (rightIndex !== -1) rightLineData[rightIndex] = yValues[rightIndex];
      
      datasets.push(
        {
          label: 'Left Value',
          data: leftLineData,
          borderColor: 'rgba(78, 205, 196, 1)',
          borderWidth: 3,
          borderDash: [5, 5],
          pointRadius: 0,
          type: 'line'
        },
        {
          label: 'Right Value',
          data: rightLineData,
          borderColor: 'rgba(255, 0, 0, 1)',
          borderWidth: 3,
          borderDash: [5, 5],
          pointRadius: 0,
          type: 'line'
        }
      );
    }

    // Add standard deviation markers if enabled
    if (showStandardDeviations) {
      const sdMarkers = [];
      for (let i = -3; i <= 3; i++) {
        if (i !== 0) {
          const x = safeMean + i * safeSd;
          const markerData = new Array(xValues.length).fill(null);
          const index = xValues.findIndex(val => val >= x);
          if (index !== -1) {
            markerData[index] = NormalMath.pdf(x, safeMean, safeSd);
          }
          sdMarkers.push({
            label: `${i}σ`,
            data: markerData,
            borderColor: i === 0 ? 'rgba(255, 0, 0, 0.8)' : 'rgba(100, 100, 100, 0.5)',
            borderWidth: i === 0 ? 3 : 1,
            borderDash: [5, 5],
            pointRadius: 0,
            type: 'line'
          });
        }
      }
      datasets.push(...sdMarkers);
    }

    return {
      labels: xValues.map(x => x.toFixed(2)),
      datasets
    };
  }, [calculations, calcType, showStandardDeviations, inverseMode]);

  // Chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(42, 42, 42, 0.9)',
        callbacks: {
          title: (context) => `X = ${context[0].label}`,
          label: (context) => {
            if (context.datasetIndex === 0) {
              const x = parseFloat(context.label);
              const z = NormalMath.toZScore(x, calculations.mean, calculations.sd);
              return [
                `Density: ${context.parsed.y.toFixed(4)}`,
                `Z-score: ${z.toFixed(3)}`
              ];
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Probability Density'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Value (X)'
        }
      }
    }
  }), [calculations]);

  // Handle example selection
  const selectExample = (example) => {
    setMean(example.mean);
    setSd(example.sd);
    setValue1(example.mean);
    setValue2(example.mean + example.sd);
    announcePolite('Loaded example: ' + example.name);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-darkGrey mb-2">
            📈 Normal Distribution Calculator
          </h2>
          <p className="text-darkGrey opacity-80">
            Explore the bell curve - nature's favorite distribution pattern
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Control Panel */}
          <div className="space-y-4">
            {/* Distribution Parameters */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4 flex items-center">
                ⚙️ Distribution Parameters
                <InfoIcon info="Define the center (mean) and spread (standard deviation) of your normal distribution" />
              </h3>
              
              <div className="space-y-4">
                {/* Mean Input */}
                <div>
                  <label htmlFor="norm-mean" className="flex items-center text-darkGrey font-medium mb-2">
                    Mean (μ): {safeParse(mean, 0).toFixed(2)}
                    <InfoIcon info="The center of the bell curve - where the peak is located" />
                  </label>
                  <input
                    id="norm-mean"
                    type="number"
                    value={mean}
                    onChange={(e) => setMean(e.target.value)}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    placeholder="0"
                  />
                </div>

                {/* Standard Deviation Input */}
                <div>
                  <label htmlFor="norm-sd" className="flex items-center text-darkGrey font-medium mb-2">
                    Standard Deviation (σ): {Math.max(safeParse(sd, 1), 0.0001).toFixed(2)}
                    <InfoIcon info="The spread of the distribution - larger values create wider curves" />
                  </label>
                  <input
                    id="norm-sd"
                    type="number"
                    min="0.0001"
                    value={sd}
                    onChange={(e) => setSd(e.target.value)}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    placeholder="1"
                  />
                </div>

                {/* Quick Stats */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-bold text-darkGrey mb-1">📐 68-95-99.7 Rule:</p>
                  <div className="space-y-1 text-darkGrey/80">
                    <p>• 68% of data: {(calculations.mean - calculations.sd).toFixed(2)} to {(calculations.mean + calculations.sd).toFixed(2)}</p>
                    <p>• 95% of data: {(calculations.mean - 2*calculations.sd).toFixed(2)} to {(calculations.mean + 2*calculations.sd).toFixed(2)}</p>
                    <p>• 99.7% of data: {(calculations.mean - 3*calculations.sd).toFixed(2)} to {(calculations.mean + 3*calculations.sd).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Setup */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4 flex items-center">
                🧮 Probability Calculation
                <InfoIcon info="Choose what probability you want to calculate" />
              </h3>
              
              {/* Mode Toggle */}
              <div className="mb-4 p-3 bg-white rounded-lg border-2 border-darkGrey/20">
                <label className="block text-darkGrey font-medium mb-2">Calculation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setInverseMode(false)}
                    aria-pressed={!inverseMode}
                    className={`p-2 rounded font-medium transition-all ${
                      !inverseMode
                        ? 'bg-darkTeal text-white'
                        : 'bg-gray-100 text-darkGrey hover:bg-gray-200'
                    }`}
                  >
                    Value → Probability
                  </button>
                  <button
                    onClick={() => setInverseMode(true)}
                    aria-pressed={inverseMode}
                    className={`p-2 rounded font-medium transition-all ${
                      inverseMode
                        ? 'bg-darkTeal text-white'
                        : 'bg-gray-100 text-darkGrey hover:bg-gray-200'
                    }`}
                  >
                    Probability → Value
                  </button>
                </div>
              </div>
              
              {!inverseMode ? (
                <div className="space-y-3">
                  {/* Input Type */}
                  <div>
                    <label htmlFor="norm-input-type" className="block text-darkGrey font-medium mb-2">Input Type</label>
                    <select
                      id="norm-input-type"
                      value={inputType}
                      onChange={(e) => setInputType(e.target.value)}
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    >
                      <option value="x">X values (actual values)</option>
                      <option value="z">Z-scores (standardized)</option>
                    </select>
                  </div>

                  {/* Calculation Type */}
                  <div>
                    <label htmlFor="norm-calc-type" className="block text-darkGrey font-medium mb-2">Calculation Type</label>
                    <select
                      id="norm-calc-type"
                      value={calcType}
                      onChange={(e) => setCalcType(e.target.value)}
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                    >
                      <option value="left">P(X ≤ value) - Left tail</option>
                      <option value="right">P(X {'>'} value) - Right tail</option>
                      <option value="between">P(a {'<'} X {'<'} b) - Between two values</option>
                      <option value="outside">P(X {'<'} a or X {'>'} b) - Outside interval</option>
                    </select>
                  </div>

                  {/* Value Inputs */}
                  <div>
                    <label htmlFor="norm-value1" className="block text-darkGrey font-medium mb-2">
                      {calcType === 'between' || calcType === 'outside' ? 'First Value' : 'Value'}
                      {inputType === 'z' ? ' (Z)' : ' (X)'}
                    </label>
                    <input
                      id="norm-value1"
                      type="number"
                      value={value1}
                      onChange={(e) => setValue1(e.target.value)}
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                      placeholder="0"
                    />
                  </div>

                  {(calcType === 'between' || calcType === 'outside') && (
                    <div>
                      <label htmlFor="norm-value2" className="block text-darkGrey font-medium mb-2">
                        Second Value {inputType === 'z' ? '(Z)' : '(X)'}
                      </label>
                      <input
                        id="norm-value2"
                        type="number"
                        value={value2}
                        onChange={(e) => setValue2(e.target.value)}
                        className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                        placeholder="1"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Inverse Probability Input */}
                  <div>
                    <label htmlFor="norm-inverse-prob-range" className="flex items-center text-darkGrey font-medium mb-2">
                      Target Probability: {(safeParse(inverseProbability, 0.5) * 100).toFixed(1)}%
                      <InfoIcon info="Find X values for this cumulative probability" />
                    </label>
                    <input
                      id="norm-inverse-prob-range"
                      type="range"
                      min="0.001"
                      max="0.999"
                      step="0.001"
                      value={inverseProbability}
                      onChange={(e) => setInverseProbability(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #0F766E 0%, #0F766E ${safeParse(inverseProbability, 0.5) * 100}%, #e0e0e0 ${safeParse(inverseProbability, 0.5) * 100}%, #e0e0e0 100%)`
                      }}
                      aria-valuetext={(safeParse(inverseProbability, 0.5) * 100).toFixed(1) + " percent"}
                    />
                    <div className="mt-2">
                      <label htmlFor="norm-inverse-prob-number" className="sr-only">Target Probability</label>
                      <input
                        id="norm-inverse-prob-number"
                        type="number"
                        min="0.001"
                        max="0.999"
                        step="0.001"
                        value={inverseProbability}
                        onChange={(e) => setInverseProbability(e.target.value)}
                        className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-darkTeal outline-none"
                        placeholder="0.5"
                      />
                    </div>
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-darkGrey">
                      This will find the X value where {(safeParse(inverseProbability, 0.5) * 100).toFixed(1)}% of the data is below it, 
                      and the X value where {(safeParse(inverseProbability, 0.5) * 100).toFixed(1)}% is above it.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Display */}
            <div className="bg-accent/20 border-2 border-accent p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-3">
                🎯 Calculation Results
              </h3>
              
              {!inverseMode ? (
                <>
                  {/* Main Result */}
                  <div className="bg-white p-3 rounded-lg mb-3">
                    <p className="text-sm text-darkGrey opacity-60 mb-1">
                      {calculations.description}
                    </p>
                    <p className="text-3xl font-bold text-center text-darkGrey">
                      {calculations.probability.toFixed(4)}
                    </p>
                    <p className="text-sm text-center text-darkGrey opacity-60 mt-1">
                      {(calculations.probability * 100).toFixed(2)}% probability
                    </p>
                  </div>

                  {/* Z-scores */}
                  <div className="space-y-2 text-darkGrey">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        Z-score{calcType === 'between' || calcType === 'outside' ? ' 1' : ''}
                        <InfoIcon info="Number of standard deviations from mean" />
                      </span>
                      <span className="font-mono font-bold">{calculations.z1.toFixed(4)}</span>
                    </div>
                    {(calcType === 'between' || calcType === 'outside') && (
                      <div className="flex justify-between items-center">
                        <span>Z-score 2</span>
                        <span className="font-mono font-bold">{calculations.z2.toFixed(4)}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : calculations.inverseResults && (
                <>
                  {/* Inverse Results */}
                  <div className="bg-white p-3 rounded-lg mb-3">
                    <p className="text-sm text-darkGrey opacity-60 mb-1">
                      Finding X values for {(calculations.inverseResults.probability * 100).toFixed(1)}% probability
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="text-center p-2 bg-darkTeal/10 rounded">
                        <p className="text-xs text-darkGrey opacity-60">Left tail value</p>
                        <p className="text-xl font-bold text-darkGrey">
                          {calculations.inverseResults.leftValue.toFixed(3)}
                        </p>
                        <p className="text-xs text-darkGrey opacity-60 mt-1">
                          {(calculations.inverseResults.probability * 100).toFixed(1)}% below
                        </p>
                      </div>
                      
                      <div className="text-center p-2 bg-accent/30 rounded">
                        <p className="text-xs text-darkGrey opacity-60">Right tail value</p>
                        <p className="text-xl font-bold text-darkGrey">
                          {calculations.inverseResults.rightValue.toFixed(3)}
                        </p>
                        <p className="text-xs text-darkGrey opacity-60 mt-1">
                          {(calculations.inverseResults.probability * 100).toFixed(1)}% above
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Z-scores for inverse */}
                  <div className="space-y-2 text-darkGrey">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        Left Z-score
                        <InfoIcon info="Standard deviations below mean" />
                      </span>
                      <span className="font-mono font-bold">{calculations.inverseResults.leftZ.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        Right Z-score
                        <InfoIcon info="Standard deviations above mean" />
                      </span>
                      <span className="font-mono font-bold">{calculations.inverseResults.rightZ.toFixed(4)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-2 bg-white rounded text-xs text-darkGrey">
                    <strong>Interpretation:</strong> {(calculations.inverseResults.probability * 100).toFixed(1)}% of values fall below {calculations.inverseResults.leftValue.toFixed(3)}, 
                    and {(calculations.inverseResults.probability * 100).toFixed(1)}% fall above {calculations.inverseResults.rightValue.toFixed(3)}.
                  </div>
                </>
              )}

              {/* Display Options */}
              <div className="mt-3 pt-3 border-t border-accent space-y-2">
                <label className="flex items-center text-darkGrey text-sm">
                  <input
                    type="checkbox"
                    checked={showPercentiles}
                    onChange={(e) => setShowPercentiles(e.target.checked)}
                    className="mr-2"
                  />
                  Show Percentiles Table
                </label>
                <label className="flex items-center text-darkGrey text-sm">
                  <input
                    type="checkbox"
                    checked={showStandardDeviations}
                    onChange={(e) => setShowStandardDeviations(e.target.checked)}
                    className="mr-2"
                  />
                  Show σ markers on chart
                </label>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="space-y-4">
            {/* Chart */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4 flex items-center">
                📊 Distribution Visualization
                <InfoIcon info="The amber area represents your selected probability region" />
              </h3>
              <div className="h-96 bg-white p-2 rounded">
                <div role="img" aria-label="Normal distribution bell curve with highlighted probability area">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
              
              {/* Chart Legend */}
              <div className="mt-3 p-3 bg-white rounded-lg text-sm">
                <h4 className="font-bold text-darkGrey mb-2">📖 Chart Guide:</h4>
                <ul className="space-y-1 text-darkGrey opacity-80">
                  <li>• <span className="inline-block w-12 h-0.5 bg-darkGrey mr-1"></span> 
                    Bell curve (probability density)</li>
                  <li>• <span className="inline-block w-3 h-3 bg-accent rounded mr-1"></span>
                    {inverseMode 
                      ? `Highlighted areas = ${(calculations.inverseResults?.probability * 100).toFixed(1)}% in each tail`
                      : `Selected probability area = ${(calculations.probability * 100).toFixed(2)}%`
                    }
                  </li>
                  {inverseMode && (
                    <>
                      <li>• <span className="inline-block w-12 h-0.5 border-b-2 border-dashed border-turquoise mr-1"></span> 
                        Left value = {calculations.inverseResults?.leftValue.toFixed(3)}</li>
                      <li>• <span className="inline-block w-12 h-0.5 border-b-2 border-dashed border-red-500 mr-1"></span> 
                        Right value = {calculations.inverseResults?.rightValue.toFixed(3)}</li>
                    </>
                  )}
                  {showStandardDeviations && (
                    <li>• <span className="inline-block w-12 h-0.5 border-b border-dashed border-gray-500 mr-1"></span> 
                      Standard deviation markers</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Percentiles Table */}
            {showPercentiles && (
              <div className="bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
                <h4 className="font-bold text-darkGrey mb-3 flex items-center">
                  📊 Key Percentiles
                  <InfoIcon info="Values below which a certain percentage of data falls" />
                </h4>
                
                {/* Percentile Grid */}
                <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                  {Object.entries(calculations.percentiles).map(([key, value]) => {
                    const percentile = key.substring(1);
                    return (
                      <div key={key} className="bg-gray-50 p-2 rounded text-center">
                        <p className="font-bold text-darkGrey">{percentile}th</p>
                        <p className="font-mono text-darkTeal">{value.toFixed(3)}</p>
                      </div>
                    );
                  })}
                </div>
                
                {/* Practical Explanations */}
                <div className="bg-blue-50 p-3 rounded">
                  <h5 className="font-bold text-darkGrey mb-2">💡 What These Mean:</h5>
                  <ul className="space-y-2 text-xs text-darkGrey">
                    <li>
                      <strong>1st & 99th:</strong> Extreme values - only 1% of data is more extreme. 
                      <em className="block text-gray-600">Example: Emergency thresholds, outlier detection</em>
                    </li>
                    <li>
                      <strong>5th & 95th:</strong> Common confidence bounds - 90% of data falls between these.
                      <em className="block text-gray-600">Example: Normal ranges in medical tests</em>
                    </li>
                    <li>
                      <strong>25th & 75th:</strong> The "interquartile range" - middle 50% of your data.
                      <em className="block text-gray-600">Example: Typical performance range, salary bands</em>
                    </li>
                    <li>
                      <strong>50th (Median):</strong> The middle value - half above, half below.
                      <em className="block text-gray-600">Example: Average person's score, typical result</em>
                    </li>
                    <li>
                      <strong>10th & 90th:</strong> Often used for "acceptable range" - 80% falls between.
                      <em className="block text-gray-600">Example: Product specifications, performance targets</em>
                    </li>
                  </ul>
                  
                  <div className="mt-3 p-2 bg-accent/20 rounded">
                    <p className="text-xs font-semibold text-darkGrey">
                      🎯 Quick Reference: If you score at the {safeParse(inverseProbability, 0.5) > 0.5 ? Math.round(safeParse(inverseProbability, 0.5) * 100) : 50}th percentile, 
                      you're better than {safeParse(inverseProbability, 0.5) > 0.5 ? Math.round(safeParse(inverseProbability, 0.5) * 100) : 50}% of the population!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Examples Section */}
        <div className="mt-6 bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-darkGrey mb-3 flex items-center">
            💡 Real-World Examples
            <InfoIcon info="Click any example to load it into the calculator" />
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {NORMAL_EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => selectExample(example)}
                className="p-3 bg-platinum hover:bg-darkTeal/20 rounded transition-all text-left group"
              >
                <div className="font-bold text-darkGrey group-hover:text-darkTeal">
                  {example.name}
                </div>
                <div className="text-sm text-darkGrey opacity-70">
                  μ = {example.mean}, σ = {example.sd}
                </div>
                <div className="text-xs text-darkGrey opacity-50 mt-1">
                  {example.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-turquoise/10 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-darkGrey mb-3">
            🎓 Understanding Normal Distribution
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/80 p-3 rounded">
              <h4 className="font-bold text-darkTeal mb-2">Key Properties:</h4>
              <ul className="space-y-1 text-darkGrey">
                <li>✓ Symmetric bell-shaped curve</li>
                <li>✓ Mean = Median = Mode</li>
                <li>✓ Defined by μ (mean) and σ (std dev)</li>
                <li>✓ Total area under curve = 1.0</li>
                <li>✓ Asymptotic tails (never touch x-axis)</li>
              </ul>
            </div>
            
            <div className="bg-white/80 p-3 rounded">
              <h4 className="font-bold text-darkTeal mb-2">Z-Score Interpretation:</h4>
              <ul className="space-y-1 text-darkGrey">
                <li>• Z = 0: At the mean</li>
                <li>• Z = ±1: One std dev from mean</li>
                <li>• Z = ±2: Two std devs (unusual)</li>
                <li>• Z = ±3: Three std devs (rare)</li>
                <li>• |Z| {'>'} 3: Very rare events</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-accent/20 rounded">
            <strong className="text-darkGrey">💡 Pro Tip:</strong>
            <span className="text-darkGrey ml-2">
              The normal distribution appears everywhere in nature due to the Central Limit Theorem. 
              When many small, independent factors add up, the result tends to be normally distributed!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalDistributionCalculator;