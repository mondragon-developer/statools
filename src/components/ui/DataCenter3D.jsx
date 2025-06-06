import React from "react";
import Spline from '@splinetool/react-spline';

const DataCenter3D = () => {
  return (
    <div 
      className="relative w-full overflow-hidden" 
      style={{ height: "600px" }}
    >
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          marginLeft: "-20%",
          width: "185%",
          // Critical: clip any content outside the bounds
          clipPath: "inset(1% 0 0 0)", // Clips 1% from the top
        }}
      >
        <Spline
          scene="https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default DataCenter3D;