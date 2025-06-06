import React, { useEffect, useRef } from "react";
import { Application } from '@splinetool/runtime';

const DataCenter3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const app = new Application(canvasRef.current);
      app.load('https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode');
    }
  }, []);

  return (
    <div 
      className="relative w-full overflow-hidden" 
      style={{ 
        height: "600px",
        marginLeft: "-20%",
        marginRight: "0%",
        width: "140%",
      }}
    >
      <canvas id="canvas3d" ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default DataCenter3D;