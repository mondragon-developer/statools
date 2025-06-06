import React from "react";
import Spline from "@splinetool/react-spline";

const Hero = () => {
  return (
    <main className="flex-grow container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h1 className="text-5xl font-bold text-darkGrey">
          Statistical Tools
          <br />
          <span className="text-turquoise">For Students & Enthusiasts</span>
        </h1>
        <p className="text-xl text-darkGrey opacity-80">
          Explore powerful statistical tools and resources designed to help you
          analyze data, understand concepts, and master statistical methods.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-yellow border-2 border-darkGrey text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all shadow-lg">
            Explore Tools
          </button>
          <button className="bg-yellow border-2 border-darkGrey text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all shadow-lg">
            View Tutorials
          </button>
        </div>
      </div>

      <div
        className="relative w-full"
        style={{
          height: "600px",
          overflow: "hidden",
          // Add a subtle vignette effect to hide harsh edges
          background:
            "radial-gradient(ellipse at center, transparent 70%, #E6E6E6 100%)",
        }}
      >
        <div
          className="absolute"
          style={{
            height: "700px", // Taller than viewport
            top: "-50px", // Shift up to show robot's head
            marginLeft: "-20%",
            width: "180%",
            overflow: "hidden",
          }}
        >
          <Spline scene="https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode" />
        </div>
      </div>
    </main>
  );
};

export default Hero;
