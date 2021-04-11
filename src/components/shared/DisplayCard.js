import React from "react";
import Card from 'react-bootstrap/Card';

export default function DisplayCard(props) {

    return (
        <div>
            <Card>
                <Card.Header><h2>{props.title}</h2></Card.Header>
                <Card.Body>
                    {props.innerComponent}
                </Card.Body>
            </Card>
        </div>
    )
}