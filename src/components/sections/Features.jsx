import React from "react";
import { BookOpen, Calculator, HouseIcon } from "lucide-react";
import FeatureCard from "../ui/FeatureCard";
import CalculatorResourcesCard from "../ui/CalculatorResourcesCard";
import Spline from "@splinetool/react-spline";

const Features = () => {
  return (
    <section className="bg-white py-16" id="tools">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-darkGrey mb-12">
          Statistical Resources
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Spline Visualization Card */}
          <div className="bg-platinum p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-full h-80 mb-6">
              <Spline
                scene="https://prod.spline.design/1GfxCCZbNPvMURDn/scene.splinecode"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-bold text-darkGrey my-4 text-center">Statistical Calculators</h3>
            <p className="text-darkGrey opacity-80 text-center">
              Easy-to-use calculators for hypothesis testing, regression analysis, confidence intervals, and more.
            </p>
          </div>

          {/* Calculator Links Card */}
          <CalculatorResourcesCard />

          {/* Learning Resources Card */}
          <FeatureCard
            icon={<HouseIcon size={48} className="text-turquoise mb-4" />}
            title="Local Calculators"
            description="Same tools as online calculators but better for your privacy."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
