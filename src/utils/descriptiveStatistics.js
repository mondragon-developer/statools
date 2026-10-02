// Quartiles use linear interpolation at (n - 1) * p (inclusive percentiles).
export const calculateAllStatistics = (numbers, varianceMode = 'sample') => {
    if (!numbers.length || numbers.some(n => !Number.isFinite(n))) throw new Error('Enter finite numbers.');
    if (varianceMode === 'sample' && numbers.length < 2) throw new Error('Sample statistics require at least two numbers.');
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
    if (maxFreq === 1) {
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
export const formatResult = (stats) => {
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

