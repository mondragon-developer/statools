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

import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { jStat } from 'jstat';
import InfoIcon from './InfoIcon';

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
  testStatistic: 'rgba(255, 215, 0, 1)',
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
 * Main HypothesisTestCalculator component
 * Handles hypothesis testing calculations and visualizations
 */
const HypothesisTestCalculator = () => {
  // State management
  const [testType, setTestType] = useState(TEST_TYPES.PROPORTION);
  const [tailType, setTailType] = useState(TAIL_TYPES.TWO);
  const [includeConfidenceInterval, setIncludeConfidenceInterval] = useState(false);
  const [inputs, setInputs] = useState(DEFAULT_VALUES.proportion);
  const [result, setResult] = useState({});
  const [chartData, setChartData] = useState(null);
  const [showErrorExplanation, setShowErrorExplanation] = useState(false);

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
    if (isNaN(p_hat) || isNaN(p_0) || isNaN(n) || isNaN(alpha)) {
      alert("Please fill in all fields with valid numbers");
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
      distribution: DISTRIBUTION_TYPES.Z
    });

    createVisualization(z, criticalValue, DISTRIBUTION_TYPES.Z);
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
    if (isNaN(x_bar) || isNaN(mu_0) || isNaN(n) || isNaN(s) || isNaN(alpha)) {
      alert("Please fill in all fields with valid numbers");
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
      df: distribution === DISTRIBUTION_TYPES.T ? df : null
    });

    createVisualization(testStat, criticalValue, distribution, df);
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

    // criticalMarkers.forEach((cv, index) => {
    //   datasets.push({
    //     label: index === 0 ? 'Critical Value(s)' : '',
    //     data: xValues.map(x => Math.abs(x - cv) < 0.02 ? 0.5 : null),
    //     borderColor: CHART_COLORS.criticalValue,
    //     backgroundColor: CHART_COLORS.criticalValue,
    //     borderWidth: 3,
    //     pointRadius: 0,
    //     borderDash: [5, 5],
    //     order: 0
    //   });
    // });

    // // Add test statistic marker
    // datasets.push({
    //   label: 'Test Statistic',
    //   data: [{x: testStatistic, y: 0}],
    //   borderColor: CHART_COLORS.testStatistic,
    //   backgroundColor: CHART_COLORS.testStatistic,
    //   pointRadius: 10,
    //   pointStyle: 'triangle',
    //   pointBorderWidth: 3,
    //   showLine: false,
    //   order: -1
    // });

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
                  <label className="block text-darkGrey font-medium mb-2">Test Type</label>
                  <select 
                    value={testType} 
                    onChange={handleTestTypeChange}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                  >
                    <option value={TEST_TYPES.PROPORTION}>Proportion Test (Z-test)</option>
                    <option value={TEST_TYPES.MEAN}>Mean Test (Z or t-test)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-darkGrey font-medium mb-2">Tail Type</label>
                  <select 
                    value={tailType} 
                    onChange={(e) => setTailType(e.target.value)}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                  >
                    <option value={TAIL_TYPES.TWO}>Two-Tailed (≠)</option>
                    <option value={TAIL_TYPES.RIGHT}>Right-Tailed ({"<"})</option>
                    <option value={TAIL_TYPES.LEFT}>Left-Tailed ({"<"})</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Input Values */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4">Input Values</h3>
              
              {testType === TEST_TYPES.PROPORTION ? (
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center text-darkGrey font-medium mb-1">
                      Sample Proportion (p̂)
                      <InfoIcon info="The observed proportion in your sample" />
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      name="sampleProportion"
                      value={inputs.sampleProportion || ""}
                      onChange={handleChange}
                      placeholder="e.g., 0.65"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-darkGrey font-medium mb-1">
                      Hypothesized Proportion (p₀)
                      <InfoIcon info="The proportion stated in the null hypothesis" />
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      name="hypothesizedProportion"
                      value={inputs.hypothesizedProportion || ""}
                      onChange={handleChange}
                      placeholder="e.g., 0.50"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-darkGrey font-medium mb-1">
                      Sample Size (n)
                      <InfoIcon info="The number of observations in your sample" />
                    </label>
                    <input
                      type="number"
                      name="sampleSize"
                      value={inputs.sampleSize || ""}
                      onChange={handleChange}
                      placeholder="e.g., 100"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-darkGrey font-medium mb-1">
                      Significance Level (α)
                      <InfoIcon info="The probability of Type I error (typically 0.05)" />
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="significanceLevel"
                      value={inputs.significanceLevel || ""}
                      onChange={handleChange}
                      placeholder="e.g., 0.05"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center text-darkGrey font-medium mb-1">
                      Sample Mean (x̄)
                      <InfoIcon info="The average of your sample data" />
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      name="sampleMean"
                      value={inputs.sampleMean || ""}
                      onChange={handleChange}
                      placeholder="e.g., 25.5"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-darkGrey font-medium mb-1">
                      Hypothesized Mean (μ₀)
                      <InfoIcon info="The mean stated in the null hypothesis" />
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      name="hypothesizedMean"
                      value={inputs.hypothesizedMean || ""}
                      onChange={handleChange}
                      placeholder="e.g., 24.0"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-darkGrey font-medium mb-1">
                      Sample Size (n)
                      <InfoIcon info="The number of observations in your sample" />
                    </label>
                    <input
                      type="number"
                      name="sampleSize"
                      value={inputs.sampleSize || ""}
                      onChange={handleChange}
                      placeholder="e.g., 30"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center text-darkGrey font-medium mb-1">
                      Standard Deviation (σ or s)
                      <InfoIcon info="Population (σ) or sample (s) standard deviation" />
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      name="stdDev"
                      value={inputs.stdDev || ""}
                      onChange={handleChange}
                      placeholder="e.g., 3.5"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
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
                    <label className="flex items-center text-darkGrey font-medium mb-1">
                      Significance Level (α)
                      <InfoIcon info="The probability of Type I error (typically 0.05)" />
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="significanceLevel"
                      value={inputs.significanceLevel || ""}
                      onChange={handleChange}
                      placeholder="e.g., 0.05"
                      className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
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
                className="mt-4 w-full bg-yellow border-2 border-darkGrey text-darkGrey px-4 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all"
              >
                Calculate Test
              </button>
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
                    {chartData && <Line data={chartData} options={chartOptions} />}
                  </div>
                  <div className="mt-2 text-xs text-darkGrey">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-yellow-400 mr-1"></span>
                        Test Statistic: {result.testStatistic}
                      </span>
                      <span className="flex items-center">
                        <span className="inline-block w-3 h-3 mr-1" style={{backgroundColor: CHART_COLORS.criticalValue}}></span>
                        Critical Value(s): {result.criticalValue}
                      </span>
                    </div>
                    <p className="mt-1">
                      <span className="text-red-500">Red area:</span> Rejection region | 
                      <span className="text-turquoise ml-2">Turquoise area:</span> Acceptance region
                    </p>
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
                  <p className="text-sm text-darkGrey opacity-80 mt-1">
                    {result.reject 
                      ? `The evidence is statistically significant at α = ${inputs.significanceLevel}`
                      : `The evidence is not statistically significant at α = ${inputs.significanceLevel}`}
                  </p>
                  {result.reject && (
                    <p className="text-sm text-darkGrey mt-2 italic">
                      Note: Rejecting H₀ doesn't prove H₁ is true - it means the data is unlikely under H₀
                    </p>
                  )}
                </div>

                {/* Test Results */}
                <div className="bg-yellow/20 border-2 border-yellow p-4 rounded-lg">
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
                  <div className="mt-3 pt-3 border-t border-yellow/50">
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
      </div>
    </div>
  );
};

export default HypothesisTestCalculator;