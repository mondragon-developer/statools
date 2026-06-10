/**
 * QuizResults — displays quiz results with grade, breakdown, and explanations.
 */

import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getGradeMessage, formatAnswerText } from '../../utils/quizUtils';
import MultipleChoice from './questionTypes/MultipleChoice';
import MultipleAnswer from './questionTypes/MultipleAnswer';
import OrderingQuestion from './questionTypes/OrderingQuestion';
import MatchingQuestion from './questionTypes/MatchingQuestion';
import useFocusTrap from '../../hooks/useFocusTrap';

const QuizResults = ({ results, onClose, onRetake }) => {
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const focusTrapRef = useFocusTrap(true);

  const { detailedResults, grade, totalQuestions, correctCount } = results;

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  const renderQuestionWithResult = (result, index) => {
    const { question, userAnswer, isCorrect } = result;
    const isExpanded = expandedQuestions[question.id];

    const resultProps = {
      question,
      showResult: true,
      correctAnswer: question.correctAnswer
    };

    let questionComponent;
    switch (question.type) {
      case 'multipleChoice':
        questionComponent = <MultipleChoice {...resultProps} selectedAnswer={userAnswer} onAnswerChange={() => {}} />;
        break;
      case 'multipleAnswer':
        questionComponent = <MultipleAnswer {...resultProps} selectedAnswers={userAnswer || []} onAnswerChange={() => {}} />;
        break;
      case 'ordering':
        questionComponent = <OrderingQuestion {...resultProps} currentOrder={userAnswer || []} onAnswerChange={() => {}} />;
        break;
      case 'matching':
        questionComponent = <MatchingQuestion {...resultProps} userMatches={userAnswer || {}} onAnswerChange={() => {}} />;
        break;
      default:
        questionComponent = null;
    }

    return (
      <div
        key={question.id}
        className={`border-2 rounded-lg overflow-hidden ${isCorrect ? 'border-green-500' : 'border-red-500'}`}
      >
        <button
          onClick={() => toggleQuestion(question.id)}
          aria-expanded={isExpanded}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <>
                <CheckCircle className="text-green-500 flex-shrink-0" size={24} aria-hidden="true" />
                <span className="sr-only">Correct</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500 flex-shrink-0" size={24} aria-hidden="true" />
                <span className="sr-only">Incorrect</span>
              </>
            )}
            <div className="text-left">
              <p className="font-semibold text-darkGrey">
                Question {index + 1}
              </p>
              <p className="text-sm text-darkGrey opacity-75">
                {question.type.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="text-darkGrey" size={20} aria-hidden="true" />
          ) : (
            <ChevronDown className="text-darkGrey" size={20} aria-hidden="true" />
          )}
        </button>

        {isExpanded && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h4 className="font-semibold text-darkGrey mb-4">{question.question}</h4>
            {questionComponent}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-darkGrey mb-2">Explanation:</p>
              <p className="text-darkGrey text-sm">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getGradeColor = () => {
    if (grade.percentage >= 90) return 'text-green-600';
    if (grade.percentage >= 80) return 'text-green-500';
    if (grade.percentage >= 70) return 'text-yellow-600';
    if (grade.percentage >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getGradeBgColor = () => {
    if (grade.percentage >= 90) return 'bg-green-100 border-green-300';
    if (grade.percentage >= 80) return 'bg-green-50 border-green-200';
    if (grade.percentage >= 70) return 'bg-yellow-50 border-yellow-200';
    if (grade.percentage >= 60) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Quiz Results"
      onKeyDown={handleKeyDown}
      ref={focusTrapRef}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="border-b border-platinum p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-darkGrey">Quiz Results</h2>
            <button
              onClick={onClose}
              className="text-darkGrey hover:text-red-500 transition-colors"
              aria-label="Close results"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Score summary */}
        <div className="p-6 border-b border-platinum">
          <div className={`p-6 rounded-lg border-2 ${getGradeBgColor()}`} role="status" aria-label={`Grade: ${grade.letterGrade}, ${grade.percentage}%, ${correctCount} of ${totalQuestions} correct`}>
            <div className="text-center mb-4">
              <div className={`text-6xl font-bold mb-2 ${getGradeColor()}`}>
                {grade.letterGrade}
              </div>
              <div className="text-3xl font-bold text-darkGrey mb-2">
                {grade.percentage}%
              </div>
              <div className="text-xl text-darkGrey">
                {grade.score} Questions Correct
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-darkGrey font-medium">
                {getGradeMessage(grade.percentage)}
              </p>
            </div>

            <div className="mt-4 flex justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-darkGrey opacity-75">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {totalQuestions - correctCount}
                </div>
                <div className="text-sm text-darkGrey opacity-75">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-darkGrey">{totalQuestions}</div>
                <div className="text-sm text-darkGrey opacity-75">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question-by-question breakdown */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-darkGrey mb-4">
            Review Your Answers
          </h3>
          <p className="text-sm text-darkGrey opacity-75 mb-4">
            Click on each question to see the correct answer and explanation
          </p>

          <div className="space-y-3">
            {detailedResults.map((result, index) =>
              renderQuestionWithResult(result, index)
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-platinum p-6">
          <div className="flex justify-center gap-4">
            <button
              onClick={onRetake}
              className="flex items-center gap-2 px-6 py-3 bg-darkTeal text-white rounded-lg font-bold hover:bg-darkTeal/90 transition-all"
            >
              <RotateCcw size={20} aria-hidden="true" />
              Retake Quiz
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-platinum text-darkGrey rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
