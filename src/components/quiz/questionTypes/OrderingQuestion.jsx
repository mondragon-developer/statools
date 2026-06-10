/**
 * OrderingQuestion Component
 *
 * Displays items that need to be arranged in correct order
 * Allows reordering via up/down buttons or drag-and-drop
 *
 * @param {Object} question - Question object
 * @param {Array} currentOrder - Current order of answer IDs
 * @param {Function} onAnswerChange - Callback when order changes
 * @param {boolean} showResult - Whether to show correct/incorrect feedback
 * @param {Array} correctAnswer - Correct order of answer IDs
 */

import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { announcePolite } from '../../../utils/announce';

const OrderingQuestion = ({
  question,
  currentOrder = [],
  onAnswerChange,
  showResult = false,
  correctAnswer = []
}) => {
  const [order, setOrder] = useState([]);

  // Initialize order with shuffled options on first render
  useEffect(() => {
    if (currentOrder.length > 0) {
      setOrder(currentOrder);
    } else {
      // Create initial shuffled order
      const optionIds = question.options.map((_, idx) => String.fromCharCode(65 + idx));
      const shuffled = [...optionIds].sort(() => Math.random() - 0.5);
      setOrder(shuffled);
      onAnswerChange(shuffled);
    }
  }, []);

  const moveItem = (index, direction) => {
    if (showResult) return;

    const newOrder = [...order];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newOrder.length) return;

    // Swap items
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];

    setOrder(newOrder);
    onAnswerChange(newOrder);

    const movedOptionText = getOptionText(order[index]);
    announcePolite('Moved ' + movedOptionText + ' ' + direction);
  };

  const getItemStyle = (optionId, index) => {
    const baseStyle = 'flex items-center justify-between p-4 rounded-lg border-2 transition-all ';

    if (!showResult) {
      return baseStyle + 'border-platinum bg-white';
    }

    // Check if this item is in the correct position
    const isCorrectPosition = correctAnswer[index] === optionId;

    if (isCorrectPosition) {
      return baseStyle + 'border-green-500 bg-green-50';
    }

    return baseStyle + 'border-red-500 bg-red-50';
  };

  const getPositionIcon = (optionId, index) => {
    if (!showResult) return null;

    const isCorrectPosition = correctAnswer[index] === optionId;

    return isCorrectPosition ? (
      <Check className="text-green-500" size={20} />
    ) : (
      <X className="text-red-500" size={20} />
    );
  };

  const getOptionText = (optionId) => {
    const optionIndex = optionId.charCodeAt(0) - 65; // Convert A->0, B->1, etc.
    return question.options[optionIndex];
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-darkGrey opacity-75 mb-3">
        Arrange the items in the correct order (from first to last):
      </p>

      <div className="space-y-2">
        {order.map((optionId, index) => (
          <div key={`${optionId}-${index}`} className={getItemStyle(optionId, index)}>
            <div className="flex items-center gap-3 flex-1">
              <span className="font-bold text-darkGrey text-lg w-6">
                {index + 1}.
              </span>
              <span className="text-darkGrey flex-1">
                {getOptionText(optionId)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {getPositionIcon(optionId, index)}

              {!showResult && (
                <div className="flex gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded transition-colors ${
                      index === 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-darkTeal hover:bg-darkTeal/10'
                    }`}
                    title="Move up"
                    aria-label={`Move ${getOptionText(optionId)} up`}
                  >
                    <ArrowUp size={20} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === order.length - 1}
                    className={`p-1 rounded transition-colors ${
                      index === order.length - 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-darkTeal hover:bg-darkTeal/10'
                    }`}
                    title="Move down"
                    aria-label={`Move ${getOptionText(optionId)} down`}
                  >
                    <ArrowDown size={20} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showResult && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-semibold text-darkGrey mb-2">Correct order:</p>
          <ol className="space-y-1">
            {correctAnswer.map((optionId, index) => (
              <li key={optionId} className="text-darkGrey text-sm">
                {index + 1}. {getOptionText(optionId)}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default OrderingQuestion;
