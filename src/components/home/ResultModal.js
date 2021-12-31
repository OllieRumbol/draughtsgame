import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import DisplayModal from "../shared/DisplayModal";

export default function ResultModal(props) {
  const { title, show, setShow, message} = props;

  const handleClose = () => setShow(false);
  const handleRestart = () => window.location.reload();

  return (
    <DisplayModal
      title={title}
      show={show}
      body={message}
      innerComponent={
        <div>
          <ButtonGroup className="me-3">
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
          </ButtonGroup>
          <ButtonGroup className="ml-3">
            <Button variant="success" onClick={handleRestart}>
              Restart
            </Button>
          </ButtonGroup>
        </div>
      }
    />
  );
}
