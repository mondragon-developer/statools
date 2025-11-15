import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart, ComposedChart } from 'recharts';
import { Info, Table2, BarChart3, AlertCircle, Trash2 } from 'lucide-react';

const MAX_INPUT_COUNT = 1000;

const FrequencyDistributionCalculator = () => {
  const [dataInput, setDataInput] = useState('');
  const [dataType, setDataType] = useState('continuous'); // 'discrete' or 'continuous'
  const [numberOfClasses, setNumberOfClasses] = useState('');
  const [classWidth, setClassWidth] = useState('');
  const [minValue, setMinValue] = useState('');
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [frequencyTable, setFrequencyTable] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('histogram'); // 'histogram', 'polygon', 'both'

  const sampleDatasets = [
    {
      name: 'Test Scores (Continuous)',
      data: '45, 52, 58, 63, 67, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92, 65, 68, 71, 74, 77, 81, 84, 87, 91, 95, 55, 60, 66, 73, 79',
      type: 'continuous'
    },
    {
      name: 'Age Groups (Discrete)',
      data: '18, 19, 20, 21, 22, 18, 19, 20, 21, 22, 23, 18, 19, 20, 21, 22, 23, 24, 19, 20, 21, 22, 23, 20, 21, 22, 23, 24, 25',
      type: 'discrete'
    },
    {
      name: 'Product Ratings (Discrete)',
      data: '1, 2, 3, 4, 5, 3, 4, 5, 4, 5, 5, 2, 3, 4, 5, 4, 5, 5, 3, 4, 4, 5, 5, 4, 5, 3, 4, 5, 5, 4',
      type: 'discrete'
    },
    {
      name: 'Heights in cm (Continuous)',
      data: '158, 162, 165, 168, 170, 172, 175, 178, 180, 182, 160, 163, 166, 169, 171, 173, 176, 179, 181, 159, 164, 167, 174, 177, 161, 183, 184, 185, 186, 187',
      type: 'continuous'
    }
  ];

  const loadSampleData = (dataset) => {
    setDataInput(dataset.data);
    setDataType(dataset.type);
    setAutoCalculate(true);
  };

  const parseData = (input) => {
    const values = input
      .split(/[\n,]+/)
      .map(val => parseFloat(val.trim()))
      .filter(val => !isNaN(val));

    return values;
  };

  const calculateFrequencyDistribution = () => {
    setError('');

    const data = parseData(dataInput);

    if (data.length === 0) {
      setError('Please enter valid numeric data');
      return;
    }

    if (data.length > MAX_INPUT_COUNT) {
      setError(`Data exceeds maximum limit of ${MAX_INPUT_COUNT} values`);
      return;
    }

    const n = data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    let stats = {
      n,
      min,
      max,
      range,
      mean: data.reduce((a, b) => a + b, 0) / n
    };

    if (dataType === 'discrete') {
      calculateDiscreteFrequency(data, stats);
    } else {
      calculateContinuousFrequency(data, stats);
    }
  };

  const calculateDiscreteFrequency = (data, stats) => {
    // Count frequency of each unique value
    const frequencyMap = {};
    data.forEach(value => {
      frequencyMap[value] = (frequencyMap[value] || 0) + 1;
    });

    // Sort by value
    const sortedValues = Object.keys(frequencyMap)
      .map(Number)
      .sort((a, b) => a - b);

    let cumulative = 0;
    const table = sortedValues.map(value => {
      const frequency = frequencyMap[value];
      const relativeFreq = frequency / stats.n;
      const percentage = relativeFreq * 100;
      cumulative += frequency;
      const cumulativePercentage = (cumulative / stats.n) * 100;
      const cumulativeRelativeFreq = cumulative / stats.n;

      return {
        class: value.toString(),
        classLabel: value.toString(),
        frequency,
        relativeFrequency: relativeFreq.toFixed(4),
        percentage: percentage.toFixed(2),
        cumulativeFrequency: cumulative,
        cumulativePercentage: cumulativePercentage.toFixed(2),
        cumulativeRelativeFreq: cumulativeRelativeFreq.toFixed(4),
        midpoint: value
      };
    });

    setFrequencyTable(table);
    setStatistics(stats);
  };

  const calculateContinuousFrequency = (data, stats) => {
    let numClasses, width, start;

    if (autoCalculate) {
      // Sturges' Rule: k = 1 + 3.322 * log10(n)
      numClasses = Math.ceil(1 + 3.322 * Math.log10(stats.n));
      width = Math.ceil(stats.range / numClasses);
      start = Math.floor(stats.min);
    } else {
      numClasses = parseInt(numberOfClasses) || 5;
      width = parseFloat(classWidth) || Math.ceil(stats.range / numClasses);
      start = parseFloat(minValue) || Math.floor(stats.min);
    }

    // Create class intervals
    const classes = [];
    for (let i = 0; i < numClasses; i++) {
      const lower = start + (i * width);
      const upper = lower + width;
      classes.push({
        lower,
        upper,
        midpoint: (lower + upper) / 2,
        frequency: 0
      });
    }

    // Count frequencies
    data.forEach(value => {
      for (let i = 0; i < classes.length; i++) {
        const cls = classes[i];
        if (i === classes.length - 1) {
          // Last class includes upper bound
          if (value >= cls.lower && value <= cls.upper) {
            cls.frequency++;
            break;
          }
        } else {
          // Other classes: lower <= value < upper
          if (value >= cls.lower && value < cls.upper) {
            cls.frequency++;
            break;
          }
        }
      }
    });

    // Calculate cumulative values
    let cumulative = 0;
    const table = classes.map(cls => {
      const relativeFreq = cls.frequency / stats.n;
      const percentage = relativeFreq * 100;
      cumulative += cls.frequency;
      const cumulativePercentage = (cumulative / stats.n) * 100;
      const cumulativeRelativeFreq = cumulative / stats.n;

      return {
        class: `[${cls.lower}, ${cls.upper}${classes[classes.length - 1] === cls ? ']' : ')'}`,
        classLabel: `${cls.lower}-${cls.upper}`,
        lower: cls.lower,
        upper: cls.upper,
        midpoint: cls.midpoint.toFixed(2),
        frequency: cls.frequency,
        relativeFrequency: relativeFreq.toFixed(4),
        percentage: percentage.toFixed(2),
        cumulativeFrequency: cumulative,
        cumulativePercentage: cumulativePercentage.toFixed(2),
        cumulativeRelativeFreq: cumulativeRelativeFreq.toFixed(4)
      };
    });

    setFrequencyTable(table);
    setStatistics({ ...stats, numClasses, classWidth: width, startValue: start });
  };

  const clearAll = () => {
    setDataInput('');
    setNumberOfClasses('');
    setClassWidth('');
    setMinValue('');
    setFrequencyTable([]);
    setStatistics(null);
    setError('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-darkGrey mb-2">
          Frequency Distribution Calculator
        </h2>
        <p className="text-darkGrey opacity-80">
          Create frequency distribution tables for discrete and continuous data with visualizations
        </p>
      </div>

      {/* Sample Datasets */}
      <div className="mb-6 p-4 bg-platinum rounded-lg">
        <h3 className="font-bold text-darkGrey mb-3 flex items-center gap-2">
          <Info size={20} className="text-turquoise" />
          Sample Datasets
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {sampleDatasets.map((dataset, index) => (
            <button
              key={index}
              onClick={() => loadSampleData(dataset)}
              className="px-3 py-2 bg-white border-2 border-turquoise text-darkGrey rounded-lg hover:bg-turquoise hover:text-white transition-all text-sm"
            >
              {dataset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Data Type Selection */}
      <div className="mb-6 p-4 bg-platinum rounded-lg">
        <h3 className="font-bold text-darkGrey mb-3">Data Type</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="discrete"
              checked={dataType === 'discrete'}
              onChange={(e) => setDataType(e.target.value)}
              className="w-4 h-4 text-turquoise"
            />
            <span className="text-darkGrey">Discrete / Qualitative</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="continuous"
              checked={dataType === 'continuous'}
              onChange={(e) => setDataType(e.target.value)}
              className="w-4 h-4 text-turquoise"
            />
            <span className="text-darkGrey">Continuous / Quantitative</span>
          </label>
        </div>
      </div>

      {/* Data Input */}
      <div className="mb-6">
        <label className="block text-darkGrey font-bold mb-2">
          Enter Data (comma or newline separated, max {MAX_INPUT_COUNT} values)
        </label>
        <textarea
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          placeholder="Enter your data here... e.g., 45, 52, 58, 63, 67, 70"
          className="w-full p-3 border-2 border-platinum rounded-lg focus:border-turquoise focus:outline-none min-h-32"
        />
        <p className="text-sm text-darkGrey opacity-70 mt-1">
          Current count: {parseData(dataInput).length} values
        </p>
      </div>

      {/* Continuous Data Options */}
      {dataType === 'continuous' && (
        <div className="mb-6 p-4 bg-platinum rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={autoCalculate}
              onChange={(e) => setAutoCalculate(e.target.checked)}
              className="w-4 h-4 text-turquoise"
            />
            <label className="text-darkGrey font-bold">
              Auto-calculate (Sturges' Rule)
            </label>
          </div>

          {!autoCalculate && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-darkGrey font-bold mb-2">
                  Number of Classes
                </label>
                <input
                  type="number"
                  value={numberOfClasses}
                  onChange={(e) => setNumberOfClasses(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full p-2 border-2 border-platinum rounded-lg focus:border-turquoise focus:outline-none"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-darkGrey font-bold mb-2">
                  Class Width
                </label>
                <input
                  type="number"
                  value={classWidth}
                  onChange={(e) => setClassWidth(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full p-2 border-2 border-platinum rounded-lg focus:border-turquoise focus:outline-none"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-darkGrey font-bold mb-2">
                  Minimum Value (Start)
                </label>
                <input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  placeholder="e.g., 0"
                  className="w-full p-2 border-2 border-platinum rounded-lg focus:border-turquoise focus:outline-none"
                  step="0.01"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={calculateFrequencyDistribution}
          className="flex-1 bg-turquoise text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Table2 size={20} />
          Calculate Distribution
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <Trash2 size={20} />
          Clear
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg flex items-center gap-2">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-700 font-bold">{error}</p>
        </div>
      )}

      {/* Results */}
      {frequencyTable.length > 0 && statistics && (
        <div className="space-y-6">
          {/* Statistics Summary */}
          <div className="p-4 bg-yellow bg-opacity-20 border-2 border-yellow rounded-lg">
            <h3 className="font-bold text-darkGrey mb-3">Summary Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-darkGrey opacity-70">Sample Size (n)</p>
                <p className="text-xl font-bold text-darkGrey">{statistics.n}</p>
              </div>
              <div>
                <p className="text-sm text-darkGrey opacity-70">Range</p>
                <p className="text-xl font-bold text-darkGrey">{statistics.range.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-darkGrey opacity-70">Min - Max</p>
                <p className="text-xl font-bold text-darkGrey">
                  {statistics.min.toFixed(2)} - {statistics.max.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-darkGrey opacity-70">Mean</p>
                <p className="text-xl font-bold text-darkGrey">{statistics.mean.toFixed(2)}</p>
              </div>
              {dataType === 'continuous' && statistics.numClasses && (
                <>
                  <div>
                    <p className="text-sm text-darkGrey opacity-70">Number of Classes</p>
                    <p className="text-xl font-bold text-darkGrey">{statistics.numClasses}</p>
                  </div>
                  <div>
                    <p className="text-sm text-darkGrey opacity-70">Class Width</p>
                    <p className="text-xl font-bold text-darkGrey">{statistics.classWidth}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Frequency Distribution Table */}
          <div className="overflow-x-auto">
            <h3 className="font-bold text-darkGrey mb-3 flex items-center gap-2">
              <Table2 className="text-turquoise" size={24} />
              Frequency Distribution Table
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-turquoise text-white">
                  <th className="border border-darkGrey p-2">
                    {dataType === 'discrete' ? 'Value' : 'Class Interval'}
                  </th>
                  {dataType === 'continuous' && (
                    <th className="border border-darkGrey p-2">Midpoint</th>
                  )}
                  <th className="border border-darkGrey p-2">Frequency (f)</th>
                  <th className="border border-darkGrey p-2">Relative Freq</th>
                  <th className="border border-darkGrey p-2">Percentage (%)</th>
                  <th className="border border-darkGrey p-2">Cumulative Freq</th>
                  <th className="border border-darkGrey p-2">Cumulative %</th>
                  <th className="border border-darkGrey p-2">Cumulative Rel. Freq</th>
                </tr>
              </thead>
              <tbody>
                {frequencyTable.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-platinum bg-opacity-30' : 'bg-white'}>
                    <td className="border border-darkGrey p-2 font-mono">{row.class}</td>
                    {dataType === 'continuous' && (
                      <td className="border border-darkGrey p-2 text-center">{row.midpoint}</td>
                    )}
                    <td className="border border-darkGrey p-2 text-center font-bold">{row.frequency}</td>
                    <td className="border border-darkGrey p-2 text-center">{row.relativeFrequency}</td>
                    <td className="border border-darkGrey p-2 text-center">{row.percentage}%</td>
                    <td className="border border-darkGrey p-2 text-center">{row.cumulativeFrequency}</td>
                    <td className="border border-darkGrey p-2 text-center">{row.cumulativePercentage}%</td>
                    <td className="border border-darkGrey p-2 text-center">{row.cumulativeRelativeFreq}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-yellow bg-opacity-30 font-bold">
                  <td className="border border-darkGrey p-2">Total</td>
                  {dataType === 'continuous' && <td className="border border-darkGrey p-2"></td>}
                  <td className="border border-darkGrey p-2 text-center">{statistics.n}</td>
                  <td className="border border-darkGrey p-2 text-center">1.0000</td>
                  <td className="border border-darkGrey p-2 text-center">100.00%</td>
                  <td className="border border-darkGrey p-2"></td>
                  <td className="border border-darkGrey p-2"></td>
                  <td className="border border-darkGrey p-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Chart Type Selection for Continuous Data */}
          {dataType === 'continuous' && (
            <div className="p-4 bg-platinum rounded-lg">
              <h3 className="font-bold text-darkGrey mb-3">Visualization Options</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="histogram"
                    checked={chartType === 'histogram'}
                    onChange={(e) => setChartType(e.target.value)}
                    className="w-4 h-4 text-turquoise"
                  />
                  <span className="text-darkGrey">Histogram Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="polygon"
                    checked={chartType === 'polygon'}
                    onChange={(e) => setChartType(e.target.value)}
                    className="w-4 h-4 text-turquoise"
                  />
                  <span className="text-darkGrey">Frequency Polygon Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="both"
                    checked={chartType === 'both'}
                    onChange={(e) => setChartType(e.target.value)}
                    className="w-4 h-4 text-turquoise"
                  />
                  <span className="text-darkGrey">Both (Histogram + Polygon)</span>
                </label>
              </div>
            </div>
          )}

          {/* Visualizations */}
          <div className="p-4 bg-platinum rounded-lg">
            <h3 className="font-bold text-darkGrey mb-4 flex items-center gap-2">
              <BarChart3 className="text-turquoise" size={24} />
              {dataType === 'discrete' ? 'Bar Chart' : 'Histogram & Frequency Polygon'}
            </h3>

            {dataType === 'discrete' ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={frequencyTable}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="classLabel" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="frequency" fill="#4ECDC4" name="Frequency" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                {chartType === 'both' ? (
                  <ComposedChart data={frequencyTable}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="classLabel" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="frequency" fill="#4ECDC4" name="Frequency" />
                    <Line
                      type="monotone"
                      dataKey="frequency"
                      stroke="#FF6B6B"
                      strokeWidth={3}
                      name="Frequency Polygon"
                      dot={{ fill: '#FF6B6B', r: 5 }}
                    />
                  </ComposedChart>
                ) : chartType === 'histogram' ? (
                  <BarChart data={frequencyTable}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="classLabel" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="frequency" fill="#4ECDC4" name="Frequency" />
                  </BarChart>
                ) : (
                  <LineChart data={frequencyTable}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="classLabel" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="frequency"
                      stroke="#FF6B6B"
                      strokeWidth={3}
                      name="Frequency Polygon"
                      dot={{ fill: '#FF6B6B', r: 5 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </div>

          {/* Pareto Chart for Discrete Data */}
          {dataType === 'discrete' && (
            <div className="p-4 bg-platinum rounded-lg">
              <h3 className="font-bold text-darkGrey mb-4 flex items-center gap-2">
                <BarChart3 className="text-turquoise" size={24} />
                Pareto Chart (with Cumulative Percentage)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={frequencyTable}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="classLabel" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="frequency" fill="#4ECDC4" name="Frequency" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulativePercentage"
                    stroke="#FF6B6B"
                    strokeWidth={3}
                    name="Cumulative %"
                    dot={{ fill: '#FF6B6B', r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Interpretation Guide */}
          <div className="p-4 bg-turquoise bg-opacity-10 border-2 border-turquoise rounded-lg">
            <h3 className="font-bold text-darkGrey mb-3 flex items-center gap-2">
              <Info className="text-turquoise" size={20} />
              Understanding the Table
            </h3>
            <div className="space-y-2 text-darkGrey text-sm">
              <p><strong>Frequency (f):</strong> Count of observations in each class/value</p>
              <p><strong>Relative Frequency:</strong> Proportion of total (f/n)</p>
              <p><strong>Percentage:</strong> Relative frequency × 100</p>
              <p><strong>Cumulative Frequency:</strong> Running total of frequencies</p>
              <p><strong>Cumulative %:</strong> Percentage of data up to and including this class</p>
              <p><strong>Cumulative Relative Frequency:</strong> Proportion of data up to this class</p>
              {dataType === 'continuous' && (
                <p><strong>Midpoint (Class Mark):</strong> Center of the class interval, used for calculations</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequencyDistributionCalculator;
