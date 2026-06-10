/**
 * MultipleChoice Component
 *
 * Displays a multiple choice question with single answer selection
 * Follows Single Responsibility Principle - only handles MC question display
 *
 * @param {Object} question - Question object
 * @param {string|null} selectedAnswer - Currently selected answer ID
 * @param {Function} onAnswerChange - Callback when answer changes
 * @param {boolean} showResult - Whether to show correct/incorrect feedback
 * @param {string} correctAnswer - The correct answer ID
 */

import React from 'react';
import { Check, X } from 'lucide-react';
import { announcePolite } from '../../../utils/announce';

const MultipleChoice = ({
  question,
  selectedAnswer,
  onAnswerChange,
  showResult = false,
  correctAnswer = null
}) => {
  const getOptionStyle = (optionId) => {
    const baseStyle = 'w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ';

    if (!showResult) {
      // Normal mode - just show selection
      if (selectedAnswer === optionId) {
        return baseStyle + 'border-darkTeal bg-darkTeal/10 font-semibold';
      }
      return baseStyle + 'border-platinum hover:border-darkTeal/50 hover:bg-platinum';
    }

    // Result mode - show correct/incorrect
    if (optionId === correctAnswer) {
      return baseStyle + 'border-green-500 bg-green-50 font-semibold';
    }

    if (selectedAnswer === optionId && optionId !== correctAnswer) {
      return baseStyle + 'border-red-500 bg-red-50';
    }

    return baseStyle + 'border-platinum bg-gray-50 opacity-60';
  };

  const getOptionIcon = (optionId) => {
    if (!showResult) return null;

    if (optionId === correctAnswer) {
      return <Check className="text-green-500" size={20} />;
    }

    if (selectedAnswer === optionId && optionId !== correctAnswer) {
      return <X className="text-red-500" size={20} />;
    }

    return null;
  };

  return (
    <div className="space-y-3">
      {question.options.map((option, index) => {
        const optionId = String.fromCharCode(65 + index); // A, B, C, D...

        return (
          <button
            key={optionId}
            onClick={() => {
              if (!showResult) {
                onAnswerChange(optionId);
                announcePolite('Selected: ' + option);
              }
            }}
            disabled={showResult}
            className={getOptionStyle(optionId)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-darkGrey">{optionId}.</span>
                <span className="text-darkGrey">{option}</span>
              </div>
              {getOptionIcon(optionId)}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MultipleChoice;
