import React from "react";
import "../../style/Counter.css";

export default function PiecesTaken(props) {
  return (
    <div className="d-flex justify-content-center">
      <div className="circle red"></div>
      <h4 className="p-4">{props.player1Counter}</h4>

      <br></br>

      <div className="circle blue"></div>
      <h4 className="p-4">{props.player2Counter}</h4>
    </div>
  );
}
