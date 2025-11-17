/**
 * MultipleAnswer Component
 *
 * Displays a question where multiple answers can be selected
 * Uses checkboxes instead of radio buttons
 *
 * @param {Object} question - Question object
 * @param {Array} selectedAnswers - Array of selected answer IDs
 * @param {Function} onAnswerChange - Callback when answers change
 * @param {boolean} showResult - Whether to show correct/incorrect feedback
 * @param {Array} correctAnswer - Array of correct answer IDs
 */

import React from 'react';
import { Check, X, CheckSquare, Square } from 'lucide-react';

const MultipleAnswer = ({
  question,
  selectedAnswers = [],
  onAnswerChange,
  showResult = false,
  correctAnswer = []
}) => {
  const handleToggle = (optionId) => {
    if (showResult) return;

    const newAnswers = selectedAnswers.includes(optionId)
      ? selectedAnswers.filter(id => id !== optionId)
      : [...selectedAnswers, optionId];

    onAnswerChange(newAnswers);
  };

  const isSelected = (optionId) => selectedAnswers.includes(optionId);
  const isCorrect = (optionId) => correctAnswer.includes(optionId);

  const getOptionStyle = (optionId) => {
    const baseStyle = 'w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ';

    if (!showResult) {
      if (isSelected(optionId)) {
        return baseStyle + 'border-turquoise bg-turquoise/10 font-semibold';
      }
      return baseStyle + 'border-platinum hover:border-turquoise/50 hover:bg-platinum';
    }

    // Result mode
    const wasSelected = isSelected(optionId);
    const shouldBeSelected = isCorrect(optionId);

    if (wasSelected && shouldBeSelected) {
      // Correctly selected
      return baseStyle + 'border-green-500 bg-green-50 font-semibold';
    }

    if (wasSelected && !shouldBeSelected) {
      // Incorrectly selected
      return baseStyle + 'border-red-500 bg-red-50';
    }

    if (!wasSelected && shouldBeSelected) {
      // Should have been selected but wasn't
      return baseStyle + 'border-orange-400 bg-orange-50';
    }

    // Not selected and shouldn't be
    return baseStyle + 'border-platinum bg-gray-50 opacity-60';
  };

  const getOptionIcon = (optionId) => {
    const wasSelected = isSelected(optionId);
    const shouldBeSelected = isCorrect(optionId);

    if (!showResult) {
      return wasSelected ? (
        <CheckSquare className="text-turquoise" size={20} />
      ) : (
        <Square className="text-darkGrey opacity-30" size={20} />
      );
    }

    // Result mode icons
    if (wasSelected && shouldBeSelected) {
      return <Check className="text-green-500" size={20} />;
    }

    if (wasSelected && !shouldBeSelected) {
      return <X className="text-red-500" size={20} />;
    }

    if (!wasSelected && shouldBeSelected) {
      return <Check className="text-orange-500" size={20} />;
    }

    return <Square className="text-gray-400 opacity-30" size={20} />;
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-darkGrey opacity-75 mb-3">
        (Select all that apply)
      </p>
      {question.options.map((option, index) => {
        const optionId = String.fromCharCode(65 + index); // A, B, C, D...

        return (
          <button
            key={optionId}
            onClick={() => handleToggle(optionId)}
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
      {showResult && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="text-darkGrey">
            <span className="font-semibold">Correct answers: </span>
            {correctAnswer.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default MultipleAnswer;
