import React from "react";
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Counter.css';

export default function Players(props) {

    return (
        <div>
            <Row className="p-3">
                <div className="circle red center yellowBorder"></div>
                <h3 className="p-4">Player 1</h3>
            </Row>
            <br></br>
            <Row className="p-3">
                <div className="circle blue center"></div>
                <h3 className="p-4">Player 2</h3>
            </Row>
        </div>
    )
}