import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { RotateCcw } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

/**
 * PROBABILITY CALCULATOR: A COMPREHENSIVE STATISTICAL TOOLKIT
 * 
 * Architecture Overview:
 * This component follows SOLID principles to create a maintainable, extensible probability toolkit.
 * Think of it as a Swiss Army knife where each tool (calculator) is perfectly designed for its specific task.
 * 
 * Main Components:
 * 1. Probability Rules Engine - Like a traffic light system for event relationships
 * 2. Combinatorics Calculator - A factory for counting possibilities
 * 3. Expected Value Analyzer - A financial advisor for random events
 * 4. Dice Simulator - A physics engine for virtual dice
 */

// ========================================
// MATHEMATICAL ENGINE (Single Responsibility)
// ========================================
/**
 * Pure mathematical functions - the brain of our calculator
 * These functions are like mathematical formulas in a textbook: pure, predictable, and reusable
 */
const MathEngine = {
  /**
   * Calculate factorial: n! = n × (n-1) × ... × 1
   * Like counting all possible ways to arrange n unique books on a shelf
   */
  factorial: (n) => {
    if (n < 0) return undefined;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  },

  /**
   * Calculate combinations: C(n,r) = n! / (r! × (n-r)!)
   * Like choosing r items from n items where order doesn't matter (selecting a team)
   */
  combination: (n, r) => {
    if (r > n) return 0;
    return MathEngine.factorial(n) / (MathEngine.factorial(r) * MathEngine.factorial(n - r));
  },

  /**
   * Calculate permutations: P(n,r) = n! / (n-r)!
   * Like arranging r items from n items where order matters (race positions)
   */
  permutation: (n, r) => {
    if (r > n) return 0;
    return MathEngine.factorial(n) / MathEngine.factorial(n - r);
  },

  /**
   * Calculate probability rules based on event relationships
   * Like determining traffic flow at an intersection based on signal patterns
   */
  calculateProbabilityRules: (probA, probB, probAandB, ruleType) => {
    const probNotA = 1 - probA;
    const probNotB = 1 - probB;
    
    let probAorB;
    if (ruleType === 'mutuallyExclusive') {
      // Mutually exclusive: like two radio stations - can't tune into both
      probAorB = probA + probB;
    } else {
      // General case: like overlapping circles in a Venn diagram
      probAorB = probA + probB - probAandB;
    }
    
    // Conditional probabilities: "given that B happened, what's the chance of A?"
    const probAgivenB = probB > 0 ? probAandB / probB : 0;
    const probBgivenA = probA > 0 ? probAandB / probA : 0;
    
    return {
      probNotA,
      probNotB,
      probAorB,
      probAgivenB,
      probBgivenA
    };
  },

  /**
   * Calculate expected value: weighted average of all possible outcomes
   * Like calculating your average grade considering each assignment's weight
   */
  calculateExpectedValue: (outcomes) => {
    return outcomes.reduce((sum, outcome) => sum + (outcome.value * outcome.probability), 0);
  }
};

// ========================================
// TOOLTIP SYSTEM (Interface Segregation)
// ========================================
/**
 * Smart Tooltip Component - Like a Helpful Study Buddy
 * Shows explanations exactly where you need them, when you need them
 */
