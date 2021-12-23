import React from "react";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";

export default function ProjectCard(props) {
  const { features, title, colour, status } = props;

  let list = features.map((feature, index) => {
    return <li key={index}>{feature}</li>;
  });

  return (
    <Col>
      <Card bg="dark" text="white">
        <Card.Header className="text-center">
          <h3>{title}</h3>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <h5>Features</h5>
            <ul>{list}</ul>
          </Card.Text>
          <Alert variant={colour}>{status}</Alert>
        </Card.Body>
      </Card>
    </Col>
  );
}
