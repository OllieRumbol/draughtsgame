import React from "react";
import Button from "react-bootstrap/Button";
import DisplayModal from "../shared/DisplayModal";

export default function ResultModal(props) {
  const handleClose = () => props.update(false);

  const handleYes = () => {
    props.setJumpModalValue(true);
    handleClose();
  };

  const handleNo = () => {
    props.setJumpModalValue(false);
    handleClose();
  };

  return (
    <DisplayModal
      title="Would you like to take again?"
      show={props.show}
      update={handleClose}
      body="In draughts players can jump multiple times to take multiple pieces from their opponent."
      innerComponent={
        <div>
          <Button variant="primary" onClick={handleYes}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleNo}>
            No
          </Button>
        </div>
      }
    />
  );
}
