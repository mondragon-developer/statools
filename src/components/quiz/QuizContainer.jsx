/**
 * QuizContainer Component
 *
 * Main orchestrator for the quiz system
 * Handles:
 * - Question selection and randomization
 * - Navigation between questions
 * - Answer tracking
 * - Grading and results display
 *
 * Follows Single Responsibility Principle - manages quiz flow
 */

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import MultipleChoice from './questionTypes/MultipleChoice';
import MultipleAnswer from './questionTypes/MultipleAnswer';
import OrderingQuestion from './questionTypes/OrderingQuestion';
import MatchingQuestion from './questionTypes/MatchingQuestion';
import QuizResults from './QuizResults';
import { selectRandomQuestions, validateAnswer, calculateGrade } from '../../utils/quizUtils';

const QuizContainer = ({ questionBank, quizTitle, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // Initialize quiz with random questions
  useEffect(() => {
    const selectedQuestions = selectRandomQuestions(questionBank, 4);
    setQuestions(selectedQuestions);
  }, [questionBank]);

  // Save answer for current question
  const handleAnswerChange = (answer) => {
    const questionId = questions[currentQuestionIndex].id;
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer
    });
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz and calculate results
  const handleSubmit = () => {
    let correctCount = 0;
    const detailedResults = questions.map((question) => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = validateAnswer(userAnswer, question.correctAnswer, question.type);

      if (isCorrect) {
        correctCount++;
      }

      return {
        question,
        userAnswer,
        isCorrect
      };
    });

    const grade = calculateGrade(correctCount, questions.length);

    setResults({
      detailedResults,
      grade,
      totalQuestions: questions.length,
      correctCount
    });

    setShowResults(true);
  };

  // Render the appropriate question component based on type
  const renderQuestion = () => {
    if (questions.length === 0) return null;

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = userAnswers[currentQuestion.id];

    const commonProps = {
      question: currentQuestion,
      onAnswerChange: handleAnswerChange
    };

    switch (currentQuestion.type) {
      case 'multipleChoice':
        return (
          <MultipleChoice
            {...commonProps}
            selectedAnswer={currentAnswer}
          />
        );

      case 'multipleAnswer':
        return (
          <MultipleAnswer
            {...commonProps}
            selectedAnswers={currentAnswer || []}
          />
        );

      case 'ordering':
        return (
          <OrderingQuestion
            {...commonProps}
            currentOrder={currentAnswer || []}
          />
        );

      case 'matching':
        return (
          <MatchingQuestion
            {...commonProps}
            userMatches={currentAnswer || {}}
          />
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = userAnswers[currentQuestion?.id];

    if (!answer) return false;

    switch (currentQuestion.type) {
      case 'multipleChoice':
        return answer !== null && answer !== '';
      case 'multipleAnswer':
        return Array.isArray(answer) && answer.length > 0;
      case 'ordering':
        return Array.isArray(answer) && answer.length === currentQuestion.options.length;
      case 'matching':
        return Object.keys(answer).length === currentQuestion.options.length;
      default:
        return false;
    }
  };

  // Check if all questions are answered
  const areAllQuestionsAnswered = () => {
    return questions.every(q => {
      const answer = userAnswers[q.id];
      if (!answer) return false;

      switch (q.type) {
        case 'multipleChoice':
          return answer !== null && answer !== '';
        case 'multipleAnswer':
          return Array.isArray(answer) && answer.length > 0;
        case 'ordering':
          return Array.isArray(answer) && answer.length === q.options.length;
        case 'matching':
          return Object.keys(answer).length === q.options.length;
        default:
          return false;
      }
    });
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <p className="text-darkGrey">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Show results view
  if (showResults && results) {
    return (
      <QuizResults
        results={results}
        onClose={onClose}
        onRetake={() => {
          // Reset quiz
          const selectedQuestions = selectRandomQuestions(questionBank, 4);
          setQuestions(selectedQuestions);
          setUserAnswers({});
          setCurrentQuestionIndex(0);
          setShowResults(false);
          setResults(null);
        }}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="border-b border-platinum p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-darkGrey">{quizTitle}</h2>
            <button
              onClick={onClose}
              className="text-darkGrey hover:text-red-500 transition-colors"
              title="Close quiz"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-darkGrey">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-platinum h-2 rounded-full overflow-hidden">
              <div
                className="bg-turquoise h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start gap-2 mb-4">
              <span className="bg-turquoise text-white px-3 py-1 rounded-full text-sm font-semibold">
                {currentQuestion.type.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-darkGrey mb-6">
              {currentQuestion.question}
            </h3>
          </div>

          {renderQuestion()}
        </div>

        {/* Navigation footer */}
        <div className="border-t border-platinum p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-turquoise hover:bg-turquoise/10'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!areAllQuestionsAnswered()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                  areAllQuestionsAnswered()
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle size={20} />
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                disabled={!isCurrentQuestionAnswered()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  isCurrentQuestionAnswered()
                    ? 'bg-turquoise text-white hover:bg-turquoise/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Answer status indicator */}
          <div className="mt-4 flex gap-2 justify-center">
            {questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
              const isCurrent = idx === currentQuestionIndex;

              return (
                <div
                  key={q.id}
                  className={`w-3 h-3 rounded-full transition-all ${
                    isCurrent
                      ? 'ring-2 ring-turquoise ring-offset-2'
                      : ''
                  } ${
                    isAnswered ? 'bg-turquoise' : 'bg-platinum'
                  }`}
                  title={`Question ${idx + 1} ${isAnswered ? '(answered)' : '(not answered)'}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizContainer;
