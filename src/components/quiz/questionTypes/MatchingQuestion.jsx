/**
 * MatchingQuestion Component
 *
 * Displays items on the left that need to be matched with items on the right
 * Uses dropdown selection for matching
 *
 * @param {Object} question - Question object with options and choices
 * @param {Object} userMatches - Object mapping left items to selected right items
 * @param {Function} onAnswerChange - Callback when matches change
 * @param {boolean} showResult - Whether to show correct/incorrect feedback
 * @param {Object} correctAnswer - Object with correct matches
 */

import React, { useState, useEffect } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

const MatchingQuestion = ({
  question,
  userMatches = {},
  onAnswerChange,
  showResult = false,
  correctAnswer = {}
}) => {
  const [matches, setMatches] = useState({});
  const [shuffledChoices, setShuffledChoices] = useState([]);

  // Initialize with shuffled choices
  useEffect(() => {
    if (Object.keys(userMatches).length > 0) {
      setMatches(userMatches);
    }

    // Shuffle the right-side choices
    const shuffled = [...question.choices].sort(() => Math.random() - 0.5);
    setShuffledChoices(shuffled);
  }, []);

  const handleMatch = (leftId, rightValue) => {
    const newMatches = {
      ...matches,
      [leftId]: rightValue
    };
    setMatches(newMatches);
    onAnswerChange(newMatches);
  };

  const isCorrectMatch = (leftId) => {
    if (!showResult) return null;
    return matches[leftId] === correctAnswer[leftId];
  };

  const getMatchStyle = (leftId) => {
    const baseStyle = 'flex items-center gap-3 p-4 rounded-lg border-2 transition-all ';

    if (!showResult) {
      return baseStyle + 'border-platinum bg-white';
    }

    const correct = isCorrectMatch(leftId);

    if (correct) {
      return baseStyle + 'border-green-500 bg-green-50';
    }

    return baseStyle + 'border-red-500 bg-red-50';
  };

  const getSelectStyle = (leftId) => {
    const baseStyle = 'flex-1 p-2 rounded border-2 transition-all ';

    if (!showResult) {
      return baseStyle + 'border-turquoise/30 focus:border-turquoise focus:outline-none';
    }

    const correct = isCorrectMatch(leftId);

    if (correct) {
      return baseStyle + 'border-green-500 bg-green-50';
    }

    return baseStyle + 'border-red-500 bg-red-50';
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-darkGrey opacity-75 mb-3">
        Match each item on the left with the correct item on the right:
      </p>

      <div className="space-y-3">
        {question.options.map((option) => (
          <div key={option.id} className={getMatchStyle(option.id)}>
            <div className="flex items-center gap-3 flex-1">
              {/* Left side - the term */}
              <div className="w-1/3">
                <span className="font-semibold text-darkGrey">
                  {option.id}. {option.left}
                </span>
              </div>

              <ArrowRight className="text-turquoise opacity-50" size={20} />

              {/* Right side - dropdown selector */}
              <div className="w-2/3">
                <select
                  value={matches[option.id] || ''}
                  onChange={(e) => handleMatch(option.id, e.target.value)}
                  disabled={showResult}
                  className={getSelectStyle(option.id)}
                >
                  <option value="">-- Select --</option>
                  {shuffledChoices.map((choice, idx) => (
                    <option key={idx} value={choice}>
                      {choice}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result icon */}
            {showResult && (
              <div className="ml-2">
                {isCorrectMatch(option.id) ? (
                  <Check className="text-green-500" size={20} />
                ) : (
                  <X className="text-red-500" size={20} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show correct answers in result mode */}
      {showResult && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-semibold text-darkGrey mb-2">Correct matches:</p>
          <div className="space-y-1">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center gap-2 text-sm text-darkGrey">
                <span className="font-medium">{option.left}</span>
                <ArrowRight size={16} className="text-turquoise" />
                <span>{correctAnswer[option.id]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingQuestion;
