/**
 * CorrelationRegressionCalculator.jsx
 *
 * Comprehensive calculator for correlation and linear regression analysis.
 * Calculates correlation coefficient, regression equation, and provides predictions.
 * Includes scatter plot visualization with regression line.
 *
 * Dependencies: Chart.js, react-chartjs-2
 *
 * @component
 * @version 1.0.0
 */

import React, { useState, useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import InfoIcon from "./InfoIcon";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Configuration constants
const MAX_INPUT_COUNT = 1000;
const CHART_COLORS = {
  points: 'rgba(78, 205, 196, 0.8)',
  line: 'rgba(255, 255, 0, 1)',
  residuals: 'rgba(255, 0, 0, 0.6)'
};

// Sample datasets for testing
const SAMPLE_DATASETS = [
  {
    name: "Study Hours vs Exam Scores",
    dataX: "2, 4, 5, 6, 8, 10, 12, 15, 18, 20",
    dataY: "65, 75, 78, 82, 88, 92, 95, 98, 99, 100",
    description: "Strong positive correlation (r ≈ 0.98)"
  },
  {
    name: "Temperature vs Ice Cream Sales",
    dataX: "65, 70, 75, 80, 85, 90, 95, 100",
    dataY: "120, 180, 240, 310, 400, 520, 650, 800",
    description: "Strong positive correlation (r ≈ 0.99)"
  },
  {
    name: "Price vs Demand",
    dataX: "10, 15, 20, 25, 30, 35, 40, 45",
    dataY: "500, 400, 320, 250, 200, 160, 130, 100",
    description: "Strong negative correlation (r ≈ -0.98)"
  },
  {
    name: "Age vs Reaction Time",
    dataX: "20, 25, 30, 35, 40, 45, 50, 55, 60, 65",
    dataY: "180, 185, 190, 200, 210, 225, 240, 260, 280, 305",
    description: "Moderate positive correlation (r ≈ 0.96)"
  }
];

const CorrelationRegressionCalculator = () => {
  // State management
  const [inputX, setInputX] = useState("");
  const [inputY, setInputY] = useState("");
  const [result, setResult] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [showResiduals, setShowResiduals] = useState(false);
  const [predictionX, setPredictionX] = useState("");
  const [predictionY, setPredictionY] = useState(null);

  /**
   * Parse input string into array of numbers
   * Supports comma or space separation
   */
  const parseInputNumbers = (input) => {
    if (!input.trim()) return [];

    const numbers = input
      .trim()
      .split(/[,\s]+/)
      .map(num => parseFloat(num.trim()))
      .filter(num => !isNaN(num));

    return numbers.slice(0, MAX_INPUT_COUNT);
  };

  /**
   * Calculate mean (average)
   */
  const calculateMean = (arr) => {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  };

  /**
   * Calculate standard deviation
   */
  const calculateStdDev = (arr, mean) => {
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  };

  /**
   * Calculate correlation and regression statistics
   */
  const calculateStatistics = () => {
    const xValues = parseInputNumbers(inputX);
    const yValues = parseInputNumbers(inputY);

    // Validation
    if (xValues.length === 0 || yValues.length === 0) {
      alert("Please enter data for both X and Y variables.");
      return;
    }

    if (xValues.length !== yValues.length) {
      alert(`Error: X has ${xValues.length} values but Y has ${yValues.length} values. Both must have the same number of values.`);
      return;
    }

    if (xValues.length < 2) {
      alert("Please enter at least 2 data pairs.");
      return;
    }

    const n = xValues.length;

    // Calculate means
    const meanX = calculateMean(xValues);
    const meanY = calculateMean(yValues);

    // Calculate sums for regression
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;
    let sumX = 0;
    let sumY = 0;

    for (let i = 0; i < n; i++) {
      sumX += xValues[i];
      sumY += yValues[i];
      sumXY += xValues[i] * yValues[i];
      sumX2 += xValues[i] * xValues[i];
      sumY2 += yValues[i] * yValues[i];
    }

    // Calculate correlation coefficient (r)
    const numerator = n * sumXY - sumX * sumY;
    const denominatorX = Math.sqrt(n * sumX2 - sumX * sumX);
    const denominatorY = Math.sqrt(n * sumY2 - sumY * sumY);
    const r = numerator / (denominatorX * denominatorY);

    // Calculate coefficient of determination (R²)
    const r2 = r * r;

    // Calculate regression equation: y = a + bx
    // Slope (b)
    const slope = numerator / (n * sumX2 - sumX * sumX);
    // Intercept (a)
    const intercept = meanY - slope * meanX;

    // Calculate standard error of estimate
    let sumSquaredErrors = 0;
    for (let i = 0; i < n; i++) {
      const predicted = slope * xValues[i] + intercept;
      sumSquaredErrors += Math.pow(yValues[i] - predicted, 2);
    }
    const standardError = Math.sqrt(sumSquaredErrors / (n - 2));

    // Calculate residuals
    const residuals = xValues.map((x, i) => {
      const predicted = slope * x + intercept;
      return {
        x: x,
        actual: yValues[i],
        predicted: predicted,
        residual: yValues[i] - predicted
      };
    });

    // Interpret correlation strength
    const absR = Math.abs(r);
    let strength;
    if (absR >= 0.9) strength = "Very Strong";
    else if (absR >= 0.7) strength = "Strong";
    else if (absR >= 0.5) strength = "Moderate";
    else if (absR >= 0.3) strength = "Weak";
    else strength = "Very Weak";

    const direction = r >= 0 ? "Positive" : "Negative";

    setResult({
      n,
      meanX,
      meanY,
      r,
      r2,
      slope,
      intercept,
      standardError,
      residuals,
      xValues,
      yValues,
      strength,
      direction
    });

    setShowChart(true);
    setPredictionY(null);
  };

  /**
   * Make prediction based on regression equation
   */
  const makePrediction = () => {
    if (!result) {
      alert("Please calculate regression first.");
      return;
    }

    const x = parseFloat(predictionX);
    if (isNaN(x)) {
      alert("Please enter a valid number for X.");
      return;
    }

    const predicted = result.slope * x + result.intercept;
    setPredictionY(predicted);
  };

  /**
   * Load sample dataset
   */
  const loadSample = (index) => {
    const sample = SAMPLE_DATASETS[index];
    setInputX(sample.dataX);
    setInputY(sample.dataY);
    setResult(null);
    setShowChart(false);
    setPredictionY(null);
  };

  /**
   * Clear all inputs
   */
  const clearInputs = () => {
    setInputX("");
    setInputY("");
    setResult(null);
    setShowChart(false);
    setPredictionX("");
    setPredictionY(null);
  };

  /**
   * Generate chart data for scatter plot with regression line
   */
  const chartData = useMemo(() => {
    if (!result || !showChart) return null;

    const datasets = [
      {
        label: 'Data Points',
        data: result.xValues.map((x, i) => ({ x, y: result.yValues[i] })),
        backgroundColor: CHART_COLORS.points,
        borderColor: CHART_COLORS.points,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ];

    // Add regression line
    const minX = Math.min(...result.xValues);
    const maxX = Math.max(...result.xValues);
    const linePoints = [
      { x: minX, y: result.slope * minX + result.intercept },
      { x: maxX, y: result.slope * maxX + result.intercept }
    ];

    datasets.push({
      label: 'Regression Line',
      data: linePoints,
      type: 'line',
      borderColor: CHART_COLORS.line,
      backgroundColor: CHART_COLORS.line,
      borderWidth: 3,
      pointRadius: 0,
      fill: false
    });

    return {
      datasets
    };
  }, [result, showChart]);

  /**
   * Generate residual plot data
   */
  const residualChartData = useMemo(() => {
    if (!result || !showResiduals) return null;

    return {
      datasets: [
        {
          label: 'Residuals',
          data: result.residuals.map(r => ({ x: r.x, y: r.residual })),
          backgroundColor: CHART_COLORS.residuals,
          borderColor: CHART_COLORS.residuals,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Zero Line',
          data: [
            { x: Math.min(...result.xValues), y: 0 },
            { x: Math.max(...result.xValues), y: 0 }
          ],
          type: 'line',
          borderColor: '#2A2A2A',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          borderDash: [5, 5]
        }
      ]
    };
  }, [result, showResiduals]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Scatter Plot with Regression Line',
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X Variable',
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Y Variable',
          font: { size: 14, weight: 'bold' }
        }
      }
    }
  };

  const residualChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Residual Plot',
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X Variable',
          font: { size: 14, weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Residuals',
          font: { size: 14, weight: 'bold' }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-platinum py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-darkGrey mb-3">
            Correlation & Linear Regression Calculator
          </h1>
          <p className="text-darkGrey opacity-80">
            Analyze relationships between two variables. Calculate correlation, determine regression equation, and make predictions.
          </p>
        </div>

        {/* Sample Datasets */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-darkGrey mb-3 flex items-center gap-2">
            Sample Datasets
            <InfoIcon info="Click to load pre-configured example data for quick testing" />
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMPLE_DATASETS.map((sample, index) => (
              <button
                key={index}
                onClick={() => loadSample(index)}
                className="p-3 bg-turquoise/10 hover:bg-turquoise/20 border-2 border-turquoise rounded-lg text-left transition-all"
              >
                <div className="font-semibold text-darkGrey text-sm">{sample.name}</div>
                <div className="text-xs text-darkGrey opacity-70 mt-1">{sample.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-darkGrey mb-4 flex items-center gap-2">
            Enter Data
            <InfoIcon info="Enter values separated by commas or spaces. Both X and Y must have the same number of values (max 1000 pairs)." />
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* X Variable Input */}
            <div>
              <label className="block text-darkGrey font-semibold mb-2">
                X Variable (Independent)
              </label>
              <textarea
                value={inputX}
                onChange={(e) => setInputX(e.target.value)}
                placeholder="Example: 1, 2, 3, 4, 5 or 1 2 3 4 5"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-turquoise focus:outline-none resize-none"
                rows="5"
              />
              <div className="text-sm text-darkGrey opacity-70 mt-1">
                Values: {parseInputNumbers(inputX).length} / {MAX_INPUT_COUNT}
              </div>
            </div>

            {/* Y Variable Input */}
            <div>
              <label className="block text-darkGrey font-semibold mb-2">
                Y Variable (Dependent)
              </label>
              <textarea
                value={inputY}
                onChange={(e) => setInputY(e.target.value)}
                placeholder="Example: 10, 20, 30, 40, 50 or 10 20 30 40 50"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-turquoise focus:outline-none resize-none"
                rows="5"
              />
              <div className="text-sm text-darkGrey opacity-70 mt-1">
                Values: {parseInputNumbers(inputY).length} / {MAX_INPUT_COUNT}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={calculateStatistics}
              className="px-6 py-3 bg-turquoise text-white rounded-lg hover:bg-turquoise/90 font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Calculate
            </button>
            <button
              onClick={clearInputs}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <>
            {/* Statistics Results */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-darkGrey mb-4">Statistical Results</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Sample Size */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-darkGrey opacity-70 mb-1">Sample Size</div>
                  <div className="text-2xl font-bold text-darkGrey">{result.n}</div>
                </div>

                {/* Correlation Coefficient */}
                <div className="p-4 bg-turquoise/10 rounded-lg border-2 border-turquoise">
                  <div className="text-sm text-darkGrey opacity-70 mb-1 flex items-center gap-1">
                    Correlation (r)
                    <InfoIcon info="Measures strength and direction of linear relationship. Range: -1 to +1" />
                  </div>
                  <div className="text-2xl font-bold text-darkGrey">{result.r.toFixed(4)}</div>
                  <div className="text-sm text-turquoise font-semibold mt-1">
                    {result.strength} {result.direction}
                  </div>
                </div>

                {/* R-Squared */}
                <div className="p-4 bg-yellow/10 rounded-lg border-2 border-yellow">
                  <div className="text-sm text-darkGrey opacity-70 mb-1 flex items-center gap-1">
                    R² (R-Squared)
                    <InfoIcon info="Percentage of variance in Y explained by X. Higher is better fit." />
                  </div>
                  <div className="text-2xl font-bold text-darkGrey">{(result.r2 * 100).toFixed(2)}%</div>
                  <div className="text-sm text-darkGrey opacity-70 mt-1">
                    {result.r2.toFixed(4)}
                  </div>
                </div>

                {/* Mean X */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-darkGrey opacity-70 mb-1">Mean of X</div>
                  <div className="text-2xl font-bold text-darkGrey">{result.meanX.toFixed(4)}</div>
                </div>

                {/* Mean Y */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-darkGrey opacity-70 mb-1">Mean of Y</div>
                  <div className="text-2xl font-bold text-darkGrey">{result.meanY.toFixed(4)}</div>
                </div>

                {/* Standard Error */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-darkGrey opacity-70 mb-1 flex items-center gap-1">
                    Standard Error
                    <InfoIcon info="Average distance of data points from regression line" />
                  </div>
                  <div className="text-2xl font-bold text-darkGrey">{result.standardError.toFixed(4)}</div>
                </div>
              </div>

              {/* Regression Equation */}
              <div className="p-6 bg-gradient-to-r from-turquoise/20 to-yellow/20 rounded-lg border-2 border-turquoise">
                <h3 className="text-lg font-bold text-darkGrey mb-3 flex items-center gap-2">
                  Regression Equation
                  <InfoIcon info="Use this equation to predict Y values from X values" />
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-darkGrey mb-2">
                    ŷ = {result.intercept >= 0 ? '' : ''}{result.intercept.toFixed(4)} + ({result.slope.toFixed(4)})x
                  </div>
                  <div className="text-sm text-darkGrey opacity-80">
                    where ŷ is the predicted value of Y
                  </div>
                </div>
              </div>
            </div>

            {/* Prediction Tool */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-darkGrey mb-4 flex items-center gap-2">
                Make Predictions
                <InfoIcon info="Enter an X value to predict the corresponding Y value using the regression equation" />
              </h2>

              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-darkGrey font-semibold mb-2">
                    Enter X value:
                  </label>
                  <input
                    type="number"
                    value={predictionX}
                    onChange={(e) => setPredictionX(e.target.value)}
                    placeholder="Enter X value"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-turquoise focus:outline-none"
                  />
                </div>
                <button
                  onClick={makePrediction}
                  className="px-6 py-3 bg-turquoise text-white rounded-lg hover:bg-turquoise/90 font-semibold transition-all"
                >
                  Predict Y
                </button>
              </div>

              {predictionY !== null && (
                <div className="mt-4 p-4 bg-yellow/20 border-2 border-yellow rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-darkGrey opacity-80 mb-1">Predicted Y value:</div>
                    <div className="text-3xl font-bold text-darkGrey">
                      {predictionY.toFixed(4)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Visualization */}
            {showChart && chartData && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-darkGrey">Visualization</h2>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showResiduals}
                      onChange={(e) => setShowResiduals(e.target.checked)}
                      className="w-5 h-5 text-turquoise"
                    />
                    <span className="text-darkGrey font-semibold">Show Residual Plot</span>
                  </label>
                </div>

                <div className="h-96 mb-6">
                  <Scatter data={chartData} options={chartOptions} />
                </div>

                {showResiduals && residualChartData && (
                  <div className="h-96">
                    <Scatter data={residualChartData} options={residualChartOptions} />
                  </div>
                )}
              </div>
            )}

            {/* Interpretation Guide */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-darkGrey mb-4">Interpretation Guide</h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-darkGrey mb-2">Correlation Coefficient (r)</h3>
                  <ul className="list-disc list-inside text-darkGrey opacity-90 space-y-1 text-sm">
                    <li>r = 1: Perfect positive correlation</li>
                    <li>r = 0: No linear correlation</li>
                    <li>r = -1: Perfect negative correlation</li>
                    <li>|r| {'>'} 0.7: Strong correlation</li>
                    <li>0.3 {'<'} |r| {'<'} 0.7: Moderate correlation</li>
                    <li>|r| {'<'} 0.3: Weak correlation</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-bold text-darkGrey mb-2">R-Squared (R²)</h3>
                  <p className="text-darkGrey opacity-90 text-sm">
                    R² = {(result.r2 * 100).toFixed(2)}% means that {(result.r2 * 100).toFixed(2)}% of the variation in Y can be explained by X.
                    The remaining {(100 - result.r2 * 100).toFixed(2)}% is due to other factors.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-bold text-darkGrey mb-2">Regression Equation</h3>
                  <p className="text-darkGrey opacity-90 text-sm">
                    <strong>Slope ({result.slope.toFixed(4)}):</strong> For every 1-unit increase in X, Y {result.slope >= 0 ? 'increases' : 'decreases'} by {Math.abs(result.slope).toFixed(4)} units on average.
                  </p>
                  <p className="text-darkGrey opacity-90 text-sm mt-2">
                    <strong>Intercept ({result.intercept.toFixed(4)}):</strong> When X = 0, the predicted Y value is {result.intercept.toFixed(4)}.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CorrelationRegressionCalculator;
