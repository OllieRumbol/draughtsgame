import React from "react";
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/Counter.css';

export default function PiecesTaken(props) {
    return (
        <div>
            <Row className="p-3">
                <div className="circle red center"></div>
                <h3 className="m-0 p-4">{props.player1Counter}</h3>
            </Row>
            <br></br>
            <Row className="p-3">
                <div className="circle blue center"></div>
                <h3 className="p-4">{props.player2Counter}</h3>
            </Row>
        </div>
    )
}