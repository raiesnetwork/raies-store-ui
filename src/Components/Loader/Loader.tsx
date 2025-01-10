import React from "react";
import "./Loader.scss";

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-icon">
        <span>R</span>
        <span>A</span>
        <span>I</span>
        <span>S</span>
      </div>
      <p className="loader-icon-sub">NETWORK</p>
      {/* <div className="loader-bar"> */}
        {/* <div className="loader-progress"></div> */}
      {/* </div> */}
    </div>
  );
};

export default Loader;
