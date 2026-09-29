import React, { lazy, Suspense } from "react";
import QuietBoundary from "../ui/QuietBoundary";

const Spline = lazy(() => import("@splinetool/react-spline"));

// The scene ships with its own background color; clearing it lets the page show through.
const makeTransparent = (app) => app.setBackgroundColor("rgba(0, 0, 0, 0)");

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.focus({ preventScroll: true });
    }
  };

  return (
    <section className="flex-grow container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center" aria-labelledby="hero-heading">
      <div className="space-y-6">
        <h1 id="hero-heading" className="text-5xl font-bold text-darkGrey">
          Statistical Tools
          <br />
          <span className="text-darkTeal">For Students & Enthusiasts</span>
        </h1>
        <p className="text-xl text-darkGrey opacity-80">
          Explore powerful statistical tools and resources designed to help you
          analyze data, understand concepts, and master statistical methods.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => scrollToSection('tools')}
            className="bg-accent border-2 border-darkGrey text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all shadow-lg"
          >
            Explore Tools
          </button>
          <button
            onClick={() => scrollToSection('resources')}
            className="bg-accent border-2 border-darkGrey text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all shadow-lg"
          >
            View Tutorials
          </button>
        </div>
      </div>

      <div
        className="relative w-full"
        aria-hidden="true"
        style={{
          height: "600px",
          overflow: "hidden",
        }}
      >
        <div
          className="absolute"
          style={{
            height: "700px",
            top: "-50px",
            marginLeft: "-20%",
            width: "180%",
            overflow: "hidden",
          }}
        >
          <QuietBoundary>
            <Suspense fallback={null}>
              <Spline
                scene="https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode"
                onLoad={makeTransparent}
              />
            </Suspense>
          </QuietBoundary>
        </div>
      </div>
    </section>
  );
};

export default Hero;
