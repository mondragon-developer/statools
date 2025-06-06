import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

const Datacenter3D = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle the scene loading
  const handleOnLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative overflow-visible"
      style={{
        height: "500px",
        width: "100%",
        // This negative margin extends beyond the parent container
        marginLeft: "0%",
        marginRight: "10%",
        marginTop: "-20%",
        marginBottom: "-10%",
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-darkGrey font-medium">
            Loading 3D visualization...
          </div>
        </div>
      )}
      <div className="absolute inset-0 flex items-center">
        <Spline
          className="w-full h-full"
          scene="https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode"
          onLoad={handleOnLoad}
        />
      </div>
    </div>
  );
};

export default Datacenter3D;
