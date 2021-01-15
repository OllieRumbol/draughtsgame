import React from 'react';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

export default function ProjectCard(props) {
    let list = props.features.map((feature, index) => {
        return (<li key={index}>{feature}</li>)
    })

    return (
        <Card>
            <Card.Body>
                <Card.Header><h3>{props.title}</h3></Card.Header>
                <Card.Text>
                    <h5>Features</h5>
                    <ul>
                        {list}
                    </ul>
                </Card.Text>
                <Alert variant={props.colour}>{props.status}</Alert>
            </Card.Body>
        </Card>
    )
}