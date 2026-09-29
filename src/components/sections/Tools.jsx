import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import SnakeGame from '../games/SnakeGame';
import ProgressStrip from '../journey/ProgressStrip';
import TodayMission from '../journey/TodayMission';
import StageMap from '../journey/StageMap';
import CalculatorCoach from '../journey/CalculatorCoach';
import ResourceLibrary from '../journey/ResourceLibrary';
import NetlifyLessonsCard from '../journey/NetlifyLessonsCard';
import { STAGES, lessonPath } from '../../data/journey';

const Tools = () => {
  const firstLesson = lessonPath(STAGES[0], STAGES[0].lessons[0]);

  return (
    <section className="bg-platinum py-16" id="resources" tabIndex={-1} aria-labelledby="resources-heading">
      <div className="container mx-auto px-4 space-y-10">
        <div className="text-center max-w-3xl mx-auto">
          <p className="flex items-center justify-center gap-2 text-darkTeal font-bold uppercase tracking-wide text-sm mb-2">
            <Sparkles size={16} aria-hidden="true" /> The Data Detective & AI Apprentice
          </p>
          <h2 id="resources-heading" className="text-4xl font-bold text-darkGrey mb-4">
            Learn Statistics - and See the Ideas Behind AI
          </h2>
          <p className="text-lg text-darkGrey/80 mb-6">
            Start with short, friendly missions. No advanced math required. Each lesson explains one idea,
            lets you practice it, and then puts a real calculator in your hands.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to={firstLesson}
              className="bg-darkTeal text-white font-bold px-6 py-3 rounded-lg hover:bg-darkTeal/90 transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
            >
              Begin Stage 1
            </Link>
            <a
              href="#resource-library"
              className="bg-white border-2 border-darkGrey text-darkGrey font-bold px-6 py-3 rounded-lg hover:bg-darkGrey hover:text-white transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
            >
              Browse all resources
            </a>
          </div>
        </div>

        <ProgressStrip />
        <TodayMission />

        <section aria-labelledby="quest-map-heading">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
            <h3 id="quest-map-heading" className="text-2xl font-bold text-darkGrey">Your Statistics Quest</h3>
            <Link to="/learn" className="text-darkTeal font-semibold underline hover:no-underline">
              See the full journey map, badges, and glossary
            </Link>
          </div>
          <StageMap compact headingLevel="h4" />
        </section>

        <CalculatorCoach />

        <NetlifyLessonsCard />

        <section id="resource-library" tabIndex={-1} aria-labelledby="library-heading" className="focus:outline-none">
          <div className="max-w-3xl mx-auto mb-6">
            <h3 id="library-heading" className="text-2xl font-bold text-darkGrey text-center mb-2">Resource Library</h3>
            <p className="text-center text-darkGrey/80">
              Free study guides and practice quizzes for learning on your own. Each guide is labeled with the journey stage it supports.
            </p>
          </div>
          <ResourceLibrary />
        </section>

        <section aria-labelledby="play-heading">
          <div className="max-w-3xl mx-auto mb-4">
            <h3 id="play-heading" className="text-2xl font-bold text-darkGrey text-center mb-1">Brain Break</h3>
            <p className="text-center text-darkGrey/80">Optional: a quick round of Math Snake. It is not needed for your progress.</p>
          </div>
          <div className="flex justify-center">
            <SnakeGame />
          </div>
        </section>
      </div>
    </section>
  );
};

export default Tools;
