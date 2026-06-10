import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart, ComposedChart } from 'recharts';
import { Info, Table2, BarChart3, AlertCircle, Trash2, X, Plus, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { announcePolite } from '../../utils/announce';

const MAX_INPUT_COUNT = 1000;

const MAX_CATEGORIES = 10;

const FrequencyDistributionCalculator = () => {
  useDocumentTitle('Frequency Distribution Calculator');
  const [dataInput, setDataInput] = useState('');
  const [dataType, setDataType] = useState('continuous'); // 'discrete', 'continuous', or 'categorical'
  const [numberOfClasses, setNumberOfClasses] = useState('');
  const [classWidth, setClassWidth] = useState('');
  const [minValue, setMinValue] = useState('');
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [frequencyTable, setFrequencyTable] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('histogram'); // 'histogram', 'polygon', 'both'
  const [showDataWarning, setShowDataWarning] = useState(true);
  // Categorical data states
  const [categoricalInputMode, setCategoricalInputMode] = useState('raw'); // 'raw' or 'counts'
  const [categoryInputs, setCategoryInputs] = useState([
    { category: '', count: '' },
    { category: '', count: '' }
  ]);
  const [loadedSample, setLoadedSample] = useState('');
  const [showGuide, setShowGuide] = useState(false);

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
    },
    {
      name: 'Survey Yes/No (Categorical)',
      data: 'Yes, No, Yes, Yes, No, Yes, No, No, Yes, Yes, No, Yes, N/A, Yes, No, No, Yes, N/A, Yes, No, Yes, Yes, No, N/A, Yes',
      type: 'categorical',
      inputMode: 'raw'
    },
    {
      name: 'Blood Types (Categorical)',
      data: 'A, B, O, AB, A, O, O, A, B, O, A, O, AB, A, O, B, O, A, A, O, B, O, A, O, O, AB, A, O, B, A',
      type: 'categorical',
      inputMode: 'raw'
    }
  ];

  const loadSampleData = (dataset) => {
    setDataInput(dataset.data);
    setDataType(dataset.type);
    setAutoCalculate(true);
    setLoadedSample(dataset.name);
    if (dataset.type === 'categorical') {
      setCategoricalInputMode(dataset.inputMode || 'raw');
      setCategoryInputs([{ category: '', count: '' }, { category: '', count: '' }]);
    }
    announcePolite('Loaded sample: ' + dataset.name);
  };

  const parseData = (input) => {
    const values = input
      .split(/[\n,\s]+/)
      .map(val => parseFloat(val.trim()))
      .filter(val => !isNaN(val));

    return values;
  };

  const parseCategoricalData = (input) => {
    return input
      .split(/[\n,]+/)
      .map(val => val.trim())
      .filter(val => val.length > 0);
  };

  const addCategoryInput = () => {
    if (categoryInputs.length < MAX_CATEGORIES) {
      setCategoryInputs([...categoryInputs, { category: '', count: '' }]);
    }
  };

  const removeCategoryInput = (index) => {
    if (categoryInputs.length > 2) {
      setCategoryInputs(categoryInputs.filter((_, i) => i !== index));
    }
  };

  const updateCategoryInput = (index, field, value) => {
    const updated = [...categoryInputs];
    updated[index][field] = value;
    setCategoryInputs(updated);
  };

  const calculateFrequencyDistribution = () => {
    setError('');
    setShowDataWarning(true);

    if (dataType === 'categorical') {
      calculateCategoricalFrequency();
      return;
    }

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

  const calculateCategoricalFrequency = () => {
    let frequencyMap = {};
    let n = 0;

    if (categoricalInputMode === 'raw') {
      const data = parseCategoricalData(dataInput);

      if (data.length === 0) {
        setError('Please enter valid categorical data');
        return;
      }

      if (data.length > MAX_INPUT_COUNT) {
        setError(`Data exceeds maximum limit of ${MAX_INPUT_COUNT} values`);
        return;
      }

      // Count frequency of each category
      data.forEach(value => {
        const normalizedValue = value.toLowerCase();
        frequencyMap[normalizedValue] = (frequencyMap[normalizedValue] || { original: value, count: 0 });
        frequencyMap[normalizedValue].count++;
      });

      // Check category limit
      if (Object.keys(frequencyMap).length > MAX_CATEGORIES) {
        setError(`Too many categories. Maximum allowed is ${MAX_CATEGORIES} categories.`);
        return;
      }

      n = data.length;
    } else {
      // Parse from category:count inputs
      const validInputs = categoryInputs.filter(
        input => input.category.trim() !== '' && input.count !== '' && parseInt(input.count) > 0
      );

      if (validInputs.length === 0) {
        setError('Please enter at least one category with a count');
        return;
      }

      validInputs.forEach(input => {
        const normalizedCategory = input.category.trim().toLowerCase();
        const count = parseInt(input.count);
        if (frequencyMap[normalizedCategory]) {
          frequencyMap[normalizedCategory].count += count;
        } else {
          frequencyMap[normalizedCategory] = { original: input.category.trim(), count };
        }
        n += count;
      });
    }

    // Build frequency table
    const categories = Object.keys(frequencyMap);
    let cumulative = 0;

    const table = categories.map(key => {
      const frequency = frequencyMap[key].count;
      const relativeFreq = frequency / n;
      const percentage = relativeFreq * 100;
      cumulative += frequency;
      const cumulativePercentage = (cumulative / n) * 100;
      const cumulativeRelativeFreq = cumulative / n;

      return {
        class: frequencyMap[key].original,
        classLabel: frequencyMap[key].original,
        frequency,
        relativeFrequency: relativeFreq.toFixed(4),
        percentage: percentage.toFixed(2),
        cumulativeFrequency: cumulative,
        cumulativePercentage: cumulativePercentage.toFixed(2),
        cumulativeRelativeFreq: cumulativeRelativeFreq.toFixed(4)
      };
    });

    // Sort by frequency descending for better visualization
    table.sort((a, b) => b.frequency - a.frequency);

    // Recalculate cumulative after sorting
    cumulative = 0;
    table.forEach(row => {
      cumulative += row.frequency;
      row.cumulativeFrequency = cumulative;
      row.cumulativePercentage = (cumulative / n) * 100; // Keep as number for chart
      row.cumulativeRelativeFreq = (cumulative / n).toFixed(4);
    });

    setFrequencyTable(table);
    setStatistics({ n, numCategories: categories.length });
    announcePolite('Frequency distribution calculated for ' + n + ' values.');
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
    announcePolite('Frequency distribution calculated for ' + data.length + ' values.');
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
    announcePolite('Frequency distribution calculated for ' + data.length + ' values.');
  };

  const clearAll = () => {
    setDataInput('');
    setNumberOfClasses('');
    setClassWidth('');
    setMinValue('');
    setFrequencyTable([]);
    setStatistics(null);
    setError('');
    setShowDataWarning(true);
    setCategoryInputs([{ category: '', count: '' }, { category: '', count: '' }]);
    setLoadedSample('');
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

      {/* Educational Guide - Collapsible */}
      <div className="mb-6 border-2 border-darkTeal rounded-lg overflow-hidden">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full p-4 bg-darkTeal bg-opacity-10 flex items-center justify-between hover:bg-opacity-20 transition-all"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="text-darkTeal" size={20} />
            <span className="font-bold text-darkGrey">Student Guide: Understanding Variables & Frequency Tables</span>
          </div>
          {showGuide ? <ChevronUp className="text-darkTeal" /> : <ChevronDown className="text-darkTeal" />}
        </button>

        {showGuide && (
          <div className="p-4 bg-white space-y-4">
            {/* Types of Variables */}
            <div>
              <h3 className="font-bold text-darkGrey mb-2 text-lg">Types of Variables</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h5 className="font-bold text-blue-700">Discrete (Numeric)</h5>
                  <p className="text-sm text-darkGrey mt-1">
                    Countable values with gaps between them. Cannot have fractions.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    <strong>Examples:</strong> Number of children (0, 1, 2, 3...), dice rolls (1-6), shoe sizes
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h5 className="font-bold text-green-700">Continuous (Numeric)</h5>
                  <p className="text-sm text-darkGrey mt-1">
                    Measurable values that can take any value within a range, including decimals.
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    <strong>Examples:</strong> Height (165.5 cm), weight (70.3 kg), temperature, time
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <h5 className="font-bold text-amber-800">Categorical (Text)</h5>
                  <p className="text-sm text-darkGrey mt-1">
                    Non-numeric categories or labels that represent groups or qualities.
                  </p>
                  <p className="text-xs text-amber-800 mt-2">
                    <strong>Examples:</strong> Gender (M/F), blood type (A, B, O, AB), survey responses (Yes/No)
                  </p>
                </div>
              </div>
            </div>

            {/* Table Column Meanings */}
            <div>
              <h3 className="font-bold text-darkGrey mb-2 text-lg">Understanding Table Columns</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-platinum">
                      <th scope="col" className="border border-darkGrey p-2 text-left">Column</th>
                      <th scope="col" className="border border-darkGrey p-2 text-left">Symbol</th>
                      <th scope="col" className="border border-darkGrey p-2 text-left">Meaning</th>
                      <th scope="col" className="border border-darkGrey p-2 text-left">Formula</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-darkGrey p-2 font-bold">Frequency</td>
                      <td className="border border-darkGrey p-2 font-mono">f</td>
                      <td className="border border-darkGrey p-2">How many times each value/category appears</td>
                      <td className="border border-darkGrey p-2 font-mono">Count</td>
                    </tr>
                    <tr className="bg-platinum bg-opacity-30">
                      <td className="border border-darkGrey p-2 font-bold">Relative Frequency</td>
                      <td className="border border-darkGrey p-2 font-mono">rf</td>
                      <td className="border border-darkGrey p-2">Proportion of total (decimal form)</td>
                      <td className="border border-darkGrey p-2 font-mono">f ÷ n</td>
                    </tr>
                    <tr>
                      <td className="border border-darkGrey p-2 font-bold">Percentage</td>
                      <td className="border border-darkGrey p-2 font-mono">%</td>
                      <td className="border border-darkGrey p-2">Relative frequency as percentage</td>
                      <td className="border border-darkGrey p-2 font-mono">rf × 100</td>
                    </tr>
                    <tr className="bg-platinum bg-opacity-30">
                      <td className="border border-darkGrey p-2 font-bold">Cumulative Frequency</td>
                      <td className="border border-darkGrey p-2 font-mono">cf</td>
                      <td className="border border-darkGrey p-2">Running total of frequencies up to this point</td>
                      <td className="border border-darkGrey p-2 font-mono">Σf (sum)</td>
                    </tr>
                    <tr>
                      <td className="border border-darkGrey p-2 font-bold">Cumulative %</td>
                      <td className="border border-darkGrey p-2 font-mono">c%</td>
                      <td className="border border-darkGrey p-2">Percentage of data up to and including this class</td>
                      <td className="border border-darkGrey p-2 font-mono">(cf ÷ n) × 100</td>
                    </tr>
                    <tr className="bg-platinum bg-opacity-30">
                      <td className="border border-darkGrey p-2 font-bold">Midpoint</td>
                      <td className="border border-darkGrey p-2 font-mono">x</td>
                      <td className="border border-darkGrey p-2">Center of a class interval (continuous data only)</td>
                      <td className="border border-darkGrey p-2 font-mono">(lower + upper) ÷ 2</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to Interpret */}
            <div>
              <h3 className="font-bold text-darkGrey mb-2 text-lg">How to Interpret Results</h3>
              <div className="space-y-3">
                <div className="p-3 bg-accent bg-opacity-20 rounded-lg">
                  <p className="font-bold text-darkGrey">Example Interpretation (Test Scores):</p>
                  <ul className="text-sm text-darkGrey mt-2 space-y-1 list-disc list-inside">
                    <li><strong>Frequency:</strong> "12 students scored between 70-80 points"</li>
                    <li><strong>Relative Frequency:</strong> "0.40 (or 40%) of students scored between 70-80"</li>
                    <li><strong>Cumulative Frequency:</strong> "25 students scored 80 or below"</li>
                    <li><strong>Cumulative %:</strong> "83.33% of students scored 80 or below"</li>
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="font-bold text-darkGrey">Example Interpretation (Survey Yes/No):</p>
                  <ul className="text-sm text-darkGrey mt-2 space-y-1 list-disc list-inside">
                    <li><strong>Frequency:</strong> "15 respondents answered 'Yes'"</li>
                    <li><strong>Percentage:</strong> "60% of respondents answered 'Yes'"</li>
                    <li><strong>Pareto Chart:</strong> "The top 2 categories account for 90% of responses"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-3 bg-darkTeal bg-opacity-10 rounded-lg">
              <p className="font-bold text-darkTeal mb-2">Tips for Students:</p>
              <ul className="text-sm text-darkGrey space-y-1 list-disc list-inside">
                <li>The sum of all frequencies must equal the sample size (n)</li>
                <li>The sum of all relative frequencies must equal 1.0000</li>
                <li>The sum of all percentages must equal 100%</li>
                <li>The last cumulative frequency always equals n</li>
                <li>For continuous data, use Sturges' Rule: k = 1 + 3.322 × log₁₀(n) to find optimal number of classes</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Sample Datasets */}
      <div className="mb-6 p-4 bg-platinum rounded-lg">
        <h3 className="font-bold text-darkGrey mb-3 flex items-center gap-2">
          <Info size={20} className="text-darkTeal" />
          Sample Datasets
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {sampleDatasets.map((dataset, index) => (
            <button
              key={index}
              onClick={() => loadSampleData(dataset)}
              className={`px-3 py-2 border-2 rounded-lg transition-all text-sm ${
                loadedSample === dataset.name
                  ? 'bg-darkTeal text-white border-darkTeal font-bold'
                  : 'bg-white border-darkTeal text-darkGrey hover:bg-darkTeal hover:text-white'
              }`}
            >
              {dataset.name}
              {loadedSample === dataset.name && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      {/* Data Type Selection */}
      <div className="mb-6 p-4 bg-platinum rounded-lg">
        <h3 className="font-bold text-darkGrey mb-3">Data Type</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="discrete"
              checked={dataType === 'discrete'}
              onChange={(e) => setDataType(e.target.value)}
              className="w-4 h-4 text-darkTeal"
            />
            <span className="text-darkGrey">Discrete (Numeric)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="continuous"
              checked={dataType === 'continuous'}
              onChange={(e) => setDataType(e.target.value)}
              className="w-4 h-4 text-darkTeal"
            />
            <span className="text-darkGrey">Continuous (Numeric)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="categorical"
              checked={dataType === 'categorical'}
              onChange={(e) => setDataType(e.target.value)}
              className="w-4 h-4 text-darkTeal"
            />
            <span className="text-darkGrey">Categorical (Text)</span>
          </label>
        </div>
      </div>

      {/* Categorical Input Mode Selection */}
      {dataType === 'categorical' && (
        <div className="mb-6 p-4 bg-platinum rounded-lg">
          <h3 className="font-bold text-darkGrey mb-3">Input Mode</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="raw"
                checked={categoricalInputMode === 'raw'}
                onChange={(e) => setCategoricalInputMode(e.target.value)}
                className="w-4 h-4 text-darkTeal"
              />
              <span className="text-darkGrey">Raw Data (comma-separated)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="counts"
                checked={categoricalInputMode === 'counts'}
                onChange={(e) => setCategoricalInputMode(e.target.value)}
                className="w-4 h-4 text-darkTeal"
              />
              <span className="text-darkGrey">Category Counts</span>
            </label>
          </div>
        </div>
      )}

      {/* Data Input - Raw mode for numeric or categorical */}
      {(dataType !== 'categorical' || categoricalInputMode === 'raw') && (
        <div className="mb-6">
          <label htmlFor="freq-data-input" className="block text-darkGrey font-bold mb-2">
            Enter Data (comma or newline separated, max {MAX_INPUT_COUNT} values)
          </label>
          <textarea
            id="freq-data-input"
            value={dataInput}
            onChange={(e) => { setDataInput(e.target.value); setLoadedSample(''); }}
            placeholder={dataType === 'categorical'
              ? "Enter your data here... e.g., Yes, No, Yes, Maybe, No, Yes"
              : "Enter your data here... e.g., 45, 52, 58, 63, 67, 70"}
            className="w-full p-3 border-2 border-platinum rounded-lg focus:border-darkTeal focus:outline-none min-h-32"
            aria-invalid={!!error}
            aria-describedby="freq-error"
          />
          <p className="text-sm text-darkGrey opacity-70 mt-1">
            Current count: {dataType === 'categorical'
              ? parseCategoricalData(dataInput).length
              : parseData(dataInput).length} values
          </p>
        </div>
      )}

      {/* Category Counts Input */}
      {dataType === 'categorical' && categoricalInputMode === 'counts' && (
        <div className="mb-6 p-4 bg-platinum rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-darkGrey">Category Counts (max {MAX_CATEGORIES})</h3>
            {categoryInputs.length < MAX_CATEGORIES && (
              <button
                onClick={addCategoryInput}
                className="px-3 py-1 bg-darkTeal text-white rounded-lg hover:bg-opacity-90 transition-all text-sm flex items-center gap-1"
              >
                <Plus size={16} /> Add Category
              </button>
            )}
          </div>
          <div className="space-y-2">
            {categoryInputs.map((input, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  id={`freq-category-name-${index}`}
                  type="text"
                  value={input.category}
                  onChange={(e) => updateCategoryInput(index, 'category', e.target.value)}
                  placeholder="Category name"
                  aria-label={`Category ${index + 1} name`}
                  className="flex-1 p-2 border-2 border-platinum rounded-lg focus:border-darkTeal focus:outline-none bg-white"
                />
                <input
                  id={`freq-category-count-${index}`}
                  type="number"
                  value={input.count}
                  onChange={(e) => updateCategoryInput(index, 'count', e.target.value)}
                  placeholder="Count"
                  aria-label={`Category ${index + 1} count`}
                  min="0"
                  className="w-24 p-2 border-2 border-platinum rounded-lg focus:border-darkTeal focus:outline-none bg-white"
                />
                {categoryInputs.length > 2 && (
                  <button
                    onClick={() => removeCategoryInput(index)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                    aria-label={`Remove category ${input.category || index + 1}`}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-darkGrey opacity-70 mt-2">
            Total: {categoryInputs.reduce((sum, input) => sum + (parseInt(input.count) || 0), 0)} values across {categoryInputs.filter(i => i.category.trim() && parseInt(i.count) > 0).length} categories
          </p>
        </div>
      )}

      {/* Continuous Data Options */}
      {dataType === 'continuous' && (
        <div className="mb-6 p-4 bg-platinum rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <input
              id="freq-auto-calculate"
              type="checkbox"
              checked={autoCalculate}
              onChange={(e) => setAutoCalculate(e.target.checked)}
              className="w-4 h-4 text-darkTeal"
            />
            <label htmlFor="freq-auto-calculate" className="text-darkGrey font-bold">
              Auto-calculate (Sturges' Rule)
            </label>
          </div>

          {!autoCalculate && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="freq-number-of-classes" className="block text-darkGrey font-bold mb-2">
                  Number of Classes
                </label>
                <input
                  id="freq-number-of-classes"
                  type="number"
                  value={numberOfClasses}
                  onChange={(e) => setNumberOfClasses(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full p-2 border-2 border-platinum rounded-lg focus:border-darkTeal focus:outline-none"
                  min="1"
                />
              </div>
              <div>
                <label htmlFor="freq-class-width" className="block text-darkGrey font-bold mb-2">
                  Class Width
                </label>
                <input
                  id="freq-class-width"
                  type="number"
                  value={classWidth}
                  onChange={(e) => setClassWidth(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full p-2 border-2 border-platinum rounded-lg focus:border-darkTeal focus:outline-none"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="freq-min-value" className="block text-darkGrey font-bold mb-2">
                  Minimum Value (Start)
                </label>
                <input
                  id="freq-min-value"
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  placeholder="e.g., 0"
                  className="w-full p-2 border-2 border-platinum rounded-lg focus:border-darkTeal focus:outline-none"
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
          className="flex-1 bg-darkTeal text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
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
      <div id="freq-error" className={`mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg flex items-center gap-2 ${error ? '' : 'hidden'}`} role="status">
        <AlertCircle className="text-red-500" size={20} aria-hidden="true" />
        <p className="text-red-700 font-bold">{error || ''}</p>
      </div>

      {/* Results */}
      {frequencyTable.length > 0 && statistics && (
        <div className="space-y-6">
          {/* Statistics Summary */}
          <div className="p-4 bg-accent bg-opacity-20 border-2 border-accent rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-darkGrey">Summary Statistics</h3>
              {loadedSample && (
                <span className="text-sm bg-darkTeal text-white px-3 py-1 rounded-full">
                  {loadedSample}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-darkGrey opacity-70">Sample Size (n)</p>
                <p className="text-xl font-bold text-darkGrey">{statistics.n}</p>
              </div>
              {dataType === 'categorical' ? (
                <div>
                  <p className="text-sm text-darkGrey opacity-70">Number of Categories</p>
                  <p className="text-xl font-bold text-darkGrey">{statistics.numCategories}</p>
                </div>
              ) : (
                <>
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
                </>
              )}
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

          {/* Warning when not all data is captured */}
          {(() => {
            const totalFrequency = frequencyTable.reduce((sum, row) => sum + row.frequency, 0);
            const dataMissing = totalFrequency < statistics.n;
            if (dataMissing && showDataWarning && dataType === 'continuous' && !autoCalculate) {
              return (
                <div className="p-4 bg-orange-100 border-2 border-orange-500 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-orange-500" size={20} />
                    <p className="text-orange-700 font-bold">
                      Warning: Only {totalFrequency} of {statistics.n} data points are captured in the table.
                      {statistics.n - totalFrequency} value(s) fall outside the defined class intervals.
                      Consider adjusting the Number of Classes, Class Width, or Minimum Value.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDataWarning(false)}
                    className="text-orange-500 hover:text-orange-700 p-1"
                    aria-label="Dismiss warning"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
              );
            }
            return null;
          })()}

          {/* Frequency Distribution Table */}
          <div className="overflow-x-auto">
            <h3 className="font-bold text-darkGrey mb-3 flex items-center gap-2">
              <Table2 className="text-darkTeal" size={24} />
              Frequency Distribution Table
            </h3>
            <table className="w-full border-collapse">
              <caption className="sr-only">Frequency distribution table showing class intervals, frequencies, and cumulative statistics</caption>
              <thead>
                <tr className="bg-darkTeal text-white">
                  <th scope="col" className="border border-darkGrey p-2">
                    {dataType === 'categorical' ? 'Category' : dataType === 'discrete' ? 'Value' : 'Class Interval'}
                  </th>
                  {dataType === 'continuous' && (
                    <th scope="col" className="border border-darkGrey p-2">Midpoint</th>
                  )}
                  <th scope="col" className="border border-darkGrey p-2">Frequency (f)</th>
                  <th scope="col" className="border border-darkGrey p-2">Relative Freq</th>
                  <th scope="col" className="border border-darkGrey p-2">Percentage (%)</th>
                  <th scope="col" className="border border-darkGrey p-2">Cumulative Freq</th>
                  <th scope="col" className="border border-darkGrey p-2">Cumulative %</th>
                  <th scope="col" className="border border-darkGrey p-2">Cumulative Rel. Freq</th>
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
                    <td className="border border-darkGrey p-2 text-center">{typeof row.cumulativePercentage === 'number' ? row.cumulativePercentage.toFixed(2) : row.cumulativePercentage}%</td>
                    <td className="border border-darkGrey p-2 text-center">{row.cumulativeRelativeFreq}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {(() => {
                  const totalFrequency = frequencyTable.reduce((sum, row) => sum + row.frequency, 0);
                  const totalRelativeFreq = (totalFrequency / statistics.n).toFixed(4);
                  const totalPercentage = ((totalFrequency / statistics.n) * 100).toFixed(2);
                  return (
                    <tr className="bg-accent bg-opacity-30 font-bold">
                      <td className="border border-darkGrey p-2">Total</td>
                      {dataType === 'continuous' && <td className="border border-darkGrey p-2"></td>}
                      <td className="border border-darkGrey p-2 text-center">{totalFrequency}</td>
                      <td className="border border-darkGrey p-2 text-center">{totalRelativeFreq}</td>
                      <td className="border border-darkGrey p-2 text-center">{totalPercentage}%</td>
                      <td className="border border-darkGrey p-2"></td>
                      <td className="border border-darkGrey p-2"></td>
                      <td className="border border-darkGrey p-2"></td>
                    </tr>
                  );
                })()}
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
                    className="w-4 h-4 text-darkTeal"
                  />
                  <span className="text-darkGrey">Histogram Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="polygon"
                    checked={chartType === 'polygon'}
                    onChange={(e) => setChartType(e.target.value)}
                    className="w-4 h-4 text-darkTeal"
                  />
                  <span className="text-darkGrey">Frequency Polygon Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="both"
                    checked={chartType === 'both'}
                    onChange={(e) => setChartType(e.target.value)}
                    className="w-4 h-4 text-darkTeal"
                  />
                  <span className="text-darkGrey">Both (Histogram + Polygon)</span>
                </label>
              </div>
            </div>
          )}

          {/* Visualizations */}
          <div className="p-4 bg-platinum rounded-lg">
            <h3 className="font-bold text-darkGrey mb-4 flex items-center gap-2">
              <BarChart3 className="text-darkTeal" size={24} />
              {dataType === 'categorical' ? 'Bar Chart' : dataType === 'discrete' ? 'Bar Chart' : 'Histogram & Frequency Polygon'}
            </h3>

            <div role="img" aria-label="Frequency distribution chart">
            {(dataType === 'discrete' || dataType === 'categorical') ? (
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
                  <ComposedChart data={frequencyTable} barCategoryGap={0}>
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
                  <BarChart data={frequencyTable} barCategoryGap={0}>
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
          </div>

          {/* Pareto Chart for Categorical Data */}
          {dataType === 'categorical' && (
            <div className="p-4 bg-platinum rounded-lg">
              <h3 className="font-bold text-darkGrey mb-4 flex items-center gap-2">
                <BarChart3 className="text-darkTeal" size={24} />
                Pareto Chart (with Cumulative Percentage)
              </h3>
              <div role="img" aria-label="Pareto chart showing cumulative frequency distribution">
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
            </div>
          )}

          {/* Dynamic Interpretation Examples */}
          <div className="p-4 bg-darkTeal bg-opacity-10 border-2 border-darkTeal rounded-lg">
            <h3 className="font-bold text-darkGrey mb-3 flex items-center gap-2">
              <Info className="text-darkTeal" size={20} />
              Interpretation Examples from Your Data
            </h3>
            {frequencyTable.length > 0 && (
              <div className="space-y-3 text-darkGrey text-sm">
                {(() => {
                  const maxRow = frequencyTable.reduce((max, row) => row.frequency > max.frequency ? row : max, frequencyTable[0]);
                  const firstRow = frequencyTable[0];
                  const lastRow = frequencyTable[frequencyTable.length - 1];
                  const secondRow = frequencyTable.length >= 2 ? frequencyTable[1] : null;

                  // Context-specific language based on loaded sample
                  const getContext = () => {
                    if (loadedSample.includes('Test Scores')) {
                      return { subject: 'students', item: 'score', verb: 'scored', unit: 'points' };
                    } else if (loadedSample.includes('Age')) {
                      return { subject: 'people', item: 'age', verb: 'are aged', unit: 'years old' };
                    } else if (loadedSample.includes('Ratings')) {
                      return { subject: 'ratings', item: 'rating', verb: 'received', unit: 'stars' };
                    } else if (loadedSample.includes('Heights')) {
                      return { subject: 'people', item: 'height', verb: 'measured', unit: 'cm' };
                    } else if (loadedSample.includes('Survey') || loadedSample.includes('Yes/No')) {
                      return { subject: 'respondents', item: 'response', verb: 'answered', unit: '' };
                    } else if (loadedSample.includes('Blood')) {
                      return { subject: 'people', item: 'blood type', verb: 'have', unit: '' };
                    } else if (dataType === 'categorical') {
                      return { subject: 'responses', item: 'category', verb: 'selected', unit: '' };
                    } else if (dataType === 'discrete') {
                      return { subject: 'observations', item: 'value', verb: 'recorded', unit: '' };
                    } else {
                      return { subject: 'observations', item: 'measurement', verb: 'measured', unit: '' };
                    }
                  };

                  const ctx = getContext();

                  return (
                    <>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="font-bold text-darkTeal mb-2">Frequency Interpretation:</p>
                        <p>
                          {dataType === 'categorical'
                            ? `${maxRow.frequency} ${ctx.subject} ${ctx.verb} "${maxRow.classLabel}", making it the most common ${ctx.item}.`
                            : dataType === 'discrete'
                            ? `${maxRow.frequency} ${ctx.subject} ${ctx.verb} ${maxRow.classLabel} ${ctx.unit}, being this the most frequent ${ctx.item}.`
                            : `${maxRow.frequency} ${ctx.subject} got a ${ctx.item} between ${maxRow.classLabel} ${ctx.unit}, being this the most common range.`
                          }
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-lg">
                        <p className="font-bold text-darkTeal mb-2">Relative Frequency & Percentage:</p>
                        <p>
                          {dataType === 'categorical'
                            ? `Out of every 100 ${ctx.subject}, approximately ${Math.round(parseFloat(maxRow.percentage))} ${ctx.verb} "${maxRow.classLabel}". In decimal form, this is ${maxRow.relativeFrequency} of the total.`
                            : dataType === 'discrete'
                            ? `${maxRow.percentage}% of ${ctx.subject} (or ${maxRow.relativeFrequency} as a proportion) ${ctx.verb} the value ${maxRow.classLabel}.`
                            : `${maxRow.percentage}% of ${ctx.subject} have a ${ctx.item} between ${maxRow.classLabel} ${ctx.unit}. This means roughly ${Math.round(parseFloat(maxRow.percentage))} out of every 100 ${ctx.subject} fall in this range.`
                          }
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-lg">
                        <p className="font-bold text-darkTeal mb-2">Cumulative Frequency:</p>
                        <p>
                          {dataType === 'categorical'
                            ? secondRow
                              ? `The top 2 ${ctx.item}s ("${firstRow.classLabel}" and "${secondRow.classLabel}") together account for ${firstRow.frequency + secondRow.frequency} ${ctx.subject}, which represents ${typeof secondRow.cumulativePercentage === 'number' ? secondRow.cumulativePercentage.toFixed(2) : secondRow.cumulativePercentage}% of all responses.`
                              : `"${firstRow.classLabel}" alone accounts for ${firstRow.frequency} ${ctx.subject} (${typeof firstRow.cumulativePercentage === 'number' ? firstRow.cumulativePercentage.toFixed(2) : firstRow.cumulativePercentage}% of total).`
                            : dataType === 'discrete'
                            ? `${lastRow.cumulativeFrequency} ${ctx.subject} have a ${ctx.item} of ${lastRow.classLabel} or less. This represents ${typeof lastRow.cumulativePercentage === 'number' ? lastRow.cumulativePercentage.toFixed(2) : lastRow.cumulativePercentage}% of all ${ctx.subject}.`
                            : `${lastRow.cumulativeFrequency} ${ctx.subject} (${typeof lastRow.cumulativePercentage === 'number' ? lastRow.cumulativePercentage.toFixed(2) : lastRow.cumulativePercentage}%) have a ${ctx.item} of ${lastRow.upper || lastRow.classLabel.split('-')[1]} ${ctx.unit} or below.`
                          }
                        </p>
                      </div>

                      {dataType === 'continuous' && (
                        <div className="p-3 bg-white rounded-lg">
                          <p className="font-bold text-darkTeal mb-2">Midpoint (Class Mark):</p>
                          <p>
                            For the most common range ({maxRow.classLabel}), the midpoint is {maxRow.midpoint} {ctx.unit}. This value represents all {ctx.subject} in this class when calculating the estimated mean using the formula: Mean ≈ Σ(f × midpoint) ÷ n
                          </p>
                        </div>
                      )}

                      {dataType === 'categorical' && (
                        <div className="p-3 bg-white rounded-lg">
                          <p className="font-bold text-darkTeal mb-2">Pareto Analysis:</p>
                          <p>
                            {(() => {
                              let cumSum = 0;
                              let count = 0;
                              for (const row of frequencyTable) {
                                cumSum += row.frequency;
                                count++;
                                if ((cumSum / statistics.n) >= 0.8) break;
                              }
                              return `The top ${count} ${ctx.item}${count > 1 ? 's' : ''} account for approximately ${((cumSum / statistics.n) * 100).toFixed(1)}% of all ${ctx.subject}. This follows the Pareto principle (80/20 rule).`;
                            })()}
                          </p>
                        </div>
                      )}

                      <div className="p-3 bg-accent bg-opacity-30 rounded-lg">
                        <p className="font-bold text-darkGrey mb-1">Quick Stats Check:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Total frequencies: {frequencyTable.reduce((sum, r) => sum + r.frequency, 0)} (should equal n = {statistics.n}) {frequencyTable.reduce((sum, r) => sum + r.frequency, 0) === statistics.n ? '✓' : '✗'}</li>
                          <li>Sum of relative frequencies: {frequencyTable.reduce((sum, r) => sum + parseFloat(r.relativeFrequency), 0).toFixed(4)} (should ≈ 1.0000) {Math.abs(frequencyTable.reduce((sum, r) => sum + parseFloat(r.relativeFrequency), 0) - 1) < 0.001 ? '✓' : '✗'}</li>
                          <li>Sum of percentages: {frequencyTable.reduce((sum, r) => sum + parseFloat(r.percentage), 0).toFixed(2)}% (should ≈ 100%) {Math.abs(frequencyTable.reduce((sum, r) => sum + parseFloat(r.percentage), 0) - 100) < 0.1 ? '✓' : '✗'}</li>
                        </ul>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequencyDistributionCalculator;
