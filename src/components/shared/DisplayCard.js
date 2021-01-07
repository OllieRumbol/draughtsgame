import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

export default function DisplayCard(props) {

    return (
        <div>
            <Card>
            <Card.Header><h4>{props.title}</h4></Card.Header>
                <Card.Body>
                    {props.innerComponent}
                </Card.Body>
            </Card>
        </div>
    )
}