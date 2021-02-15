import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MyContext } from '../../store/MyProvider';
import '../../style/GameSettings.css'

export default function GameSettings(props) {
    const context = useContext(MyContext);

    const handleSubmit = () => {
        if (context.pcOr2Player != null) {
            if ((context.pcOr2Player === "true" && context.easyOrHard !== null) || context.pcOr2Player === "false") {
                props.setHasSetGameSettings(true);
            }
        }
    }

    return (
        <Container fluid>
            <Row>
                <Col xl="1"></Col>
                <Col xl="10">
                    <div>
                        <h1>Game settings</h1>
                    </div>
                    <div>
                        <h2 className="pb-2">Opponent</h2>
                        <div>
                            <label className="radioContainer">
                                <div className="topper">PC</div>
                                <input type="radio" name="radio" value={true} onChange={context.handlePcOr2PlayerChange} />
                                <span className="checkMark"></span>
                            </label>
                        </div>
                        <div>
                            <label className="radioContainer">
                                <div className="topper">2 Player</div>
                                <input type="radio" name="radio" value={false} onChange={context.handlePcOr2PlayerChange} />
                                <span className="checkMark"></span>
                            </label>
                        </div>
                        {
                            context.pcOr2Player === "true" &&
                            <div>
                                <h2 className="pb-2">Difficulty</h2>
                                <div>
                                    <label className="radioContainer">
                                        <div className="topper">Easy</div>
                                        <input type="radio" name="radio2" value={true} onChange={context.handleEasyOrHard} />
                                        <span className="checkMark"></span>
                                    </label>
                                </div>
                                <div>
                                    <label className="radioContainer">
                                        <div className="topper">Hard</div>
                                        <input type="radio" name="radio2" value={false} onChange={context.handleEasyOrHard} />
                                        <span className="checkMark"></span>
                                    </label>
                                </div>
                            </div>
                        }
                    </div>
                    <div>
                        <Button variant="success" onClick={handleSubmit}>Submit</Button>
                    </div>
                </Col>
                <Col xl="1"></Col>
            </Row>
        </Container>
    )
}

