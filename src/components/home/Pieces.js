import React from "react";
import "../../style/Counter.css";

export default function Pieces(props) {
  return (
    <div className="d-flex justify-content-around">
      <div className="circle red"></div>
      <h4 className="p-4">Single</h4>

      <br></br>

      <div className="circle red">K</div>
      <h4 className="p-4">King</h4>
    </div>
  );
}
