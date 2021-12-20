import React from "react";
import '../../style/Counter.css';

export default function Players(props) {
  return (
    <div>
      <div
        className={
          "ms-4 circle2 red center" + (props.turn === true ? " yellow" : "")
        }
      ></div>
      <h3 className="p-4">Player 1</h3>

      <br></br>

      <div
        className={
          "ms-4 circle2 blue center" + (props.turn === false ? " yellow" : "")
        }
      ></div>
      <h3 className="p-4">Player 2</h3>
    </div>
  );
}