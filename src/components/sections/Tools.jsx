import { LineChart, BarChart, PieChart, Calculator, BookOpen, FileText, TrendingUp, Table } from 'lucide-react';
import ResourceCard from '../ui/ResourceCard';
import SnakeGame from '../games/SnakeGame';
import centralTendencyQuestions from '../../data/quizzes/centralTendency';
import measuresOfDeviationQuestions from '../../data/quizzes/measuresOfDeviation';
import probabilityFundamentalsQuestions from '../../data/quizzes/probabilityFundamentals';
import binomialDistributionQuestions from '../../data/quizzes/binomialDistribution';
import poissonDistributionQuestions from '../../data/quizzes/poissonDistribution';
import normalDistributionQuestions from '../../data/quizzes/normalDistribution';
import tDistributionQuestions from '../../data/quizzes/tDistribution';
import centralLimitTheoremQuestions from '../../data/quizzes/centralLimitTheorem';
import hypothesisTestingOneSampleQuestions from '../../data/quizzes/hypothesisTestingOneSample';
import hypothesisTestingTwoSamplesQuestions from '../../data/quizzes/hypothesisTestingTwoSamples';
import confidenceIntervalsQuestions from '../../data/quizzes/confidenceIntervals';
import linearRegressionBasicsQuestions from '../../data/quizzes/linearRegressionBasics';
import regressionAnalysisQuestions from '../../data/quizzes/regressionAnalysis';
import interpretingRegressionQuestions from '../../data/quizzes/interpretingRegression';

const Tools = () => {
  // Define the resource categories with downloadable PDFs
  const resourceCategories = [
    {
      icon: <PieChart size={36} className="text-turquoise" />,
      title: "Probability & Distributions",
      description: "Master probability concepts and key statistical distributions with step-by-step examples.",
      resources: [
        {
          name: "Measures of Central Tendency",
          path: "/statools/resources/measures-of-central-tendency.pdf",
          fileName: "Measures_of_Central_Tendency.pdf",
          quiz: centralTendencyQuestions
        },
        {
          name: "Measures of Deviation",
          path: "/statools/resources/measures-of-deviation.pdf",
          fileName: "Measures_of_Deviation.pdf",
          quiz: measuresOfDeviationQuestions
        },
        {
          name: "Probability Fundamentals",
          path: "/statools/resources/probability-fundamentals.pdf",
          fileName: "Probability_Fundamentals.pdf",
          quiz: probabilityFundamentalsQuestions
        },
        {
          name: "Binomial Distribution Guide",
          path: "/statools/resources/binomial-distribution.pdf",
          fileName: "Binomial_Distribution_Guide.pdf",
          quiz: binomialDistributionQuestions
        },
        {
          name: "Poisson Distribution Examples",
          path: "/statools/resources/poisson-distribution.pdf",
          fileName: "Poisson_Distribution_Examples.pdf",
          quiz: poissonDistributionQuestions
        },
        {
          name: "Normal Distribution & Z-Scores",
          path: "/statools/resources/normal-distribution.pdf",
          fileName: "Normal_Distribution_Guide.pdf",
          quiz: normalDistributionQuestions
        },
        {
          name: "T-Distribution Explained",
          path: "/statools/resources/t-distribution.pdf",
          fileName: "T_Distribution_Guide.pdf",
          quiz: tDistributionQuestions
        }
      ]
    },
    {
      icon: <BarChart size={36} className="text-turquoise" />,
      title: "Statistical Inference",
      description: "Learn hypothesis testing, confidence intervals, and the Central Limit Theorem with practical examples.",
      resources: [
        {
          name: "Central Limit Theorem",
          path: "/statools/resources/central-limit-theorem.pdf",
          fileName: "Central_Limit_Theorem.pdf",
          quiz: centralLimitTheoremQuestions
        },
        {
          name: "Hypothesis Testing: One Sample",
          path: "/statools/resources/hypothesis-testing-one-sample.pdf",
          fileName: "Hypothesis_Testing_One_Sample.pdf",
          quiz: hypothesisTestingOneSampleQuestions
        },
        {
          name: "Hypothesis Testing: Two Samples",
          path: "/statools/resources/hypothesis-testing-two-samples.pdf",
          fileName: "Hypothesis_Testing_Two_Samples.pdf",
          quiz: hypothesisTestingTwoSamplesQuestions
        },
        {
          name: "Confidence Intervals Step-by-Step",
          path: "/statools/resources/confidence-intervals.pdf",
          fileName: "Confidence_Intervals_Guide.pdf",
          quiz: confidenceIntervalsQuestions
        }
      ]
    },
    {
      icon: <TrendingUp size={36} className="text-turquoise" />,
      title: "Regression Analysis",
      description: "Understand linear regression from basics to interpretation with real-world examples.",
      resources: [
        {
          name: "Linear Regression Basics",
          path: "/statools/resources/linear-regression-basics.pdf",
          fileName: "Linear_Regression_Basics.pdf",
          quiz: linearRegressionBasicsQuestions
        },
        {
          name: "Regression Analysis Step-by-Step",
          path: "/statools/resources/regression-step-by-step.pdf",
          fileName: "Regression_Analysis_Step_by_Step.pdf",
          quiz: regressionAnalysisQuestions
        },
        {
          name: "Interpreting Regression Results",
          path: "/statools/resources/interpreting-regression.pdf",
          fileName: "Interpreting_Regression_Results.pdf",
          quiz: interpretingRegressionQuestions
        }
      ]
    },
    {
      icon: <Calculator size={36} className="text-turquoise" />,
      title: "Calculator Guides & Tables",
      description: "Quick reference guides for our calculators and essential statistical tables.",
      resources: [
        {
          name: "Statistics Calculator Guide",
          path: "/statools/resources/statistics-calculator-guide.pdf",
          fileName: "Statistics_Calculator_Guide.pdf"
        },
        {
          name: "Probability Calculator Guide",
          path: "/statools/resources/probability-calculator-guide.pdf",
          fileName: "Probability_Calculator_Guide.pdf"
        },
        {
          name: "Distribution Calculators Guide",
          path: "/statools/resources/distribution-calculators-guide.pdf",
          fileName: "Distribution_Calculators_Guide.pdf"
        },
        {
          name: "Statistical Tables Cheat Sheet",
          path: "/statools/resources/statistical-tables.pdf",
          fileName: "Statistical_Tables_Cheat_Sheet.pdf"
        }
      ]
    }
  ];

  return (
    <section className="bg-platinum py-16" id="resources">
      <div className="container mx-auto px-4">
        {/* Snake Game Container */}
        <div className="w-full mb-12 flex justify-center">
          <SnakeGame />
        </div>

        <h2 className="text-4xl font-bold text-center text-darkGrey mb-12">
          Content and Resources
        </h2>
        <p className="text-center text-darkGrey opacity-80 mb-12 max-w-3xl mx-auto">
          Download comprehensive study guides, step-by-step examples, and calculator tutorials.
          All materials are free and designed to support your statistics learning journey.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {resourceCategories.map((category, index) => (
            <ResourceCard
              key={index}
              icon={category.icon}
              title={category.title}
              description={category.description}
              resources={category.resources}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;