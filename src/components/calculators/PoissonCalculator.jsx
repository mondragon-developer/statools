import React, { useState, useEffect, useCallback, useMemo, useId } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { jStat } from 'jstat';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { announcePolite } from '../../utils/announce';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

/**
 * Poisson distribution calculator — computes P(X=k), cumulative probabilities,
 * and visualizes the distribution for a given lambda.
 */

// ========================================
// MATHEMATICAL ENGINE (Single Responsibility)
// ========================================
/**
 * Pure mathematical functions for Poisson calculations
 * Think of this as the calculator's brain - pure logic, no UI concerns
 */
const PoissonMath = {
  /**
   * Calculate Poisson probability mass function
   * P(X = k) = (λ^k * e^(-λ)) / k!
   * Like calculating the odds of exactly k lightning strikes in an hour
   */
  pmf: (k, lambda) => {
    if (lambda <= 0 || k < 0) return 0;
    return jStat.poisson.pdf(k, lambda);
  },

  /**
   * Calculate cumulative distribution function
   * P(X ≤ k) - probability of at most k events
   * Like asking "what's the chance of 5 or fewer calls?"
   */
  cdf: (k, lambda) => {
    if (lambda <= 0 || k < 0) return 0;
    return jStat.poisson.cdf(k, lambda);
  },

  /**
   * Calculate probability of at least k events
   * P(X ≥ k) = 1 - P(X ≤ k-1)
   * Like asking "what's the chance of 5 or more calls?"
   */
  atLeast: (k, lambda) => {
    if (lambda <= 0) return 0;
    if (k <= 0) return 1;
    return 1 - jStat.poisson.cdf(k - 1, lambda);
  },

  /**
   * Normal approximation for large lambda
   * When λ > 10, Poisson ≈ Normal(μ=λ, σ²=λ)
   * Like switching from counting raindrops to measuring rainfall
   */
  normalApproximation: (k, lambda) => {
    return jStat.normal.pdf(k, lambda, Math.sqrt(lambda));
  },

  /**
   * Calculate distribution statistics
   * For Poisson: mean = variance = λ (unique property!)
   */
  getStatistics: (lambda) => ({
    mean: lambda,
    variance: lambda,
    standardDev: Math.sqrt(lambda),
    skewness: 1 / Math.sqrt(lambda),
    kurtosis: 1 / lambda
  })
};

// ========================================
// INFO ICON COMPONENT (Reusable UI Element)
// ========================================
/**
 * Educational tooltip component - your friendly statistics tutor
 * Provides context-sensitive help exactly when students need it
 */
const InfoIcon = ({ info }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <div className="relative inline-block ml-2" onKeyDown={(e) => { if (e.key === 'Escape') setIsVisible(false); }}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-darkTeal rounded-full cursor-help transition-all hover:scale-110"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(v => !v)}
        aria-expanded={isVisible}
        aria-describedby={isVisible ? tooltipId : undefined}
        aria-label="More info"
      >
        ?
      </button>

      {isVisible && (
        <div id={tooltipId} role="tooltip" className="absolute z-50 w-64 p-3 text-sm text-white bg-darkGrey rounded-lg shadow-xl -top-2 left-8">
          <div className="absolute w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-darkGrey -left-[6px] top-2" />
          {info}
        </div>
      )}
    </div>
  );
};

// ========================================
// REAL-WORLD EXAMPLES (Configuration)
// ========================================
/**
 * Common Poisson scenarios from everyday life
 * Each example is like a different weather pattern we're studying
 */
const POISSON_EXAMPLES = [
  { 
    name: '☎️ Call Center', 
    lambda: 3, 
    unit: 'calls/hour',
    description: 'Average incoming calls to support'
  },
  { 
    name: '🏭 Quality Control', 
    lambda: 2, 
    unit: 'defects/batch',
    description: 'Manufacturing defects per batch'
  },
  { 
    name: '🛒 Store Arrivals', 
    lambda: 4, 
    unit: 'customers/min',
    description: 'Customer arrivals at checkout'
  },
  { 
    name: '📧 Email Traffic', 
    lambda: 20, 
    unit: 'emails/day',
    description: 'Daily email volume'
  },
  { 
    name: '🚗 Traffic Safety', 
    lambda: 1.5, 
    unit: 'accidents/month',
    description: 'Monthly traffic incidents'
  },
  {
    name: '💻 Server Errors',
    lambda: 0.5,
    unit: 'crashes/day',
    description: 'System failure rate'
  }
];

// ========================================
// CHART CONFIGURATION MODULE
// ========================================
/**
 * Manages all chart visualization logic
 * Like a TV studio director - controls what viewers see and how
 */
