import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { jStat } from 'jstat';
import InfoIcon from './InfoIcon';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

/**
 * NORMAL DISTRIBUTION CALCULATOR: THE BELL CURVE EXPLORER
 * 
 * Architecture Overview:
 * This calculator is like a GPS for the statistical world's most famous curve - the bell curve.
 * Just as GPS helps you navigate physical space, this tool helps you navigate probability space.
 * 
 * Real-World Applications:
 * 1. Test Scores - Finding percentiles and grade boundaries
 * 2. Quality Control - Determining acceptable tolerance ranges
 * 3. Medical Tests - Understanding test results and reference ranges
 * 4. Financial Analysis - Risk assessment and portfolio management
 * 5. Natural Phenomena - Heights, weights, measurement errors
 * 
 * The Normal Distribution Recipe:
 * - Two key ingredients: μ (mean) and σ (standard deviation)
 * - The 68-95-99.7 rule: Most data falls within 3 standard deviations
 * - Z-scores: The universal language of normal distributions
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
  // State management - with safe default values
  const [mean, setMean] = useState(0);
  const [sd, setSd] = useState(1);
  const [inputType, setInputType] = useState('x'); // 'x' or 'z'
  const [calcType, setCalcType] = useState('left');
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(1);
  const [showPercentiles, setShowPercentiles] = useState(true);
  const [showStandardDeviations, setShowStandardDeviations] = useState(true);

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
      sd: safeSd
    };
  }, [mean, sd, inputType, calcType, value1, value2]);

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

      // Determine if this point should be filled based on calcType
      let shouldFill = false;
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
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
        borderWidth: 0,
        pointRadius: 0,
        tension: 0.4,
        fill: true
      }
    ];

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
  }, [calculations, calcType, showStandardDeviations]);

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
                  <label className="flex items-center text-darkGrey font-medium mb-2">
                    Mean (μ): {safeParse(mean, 0).toFixed(2)}
                    <InfoIcon info="The center of the bell curve - where the peak is located" />
                  </label>
                  <input
                    type="number"
                    value={mean}
                    onChange={(e) => setMean(e.target.value)}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                    placeholder="0"
                  />
                </div>

                {/* Standard Deviation Input */}
                <div>
                  <label className="flex items-center text-darkGrey font-medium mb-2">
                    Standard Deviation (σ): {Math.max(safeParse(sd, 1), 0.0001).toFixed(2)}
                    <InfoIcon info="The spread of the distribution - larger values create wider curves" />
                  </label>
                  <input
                    type="number"
                    min="0.0001"
                    value={sd}
                    onChange={(e) => setSd(e.target.value)}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
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
              
              <div className="space-y-3">
                {/* Input Type */}
                <div>
                  <label className="block text-darkGrey font-medium mb-2">Input Type</label>
                  <select
                    value={inputType}
                    onChange={(e) => setInputType(e.target.value)}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                  >
                    <option value="x">X values (actual values)</option>
                    <option value="z">Z-scores (standardized)</option>
                  </select>
                </div>

                {/* Calculation Type */}
                <div>
                  <label className="block text-darkGrey font-medium mb-2">Calculation Type</label>
                  <select
                    value={calcType}
                    onChange={(e) => setCalcType(e.target.value)}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                  >
                    <option value="left">P(X ≤ value) - Left tail</option>
                    <option value="right">P(X {'>'} value) - Right tail</option>
                    <option value="between">P(a {'<'} X {'<'} b) - Between two values</option>
                    <option value="outside">P(X {'<'} a or X {'>'} b) - Outside interval</option>
                  </select>
                </div>

                {/* Value Inputs */}
                <div>
                  <label className="block text-darkGrey font-medium mb-2">
                    {calcType === 'between' || calcType === 'outside' ? 'First Value' : 'Value'}
                    {inputType === 'z' ? ' (Z)' : ' (X)'}
                  </label>
                  <input
                    type="number"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                    placeholder="0"
                  />
                </div>

                {(calcType === 'between' || calcType === 'outside') && (
                  <div>
                    <label className="block text-darkGrey font-medium mb-2">
                      Second Value {inputType === 'z' ? '(Z)' : '(X)'}
                    </label>
                    <input
                      type="number"
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                      placeholder="1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Results Display */}
            <div className="bg-yellow/20 border-2 border-yellow p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-3">
                🎯 Calculation Results
              </h3>
              
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

              {/* Display Options */}
              <div className="mt-3 pt-3 border-t border-yellow space-y-2">
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
                <InfoIcon info="The yellow area represents your selected probability region" />
              </h3>
              <div className="h-96 bg-white p-2 rounded">
                <Line data={chartData} options={chartOptions} />
              </div>
              
              {/* Chart Legend */}
              <div className="mt-3 p-3 bg-white rounded-lg text-sm">
                <h4 className="font-bold text-darkGrey mb-2">📖 Chart Guide:</h4>
                <ul className="space-y-1 text-darkGrey opacity-80">
                  <li>• <span className="inline-block w-12 h-0.5 bg-darkGrey mr-1"></span> 
                    Bell curve (probability density)</li>
                  <li>• <span className="inline-block w-3 h-3 bg-yellow rounded mr-1"></span> 
                    Selected probability area = {(calculations.probability * 100).toFixed(2)}%</li>
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
                <h4 className="font-bold text-darkGrey mb-3">📊 Key Percentiles</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {Object.entries(calculations.percentiles).map(([key, value]) => {
                    const percentile = key.substring(1);
                    return (
                      <div key={key} className="bg-gray-50 p-2 rounded text-center">
                        <p className="font-bold text-darkGrey">{percentile}th</p>
                        <p className="font-mono text-turquoise">{value.toFixed(3)}</p>
                      </div>
                    );
                  })}
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
                className="p-3 bg-platinum hover:bg-turquoise/20 rounded transition-all text-left group"
              >
                <div className="font-bold text-darkGrey group-hover:text-turquoise">
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
              <h4 className="font-bold text-turquoise mb-2">Key Properties:</h4>
              <ul className="space-y-1 text-darkGrey">
                <li>✓ Symmetric bell-shaped curve</li>
                <li>✓ Mean = Median = Mode</li>
                <li>✓ Defined by μ (mean) and σ (std dev)</li>
                <li>✓ Total area under curve = 1.0</li>
                <li>✓ Asymptotic tails (never touch x-axis)</li>
              </ul>
            </div>
            
            <div className="bg-white/80 p-3 rounded">
              <h4 className="font-bold text-turquoise mb-2">Z-Score Interpretation:</h4>
              <ul className="space-y-1 text-darkGrey">
                <li>• Z = 0: At the mean</li>
                <li>• Z = ±1: One std dev from mean</li>
                <li>• Z = ±2: Two std devs (unusual)</li>
                <li>• Z = ±3: Three std devs (rare)</li>
                <li>• |Z| {'>'} 3: Very rare events</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-yellow/20 rounded">
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