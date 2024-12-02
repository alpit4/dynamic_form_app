import React from "react";

const ProgressBar = ({ progress }) => (
  <div className="progress-bar-container">
    <div
      className="progress-bar"
      style={{ width: `${progress}%`, backgroundColor: "blue" }}
    ></div>
  </div>
);

export default ProgressBar;
