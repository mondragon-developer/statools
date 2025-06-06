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

import React, { useState, useEffect, useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Scatter } from 'react-chartjs-2';
import InfoIcon from "./InfoIcon";

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
  },
  boxplot: {
    box: 'rgba(78, 205, 196, 0.3)',
    median: 'rgba(42, 42, 42, 1)',
    whisker: 'rgba(42, 42, 42, 0.8)',
    outlier: 'rgba(255, 0, 0, 0.8)'
  }
};

const SAMPLE_DATASETS = [
  {
    name: "Normal Distribution (Heights)",
    data: "68 72 75 70 74 71 69 73 76 72 70 74 71 73 75 69 72 74 71 73",
    description: "Typical bell curve distribution"
  },
  {
    name: "Symmetric Distribution",
    data: "5 5 5 4 4 6 6 3 3 7 7 2 2 8 8 1 1 9 9 5 5 5",
    description: "Balanced around center"
  },
  {
    name: "Right-Skewed (Income Data)",
    data: "1 1 2 2 2 3 3 3 3 4 4 4 5 5 6 6 7 8 9 15 20 25 30",
    description: "Long tail to the right"
  }
];

const MAX_INPUT_COUNT = 100;
const DEFAULT_BIN_COUNT = 5;
const MIN_BINS = 3;
const MAX_BINS = 15;

/**
 * Main StatisticsCalculator component
 * Handles statistical calculations and data visualization
 */
