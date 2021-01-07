import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Counter.css';
import Row from 'react-bootstrap/Row';

export default function Pieces(props) {

    return (
        <div>
            <Row className="p-3">
                <div className="circle red center"></div>
                <h5 className="p-4">Single</h5>
            </Row>
            <br></br>
            <Row className="p-3">
            <div className="circle red center">K</div>
                <h5 className="p-4">King</h5>
            </Row>
        </div>
    )
}