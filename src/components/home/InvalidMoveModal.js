import React from "react";
import Button from "react-bootstrap/Button";
import DisplayModal from "../shared/DisplayModal";

export default function InvalidMoveModal(props) {
  const handleClose = () => props.update(false);

  return (
    <DisplayModal
      title="That was an invalid move"
      show={props.show}
      body="Please pick another move to continue the game."
      innerComponent={
        <Button variant="primary" onClick={handleClose}>
          Okay
        </Button>
      }
    />
  );
}
