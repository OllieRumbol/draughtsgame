import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Counter.css';
import Row from 'react-bootstrap/Row';

export default function PiecesTaken(props) {

    return (
        <div>
            <Row className="p-3">
                <div className="circle red center"></div>
            </Row>
            <br></br>
            <Row className="p-3">
            <div className="circle blue center"></div>
            </Row>
        </div>
    )
}