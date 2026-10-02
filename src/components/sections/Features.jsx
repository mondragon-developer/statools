import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CALCULATORS } from '../../data/journey/calculators';
import CalculatorResourcesCard from '../ui/CalculatorResourcesCard';

const Features = () => (
  <section className="bg-white py-12" id="tools" tabIndex={-1} aria-labelledby="features-heading">
    <div className="container mx-auto px-4">
      <h2 id="features-heading" className="text-3xl font-bold text-darkGrey">Find the right calculator</h2>
      <p className="text-darkGrey/80 mt-3 mb-6 max-w-2xl">Explore distributions, compare groups, or summarize a dataset. Calculations work without AI, sign-in, or a subscription.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(CALCULATORS).map(([key, calc]) => (
          <Link key={key} to={calc.path} className="group rounded-xl border border-darkTeal/20 p-5 hover:bg-platinum/50 hover:border-darkTeal transition-colors">
            <h3 className="font-bold text-darkTeal flex items-start justify-between gap-3">{calc.name}<ArrowRight size={18} className="flex-shrink-0 mt-1" aria-hidden="true" /></h3>
            <p className="text-sm text-darkGrey/80 mt-2">{calc.summary}</p>
          </Link>
        ))}
      </div>
      <details className="mt-8 rounded-lg border border-platinum p-4">
        <summary className="cursor-pointer font-semibold text-darkTeal">More calculators from other websites</summary>
        <p className="text-sm text-darkGrey/80 my-3">These external resources have their own terms and privacy practices.</p>
        <CalculatorResourcesCard />
      </details>
    </div>
  </section>
);
export default Features;
