import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import QuizContainer from '../quiz/QuizContainer';

const ResourceCard = ({ icon, title, description, resources }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [expandedResources, setExpandedResources] = useState({});
  const quizTriggerRef = useRef(null);

  const handleDownload = (pdfPath, fileName) => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = fileName;
    link.target = '_blank';
    link.click();
  };

  const handleQuizClick = (quizData, resourceName, buttonEl) => {
    quizTriggerRef.current = buttonEl;
    setCurrentQuiz({
      questions: quizData,
      title: `${resourceName} - Practice Quiz`
    });
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setCurrentQuiz(null);
    quizTriggerRef.current?.focus();
  };

  const toggleResource = (index) => {
    setExpandedResources({
      ...expandedResources,
      [index]: !expandedResources[index]
    });
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
        <div className="flex items-start space-x-4 mb-4">
          <div className="mt-1" aria-hidden="true">{icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-darkGrey mb-2">{title}</h3>
            <p className="text-darkGrey opacity-80 text-sm">{description}</p>
          </div>
        </div>

        <ul className="space-y-2 mt-4" aria-label={`${title} resources`}>
          {resources && resources.map((resource, index) => {
            const isExpanded = expandedResources[index];
            const hasQuiz = resource.quiz && resource.quiz.length > 0;

            return (
              <li
                key={index}
                className="bg-platinum/50 rounded-md hover:bg-darkTeal/10 transition-colors overflow-hidden"
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <FileText size={18} className="text-darkTeal" aria-hidden="true" />
                    <span className="text-sm font-medium text-darkGrey">
                      {resource.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(resource.path, resource.fileName)}
                      className="flex items-center space-x-1 px-3 py-1 bg-darkTeal text-white rounded-md hover:bg-darkTeal/90 transition-colors text-sm"
                      aria-label={`Download ${resource.name} as PDF`}
                    >
                      <Download size={16} aria-hidden="true" />
                      <span>PDF</span>
                    </button>

                    {hasQuiz && (
                      <button
                        onClick={() => toggleResource(index)}
                        className="p-1 text-darkGrey hover:text-darkTeal transition-colors"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? 'Hide' : 'Show'} quiz for ${resource.name}`}
                      >
                        {isExpanded ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
                      </button>
                    )}
                  </div>
                </div>

                {hasQuiz && isExpanded && (
                  <div className="px-3 pb-3">
                    <button
                      onClick={(e) => handleQuizClick(resource.quiz, resource.name, e.currentTarget)}
                      className="w-full flex items-center justify-center gap-2 p-2 bg-accent/80 border border-darkGrey/30 text-darkGrey rounded-md font-semibold hover:bg-accent hover:border-darkGrey transition-all text-sm"
                    >
                      <Brain size={16} aria-hidden="true" />
                      Practice Quiz
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {showQuiz && currentQuiz && (
        <QuizContainer
          questionBank={currentQuiz.questions}
          quizTitle={currentQuiz.title}
          onClose={handleCloseQuiz}
        />
      )}
    </>
  );
};

export default ResourceCard;
