import React from "react";
import "../style/Controls.css"; 

const Controls = ({ lightOn, setLightOn, lightColor, setLightColor, intensity, setIntensity }) => {
  return (
    <div className="controls">
      <label className="switch">
        <input
          type="checkbox"
          checked={lightOn}
          onChange={() => setLightOn(!lightOn)}
        />
        <span className="slider"></span>
      </label>
      <span className="label-text">Lumière {lightOn ? "allumée" : "éteinte"}</span>

      <div>
        <label>Couleur de la lumière :</label>
        <input
          type="color"
          value={lightColor}
          onChange={(e) => setLightColor(e.target.value)}
        />
      </div>

      <div>
        <label>Intensité :</label>
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

export default Controls;
