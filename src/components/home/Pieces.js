import React from "react";
import "../../style/Counter.css";

export default function Pieces(props) {
  return (
    <div>
      <div className="ms-4 circle2 red center"></div>
      <h3 className="p-4">Single</h3>

      <br></br>

      <div className="ms-4 circle2 red center">K</div>
      <h3 className="p-4">King</h3>
    </div>
  );
}