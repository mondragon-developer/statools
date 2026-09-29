import centralTendencyQuestions from '../quizzes/centralTendency';
import measuresOfDeviationQuestions from '../quizzes/measuresOfDeviation';
import probabilityFundamentalsQuestions from '../quizzes/probabilityFundamentals';
import binomialDistributionQuestions from '../quizzes/binomialDistribution';
import poissonDistributionQuestions from '../quizzes/poissonDistribution';
import normalDistributionQuestions from '../quizzes/normalDistribution';
import tDistributionQuestions from '../quizzes/tDistribution';
import centralLimitTheoremQuestions from '../quizzes/centralLimitTheorem';
import hypothesisTestingOneSampleQuestions from '../quizzes/hypothesisTestingOneSample';
import hypothesisTestingTwoSamplesQuestions from '../quizzes/hypothesisTestingTwoSamples';
import confidenceIntervalsQuestions from '../quizzes/confidenceIntervals';
import linearRegressionBasicsQuestions from '../quizzes/linearRegressionBasics';
import regressionAnalysisQuestions from '../quizzes/regressionAnalysis';
import interpretingRegressionQuestions from '../quizzes/interpretingRegression';

const BASE = import.meta.env.BASE_URL;

export const RESOURCE_CATEGORIES = ['Foundations', 'Probability', 'Inference', 'Regression', 'Calculator Guides'];

// stage: the journey stage the guide supports; null means it is a reference for every stage.
export const RESOURCES = [
  {
    id: 'central-tendency',
    name: 'Measures of Central Tendency',
    path: `${BASE}resources/measures-of-central-tendency.pdf`,
    fileName: 'Measures_of_Central_Tendency.pdf',
    quiz: centralTendencyQuestions,
    category: 'Foundations',
    stage: 2,
  },
  {
    id: 'deviation',
    name: 'Measures of Deviation',
    path: `${BASE}resources/measures-of-deviation.pdf`,
    fileName: 'Measures_of_Deviation.pdf',
    quiz: measuresOfDeviationQuestions,
    category: 'Foundations',
    stage: 2,
  },
  {
    id: 'probability-fundamentals',
    name: 'Probability Fundamentals',
    path: `${BASE}resources/probability-fundamentals.pdf`,
    fileName: 'Probability_Fundamentals.pdf',
    quiz: probabilityFundamentalsQuestions,
    category: 'Probability',
    stage: 3,
  },
  {
    id: 'binomial',
    name: 'Binomial Distribution Guide',
    path: `${BASE}resources/binomial-distribution.pdf`,
    fileName: 'Binomial_Distribution_Guide.pdf',
    quiz: binomialDistributionQuestions,
    category: 'Probability',
    stage: 3,
  },
  {
    id: 'normal',
    name: 'Normal Distribution & Z-Scores',
    path: `${BASE}resources/normal-distribution.pdf`,
    fileName: 'Normal_Distribution_Guide.pdf',
    quiz: normalDistributionQuestions,
    category: 'Probability',
    stage: 4,
  },
  {
    id: 'poisson',
    name: 'Poisson Distribution Examples',
    path: `${BASE}resources/poisson-distribution.pdf`,
    fileName: 'Poisson_Distribution_Examples.pdf',
    quiz: poissonDistributionQuestions,
    category: 'Probability',
    stage: 4,
  },
  {
    id: 't-distribution',
    name: 'T-Distribution Explained',
    path: `${BASE}resources/t-distribution.pdf`,
    fileName: 'T_Distribution_Guide.pdf',
    quiz: tDistributionQuestions,
    category: 'Probability',
    stage: 4,
  },
  {
    id: 'clt',
    name: 'Central Limit Theorem',
    path: `${BASE}resources/central-limit-theorem.pdf`,
    fileName: 'Central_Limit_Theorem.pdf',
    quiz: centralLimitTheoremQuestions,
    category: 'Inference',
    stage: 5,
  },
  {
    id: 'confidence-intervals',
    name: 'Confidence Intervals Step-by-Step',
    path: `${BASE}resources/confidence-intervals.pdf`,
    fileName: 'Confidence_Intervals_Guide.pdf',
    quiz: confidenceIntervalsQuestions,
    category: 'Inference',
    stage: 5,
  },
  {
    id: 'hypothesis-one',
    name: 'Hypothesis Testing: One Sample',
    path: `${BASE}resources/hypothesis-testing-one-sample.pdf`,
    fileName: 'Hypothesis_Testing_One_Sample.pdf',
    quiz: hypothesisTestingOneSampleQuestions,
    category: 'Inference',
    stage: 5,
  },
  {
    id: 'hypothesis-two',
    name: 'Hypothesis Testing: Two Samples',
    path: `${BASE}resources/hypothesis-testing-two-samples.pdf`,
    fileName: 'Hypothesis_Testing_Two_Samples.pdf',
    quiz: hypothesisTestingTwoSamplesQuestions,
    category: 'Inference',
    stage: 5,
  },
  {
    id: 'regression-basics',
    name: 'Linear Regression Basics',
    path: `${BASE}resources/linear-regression-basics.pdf`,
    fileName: 'Linear_Regression_Basics.pdf',
    quiz: linearRegressionBasicsQuestions,
    category: 'Regression',
    stage: 6,
  },
  {
    id: 'regression-steps',
    name: 'Regression Analysis Step-by-Step',
    path: `${BASE}resources/regression-step-by-step.pdf`,
    fileName: 'Regression_Analysis_Step_by_Step.pdf',
    quiz: regressionAnalysisQuestions,
    category: 'Regression',
    stage: 6,
  },
  {
    id: 'regression-interpreting',
    name: 'Interpreting Regression Results',
    path: `${BASE}resources/interpreting-regression.pdf`,
    fileName: 'Interpreting_Regression_Results.pdf',
    quiz: interpretingRegressionQuestions,
    category: 'Regression',
    stage: 6,
  },
  {
    id: 'guide-statistics',
    name: 'Statistics Calculator Guide',
    path: `${BASE}resources/statistics-calculator-guide.pdf`,
    fileName: 'Statistics_Calculator_Guide.pdf',
    category: 'Calculator Guides',
    stage: null,
  },
  {
    id: 'guide-probability',
    name: 'Probability Calculator Guide',
    path: `${BASE}resources/probability-calculator-guide.pdf`,
    fileName: 'Probability_Calculator_Guide.pdf',
    category: 'Calculator Guides',
    stage: null,
  },
  {
    id: 'guide-distributions',
    name: 'Distribution Calculators Guide',
    path: `${BASE}resources/distribution-calculators-guide.pdf`,
    fileName: 'Distribution_Calculators_Guide.pdf',
    category: 'Calculator Guides',
    stage: null,
  },
  {
    id: 'tables',
    name: 'Statistical Tables Cheat Sheet',
    path: `${BASE}resources/statistical-tables.pdf`,
    fileName: 'Statistical_Tables_Cheat_Sheet.pdf',
    category: 'Calculator Guides',
    stage: null,
  },
];

export const getResource = (id) => RESOURCES.find(r => r.id === id);
