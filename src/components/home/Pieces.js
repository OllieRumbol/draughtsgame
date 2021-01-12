import React from "react";
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/Counter.css';

export default function Pieces(props) {
    return (
        <div>
            <Row className="p-3">
                <div className="circle red center"></div>
                <h3 className="p-4">Single</h3>
            </Row>
            <br></br>
            <Row className="p-3">
                <div className="circle red center">K</div>
                <h3 className="p-4">King</h3>
            </Row>
        </div>
    )
}