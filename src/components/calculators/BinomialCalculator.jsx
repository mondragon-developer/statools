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

import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { jStat } from 'jstat';
import InfoIcon from './InfoIcon';

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
    background: 'rgba(255, 255, 0, 0.8)',
    border: 'rgba(255, 255, 0, 1)'
  }
};

/**
 * Predefined scenarios demonstrating different distribution shapes
 * Each scenario represents a common real-world application
 */
const PRESET_SCENARIOS = [
  { 
    name: 'Fair Coin (n=10, p=0.5)', 
    n: 10,
    p: 0.5,
    x: 5
  },
  { 
    name: 'Test Success (n=20, p=0.7)', 
    n: 20,
    p: 0.7,
    x: 14
  },
  { 
    name: 'Quality Control (n=30, p=0.25)', 
    n: 30,
    p: 0.25,
    x: 8
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
 * Main BinomialCalculator component
 * Manages state, calculations, and rendering of the probability interface
 */
const BinomialCalculator = () => {
  // Core state variables
  const [n, setN] = useState(10);                    // Number of trials
  const [p, setP] = useState(0.5);                   // Probability of success
  const [x, setX] = useState(5);                     // Target value
  const [probabilityType, setProbabilityType] = useState('exact');  // Calculation type

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
  const getSliderStyle = (value, min, max, color = '#4ECDC4') => ({
    background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #e0e0e0 ${((value - min) / (max - min)) * 100}%, #e0e0e0 100%)`
  });

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
                  <label className="flex items-center text-darkGrey font-medium mb-2">
                    Number of trials (n): {n}
                    <InfoIcon info="Total number of independent trials or experiments" />
                  </label>
                  <input
                    type="range"
                    min={PARAMETER_RANGES.n.min}
                    max={PARAMETER_RANGES.n.max}
                    value={n}
                    onChange={(e) => updateParameter('n', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={getSliderStyle(n, PARAMETER_RANGES.n.min, PARAMETER_RANGES.n.max)}
                    aria-label="Number of trials"
                  />
                </div>

                {/* Probability slider */}
                <div>
                  <label className="flex items-center text-darkGrey font-medium mb-2">
                    Probability of success (p): {p.toFixed(2)}
                    <InfoIcon info="Probability of success in a single trial" />
                  </label>
                  <input
                    type="range"
                    min={PARAMETER_RANGES.p.min}
                    max={PARAMETER_RANGES.p.max}
                    step={PARAMETER_RANGES.p.step}
                    value={p}
                    onChange={(e) => updateParameter('p', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={getSliderStyle(p, PARAMETER_RANGES.p.min, PARAMETER_RANGES.p.max)}
                    aria-label="Probability of success"
                  />
                </div>

                {/* Target value slider */}
                <div>
                  <label className="flex items-center text-darkGrey font-medium mb-2">
                    X value: {x}
                    <InfoIcon info="Number of successes of interest" />
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={n}
                    value={x}
                    onChange={(e) => updateParameter('x', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={getSliderStyle(x, 0, n, '#FFFF00')}
                    aria-label="Target value"
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
            <div className="bg-yellow/20 border-2 border-yellow p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-2">Results</h3>
              <div className="space-y-2 text-darkGrey">
                <p className="text-lg font-semibold">
                  Probability: {probability.toFixed(4)}
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
          </div>

          {/* Visualization panel */}
          <div className="bg-platinum p-4 rounded-lg">
            <h3 className="text-xl font-bold text-darkGrey mb-4">Distribution Visualization</h3>
            <div className="h-96">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Preset scenarios */}
        <div className="mt-6 bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-darkGrey mb-2">Common Examples</h3>
          <div className="grid md:grid-cols-3 gap-2">
            {PRESET_SCENARIOS.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="p-2 bg-platinum hover:bg-turquoise/20 rounded transition-colors text-sm text-darkGrey"
                aria-label={`Apply ${preset.name} scenario`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinomialCalculator;