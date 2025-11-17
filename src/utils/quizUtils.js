/**
 * Quiz Utility Functions
 *
 * Helper functions for quiz functionality including:
 * - Random question selection
 * - Answer validation
 * - Grade calculation
 * - Score formatting
 */

/**
 * Randomly selects n questions from a question bank
 * Ensures no duplicates and maintains variety of question types
 *
 * @param {Array} questionBank - Array of all available questions
 * @param {number} count - Number of questions to select (default: 4)
 * @returns {Array} Selected questions
 */
export const selectRandomQuestions = (questionBank, count = 4) => {
  if (!questionBank || questionBank.length === 0) {
    return [];
  }

  // Ensure we don't try to select more questions than available
  const actualCount = Math.min(count, questionBank.length);

  // Create a copy to avoid mutating original
  const shuffled = [...questionBank].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, actualCount);
};

/**
 * Validates a user's answer against the correct answer
 *
 * @param {string|Array} userAnswer - User's selected answer(s)
 * @param {string|Array|Object} correctAnswer - Correct answer(s)
 * @param {string} questionType - Type of question
 * @returns {boolean} True if answer is correct
 */
export const validateAnswer = (userAnswer, correctAnswer, questionType) => {
  if (!userAnswer) return false;

  switch (questionType) {
    case 'multipleChoice':
      return userAnswer === correctAnswer;

    case 'multipleAnswer':
      if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) {
        return false;
      }
      // Check if arrays have same length and all elements match
      if (userAnswer.length !== correctAnswer.length) return false;
      const sortedUser = [...userAnswer].sort();
      const sortedCorrect = [...correctAnswer].sort();
      return sortedUser.every((val, idx) => val === sortedCorrect[idx]);

    case 'ordering':
      if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) {
        return false;
      }
      // Check if order matches exactly
      return userAnswer.length === correctAnswer.length &&
        userAnswer.every((val, idx) => val === correctAnswer[idx]);

    case 'matching':
      if (typeof userAnswer !== 'object' || typeof correctAnswer !== 'object') {
        return false;
      }
      // Check if all matches are correct
      const userKeys = Object.keys(userAnswer);
      const correctKeys = Object.keys(correctAnswer);
      if (userKeys.length !== correctKeys.length) return false;
      return userKeys.every(key => userAnswer[key] === correctAnswer[key]);

    default:
      return false;
  }
};

/**
 * Calculates the grade based on correct answers
 *
 * @param {number} correctCount - Number of correct answers
 * @param {number} totalQuestions - Total number of questions
 * @returns {Object} Grade object with score, percentage, and letter grade
 */
export const calculateGrade = (correctCount, totalQuestions) => {
  if (totalQuestions === 0) {
    return { score: 0, percentage: 0, letterGrade: 'F', passed: false };
  }

  const percentage = Math.round((correctCount / totalQuestions) * 100);
  let letterGrade;
  let passed;

  if (percentage >= 90) {
    letterGrade = 'A';
    passed = true;
  } else if (percentage >= 80) {
    letterGrade = 'B';
    passed = true;
  } else if (percentage >= 70) {
    letterGrade = 'C';
    passed = true;
  } else if (percentage >= 60) {
    letterGrade = 'D';
    passed = false;
  } else {
    letterGrade = 'F';
    passed = false;
  }

  return {
    score: `${correctCount}/${totalQuestions}`,
    percentage,
    letterGrade,
    passed
  };
};

/**
 * Formats answer options for display
 *
 * @param {Array} options - Array of options
 * @param {string} questionType - Type of question
 * @returns {Array} Formatted options with labels
 */
export const formatOptions = (options, questionType) => {
  if (questionType === 'matching') {
    return options; // Matching questions have their own structure
  }

  return options.map((option, index) => ({
    id: String.fromCharCode(65 + index), // A, B, C, D, etc.
    text: option
  }));
};

/**
 * Converts answer ID(s) to readable text
 *
 * @param {string|Array|Object} answer - Answer ID(s)
 * @param {Array} options - Question options
 * @param {string} questionType - Type of question
 * @returns {string} Formatted answer text
 */
export const formatAnswerText = (answer, options, questionType) => {
  if (!answer) return 'No answer provided';

  const formattedOptions = formatOptions(options, questionType);

  switch (questionType) {
    case 'multipleChoice':
      const option = formattedOptions.find(opt => opt.id === answer);
      return option ? `${answer}: ${option.text}` : answer;

    case 'multipleAnswer':
      if (!Array.isArray(answer)) return 'Invalid answer';
      return answer
        .map(id => {
          const opt = formattedOptions.find(o => o.id === id);
          return opt ? `${id}: ${opt.text}` : id;
        })
        .join(', ');

    case 'ordering':
      if (!Array.isArray(answer)) return 'Invalid answer';
      return answer
        .map((id, idx) => {
          const opt = formattedOptions.find(o => o.id === id);
          return opt ? `${idx + 1}. ${opt.text}` : id;
        })
        .join(' → ');

    case 'matching':
      if (typeof answer !== 'object') return 'Invalid answer';
      return Object.entries(answer)
        .map(([key, value]) => `${key} → ${value}`)
        .join(', ');

    default:
      return String(answer);
  }
};

/**
 * Shuffles an array (Fisher-Yates algorithm)
 *
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Gets a congratulatory message based on grade
 *
 * @param {number} percentage - Score percentage
 * @returns {string} Congratulatory message
 */
export const getGradeMessage = (percentage) => {
  if (percentage === 100) {
    return 'Perfect score! Outstanding work!';
  } else if (percentage >= 90) {
    return 'Excellent work! You have mastered this topic!';
  } else if (percentage >= 80) {
    return 'Great job! You have a strong understanding!';
  } else if (percentage >= 70) {
    return 'Good effort! Keep practicing to improve!';
  } else if (percentage >= 60) {
    return 'You passed, but review the explanations to strengthen your knowledge.';
  } else {
    return 'Keep studying! Review the explanations and try again.';
  }
};
