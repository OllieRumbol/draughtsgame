import React from "react";
import "../../style/Counter.css";

export default function Players(props) {
  return (
    <div className="d-flex justify-content-center">
      <div
        className={"circle red" + (props.turn === true ? " yellow" : "")}
      ></div>
      <h4 className="p-4">Player 1</h4>

      <br></br>

      <div
        className={"circle blue" + (props.turn === false ? " yellow" : "")}
      ></div>
      <h4 className="p-4">Player 2</h4>
    </div>
  );
}
