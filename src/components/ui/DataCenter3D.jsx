import React from "react";
import Spline from '@splinetool/react-spline';

const DataCenter3D = () => {
  return (
    <div 
      className="relative w-full" 
      style={{ 
        height: "600px",
        overflow: "hidden",
        // Add a subtle vignette effect to hide harsh edges
        background: "radial-gradient(ellipse at center, transparent 70%, #E6E6E6 100%)"
      }}
    >
      {/* Main scene container */}
      <div 
        className="absolute"
        style={{
          height: "700px", // Taller than viewport
          top: "-50px", // Shift up to show robot's head
          marginLeft: "-42%",
          width: "185%",
          overflow: "hidden"
        }}
      >
        <Spline
          scene="https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode"
          className="w-full h-full"
        />
      </div>
      
      {/* Top edge mask to blend smoothly */}
      <div 
        className="absolute inset-x-0 top-0 h-20 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #E6E6E6 0%, transparent 100%)",
          zIndex: 1
        }}
      />
    </div>
  );
};

export default DataCenter3D;