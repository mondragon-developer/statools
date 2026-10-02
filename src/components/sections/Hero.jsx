import { Link } from 'react-router-dom';
import InteractiveDataset from './InteractiveDataset';
import { Calculator, BookOpen } from 'lucide-react';

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
    <InteractiveDataset />
  </section>
);
export default Hero;
