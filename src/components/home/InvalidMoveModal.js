import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function InvalidMoveModal(props) {
    const handleClose = () => props.update(false);

    return (
        <div>
            <Modal show={props.show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>That was an invalid move</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please pick another move to continue the game.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>Okay</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}