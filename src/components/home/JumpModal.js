import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import DisplayModal from "../shared/DisplayModal";

export default function ResultModal(props) {
  const {show, handleYes, handleNo} = props;

  return (
    <DisplayModal
      title="Would you like to take again?"
      show={show}
      body="In draughts players can jump multiple times to take multiple pieces from their opponent."
      innerComponent={
        <div>
          <ButtonGroup className="me-3">
            <Button variant="primary" onClick={handleYes}>
              Yes
            </Button>
          </ButtonGroup>
          <ButtonGroup className="ml-3">
            <Button variant="primary" onClick={handleNo}>
              No
            </Button>
          </ButtonGroup>
        </div>
      }
    />
  );
}
