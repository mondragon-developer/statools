import React, { useState, useEffect } from "react";

const Datacenter3D = () => {
  const [SplineComponent, setSplineComponent] = useState(null);

  useEffect(() => {
    // Dynamic import based on environment
    const loadSpline = async () => {
      try {
        const { default: Spline } = await import('@splinetool/react-spline');
        setSplineComponent(() => Spline);
      } catch (error) {
        console.error('Failed to load Spline:', error);
      }
    };
    
    loadSpline();
  }, []);

  if (!SplineComponent) {
    return <div className="w-full h-[500px] bg-gray-900 flex items-center justify-center">
      <p className="text-white">Loading 3D Environment...</p>
    </div>;
  }

  return (
    <div className="relative w-full h-[500px]">
      <SplineComponent
        scene="https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
};

export default Datacenter3D;
