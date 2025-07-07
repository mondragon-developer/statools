import React, { useState } from 'react';
import { jStat } from 'jstat';
import InfoIcon from './InfoIcon';

const NormalDistributionCalculator = () => {
  const [mean, setMean] = useState(0);
  const [sd, setSd] = useState(1);
  const [inputType, setInputType] = useState('x');
  const [calcType, setCalcType] = useState('left');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result, setResult] = useState(null);
  const [z1, setZ1] = useState(null);
  const [z2, setZ2] = useState(null);
  const [error, setError] = useState('');

  const toZ = (x) => (x - mean) / sd;

  const cdf = (z) => jStat.normal.cdf(z, 0, 1);

  const calculate = () => {
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (isNaN(mean) || isNaN(sd) || sd <= 0) {
      setError('Enter a valid mean and standard deviation');
      setResult(null);
      return;
    }

    if (isNaN(v1)) {
      setError('Enter a valid value');
      setResult(null);
      return;
    }
    let zVal1 = inputType === 'z' ? v1 : toZ(v1);
    let prob;
    let zVal2;

    if (calcType === 'left') {
      prob = cdf(zVal1);
    } else if (calcType === 'right') {
      prob = 1 - cdf(zVal1);
    } else if (calcType === 'between') {
      if (isNaN(v2)) {
        setError('Enter a valid second value');
        setResult(null);
        return;
      }
      zVal2 = inputType === 'z' ? v2 : toZ(v2);
      prob = cdf(Math.max(zVal1, zVal2)) - cdf(Math.min(zVal1, zVal2));
    } else if (calcType === 'around') {
      if (isNaN(v2)) {
        setError('Enter a valid margin');
        setResult(null);
        return;
      }
      const margin = inputType === 'z' ? Math.abs(v2) : Math.abs(v2 / sd);
      prob = cdf(zVal1 + margin) - cdf(zVal1 - margin);
      zVal2 = margin;
    }

    setResult(prob);
    setZ1(zVal1);
    setZ2(zVal2);
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-darkGrey mb-4">
          Normal Distribution Calculator
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-darkGrey font-medium mb-1">
                Mean (μ)
                <InfoIcon info="Center of the distribution" />
              </label>
              <input
                type="number"
                value={mean}
                onChange={(e) => setMean(parseFloat(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="flex items-center text-darkGrey font-medium mb-1">
                Std Dev (σ)
                <InfoIcon info="Spread of the distribution" />
              </label>
              <input
                type="number"
                min="0.0001"
                value={sd}
                onChange={(e) => setSd(parseFloat(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="flex items-center text-darkGrey font-medium mb-1">
                Input Type
              </label>
              <select
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="x">X value</option>
                <option value="z">Z value</option>
              </select>
            </div>
            <div>
              <label className="flex items-center text-darkGrey font-medium mb-1">
                Calculation
              </label>
              <select
                value={calcType}
                onChange={(e) => setCalcType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="left">P(X &lt;= value)</option>
                <option value="right">P(X &gt; value)</option>
                <option value="between">P(value1 &lt; X &lt; value2)</option>
                <option value="around">P(X around value ± margin)</option>
              </select>
            </div>
            <div>
              <label className="flex items-center text-darkGrey font-medium mb-1">
                {calcType === 'between' ? 'First value' : 'Value'}
              </label>
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            {(calcType === 'between' || calcType === 'around') && (
              <div>
                <label className="flex items-center text-darkGrey font-medium mb-1">
                  {calcType === 'between' ? 'Second value' : 'Margin'}
                </label>
                <input
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
            <button
              onClick={calculate}
              className="px-4 py-2 bg-turquoise text-white rounded hover:bg-turquoise/80"
            >
              Calculate
            </button>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          <div className="bg-yellow/20 border-2 border-yellow p-4 rounded space-y-2">
            <h3 className="text-xl font-bold text-darkGrey mb-2">Results</h3>
            {result !== null && (
              <>
                <p className="text-darkGrey">Probability: {result.toFixed(4)}</p>
                <p className="text-darkGrey">z₁: {z1.toFixed(4)}</p>
                {z2 !== null && (
                  <p className="text-darkGrey">
                    {calcType === 'between' ? 'z₂' : 'margin'}: {z2.toFixed(4)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalDistributionCalculator;
