import React from "react";
import Card from "react-bootstrap/Card";

export default function DisplayCard(props) {
  return (
    <Card bg="dark" text="white">
      <Card.Header className="text-center">
        <h2>{props.title}</h2>
      </Card.Header>
      <Card.Body className="text-center">{props.innerComponent}</Card.Body>
    </Card>
  );
}
