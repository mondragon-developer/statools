import React from "react";
import Spline from '@splinetool/react-spline';

const DataCenter3D = () => {
  return (
    <div 
      className="relative w-full overflow-hidden" 
      style={{ 
        height: "600px",
        marginLeft: "-20%",
        marginRight: "0%",
        width: "130%" 
      }}
    >
      <Spline
        scene="https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default DataCenter3D;