import React from "react";

const LightControlButton = ({ lightColor, setLightColor, intensity, setIntensity }) => {
    return (
      <div>
        <div>
          <label>Changer la couleur de la lumière :</label>
          <input
            type="color"
            value={lightColor}
            onChange={(e) => setLightColor(e.target.value)}
          />
        </div>
  
        <div>
          <label>Intensité de la lumière :</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
          />
        </div>
      </div>
    );
  };

export default LightControlButton;
