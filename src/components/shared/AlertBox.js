import React from "react";
import Alert from "react-bootstrap/Alert";

export default function AlertBox(props) {
  return (
    <Alert variant="danger">
      <Alert.Heading>{props.title}</Alert.Heading>
      <p>
        The draughts game had problems with connecting and using external
        resources used for player tips and automated player features.
      </p>
      <hr />
      <p className="mb-0">{props.end}</p>
    </Alert>
  );
}
