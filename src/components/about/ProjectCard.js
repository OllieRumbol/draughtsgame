import React from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import DisplayCard from "../shared/DisplayCard";

export default function ProjectCard(props) {
  const { features, title, colour, status } = props;

  let list = features.map((feature, index) => {
    return <li key={index}>{feature}</li>;
  });

  return (
    <Col>
      <DisplayCard
        title={title}
        innerComponent={
          <div>
            <h3>Features</h3>
            <ul>{list}</ul>
            <Alert variant={colour}>{status}</Alert>
          </div>
        }
      ></DisplayCard>
    </Col>
  );
}
