import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

const Datacenter3D = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle the scene loading
  const handleOnLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className="relative w-full"
      style={{
        height: "500px",
        // This negative margin extends beyond the parent container
        marginLeft: "-20%",
        marginRight: "0%",
        width: "185%",
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
          style={{ width: "80%", height: "130%" }}
          scene="https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode"
          onLoad={handleOnLoad}
        />
      </div>
    </div>
  );
};

export default Datacenter3D;
