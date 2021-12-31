import React from "react";
import Modal from "react-bootstrap/Modal";
import "../../style/DisplayModal.css";

export default function DisplayModal(props) {
  const { title, show, body, innerComponent } = props;

  return (
    <Modal show={show} backdrop="static">
      <div className="darkBackground lightText">
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>{innerComponent}</Modal.Footer>
      </div>
    </Modal>
  );
}