const StatisticsCalculator = () => {
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
  const [showBoxPlotModal, setShowBoxPlotModal] = useState(false);

  /**
   * Update visualizations when parameters change
   * Triggered by changes to histogram configuration
   */
  useEffect(() => {
    if (result.mean !== undefined) {
      const numbers = parseInputNumbers();
      if (numbers.length > 0) {
        generateChartData(numbers, parseFloat(result.outlierMin), parseFloat(result.outlierMax));
      }
    }
  }, [binCount, classWidth, minBoundary, chartType]);

  /**
   * Parse input string into array of numbers
   * @returns {number[]} Array of parsed numbers
   */
  const parseInputNumbers = () => {
    return input.trim().split(/\s+/).map(Number).filter(n => !isNaN(n));
  };

  /**
   * Main calculation function
   * Computes all statistical measures and initiates visualization
   */
  const calculateStatistics = () => {
    const numbers = parseInputNumbers();
    
    // Input validation
    if (numbers.length === 0) {
      alert("Please enter valid numbers separated by spaces.");
      return;
    }
    
    if (numbers.length > MAX_INPUT_COUNT) {
      alert(`Please enter no more than ${MAX_INPUT_COUNT} numbers.`);
      return;
    }

    // Calculate statistical measures
    const stats = calculateAllStatistics(numbers);
    setResult(formatResult(stats));
    
    // Set intelligent defaults for histogram
    const suggestedMin = Math.floor(stats.min / 10) * 10;
    setMinBoundary(suggestedMin);
    
    const suggestedWidth = Math.ceil(stats.range / binCount);
    setClassWidth(suggestedWidth);
    
    // Generate visualization
    generateChartData(numbers, stats.outlierMin, stats.outlierMax);
    setShowChart(true);
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
    
    // Variance and standard deviation (sample)
    const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);
    
    // Quartiles
    const q1 = calculatePercentile(sorted, 0.25);
    const q3 = calculatePercentile(sorted, 0.75);
    const iqr = q3 - q1;
    
    // Outlier boundaries (1.5 * IQR method)
    const outlierMin = q1 - 1.5 * iqr;
    const outlierMax = q3 + 1.5 * iqr;

    return {
      min, max, range, mean, median, stdDev, variance,
      q1, q3, iqr, outlierMin, outlierMax
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
      formatted[key] = stats[key].toFixed(4);
    });
    return formatted;
  };

  /**
   * Generate appropriate chart data based on selected type
   * @param {number[]} numbers - Input data
   * @param {number} outlierMin - Lower outlier boundary
   * @param {number} outlierMax - Upper outlier boundary
   */
  const generateChartData = (numbers, outlierMin, outlierMax) => {
    switch (chartType) {
      case CHART_TYPES.HISTOGRAM:
        generateHistogram(numbers, outlierMin, outlierMax);
        break;
      case CHART_TYPES.BAR:
        generateBarChart(numbers, outlierMin, outlierMax);
        break;
      case CHART_TYPES.BOXPLOT:
        generateBoxPlot(numbers, outlierMin, outlierMax);
        break;
    }
  };

  /**
   * Generate histogram data with frequency distribution
   * Creates bins and calculates frequencies for each class interval
   */
  const generateHistogram = (numbers, outlierMin, outlierMax) => {
    const bins = new Array(binCount).fill(0);
    const binLabels = [];
    const backgroundColors = [];
    const borderColors = [];
    const tableData = [];
    const totalCount = numbers.length;
    let cumulativeFreq = 0;

    // Distribute numbers into bins
    numbers.forEach(num => {
      const binIndex = Math.floor((num - minBoundary) / classWidth);
      if (binIndex >= 0 && binIndex < binCount) {
        bins[binIndex]++;
      } else if (binIndex >= binCount) {
        bins[binCount - 1]++; // Place in last bin if beyond range
      }
    });

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

    setFrequencyTable(tableData);
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
  const generateBarChart = (numbers, outlierMin, outlierMax) => {
    // Count frequencies
    const frequencyMap = {};
    numbers.forEach(num => {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });

    const uniqueValues = Object.keys(frequencyMap).map(Number).sort((a, b) => a - b);
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
  const generateBoxPlot = (numbers, outlierMin, outlierMax) => {
    const stats = calculateAllStatistics(numbers);
    
    // Identify outliers and whisker values
    const outliers = numbers.filter(n => n < outlierMin || n > outlierMax);
    const nonOutliers = numbers.filter(n => n >= outlierMin && n <= outlierMax);
    const whiskerMin = nonOutliers.length > 0 ? Math.min(...nonOutliers) : stats.min;
    const whiskerMax = nonOutliers.length > 0 ? Math.max(...nonOutliers) : stats.max;
    
    // Enhanced color scheme for better distinction
    const boxPlotColors = {
      box: 'rgba(78, 205, 196, 0.4)',        // Turquoise box
      boxBorder: 'rgba(78, 205, 196, 1)',    // Solid turquoise border
      median: 'rgba(255, 215, 0, 1)',        // Gold median line
      whisker: 'rgba(100, 100, 100, 0.8)',   // Dark gray whiskers
      outlier: 'rgba(255, 69, 0, 0.8)',      // Orange-red outliers
      labels: 'rgba(42, 42, 42, 1)'          // Dark labels
    };
    
    // Create enhanced box plot structure
    const datasets = [
      // Background reference line (min to max range)
      {
        label: 'Data Range',
        data: [{x: 0, y: whiskerMin}, {x: 0, y: whiskerMax}],
        borderColor: 'rgba(200, 200, 200, 0.3)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        type: 'line',
        order: 10
      },
      // Lower whisker with cap
      {
        label: `Lower Whisker: ${whiskerMin.toFixed(2)}`,
        data: [
          {x: -0.3, y: whiskerMin}, {x: 0.3, y: whiskerMin},  // Cap
          {x: 0, y: whiskerMin}, {x: 0, y: stats.q1}          // Line
        ],
        borderColor: boxPlotColors.whisker,
        backgroundColor: boxPlotColors.whisker,
        borderWidth: 2,
        pointRadius: 0,
        showLine: true,
        type: 'line',
        order: 5
      },
      // IQR Box - using multiple overlapping bars for box effect
      {
        label: `Q1 (25th): ${stats.q1.toFixed(2)}`,
        data: [{x: -0.4, y: stats.q1}, {x: 0.4, y: stats.q1}],
        borderColor: boxPlotColors.boxBorder,
        borderWidth: 3,
        pointRadius: 0,
        type: 'line',
        order: 3
      },
      {
        label: `Q3 (75th): ${stats.q3.toFixed(2)}`,
        data: [{x: -0.4, y: stats.q3}, {x: 0.4, y: stats.q3}],
        borderColor: boxPlotColors.boxBorder,
        borderWidth: 3,
        pointRadius: 0,
        type: 'line',
        order: 3
      },
      // Box sides
      {
        label: 'Box Left',
        data: [{x: -0.4, y: stats.q1}, {x: -0.4, y: stats.q3}],
        borderColor: boxPlotColors.boxBorder,
        borderWidth: 3,
        pointRadius: 0,
        type: 'line',
        order: 3
      },
      {
        label: 'Box Right',
        data: [{x: 0.4, y: stats.q1}, {x: 0.4, y: stats.q3}],
        borderColor: boxPlotColors.boxBorder,
        borderWidth: 3,
        pointRadius: 0,
        type: 'line',
        order: 3
      },
      // Box fill (using scatter with rectangles)
      {
        label: `IQR: ${stats.iqr.toFixed(2)}`,
        data: Array(20).fill().map((_, i) => ({
          x: -0.35 + (i * 0.035),
          y: stats.q1 + (stats.iqr / 2)
        })),
        backgroundColor: boxPlotColors.box,
        pointRadius: (stats.iqr * 2), // Dynamic size based on IQR
        pointStyle: 'rect',
        type: 'scatter',
        order: 4
      },
      // Median line (prominent)
      {
        label: `Median: ${stats.median.toFixed(2)}`,
        data: [{x: -0.4, y: stats.median}, {x: 0.4, y: stats.median}],
        borderColor: boxPlotColors.median,
        borderWidth: 4,
        pointRadius: 0,
        type: 'line',
        order: 2
      },
      // Upper whisker with cap
      {
        label: `Upper Whisker: ${whiskerMax.toFixed(2)}`,
        data: [
          {x: 0, y: stats.q3}, {x: 0, y: whiskerMax},          // Line
          {x: -0.3, y: whiskerMax}, {x: 0.3, y: whiskerMax}   // Cap
        ],
        borderColor: boxPlotColors.whisker,
        backgroundColor: boxPlotColors.whisker,
        borderWidth: 2,
        pointRadius: 0,
        showLine: true,
        type: 'line',
        order: 5
      }
    ];

    // Add outliers if enabled
    if (showOutliers && outliers.length > 0) {
      datasets.push({
        label: `Outliers (${outliers.length} values)`,
        data: outliers.map((value, i) => ({
          x: (i % 5 - 2) * 0.08, // Spread horizontally
          y: value
        })),
        backgroundColor: boxPlotColors.outlier,
        borderColor: 'rgba(200, 0, 0, 1)',
        borderWidth: 2,
        pointRadius: 7,
        pointStyle: 'circle',
        type: 'scatter',
        order: 1
      });
    }

    // Add value annotations
    datasets.push({
      label: 'Key Values',
      data: [
        {x: -0.6, y: stats.q1, label: 'Q1'},
        {x: -0.6, y: stats.median, label: 'Med'},
        {x: -0.6, y: stats.q3, label: 'Q3'},
        {x: 0.6, y: whiskerMin, label: 'Min'},
        {x: 0.6, y: whiskerMax, label: 'Max'}
      ],
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      pointRadius: 0,
      type: 'scatter',
      order: 0
    });

    setChartData({
      labels: [''],
      datasets: datasets.filter(d => d.label !== 'Box Left' && d.label !== 'Box Right') // Filter internal construction lines from legend
    });
  };

  /**
   * Chart configuration options
   */
  const chartOptions = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: chartType === CHART_TYPES.BOXPLOT,
          position: 'bottom',
          labels: {
            filter: (item) => {
              // Hide construction helper datasets
              return !['Box Left', 'Box Right', 'Key Values', 'Data Range'].includes(item.text);
            }
          }
        },
        title: {
          display: true,
          text: chartType === CHART_TYPES.HISTOGRAM ? 'Frequency Histogram' 
              : chartType === CHART_TYPES.BAR ? 'Value Frequencies' 
              : 'Box Plot Analysis',
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            title: (context) => {
              if (chartType === CHART_TYPES.BOXPLOT) {
                return context[0].dataset.label;
              }
              return chartType === CHART_TYPES.HISTOGRAM 
                ? `Class: ${context[0].label}`
                : `Value: ${context[0].label}`;
            },
            label: (context) => {
              if (chartType === CHART_TYPES.BOXPLOT) {
                return `Value: ${context.parsed.y.toFixed(2)}`;
              }
              return `Frequency: ${context.parsed.y}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: chartType !== CHART_TYPES.BOXPLOT,
          title: {
            display: true,
            text: chartType === CHART_TYPES.BOXPLOT ? 'Values' : 'Frequency'
          }
        },
        x: {
          title: {
            display: true,
            text: chartType === CHART_TYPES.HISTOGRAM ? 'Classes' 
                : chartType === CHART_TYPES.BAR ? 'Values' 
                : 'Data Distribution'
          }
        }
      }
    };

    // Special configuration for box plot
    if (chartType === CHART_TYPES.BOXPLOT) {
      baseOptions.scales.x = {
        ...baseOptions.scales.x,
        min: -1,
        max: 1,
        ticks: {
          display: false  // Hide x-axis ticks for cleaner look
        }
      };
      // Add padding to y-axis for better visualization
      if (result.min && result.max) {
        const range = parseFloat(result.max) - parseFloat(result.min);
        const padding = range * 0.1;
        baseOptions.scales.y.min = parseFloat(result.min) - padding;
        baseOptions.scales.y.max = parseFloat(result.max) + padding;
      }
    }

    return baseOptions;
  }, [chartType, result]);

  /**
   * Generate slider gradient style
   */
  const getSliderStyle = (value, min, max) => ({
    background: `linear-gradient(to right, #4ECDC4 0%, #4ECDC4 ${(value - min) / (max - min) * 100}%, #e0e0e0 ${(value - min) / (max - min) * 100}%, #e0e0e0 100%)`
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
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input and Controls Panel */}
          <div className="space-y-4">
            <div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter numbers separated by spaces"
                className="w-full p-4 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none transition-colors"
                rows="4"
                aria-label="Number input"
              />
            </div>
            
            {/* Visualization Options */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-lg font-bold text-darkGrey mb-3">Visualization Options</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-darkGrey font-medium mb-2">Chart Type</label>
                  <select 
                    value={chartType} 
                    onChange={(e) => setChartType(e.target.value)}
                    className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
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
                      <label className="flex items-center text-darkGrey font-medium mb-2">
                        Number of Classes: {binCount}
                        <InfoIcon info="The number of intervals to group your data into" />
                      </label>
                      <input
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
                      <label className="block text-darkGrey font-medium mb-2">
                        Lower Boundary of First Class
                      </label>
                      <input
                        type="number"
                        value={minBoundary}
                        onChange={(e) => setMinBoundary(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-darkGrey font-medium mb-2">
                        Class Width
                      </label>
                      <input
                        type="number"
                        value={classWidth}
                        onChange={(e) => setClassWidth(parseFloat(e.target.value) || 1)}
                        className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
                      />
                    </div>
                  </>
                )}
                {/* Box Plot specific controls */}
                {chartType === CHART_TYPES.BOXPLOT && (
                  <div className="mt-3 p-3 bg-yellow/10 rounded">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showOutliers}
                        onChange={(e) => setShowOutliers(e.target.checked)}
                        className="w-4 h-4 text-turquoise rounded focus:ring-turquoise"
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
              className="w-full bg-yellow border-2 border-darkGrey text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all"
            >
              Calculate Statistics
            </button>
            
            {/* Sample Data Sets */}
            <div className="bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-darkGrey mb-2">Example Data Sets</h3>
              <div className="space-y-2">
                {SAMPLE_DATASETS.map((dataset, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(dataset.data)}
                    className="w-full text-left text-sm p-2 bg-platinum hover:bg-turquoise/20 rounded transition-colors"
                  >
                    <div className="font-medium">{dataset.name}</div>
                    <div className="text-xs text-darkGrey/70">{dataset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results and Visualization Panel */}
          <div className="space-y-4">
            {result.mean !== undefined && (
              <>
                {/* Statistical Measures */}
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
                      <span className="font-medium">Std Dev:</span>
                      <span className="ml-auto font-mono">{result.stdDev}</span>
                      <InfoIcon info="Typical distance from mean" />
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
                
                {/* Chart Visualization */}
                {showChart && chartData && (
                  <div className="bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
                    <div className="h-64">
                      {chartType === CHART_TYPES.BOXPLOT ? (
                        <Scatter data={chartData} options={chartOptions} />
                      ) : (
                        <Bar data={chartData} options={chartOptions} />
                      )}
                    </div>
                    {chartType === CHART_TYPES.BOXPLOT && (
                      <button
                        onClick={() => setShowBoxPlotModal(true)}
                        className="mt-3 w-full bg-turquoise text-white px-4 py-2 rounded hover:bg-turquoise/80 transition-colors"
                      >
                        🔍 View Larger Box Plot
                      </button>
                    )}
                    {chartType !== CHART_TYPES.BOXPLOT && (
                      <p className="text-xs text-darkGrey opacity-60 mt-2 text-center">
                        Red indicates potential outliers (1.5 × IQR method)
                      </p>
                    )}
                  </div>
                )}
                
                {/* Box Plot Modal */}
                {showBoxPlotModal && chartType === CHART_TYPES.BOXPLOT && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-4xl max-h-screen overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-darkGrey">
                          Box Plot Analysis
                        </h3>
                        <button
                          onClick={() => setShowBoxPlotModal(false)}
                          className="text-darkGrey hover:text-red-500 text-2xl font-bold"
                        >
                          ×
                        </button>
                      </div>
                      
                      {/* Box Plot Explanation */}
                      <div className="mb-4 p-4 bg-blue-50 rounded">
                        <h4 className="font-semibold text-darkGrey mb-2">
                          📊 How to Read This Box Plot:
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3 text-sm text-darkGrey">
                          <div>
                            <p>• <span className="font-semibold text-gray-700">Gray Lines (Whiskers):</span> Extend to min/max non-outlier values</p>
                            <p>• <span className="font-semibold" style={{color: 'rgba(78, 205, 196, 1)'}}>Turquoise Box:</span> Contains middle 50% of data (IQR)</p>
                            <p>• <span className="font-semibold" style={{color: 'rgba(255, 215, 0, 1)'}}>Gold Line:</span> The median (middle value)</p>
                          </div>
                          <div>
                            <p>• <span className="font-semibold">Box Edges:</span> Q1 (bottom) and Q3 (top)</p>
                            <p>• <span className="font-semibold" style={{color: 'rgba(255, 69, 0, 1)'}}>Orange Dots:</span> Outliers beyond 1.5×IQR</p>
                            <p>• <span className="font-semibold">50% Rule:</span> Half the data is inside the box!</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Large Box Plot */}
                      <div className="h-96 mb-4">
                        <Scatter 
                          data={chartData} 
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              legend: {
                                display: true,
                                position: 'bottom',
                                labels: {
                                  filter: (item) => !['Box Left', 'Box Right', 'Key Values'].includes(item.text)
                                }
                              }
                            }
                          }} 
                        />
                      </div>
                      
                      {/* Summary Statistics */}
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-semibold text-darkGrey mb-2">Summary Statistics:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
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
                          <th className="text-left p-2">Class</th>
                          <th className="text-center p-2">Frequency</th>
                          <th className="text-center p-2">Relative (%)</th>
                          <th className="text-center p-2">Cumulative (%)</th>
                          <th className="text-center p-2">Midpoint</th>
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