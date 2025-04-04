import React, { useState, useEffect } from "react";
import Canvas from "./Canvas";
import Controls from "./Controls";

const Scene = () => {
  const [sizes, setSizes] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [manualRotation, setManualRotation] = useState({ x: 0, y: 0 });
  const [lightOn, setLightOn] = useState(true);
  const [lightColor, setLightColor] = useState("#ff0000");
  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setSizes({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Canvas
        sizes={sizes}
        manualRotation={manualRotation}
        lightOn={lightOn}
        lightColor={lightColor}
        intensity={intensity}
      />
      <Controls
        lightOn={lightOn}
        setLightOn={setLightOn}
        lightColor={lightColor}
        setLightColor={setLightColor}
        intensity={intensity}
        setIntensity={setIntensity}
      />
    </div>
  );
};

export default Scene;