const InfoIcon = ({ info }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);

  // Calculate tooltip position - like a smart label that knows where to appear
  const updatePosition = useCallback(() => {
    if (!iconRef.current || !tooltipRef.current) return;

    const iconRect = iconRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Position relative to the icon, accounting for page scroll
    let left = iconRect.left + scrollX + (iconRect.width / 2) - (tooltipRect.width / 2);
    let top = iconRect.top + scrollY - tooltipRect.height - 10;

    // Boundary checks - like bumpers in bowling
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Keep tooltip on screen horizontally
    if (left < 10) {
      left = 10;
    } else if (left + tooltipRect.width > scrollX + viewportWidth - 10) {
      left = scrollX + viewportWidth - tooltipRect.width - 10;
    }
    
    // If no room above, show below
    if (top - scrollY < 10) {
      top = iconRect.bottom + scrollY + 10;
    }

    setPosition({ top, left });
  }, []);

  // Show tooltip on hover
  const handleMouseEnter = () => {
    setIsVisible(true);
    // Use RAF for smoother positioning
    requestAnimationFrame(() => {
      requestAnimationFrame(updatePosition);
    });
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Keep tooltip positioned correctly during scroll/resize
  useEffect(() => {
    if (isVisible) {
      const handleUpdate = () => requestAnimationFrame(updatePosition);
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);
      
      // Initial position update
      handleUpdate();
      
      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isVisible, updatePosition]);

  return (
    <>
      <span
        ref={iconRef}
        className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-turquoise rounded-full cursor-help transition-all hover:scale-110 hover:shadow-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        tabIndex={0}
        aria-label="More information"
        role="button"
      >
        ?
      </span>
      
      {/* Tooltip Portal - Appears in the document flow */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-4 py-3 text-sm text-white bg-darkGrey rounded-lg shadow-xl max-w-sm pointer-events-none"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
        >
          {/* Arrow pointer */}
          <div
            className="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-darkGrey"
            style={{
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
          <div className="text-white/90">{info}</div>
        </div>
      )}
    </>
  );
};

// ========================================
// 3D DICE COMPONENT (Open/Closed Principle)
// ========================================
/**
 * Pure 3D CSS Dice Component
 * Like a physical die that you can see from all angles
 * Open for extension (different sizes/colors) but closed for modification
 */
const Dice3D = ({ value, isRolling, size = 60 }) => {
  // Dot patterns for each face - like the arrangement of pips on real dice
  const dotPositions = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[30, 30], [50, 50], [70, 70]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
    6: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]]
  };

  const renderDots = (faceValue) => {
    return dotPositions[faceValue].map((pos, i) => (
      <div
        key={i}
        className="absolute bg-darkGrey rounded-full"
        style={{
          width: `${size * 0.15}px`,
          height: `${size * 0.15}px`,
          left: `${pos[0]}%`,
          top: `${pos[1]}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />
    ));
  };

  // Six faces of a die, each positioned in 3D space
  const faces = [
    { value: 1, transform: `translateZ(${size/2}px)` },
    { value: 6, transform: `translateZ(-${size/2}px) rotateY(180deg)` },
    { value: 2, transform: `rotateY(-90deg) translateZ(${size/2}px)` },
    { value: 5, transform: `rotateY(90deg) translateZ(${size/2}px)` },
    { value: 3, transform: `rotateX(90deg) translateZ(${size/2}px)` },
    { value: 4, transform: `rotateX(-90deg) translateZ(${size/2}px)` }
  ];

  // Calculate rotation based on current value or rolling state
  const getRotation = () => {
    if (isRolling) {
      return 'rotateX(720deg) rotateY(720deg)';
    }
    const rotations = {
      1: 'rotateX(0deg) rotateY(0deg)',
      2: 'rotateY(-90deg)',
      3: 'rotateX(-90deg)',
      4: 'rotateX(90deg)',
      5: 'rotateY(90deg)',
      6: 'rotateY(180deg)'
    };
    return rotations[value];
  };

  return (
    <div className="inline-block" style={{ perspective: '200px' }}>
      <div
        className="relative transition-transform duration-1000 ease-out"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transformStyle: 'preserve-3d',
          transform: getRotation()
        }}
      >
        {faces.map((face) => (
          <div
            key={face.value}
            className="absolute bg-yellow border-2 border-darkGrey rounded-lg flex items-center justify-center"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: face.transform
            }}
          >
            {renderDots(face.value)}
          </div>
        ))}
      </div>
    </div>
  );
};

// ========================================
// PROBABILITY RULES MODULE (Single Responsibility)
// ========================================
/**
 * Handles all probability rules calculations and UI
 * Like a control panel for understanding how events relate to each other
 */
const ProbabilityRulesModule = ({ MathEngine }) => {
  // State management - keeping track of our probability values
  const [probA, setProbA] = useState(0.5);
  const [probB, setProbB] = useState(0.3);
  const [probAandB, setProbAandB] = useState(0.1);
  const [ruleType, setRuleType] = useState('independent');

  // Reset function - returning to factory defaults
  const reset = useCallback(() => {
    setProbA(0.5);
    setProbB(0.3);
    setProbAandB(0.1);
    setRuleType('independent');
  }, []);

  // Memoized calculations - like caching frequently accessed data
  const results = useMemo(() => 
    MathEngine.calculateProbabilityRules(probA, probB, probAandB, ruleType),
    [probA, probB, probAandB, ruleType]
  );

  // Visualization data for the complete probability space
  const vennData = useMemo(() => {
    // Calculate all regions of the probability space - like dividing a pizza
    const probAonly = probA - probAandB;  // Just A, not B
    const probBonly = probB - probAandB;  // Just B, not A
    const probBoth = probAandB;           // Both A and B
    const probNeither = 1 - (probA + probB - probAandB);  // Neither A nor B
    
    return {
      labels: ['Only A', 'Only B', 'Both A and B', 'Neither A nor B'],
      datasets: [{
        data: [
          Math.max(0, probAonly),
          Math.max(0, probBonly),
          Math.max(0, probBoth),
          Math.max(0, probNeither)
        ],
        backgroundColor: [
          'rgba(78, 205, 196, 0.7)',   // Turquoise for A only
          'rgba(255, 255, 0, 0.7)',     // Yellow for B only
          'rgba(34, 139, 34, 0.7)',     // Green for intersection
          'rgba(128, 128, 128, 0.3)'    // Gray for neither
        ],
        borderColor: [
          'rgba(78, 205, 196, 1)',
          'rgba(255, 255, 0, 1)',
          'rgba(34, 139, 34, 1)',
          'rgba(128, 128, 128, 1)'
        ],
        borderWidth: 2
      }]
    };
  }, [probA, probB, probAandB]);

  // Formula displays for student learning
  const formulas = {
    complement: "P(not A) = 1 - P(A)",
    union: ruleType === 'mutuallyExclusive' 
      ? "P(A ∪ B) = P(A) + P(B)" 
      : "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
    conditional: "P(A|B) = P(A ∩ B) / P(B)",
    multiplication: ruleType === 'independent'
      ? "P(A ∩ B) = P(A) × P(B)"
      : "P(A ∩ B) = P(A) × P(B|A)"
  };

  return (
    <div className="space-y-6">
      <div className="bg-platinum p-4 rounded-lg">
        <h3 className="text-xl font-bold text-darkGrey mb-4 flex items-center justify-between">
          <span className="flex items-center">
            Probability Rules: The Traffic Laws of Chance
            <InfoIcon info="Explore how events interact like traffic at an intersection - sometimes they flow together, sometimes they're mutually exclusive" />
          </span>
          <button
            onClick={reset}
            className="p-2 bg-yellow border-2 border-darkGrey text-darkGrey rounded-lg hover:bg-darkGrey hover:text-white transition-all"
            title="Reset to defaults"
          >
            <RotateCcw size={20} />
          </button>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Control Panel */}
          <div className="space-y-4">
            {/* Probability A Slider */}
            <div>
              <label className="flex items-center text-darkGrey font-medium mb-2">
                P(A) = {probA.toFixed(2)} - Event A Likelihood
                <InfoIcon info="Like the chance of rain today - a standalone probability" />
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={probA}
                onChange={(e) => setProbA(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4ECDC4 0%, #4ECDC4 ${probA * 100}%, #e0e0e0 ${probA * 100}%, #e0e0e0 100%)`
                }}
              />
            </div>
            
            {/* Probability B Slider */}
            <div>
              <label className="flex items-center text-darkGrey font-medium mb-2">
                P(B) = {probB.toFixed(2)} - Event B Likelihood
                <InfoIcon info="Like the chance of traffic - another standalone probability" />
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={probB}
                onChange={(e) => setProbB(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FFFF00 0%, #FFFF00 ${probB * 100}%, #e0e0e0 ${probB * 100}%, #e0e0e0 100%)`
                }}
              />
            </div>
            
            {/* Event Relationship Selector */}
            <div>
              <label className="block text-darkGrey font-medium mb-2">
                How Events Relate
                <InfoIcon info="Like traffic patterns - can events happen together or are they exclusive?" />
              </label>
              <select
                value={ruleType}
                onChange={(e) => setRuleType(e.target.value)}
                className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
              >
                <option value="independent">Independent (like coin flips)</option>
                <option value="dependent">Dependent (like drawing cards)</option>
                <option value="mutuallyExclusive">Mutually Exclusive (like being in two places)</option>
              </select>
            </div>
            
            {/* Intersection Probability */}
            {ruleType !== 'mutuallyExclusive' && (
              <div>
                <label className="flex items-center text-darkGrey font-medium mb-2">
                  P(A ∩ B) = {probAandB.toFixed(2)} - Both Events Together
                  <InfoIcon info="The overlap - like being both rainy AND having traffic" />
                </label>
                <input
                  type="range"
                  min="0"
                  max={Math.min(probA, probB)}
                  step="0.01"
                  value={probAandB}
                  onChange={(e) => setProbAandB(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                      background: `linear-gradient(to right, #4ECDC4 0%,rgb(95, 78, 205) ${(1-(1-probAandB/Math.min(probA, probB)))*100}%, #e0e0e0 ${probAandB*100}%, #e0e0e0 100%)`
                  }}

                />
              </div>
            )}
          </div>
          
          {/* Results Dashboard */}
          <div className="bg-white p-4 rounded-lg border-2 border-darkGrey/20">
            <h4 className="font-bold text-darkGrey mb-3">🎯 Calculated Probabilities</h4>
            
            {/* Formula Cards */}
            <div className="mb-4 space-y-2">
              <div className="bg-blue-50 p-2 rounded text-xs font-mono text-center">
                {formulas.complement}
              </div>
              <div className="bg-yellow-50 p-2 rounded text-xs font-mono text-center">
                {formulas.union}
              </div>
              {ruleType !== 'mutuallyExclusive' && (
                <div className="bg-green-50 p-2 rounded text-xs font-mono text-center">
                  {formulas.conditional}
                </div>
              )}
            </div>
            
            {/* Calculated Values */}
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="flex justify-between items-center">
                  <span className="text-sm">P(not A):</span>
                  <span className="font-mono font-bold">{results.probNotA.toFixed(4)}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  = 1 - {probA.toFixed(2)} = {results.probNotA.toFixed(4)}
                </p>
              </div>
              
              <div className="border-b pb-2">
                <p className="flex justify-between items-center">
                  <span className="text-sm">P(not B):</span>
                  <span className="font-mono font-bold">{results.probNotB.toFixed(4)}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  = 1 - {probB.toFixed(2)} = {results.probNotB.toFixed(4)}
                </p>
              </div>
              
              <div className="border-b pb-2">
                <p className="flex justify-between items-center">
                  <span className="text-sm">P(A ∪ B):</span>
                  <span className="font-mono font-bold text-turquoise">{results.probAorB.toFixed(4)}</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {ruleType === 'mutuallyExclusive' 
                    ? `= ${probA.toFixed(2)} + ${probB.toFixed(2)} = ${results.probAorB.toFixed(4)}`
                    : `= ${probA.toFixed(2)} + ${probB.toFixed(2)} - ${probAandB.toFixed(2)} = ${results.probAorB.toFixed(4)}`
                  }
                </p>
              </div>
              
              {ruleType !== 'mutuallyExclusive' && (
                <>
                  <div className="border-b pb-2">
                    <p className="flex justify-between items-center">
                      <span className="text-sm">P(A|B):</span>
                      <span className="font-mono font-bold">{results.probAgivenB.toFixed(4)}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      = {probAandB.toFixed(2)} / {probB.toFixed(2)} = {results.probAgivenB.toFixed(4)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="flex justify-between items-center">
                      <span className="text-sm">P(B|A):</span>
                      <span className="font-mono font-bold">{results.probBgivenA.toFixed(4)}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      = {probAandB.toFixed(2)} / {probA.toFixed(2)} = {results.probBgivenA.toFixed(4)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Visual Representation */}
        <div className="mt-6 bg-white p-4 rounded-lg border-2 border-darkGrey/20">
          <h4 className="font-bold text-darkGrey mb-3">📊 Visual Breakdown - The Complete Probability Universe</h4>
          
          {/* Venn Diagram Explanation */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-darkGrey">
              <strong>Think of this like a map of all possibilities:</strong><br/>
              • <span className="inline-block w-3 h-3 bg-turquoise rounded mr-1"></span> Only A happens (not B)<br/>
              • <span className="inline-block w-3 h-3 bg-yellow rounded mr-1"></span> Only B happens (not A)<br/>
              • <span className="inline-block w-3 h-3 bg-green-600 rounded mr-1"></span> Both A and B happen<br/>
              • <span className="inline-block w-3 h-3 bg-gray-400 rounded mr-1"></span> Neither A nor B happens<br/>
              <strong className="block mt-2">All four regions must add up to 1.00 (100%)</strong>
            </p>
          </div>
          
          <div className="h-64">
            <Pie data={vennData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { 
                  position: 'bottom',
                  labels: {
                    generateLabels: (chart) => {
                      const data = chart.data;
                      if (data.labels.length && data.datasets.length) {
                        return data.labels.map((label, i) => {
                          const value = data.datasets[0].data[i];
                          return {
                            text: `${label}: ${value.toFixed(3)}`,
                            fillStyle: data.datasets[0].backgroundColor[i],
                            strokeStyle: data.datasets[0].borderColor[i],
                            lineWidth: data.datasets[0].borderWidth,
                            hidden: false,
                            index: i
                          };
                        });
                      }
                      return [];
                    }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.parsed || 0;
                      const percentage = (value * 100).toFixed(1);
                      return `${label}: ${value.toFixed(3)} (${percentage}%)`;
                    }
                  }
                }
              }
            }} />
          </div>
          
          {/* Verification Check */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Total probability: {(Math.max(0, probA - probAandB) + Math.max(0, probB - probAandB) + Math.max(0, probAandB) + Math.max(0, 1 - (probA + probB - probAandB))).toFixed(3)} 
            {Math.abs((Math.max(0, probA - probAandB) + Math.max(0, probB - probAandB) + Math.max(0, probAandB) + Math.max(0, 1 - (probA + probB - probAandB))) - 1) < 0.001 ? 
              <span className="text-green-600 ml-1">✓ Adds to 1.00</span> : 
              <span className="text-red-600 ml-1">⚠️ Check values</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// COMBINATORICS MODULE (Single Responsibility)
// ========================================
/**
 * Handles all combinatorics calculations
 * Like a factory that counts all possible ways to arrange or select items
 */
const CombinatoricsModule = ({ MathEngine }) => {
  const [n, setN] = useState(10);
  const [r, setR] = useState(3);
  const [combType, setCombType] = useState('combination');
  const [withReplacement, setWithReplacement] = useState(false);

  const reset = useCallback(() => {
    setN(10);
    setR(3);
    setCombType('combination');
    setWithReplacement(false);
  }, []);

  // Calculate result based on selected type
  const result = useMemo(() => {
    if (combType === 'combination') {
      return withReplacement 
        ? MathEngine.combination(n + r - 1, r)  // Combinations with replacement
        : MathEngine.combination(n, r);         // Standard combinations
    } else if (combType === 'permutation') {
      return withReplacement 
        ? Math.pow(n, r)                        // Permutations with replacement
        : MathEngine.permutation(n, r);         // Standard permutations
    } else {
      return MathEngine.factorial(n);           // Factorial
    }
  }, [n, r, combType, withReplacement]);

  // Preset examples - like recipe cards for common scenarios
  const presetExamples = [
    { name: "Poker hands: 5 cards from 52", n: 52, r: 5, type: 'combination', replacement: false },
    { name: "Race positions: Top 3 from 10", n: 10, r: 3, type: 'permutation', replacement: false },
    { name: "Lottery: Choose 3 from 6", n: 6, r: 3, type: 'combination', replacement: false },
    { name: "PIN code: 4 letters", n: 26, r: 4, type: 'permutation', replacement: true }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-platinum p-4 rounded-lg">
        <h3 className="text-xl font-bold text-darkGrey mb-4 flex items-center justify-between">
          <span className="flex items-center">
            Combinatorics: The Art of Counting Possibilities
            <InfoIcon info="Like counting all possible ice cream combinations at a shop - order might or might not matter!" />
          </span>
          <button
            onClick={reset}
            className="p-2 bg-yellow border-2 border-darkGrey text-darkGrey rounded-lg hover:bg-darkGrey hover:text-white transition-all"
            title="Reset to defaults"
          >
            <RotateCcw size={20} />
          </button>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-darkGrey font-medium mb-2">
                Calculation Type
                <InfoIcon info="Choose your counting method - like deciding if order matters in a race vs a team" />
              </label>
              <select
                value={combType}
                onChange={(e) => setCombType(e.target.value)}
                className="w-full p-2 border-2 border-darkGrey/20 rounded-lg focus:border-turquoise outline-none"
              >
                <option value="combination">Combination - Order Doesn't Matter</option>
                <option value="permutation">Permutation - Order Matters</option>
                <option value="factorial">Factorial - Arrange Everything</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center text-darkGrey font-medium mb-2">
                Total items (n): {n}
                <InfoIcon info="Your pool of choices - like items on a menu" />
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4ECDC4 0%, #4ECDC4 ${(n - 1) / 19 * 100}%, #e0e0e0 ${(n - 1) / 19 * 100}%, #e0e0e0 100%)`
                }}
              />
            </div>
            
            {combType !== 'factorial' && (
              <>
                <div>
                  <label className="flex items-center text-darkGrey font-medium mb-2">
                    Items to select (r): {r}
                    <InfoIcon info="How many you're choosing - like picking team members" />
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={n}
                    value={r}
                    onChange={(e) => setR(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #FFFF00 0%, #FFFF00 ${r / n * 100}%, #e0e0e0 ${r / n * 100}%, #e0e0e0 100%)`
                    }}
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-darkGrey">
                    <input
                      type="checkbox"
                      checked={withReplacement}
                      onChange={(e) => setWithReplacement(e.target.checked)}
                      className="mr-2"
                    />
                    With replacement
                    <InfoIcon info="Can you pick the same item twice? Like drawing with replacement" />
                  </label>
                </div>
              </>
            )}
          </div>
          
          {/* Results Display */}
          <div className="bg-white p-4 rounded-lg border-2 border-darkGrey/20">
            <h4 className="font-bold text-darkGrey mb-3">🎯 Result</h4>
            <div className="text-center">
              <p className="text-4xl font-bold text-turquoise mb-2">
                {result.toLocaleString()}
              </p>
              <p className="text-sm text-darkGrey opacity-80">
                {combType === 'factorial' && `${n}! = ${n} × ${n-1} × ... × 1`}
                {combType === 'combination' && !withReplacement && `C(${n},${r}) = ${n}! / (${r}! × ${n-r}!)`}
                {combType === 'combination' && withReplacement && `C(${n+r-1},${r})`}
                {combType === 'permutation' && !withReplacement && `P(${n},${r}) = ${n}! / ${n-r}!`}
                {combType === 'permutation' && withReplacement && `${n}^${r}`}
              </p>
            </div>
            
            <div className="mt-4 p-3 bg-yellow/20 rounded-lg">
              <p className="text-sm text-darkGrey">
                <strong>Real-World Meaning:</strong><br/>
                {combType === 'combination' && `Imagine selecting ${r} items from a menu of ${n} items - you have ${result.toLocaleString()} different meal combinations!`}
                {combType === 'permutation' && `Picture arranging ${r} people in a line from ${n} candidates - there are ${result.toLocaleString()} possible lineups!`}
                {combType === 'factorial' && `Think of arranging ${n} books on a shelf - you have ${result.toLocaleString()} different arrangements!`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Examples */}
        <div className="mt-6 bg-white p-4 rounded-lg border-2 border-darkGrey/20">
          <h4 className="font-bold text-darkGrey mb-3">⚡ Quick Examples</h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            {presetExamples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setN(example.n);
                  setR(example.r);
                  setCombType(example.type);
                  setWithReplacement(example.replacement);
                }}
                className="p-2 bg-platinum hover:bg-turquoise/20 rounded transition-colors text-left"
              >
                <strong>{example.name}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// EXPECTED VALUE MODULE (Single Responsibility)
// ========================================
/**
 * Calculates expected values for random events
 * Like a financial advisor for games of chance
 */
const ExpectedValueModule = ({ MathEngine }) => {
  const [outcomes, setOutcomes] = useState([
    { value: 100, probability: 0.2 },
    { value: 50, probability: 0.3 },
    { value: -20, probability: 0.5 }
  ]);

  const reset = useCallback(() => {
    setOutcomes([
      { value: 100, probability: 0.2 },
      { value: 50, probability: 0.3 },
      { value: -20, probability: 0.5 }
    ]);
  }, []);

  const addOutcome = () => {
    setOutcomes([...outcomes, { value: 0, probability: 0 }]);
  };

  const removeOutcome = (index) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter((_, i) => i !== index));
    }
  };

  const updateOutcome = (index, field, value) => {
    const newOutcomes = [...outcomes];
    newOutcomes[index][field] = parseFloat(value) || 0;
    setOutcomes(newOutcomes);
  };

  // Calculate expected value and total probability
  const { expectedValue, totalProb } = useMemo(() => {
    const ev = MathEngine.calculateExpectedValue(outcomes);
    const tp = outcomes.reduce((sum, o) => sum + o.probability, 0);
    return { expectedValue: ev, totalProb: tp };
  }, [outcomes]);

  // Chart data for visualization
  const chartData = useMemo(() => ({
    labels: outcomes.map((_, i) => `Outcome ${i + 1}`),
    datasets: [{
      label: 'Contribution to Expected Value',
      data: outcomes.map(o => o.value * o.probability),
      backgroundColor: outcomes.map(o => o.value >= 0 ? 'rgba(78, 205, 196, 0.6)' : 'rgba(255, 0, 0, 0.6)'),
      borderColor: outcomes.map(o => o.value >= 0 ? 'rgba(78, 205, 196, 1)' : 'rgba(255, 0, 0, 1)'),
      borderWidth: 2
    }]
  }), [outcomes]);

  return (
    <div className="space-y-6">
      <div className="bg-platinum p-4 rounded-lg">
        <h3 className="text-xl font-bold text-darkGrey mb-4 flex items-center justify-between">
          <span className="flex items-center">
            Expected Value: Your Statistical Crystal Ball
            <InfoIcon info="Like calculating the average outcome of a lottery ticket - what's your long-term expectation?" />
          </span>
          <button
            onClick={reset}
            className="p-2 bg-yellow border-2 border-darkGrey text-darkGrey rounded-lg hover:bg-darkGrey hover:text-white transition-all"
            title="Reset to defaults"
          >
            <RotateCcw size={20} />
          </button>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Outcome Input */}
          <div className="space-y-4">
            <h4 className="font-bold text-darkGrey">Define Your Outcomes</h4>
            {outcomes.map((outcome, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border-2 border-darkGrey/20">
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="text-sm text-darkGrey">Value ($)</label>
                    <input
                      type="number"
                      value={outcome.value}
                      onChange={(e) => updateOutcome(index, 'value', e.target.value)}
                      className="w-full p-1 border-2 border-darkGrey/20 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-darkGrey">Probability</label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={outcome.probability}
                      onChange={(e) => updateOutcome(index, 'probability', e.target.value)}
                      className="w-full p-1 border-2 border-darkGrey/20 rounded"
                    />
                  </div>
                  {outcomes.length > 2 && (
                    <button
                      onClick={() => removeOutcome(index)}
                      className="text-red-500 hover:text-red-700 mt-4"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button
              onClick={addOutcome}
              className="w-full bg-yellow border-2 border-darkGrey text-darkGrey px-4 py-2 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all"
            >
              + Add Another Outcome
            </button>
            
            {Math.abs(totalProb - 1) > 0.01 && (
              <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
                ⚠️ Probabilities sum to {totalProb.toFixed(2)} (should be 1.00)
              </p>
            )}
          </div>
          
          {/* Results and Visualization */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-darkGrey/20">
              <h4 className="font-bold text-darkGrey mb-3">💰 Expected Value</h4>
              <p className="text-4xl font-bold text-center text-turquoise">
                ${expectedValue.toFixed(2)}
              </p>
              <p className="text-sm text-darkGrey opacity-80 text-center mt-2">
                E(X) = Σ(value × probability)
              </p>
            </div>
            
            <div className="bg-yellow/20 p-4 rounded-lg">
              <p className="text-sm text-darkGrey">
                <strong>What This Means:</strong><br/>
                {expectedValue > 0 && `🎉 Good news! On average, you'll gain $${expectedValue.toFixed(2)} per play. This is a favorable bet in the long run.`}
                {expectedValue < 0 && `⚠️ Caution! On average, you'll lose $${Math.abs(expectedValue).toFixed(2)} per play. The house has the edge here.`}
                {expectedValue === 0 && `⚖️ Perfect balance! This is a fair game with no advantage to either side.`}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border-2 border-darkGrey/20">
              <Bar data={chartData} options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: {
                    display: true,
                    text: 'How Each Outcome Contributes'
                  }
                },
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: 'Value × Probability'
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// DICE SIMULATOR MODULE (Single Responsibility)
// ========================================
/**
 * Interactive dice rolling simulator
 * Like a physics-accurate virtual casino table
 */
const DiceSimulatorModule = () => {
  const [diceCount, setDiceCount] = useState(2);
  const [diceValues, setDiceValues] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState([]);

  const reset = useCallback(() => {
    setDiceCount(2);
    setDiceValues([1, 1]);
    setIsRolling(false);
    setRollHistory([]);
  }, []);

  // Roll the dice with animation
  const rollDice = useCallback(() => {
    setIsRolling(true);
    setTimeout(() => {
      const newValues = Array(diceCount).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
      setDiceValues(newValues);
      setIsRolling(false);
      setRollHistory(prev => [...prev.slice(-19), {
        values: newValues,
        sum: newValues.reduce((a, b) => a + b, 0),
        timestamp: Date.now()
      }]);
    }, 1000);
  }, [diceCount]);

  // Update dice values when count changes
  useEffect(() => {
    setDiceValues(Array(diceCount).fill(1));
  }, [diceCount]);

  // Calculate frequency distribution
  const { sumFrequency, chartData } = useMemo(() => {
    const freq = {};
    rollHistory.forEach(roll => {
      freq[roll.sum] = (freq[roll.sum] || 0) + 1;
    });
    
    const possibleSums = Array.from({length: 6 * diceCount - diceCount + 1}, (_, i) => i + diceCount);
    const frequencies = possibleSums.map(sum => freq[sum] || 0);
    
    return {
      sumFrequency: freq,
      chartData: {
        labels: possibleSums.map(s => s.toString()),
        datasets: [{
          label: 'Roll Frequency',
          data: frequencies,
          backgroundColor: 'rgba(78, 205, 196, 0.6)',
          borderColor: 'rgba(78, 205, 196, 1)',
          borderWidth: 2
        }]
      }
    };
  }, [rollHistory, diceCount]);

  return (
    <div className="space-y-6">
      <div className="bg-platinum p-6 rounded-lg">
        <h3 className="text-xl font-bold text-darkGrey mb-4 flex items-center justify-between">
          <span className="flex items-center">
            🎲 3D Dice Simulator: Roll the Bones!
            <InfoIcon info="Experience probability in action - watch how random rolls create predictable patterns over time" />
          </span>
          <button
            onClick={reset}
            className="p-2 bg-yellow border-2 border-darkGrey text-darkGrey rounded-lg hover:bg-darkGrey hover:text-white transition-all"
            title="Reset to defaults"
          >
            <RotateCcw size={20} />
          </button>
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Dice Controls and Display */}
          <div className="space-y-4">
            {/* Dice Count Slider */}
            <div>
              <label className="flex items-center text-darkGrey font-medium mb-2">
                Number of dice: {diceCount}
                <InfoIcon info="More dice = more possible sums and a bell curve distribution" />
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={diceCount}
                onChange={(e) => setDiceCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4ECDC4 0%, #4ECDC4 ${(diceCount - 1) / 5 * 100}%, #e0e0e0 ${(diceCount - 1) / 5 * 100}%, #e0e0e0 100%)`
                }}
              />
            </div>
            
            {/* 3D Dice Display Area */}
            <div className="bg-white rounded-lg p-6 min-h-[240px] flex items-center justify-center border-2 border-darkGrey/20">
              <div className="flex gap-3 flex-wrap justify-center items-center">
                {diceValues.map((value, i) => (
                  <Dice3D key={`dice-${i}`} value={value} isRolling={isRolling} size={diceCount > 4 ? 50 : 60} />
                ))}
              </div>
            </div>
            
            {/* Roll Button */}
            <button
              onClick={rollDice}
              disabled={isRolling}
              className="w-full bg-yellow border-2 border-darkGrey text-darkGrey px-4 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice!'}
            </button>
            
            {/* Result Display */}
            {diceValues && !isRolling && rollHistory.length > 0 && (
              <div className="bg-white p-4 rounded-lg border-2 border-darkGrey/20">
                <p className="text-center">
                  <span className="text-darkGrey">Result: </span>
                  <span className="font-bold text-lg">{diceValues.join(' + ')} = </span>
                  <span className="font-bold text-2xl text-turquoise">
                    {diceValues.reduce((a, b) => a + b, 0)}
                  </span>
                </p>
              </div>
            )}
            
            {/* Pro Tips */}
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <strong className="text-darkGrey">🎯 Pro Tips:</strong>
              <ul className="mt-1 space-y-1 text-darkGrey/80">
                <li>• With 2 dice, 7 is the most likely sum (6 ways)</li>
                <li>• More dice = results cluster around the center</li>
                <li>• This demonstrates the Central Limit Theorem!</li>
              </ul>
            </div>
          </div>
          
          {/* Right Column: Statistics and History */}
          <div className="space-y-4">
            {/* Roll History */}
            <div className="bg-white p-4 rounded-lg border-2 border-darkGrey/20">
              <h4 className="font-bold text-darkGrey mb-3">📜 Roll History (Last 20)</h4>
              <div className="h-48 overflow-y-auto">
                {rollHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-darkGrey/60">
                    <p className="text-center">No rolls yet!</p>
                    <p className="text-sm mt-2">Click "Roll Dice" to start</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {rollHistory.slice().reverse().map((roll, i) => (
                      <div key={`roll-${rollHistory.length - i}`} className="flex justify-between items-center text-sm p-1 hover:bg-gray-50 rounded">
                        <span className="text-darkGrey">Roll #{rollHistory.length - i}:</span>
                        <span className="font-mono">
                          <span className="text-gray-600">{roll.values.join('+')}</span>
                          <span className="font-bold ml-2">= {roll.sum}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Distribution Chart */}
            {rollHistory.length > 0 && (
              <div className="bg-white p-4 rounded-lg border-2 border-darkGrey/20">
                <h4 className="font-bold text-darkGrey mb-3">📊 Distribution Analysis</h4>
                <div className="h-64">
                  <Bar data={chartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          title: (context) => `Sum: ${context[0].label}`,
                          label: (context) => `Rolled ${context.parsed.y} time${context.parsed.y !== 1 ? 's' : ''} (${((context.parsed.y / rollHistory.length) * 100).toFixed(1)}%)`
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        },
                        title: {
                          display: true,
                          text: 'Frequency'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Sum of Dice'
                        }
                      }
                    }
                  }} />
                </div>
                
                {/* Statistical Summary */}
                {rollHistory.length >= 10 && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-darkGrey">
                    <p className="text-center">
                      After {rollHistory.length} rolls, notice the bell curve forming!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// MAIN CALCULATOR COMPONENT (Composition Root)
// ========================================
/**
 * The main probability calculator that orchestrates all modules
 * Like a Swiss Army knife with different tools for different probability tasks
 */
const ProbabilityCalculator = () => {
  const [activeTab, setActiveTab] = useState('rules');

  // Tab configuration - easy to extend with new modules
  const tabs = [
    { id: 'rules', label: '📐 Probability Rules', component: <ProbabilityRulesModule MathEngine={MathEngine} /> },
    { id: 'combinatorics', label: '🔢 Combinatorics', component: <CombinatoricsModule MathEngine={MathEngine} /> },
    { id: 'expected', label: '💰 Expected Value', component: <ExpectedValueModule MathEngine={MathEngine} /> },
    { id: 'dice', label: '🎲 Dice Simulator', component: <DiceSimulatorModule /> }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-darkGrey mb-2">
            🎲 Comprehensive Probability Calculator
          </h2>
          <p className="text-darkGrey opacity-80">
            Your statistical Swiss Army knife - master probability with interactive tools and visualizations
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-darkGrey/20">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-turquoise text-turquoise'
                  : 'text-darkGrey hover:text-turquoise'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div>
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
        
        {/* Educational Footer */}
        <div className="mt-8 p-4 bg-platinum rounded-lg">
          <h3 className="font-bold text-darkGrey mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-darkGrey space-y-1">
            <li>• <strong>Probability Rules:</strong> Use for analyzing event relationships and conditional probabilities</li>
            <li>• <strong>Combinatorics:</strong> Perfect for counting possibilities in games, passwords, and selections</li>
            <li>• <strong>Expected Value:</strong> Essential for decision-making in uncertain situations</li>
            <li>• <strong>Dice Simulator:</strong> See the law of large numbers in action - patterns emerge from randomness!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityCalculator;