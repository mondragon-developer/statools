import React from "react";
import DataCenter3D from "../ui/DataCenter3D";

const Hero = () => {
  return (
    <main className="flex-grow container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h1 className="text-5xl font-bold text-darkGrey">
          Statistical Tools
          <br />
          <span className="text-turquoise">For Students & Researchers</span>
        </h1>
        <p className="text-xl text-darkGrey opacity-80">
          Explore powerful statistical tools and resources designed to help you
          analyze data, understand concepts, and master statistical methods.
        </p>
        <div className="flex space-x-4">
          <button className="bg-yellow text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg">
            Explore Tools
          </button>
          <button className="border-2 border-darkGrey text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all">
            View Tutorials
          </button>
        </div>
      </div>
      <div className="relative">
        {/* <div className="bg-yellow rounded-lg p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform"> */}
        <div className="bg-white rounded-lg p-4">
          <DataCenter3D />
        </div>
      </div>
      {/* </div> */}
    </main>
  );
};

export default Hero;