const ChartManager = {
  /**
   * Generate distribution data for visualization
   * Creates the complete probability landscape
   */
  generateDistributionData: (lambda, x, probabilityType, showNormalApprox) => {
    // Calculate reasonable x-axis range (like setting map boundaries)
    const maxX = Math.max(Math.ceil(lambda + 4 * Math.sqrt(lambda)), 20);
    const labels = [];
    const probabilities = [];
    const normalApprox = [];
    const backgroundColors = [];
    const borderColors = [];

    // Generate data points for each possible outcome
    for (let k = 0; k <= maxX; k++) {
      labels.push(k.toString());
      
      // Calculate exact Poisson probability
      const prob = PoissonMath.pmf(k, lambda);
      probabilities.push(prob);

      // Calculate normal approximation if requested and valid
      if (showNormalApprox && lambda > 10) {
        const normalProb = PoissonMath.normalApproximation(k, lambda);
        normalApprox.push(normalProb);
      }

      // Color coding - like a heat map for probabilities
      let color = 'rgba(78, 205, 196, 0.6)'; // Default turquoise
      let border = 'rgba(78, 205, 196, 1)';

      // Highlight selected probabilities in yellow
      const shouldHighlight = 
        (probabilityType === 'exact' && k === x) ||
        (probabilityType === 'atMost' && k <= x) ||
        (probabilityType === 'atLeast' && k >= x);

      if (shouldHighlight) {
        color = 'rgba(217, 119, 6, 0.8)'; // Amber
        border = 'rgba(180, 83, 9, 1)';
      }

      backgroundColors.push(color);
      borderColors.push(border);
    }

    // Assemble datasets for Chart.js
    const datasets = [{
      label: 'Poisson Distribution',
      data: probabilities,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 2,
      type: 'bar'
    }];

    // Add normal approximation overlay if applicable
    if (showNormalApprox && lambda > 10) {
      datasets.push({
        label: 'Normal Approximation',
        data: normalApprox,
        borderColor: 'rgba(42, 42, 42, 0.8)',
        backgroundColor: 'transparent',
        borderWidth: 3,
        type: 'line',
        tension: 0.4,
        pointRadius: 0
      });
    }

    return { labels, datasets };
  },

  /**
   * Chart configuration options
   * Like camera settings for the perfect statistical shot
   */
  getChartOptions: (showNormalApprox, lambda) => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: showNormalApprox && lambda > 10,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(42, 42, 42, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        displayColors: true,
        callbacks: {
          title: (context) => `k = ${context[0].label}`,
          label: (context) => {
            if (context.dataset.type === 'bar') {
              const prob = context.parsed.y;
              const percentage = (prob * 100).toFixed(2);
              return `P(X = ${context.label}) = ${prob.toFixed(4)} (${percentage}%)`;
            }
            return `Normal ≈ ${context.parsed.y.toFixed(4)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Probability',
          font: { size: 14, weight: 'bold' }
        },
        ticks: {
          callback: (value) => value.toFixed(3)
        }
      },
      x: {
        title: {
          display: true,
          text: 'Number of Events (k)',
          font: { size: 14, weight: 'bold' }
        }
      }
    }
  })
};

// ========================================
// MAIN CALCULATOR COMPONENT
// ========================================
/**
 * The Poisson Distribution Calculator
 * Your statistical weather station for predicting rare events
 */
const PoissonCalculator = () => {
  useDocumentTitle('Poisson Distribution Calculator');
  // State management - the calculator's memory
  const [lambda, setLambda] = useState(5);        // Average rate (λ)
  const [x, setX] = useState(5);                   // Target value
  const [probabilityType, setProbabilityType] = useState('exact');
  const [showNormalApprox, setShowNormalApprox] = useState(false);

  // Calculate maximum reasonable x value based on lambda
  const maxX = useMemo(() => 
    Math.max(Math.ceil(lambda + 4 * Math.sqrt(lambda)), 20),
    [lambda]
  );

  // Generate chart data using memoization for performance
  const chartData = useMemo(() => 
    ChartManager.generateDistributionData(lambda, x, probabilityType, showNormalApprox),
    [lambda, x, probabilityType, showNormalApprox]
  );

  // Chart options configuration
  const chartOptions = useMemo(() => 
    ChartManager.getChartOptions(showNormalApprox, lambda),
    [showNormalApprox, lambda]
  );

  // Calculate the selected probability
  const probability = useMemo(() => {
    switch (probabilityType) {
      case 'exact':
        return PoissonMath.pmf(x, lambda);
      case 'atMost':
        return PoissonMath.cdf(x, lambda);
      case 'atLeast':
        return PoissonMath.atLeast(x, lambda);
      default:
        return 0;
    }
  }, [x, lambda, probabilityType]);

  // Get distribution statistics
  const stats = useMemo(() => 
    PoissonMath.getStatistics(lambda),
    [lambda]
  );

  // Handle example selection
  const selectExample = useCallback((example) => {
    setLambda(example.lambda);
    setX(Math.floor(example.lambda)); // Set x to expected value
    announcePolite('Loaded example: ' + example.name);
  }, []);

  // Educational formulas for display
  const formulas = {
    pmf: 'P(X = k) = (λ^k × e^(-λ)) / k!',
    mean: 'μ = λ',
    variance: 'σ² = λ',
    standardDev: 'σ = √λ'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-darkGrey mb-2">
            🎯 Poisson Distribution Calculator
          </h2>
          <p className="text-darkGrey opacity-80">
            Your probability prediction engine for rare events - from call centers to quality control
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Control Panel */}
          <div className="space-y-4">
            {/* Parameters Section */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4 flex items-center">
                ⚙️ Distribution Parameters
                <InfoIcon info="Set the average rate (λ) and target value (x) for your Poisson distribution" />
              </h3>
              
              <div className="space-y-4">
                {/* Lambda Slider */}
                <div>
                  <label htmlFor="poisson-lambda" className="flex items-center text-darkGrey font-medium mb-2">
                    Rate parameter (λ): {lambda.toFixed(1)}
                    <InfoIcon info="The average number of events per time interval. Like the average calls per hour at a call center." />
                  </label>
                  <input
                    id="poisson-lambda"
                    type="range"
                    min="0.1"
                    max="30"
                    step="0.1"
                    value={lambda}
                    onChange={(e) => setLambda(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #0F766E 0%, #0F766E ${(lambda - 0.1) / 29.9 * 100}%, #e0e0e0 ${(lambda - 0.1) / 29.9 * 100}%, #e0e0e0 100%)`
                    }}
                    aria-valuetext={lambda + " events per interval"}
                  />
                  <div className="mt-1 text-xs text-darkGrey opacity-60">
                    Range: 0.1 to 30 events per interval
                  </div>
                </div>

                {/* X Value Slider */}
                <div>
                  <label htmlFor="poisson-target-value" className="flex items-center text-darkGrey font-medium mb-2">
                    Target value (x): {x}
                    <InfoIcon info="The specific number of events you're calculating the probability for. Like 'exactly 5 calls' or 'at most 3 defects'." />
                  </label>
                  <input
                    id="poisson-target-value"
                    type="range"
                    min="0"
                    max={maxX}
                    value={x}
                    onChange={(e) => setX(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #D97706 0%, #D97706 ${x / maxX * 100}%, #e0e0e0 ${x / maxX * 100}%, #e0e0e0 100%)`
                    }}
                    aria-valuetext={x + " events"}
                  />
                  <div className="mt-1 text-xs text-darkGrey opacity-60">
                    Range: 0 to {maxX} events
                  </div>
                </div>
              </div>

              {/* Normal Approximation Toggle */}
              {lambda > 10 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <label className="flex items-center text-darkGrey">
                    <input
                      type="checkbox"
                      checked={showNormalApprox}
                      onChange={(e) => setShowNormalApprox(e.target.checked)}
                      className="mr-2 w-4 h-4"
                    />
                    Show Normal Approximation
                    <InfoIcon info="When λ > 10, the Poisson distribution can be approximated by a Normal distribution with mean λ and variance λ. This is useful for quick calculations!" />
                  </label>
                  <p className="text-xs text-darkGrey mt-1 ml-6">
                    Normal(μ={lambda.toFixed(1)}, σ²={lambda.toFixed(1)})
                  </p>
                </div>
              )}
            </div>

            {/* Probability Type Selection */}
            <div className="bg-platinum p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-4 flex items-center">
                📊 Probability Type
                <InfoIcon info="Choose what type of probability you want to calculate" />
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-2 hover:bg-white rounded transition-colors">
                  <input
                    type="radio"
                    value="exact"
                    checked={probabilityType === 'exact'}
                    onChange={(e) => setProbabilityType(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-darkGrey">
                    <strong>P(X = {x})</strong> - Exactly {x} events
                  </span>
                </label>
                <label className="flex items-center p-2 hover:bg-white rounded transition-colors">
                  <input
                    type="radio"
                    value="atMost"
                    checked={probabilityType === 'atMost'}
                    onChange={(e) => setProbabilityType(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-darkGrey">
                    <strong>P(X ≤ {x})</strong> - At most {x} events
                  </span>
                </label>
                <label className="flex items-center p-2 hover:bg-white rounded transition-colors">
                  <input
                    type="radio"
                    value="atLeast"
                    checked={probabilityType === 'atLeast'}
                    onChange={(e) => setProbabilityType(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="text-darkGrey">
                    <strong>P(X ≥ {x})</strong> - At least {x} events
                  </span>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className="bg-accent/20 border-2 border-accent p-4 rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey mb-3 flex items-center">
                🎯 Calculation Results
              </h3>
              
              {/* Main Result */}
              <div className="bg-white p-3 rounded-lg mb-3">
                <p className="text-2xl font-bold text-center text-darkGrey">
                  Probability = {probability.toFixed(4)}
                </p>
                <p className="text-sm text-center text-darkGrey opacity-60 mt-1">
                  {(probability * 100).toFixed(2)}% chance
                </p>
              </div>

              {/* Statistics */}
              <div className="space-y-2 text-darkGrey">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    Mean (μ)
                    <InfoIcon info={formulas.mean} />
                  </span>
                  <span className="font-mono font-bold">{stats.mean.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    Variance (σ²)
                    <InfoIcon info={formulas.variance} />
                  </span>
                  <span className="font-mono font-bold">{stats.variance.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    Std Dev (σ)
                    <InfoIcon info={formulas.standardDev} />
                  </span>
                  <span className="font-mono font-bold">{stats.standardDev.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="bg-platinum p-4 rounded-lg">
            <h3 className="text-xl font-bold text-darkGrey mb-4 flex items-center">
              📈 Distribution Visualization
              <InfoIcon info="Visual representation of the Poisson distribution. Amber bars show your selected probability range." />
            </h3>
            <div className="h-96 bg-white p-2 rounded">
              {chartData && <div role="img" aria-label="Poisson distribution bar chart showing probability for each number of events"><Bar data={chartData} options={chartOptions} /></div>}
            </div>
            
            {/* Interpretation Guide */}
            <div className="mt-4 p-3 bg-white rounded-lg text-sm">
              <h4 className="font-bold text-darkGrey mb-2">📖 How to Read This Chart:</h4>
              <ul className="space-y-1 text-darkGrey opacity-80">
                <li>• <span className="inline-block w-3 h-3 bg-turquoise rounded mr-1"></span>
                  Turquoise bars show individual probabilities</li>
                <li>• <span className="inline-block w-3 h-3 bg-accent rounded mr-1"></span>
                  Amber bars highlight your selected range</li>
                {showNormalApprox && lambda > 10 && (
                  <li>• <span className="inline-block w-12 h-0.5 bg-darkGrey mr-1"></span> 
                    Black curve shows normal approximation</li>
                )}
                <li>• Peak at k = {Math.floor(lambda)} (most likely outcome)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <div className="mt-6 bg-white border-2 border-darkGrey/20 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-darkGrey mb-3 flex items-center">
            💡 Real-World Examples
            <InfoIcon info="Click any example to load it into the calculator" />
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {POISSON_EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => selectExample(example)}
                className="p-3 bg-platinum hover:bg-darkTeal/20 rounded transition-all text-left group"
              >
                <div className="font-bold text-darkGrey group-hover:text-darkTeal">
                  {example.name}
                </div>
                <div className="text-sm text-darkGrey opacity-70">
                  λ = {example.lambda} {example.unit}
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
            🎓 Understanding Poisson Distribution
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/80 p-3 rounded">
              <h4 className="font-bold text-darkTeal mb-2">When to Use Poisson:</h4>
              <ul className="space-y-1 text-darkGrey">
                <li>✓ Events occur independently</li>
                <li>✓ Average rate (λ) is constant</li>
                <li>✓ Two events can't occur simultaneously</li>
                <li>✓ Probability of event in small interval ≈ λ × interval</li>
              </ul>
            </div>
            
            <div className="bg-white/80 p-3 rounded">
              <h4 className="font-bold text-darkTeal mb-2">Key Formula:</h4>
              <div className="bg-darkGrey/10 p-2 rounded font-mono text-center">
                {formulas.pmf}
              </div>
              <p className="mt-2 text-darkGrey">
                Where e ≈ 2.71828 (Euler's number)
              </p>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-accent/20 rounded">
            <strong className="text-darkGrey">💡 Pro Tip:</strong>
            <span className="text-darkGrey ml-2">
              The Poisson distribution is perfect for modeling "rare" events. 
              If events are very common (λ {'>'} 10), consider using the normal approximation for easier calculations!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoissonCalculator;