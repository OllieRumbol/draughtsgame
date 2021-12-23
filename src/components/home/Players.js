import React from "react";
import "../../style/Counter.css";

export default function Players(props) {
  return (
    <div className="d-flex justify-content-center">
      <div
        className={
          "circle2 red" + (props.turn === true ? " yellow" : "")
        }
      ></div>
      <h3 className="p-4">Player 1</h3>

      <br></br>

      <div
        className={
          "circle2 blue" + (props.turn === false ? " yellow" : "")
        }
      ></div>
      <h3 className="p-4">Player 2</h3>
    </div>
  );
}
