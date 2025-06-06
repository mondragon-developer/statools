import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LocalCalculatorsPage from './pages/LocalCalculatorsPage';
import CalculatorLayout from './components/layout/CalculatorLayout';
import StatisticsCalculator from './components/calculators/StatisticsCalculator';
import BinomialCalculator from './components/calculators/BinomialCalculator';
import PoissonCalculator from './components/calculators/PoissonCalculator';
import HypothesisTestCalculator from './components/calculators/HypothesisTestCalculator';
import ProbabilityCalculator from './components/calculators/ProbabilityCalculator';

function App() {
  
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/statools" element={<HomePage />} />
        <Route path="/calculators" element={<CalculatorLayout />}>
          <Route index element={<LocalCalculatorsPage />} />
          <Route path="statistics" element={<StatisticsCalculator />} />
          <Route path="probability" element={<ProbabilityCalculator />} />
          <Route path="binomial" element={<BinomialCalculator />} />
          <Route path="poisson" element={<PoissonCalculator />} />
          <Route path="hypothesis-test" element={<HypothesisTestCalculator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
