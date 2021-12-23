import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function ResultModal(props) {
  const handleClose = () => props.update(false);

  const handleRestart = () => window.location.reload();

  return (
    <Modal show={props.show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.message}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={handleRestart}>
          Restart
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
