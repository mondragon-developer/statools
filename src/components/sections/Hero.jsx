import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, BookOpen, Compass } from 'lucide-react';

const Hero = () => (
  <section className="container mx-auto px-4 py-12 sm:py-20 grid lg:grid-cols-2 gap-10 items-center" aria-labelledby="hero-heading">
    <div className="space-y-6">
      <p className="text-sm font-bold uppercase tracking-widest text-darkTeal">Free statistics tools / No account needed</p>
      <h1 id="hero-heading" className="text-4xl sm:text-5xl font-bold text-darkGrey leading-tight">
        Understand your data.<br /><span className="text-darkTeal">Build your confidence.</span>
      </h1>
      <p className="text-lg text-darkGrey/80 max-w-xl">Calculate, explore the steps, and practice what you learn. Nine calculators and a guided learning journey for statistics students.</p>
      <div className="flex flex-wrap gap-3">
        <Link to="/calculators" className="inline-flex items-center gap-2 bg-accent text-darkGrey border-2 border-darkGrey px-5 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white"><Calculator size={20} aria-hidden="true" /> Open calculators</Link>
        <Link to="/learn" className="inline-flex items-center gap-2 border-2 border-darkTeal text-darkTeal px-5 py-3 rounded-lg font-bold hover:bg-darkTeal hover:text-white"><BookOpen size={20} aria-hidden="true" /> Start learning</Link>
      </div>
      <p className="text-sm text-darkGrey/80">Calculations run on your device. Optional AI help sends messages to an outside service. <Link to="/privacy" className="underline text-darkTeal">How privacy works</Link></p>
    </div>
    <div className="bg-white border border-darkTeal/20 rounded-2xl p-6 sm:p-8 shadow-sm">
      <p className="text-sm font-semibold text-darkTeal">A small dataset, a clearer picture</p>
      <p className="text-2xl font-mono tracking-wide text-darkGrey mt-4">2, 4, 4, 6, 9</p>
      <dl className="grid grid-cols-3 gap-3 my-6">
        {[['Mean', '5'], ['Median', '4'], ['Sample SD', '2.65']].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-platinum/60 p-3"><dt className="text-sm text-darkGrey">{label}</dt><dd className="text-2xl font-bold text-darkTeal mt-1">{value}</dd></div>
        ))}
      </dl>
      <p className="text-darkGrey/80">The largest value pulls the mean above the median. Explore how center and spread describe your data.</p>
      <Link to="/calculators/statistics" className="inline-flex items-center gap-2 mt-5 font-semibold text-darkTeal underline">Try the statistics calculator <ArrowRight size={18} aria-hidden="true" /></Link>
      <a href="#calculator-coach" className="flex items-center gap-2 mt-5 pt-5 border-t border-platinum font-semibold text-darkTeal underline"><Compass size={18} aria-hidden="true" /> Help me choose a calculator</a>
    </div>
  </section>
);
export default Hero;
