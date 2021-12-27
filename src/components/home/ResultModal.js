import React from "react";
import Button from "react-bootstrap/Button";
import DisplayModal from "../shared/DisplayModal";

export default function ResultModal(props) {
  const { title, show, message, update } = props;

  const handleClose = () => update(false);
  const handleRestart = () => window.location.reload();

  return (
    <DisplayModal
      title={title}
      show={show}
      update={handleClose}
      body={message}
      innerComponent={
        <div>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleRestart}>
            Restart
          </Button>
        </div>
      }
    />
  );
}
