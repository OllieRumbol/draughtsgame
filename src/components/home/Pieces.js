import React from "react";
import "../../style/Counter.css";

export default function Pieces(props) {
  return (
    <div className="d-flex justify-content-center">
      <div className="circle2 red"></div>
      <h3 className="p-4">Single</h3>

      <br></br>

      <div className="circle2 red">K</div>
      <h3 className="p-4">King</h3>
    </div>
  );
}
