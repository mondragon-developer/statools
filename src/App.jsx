import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LocalCalculatorsPage from './pages/LocalCalculatorsPage';
import CalculatorLayout from './components/layout/CalculatorLayout';
import StatisticsCalculator from './components/calculators/StatisticsCalculator';
import BinomialCalculator from './components/calculators/BinomialCalculator';
import PoissonCalculator from './components/calculators/PoissonCalculator';
import HypothesisTestCalculator from './components/calculators/HypothesisTestCalculator';
import TwoSampleCalculator from './components/calculators/TwoSampleCalculator';
import ProbabilityCalculator from './components/calculators/ProbabilityCalculator';
import NormalDistributionCalculator from './components/calculators/NormalDistributionCalculator';
import CorrelationRegressionCalculator from './components/calculators/CorrelationRegressionCalculator';
import FrequencyDistributionCalculator from './components/calculators/FrequencyDistributionCalculator';
import AccessibilityPage from './pages/AccessibilityPage';
import JourneyLayout from './components/layout/JourneyLayout';
import ChatWidget from './components/chat/ChatWidget';
import VoiceCommands from './components/ui/VoiceCommands';
import AccessibilityBanner from './components/ui/AccessibilityBanner';

const LearnHubPage = lazy(() => import('./pages/learn/LearnHubPage'));
const StagePage = lazy(() => import('./pages/learn/StagePage'));
const LessonPage = lazy(() => import('./pages/learn/LessonPage'));
const CapstonePage = lazy(() => import('./pages/learn/CapstonePage'));
const CertificatePage = lazy(() => import('./pages/learn/CertificatePage'));
const TeacherReportPage = lazy(() => import('./pages/learn/TeacherReportPage'));

const pageLoading = <p className="text-darkGrey" role="status">Loading...</p>;

function App() {
  return (
    <>
      <AccessibilityBanner />
      <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/learn" element={<JourneyLayout />}>
            <Route index element={<Suspense fallback={pageLoading}><LearnHubPage /></Suspense>} />
            <Route path="stage/:stageId" element={<Suspense fallback={pageLoading}><StagePage /></Suspense>} />
            <Route path="stage/:stageId/lesson/:lessonId" element={<Suspense fallback={pageLoading}><LessonPage /></Suspense>} />
            <Route path="capstone" element={<Suspense fallback={pageLoading}><CapstonePage /></Suspense>} />
            <Route path="certificate" element={<Suspense fallback={pageLoading}><CertificatePage /></Suspense>} />
            <Route path="report" element={<Suspense fallback={pageLoading}><TeacherReportPage /></Suspense>} />
          </Route>
          <Route path="/calculators" element={<CalculatorLayout />}>
            <Route index element={<LocalCalculatorsPage />} />
            <Route path="statistics" element={<StatisticsCalculator />} />
            <Route path="probability" element={<ProbabilityCalculator />} />
            <Route path="normal" element={<NormalDistributionCalculator />} />
            <Route path="binomial" element={<BinomialCalculator />} />
            <Route path="poisson" element={<PoissonCalculator />} />
            <Route path="hypothesis-test" element={<HypothesisTestCalculator />} />
            <Route path="two-sample" element={<TwoSampleCalculator />} />
            <Route path="correlation-regression" element={<CorrelationRegressionCalculator />} />
            <Route path="frequency-distribution" element={<FrequencyDistributionCalculator />} />
          </Route>
        </Routes>
      </Router>
      <ChatWidget />
      <VoiceCommands />
    </>
  );
}

export default App;
