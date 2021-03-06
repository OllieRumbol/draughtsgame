import React from "react";
import Row from 'react-bootstrap/Row';
import '../../style/Counter.css';

export default function Players(props) {
    return (
        <div>
            <Row className="p-3">
                <div className={"circle2 red center" + (props.turn === true ? " yellow" : "")}></div>
                <h3 className="p-4">Player 1</h3>
            </Row>
            <br></br>
            <Row className="p-3">
                <div className={"circle2 blue center" + (props.turn === false ? " yellow" : "")}></div>
                <h3 className="p-4">Player 2</h3>
            </Row>
        </div>
    )
}