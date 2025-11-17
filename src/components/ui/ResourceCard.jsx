import React, { useState } from 'react';
import { Download, FileText, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import QuizContainer from '../quiz/QuizContainer';

const ResourceCard = ({ icon, title, description, resources }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [expandedResources, setExpandedResources] = useState({});

  const handleDownload = (pdfPath, fileName) => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = fileName;
    link.target = '_blank';
    link.click();
  };

  const handleQuizClick = (quizData, resourceName) => {
    setCurrentQuiz({
      questions: quizData,
      title: `${resourceName} - Practice Quiz`
    });
    setShowQuiz(true);
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
        {/* Header with icon and title */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="mt-1">{icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-darkGrey mb-2">{title}</h3>
            <p className="text-darkGrey opacity-80 text-sm">{description}</p>
          </div>
        </div>

        {/* Resources list */}
        <div className="space-y-2 mt-4">
          {resources && resources.map((resource, index) => {
            const isExpanded = expandedResources[index];
            const hasQuiz = resource.quiz && resource.quiz.length > 0;

            return (
              <div
                key={index}
                className="bg-platinum/50 rounded-md hover:bg-turquoise/10 transition-colors overflow-hidden"
              >
                {/* Main resource row */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <FileText size={18} className="text-turquoise" />
                    <span className="text-sm font-medium text-darkGrey">
                      {resource.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Download button */}
                    <button
                      onClick={() => handleDownload(resource.path, resource.fileName)}
                      className="flex items-center space-x-1 px-3 py-1 bg-turquoise text-white rounded-md hover:bg-turquoise/80 transition-colors text-sm"
                      aria-label={`Download ${resource.name}`}
                    >
                      <Download size={16} />
                      <span>PDF</span>
                    </button>

                    {/* Toggle button for quiz (if available) */}
                    {hasQuiz && (
                      <button
                        onClick={() => toggleResource(index)}
                        className="p-1 text-darkGrey hover:text-turquoise transition-colors"
                        aria-label={isExpanded ? "Hide quiz" : "Show quiz"}
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable quiz section */}
                {hasQuiz && isExpanded && (
                  <div className="px-3 pb-3">
                    <button
                      onClick={() => handleQuizClick(resource.quiz, resource.name)}
                      className="w-full flex items-center justify-center gap-2 p-2 bg-yellow/80 border border-darkGrey/30 text-darkGrey rounded-md font-semibold hover:bg-yellow hover:border-darkGrey transition-all text-sm"
                    >
                      <Brain size={16} />
                      Practice Quiz
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz modal */}
      {showQuiz && currentQuiz && (
        <QuizContainer
          questionBank={currentQuiz.questions}
          quizTitle={currentQuiz.title}
          onClose={() => {
            setShowQuiz(false);
            setCurrentQuiz(null);
          }}
        />
      )}
    </>
  );
};

export default ResourceCard;
