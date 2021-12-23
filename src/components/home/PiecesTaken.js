import React from "react";
import "../../style/Counter.css";

export default function PiecesTaken(props) {
  return (
    <div className="d-flex justify-content-center">
      <div className="circle2 red"></div>
      <h3 className="p-4">{props.player1Counter}</h3>

      <br></br>

      <div className="circle2 blue"></div>
      <h3 className="p-4">{props.player2Counter}</h3>
    </div>
  );
}
