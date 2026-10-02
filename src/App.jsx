import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LocalCalculatorsPage from './pages/LocalCalculatorsPage';
import CalculatorLayout from './components/layout/CalculatorLayout';
import AccessibilityPage from './pages/AccessibilityPage';
import JourneyLayout from './components/layout/JourneyLayout';
import ChatWidget from './components/chat/ChatWidget';
import VoiceCommands from './components/ui/VoiceCommands';
import AccessibilityBanner from './components/ui/AccessibilityBanner';

const StatisticsCalculator = lazy(() => import('./components/calculators/StatisticsCalculator'));
const BinomialCalculator = lazy(() => import('./components/calculators/BinomialCalculator'));
const PoissonCalculator = lazy(() => import('./components/calculators/PoissonCalculator'));
const HypothesisTestCalculator = lazy(() => import('./components/calculators/HypothesisTestCalculator'));
const TwoSampleCalculator = lazy(() => import('./components/calculators/TwoSampleCalculator'));
const ProbabilityCalculator = lazy(() => import('./components/calculators/ProbabilityCalculator'));
const NormalDistributionCalculator = lazy(() => import('./components/calculators/NormalDistributionCalculator'));
const CorrelationRegressionCalculator = lazy(() => import('./components/calculators/CorrelationRegressionCalculator'));
const FrequencyDistributionCalculator = lazy(() => import('./components/calculators/FrequencyDistributionCalculator'));

const LearnHubPage = lazy(() => import('./pages/learn/LearnHubPage'));
const StagePage = lazy(() => import('./pages/learn/StagePage'));
const LessonPage = lazy(() => import('./pages/learn/LessonPage'));
const CapstonePage = lazy(() => import('./pages/learn/CapstonePage'));
const CertificatePage = lazy(() => import('./pages/learn/CertificatePage'));
const TeacherReportPage = lazy(() => import('./pages/learn/TeacherReportPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

const pageLoading = <p className="text-darkGrey" role="status">Loading...</p>;

function App() {
  return (
    <>
      <AccessibilityBanner />
      <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <Suspense fallback={pageLoading}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/privacy" element={<Suspense fallback={pageLoading}><PrivacyPage /></Suspense>} />
          <Route path="/terms" element={<Suspense fallback={pageLoading}><TermsPage /></Suspense>} />
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
        </Suspense>
        {/* Inside the router so spoken navigation stays client-side and the mic keeps listening. */}
        <VoiceCommands />
        <ChatWidget />
      </Router>
    </>
  );
}

export default App;
