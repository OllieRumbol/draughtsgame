import React from "react";
import "../../style/Counter.css";

export default function PiecesTaken(props) {
  return (
    <div>
      <div className="ms-4 circle2 red center"></div>
      <h3 className="m-0 p-4">{props.player1Counter}</h3>

      <br></br>

      <div className="ms-4 circle2 blue center"></div>
      <h3 className="p-4">{props.player2Counter}</h3>
    </div>
  );
}
