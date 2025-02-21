import React from "react";
import "./Loader.scss";

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-icon">
        <span>i</span>
        <span>X</span>
        <span>E</span>
        <span>S</span>
      </div>
      <p className="loader-icon-sub">Xtended-Human-AI-Eco-System</p>
      {/* <div className="loader-bar"> */}
        {/* <div className="loader-progress"></div> */}
      {/* </div> */}
    </div>
  );
};

export default Loader;
