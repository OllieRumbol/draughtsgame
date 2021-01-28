import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ResultModal(props) {
    const handleClose = () => props.update(false);

    const handleYes = () => {
        props.setJumpModalValue(true);
        handleClose();
    }

    return (
        <div>
            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Would you like to take again?</Modal.Title>
                </Modal.Header>
                <Modal.Body>In draughts players can jump multiple times to take multiple pieces from their opponent.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleYes}>Yes</Button>
                    <Button variant="primary" onClick={handleClose}>No</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}