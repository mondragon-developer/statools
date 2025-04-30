import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

const Histogram3D = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle the scene loading
  const handleOnLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-80 md:h-96">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
          <div className="text-darkGrey">Loading 3D visualization...</div>
        </div>
      )}
      <Spline
        className="w-full h-full rounded-lg"
        scene="https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode"
        onLoad={handleOnLoad}
      />
    </div>
  );
};

export default Histogram3D;
