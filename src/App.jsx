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
import ChatWidget from './components/chat/ChatWidget';
import VoiceCommands from './components/ui/VoiceCommands';
import AccessibilityBanner from './components/ui/AccessibilityBanner';

function App() {
  return (
    <>
      <AccessibilityBanner />
      <Router basename="/statools">
        <Routes>
          <Route path="/" element={<HomePage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
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
