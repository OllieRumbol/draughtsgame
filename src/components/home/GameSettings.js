import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { MyContext } from "../../store/MyProvider";
import "../../style/GameSettings.css";

export default function GameSettings(props) {
  const context = useContext(MyContext);

  const handleSubmit = () => {
    props.setHasSetGameSettings(true);
  };

  return (
    <Container fluid>
      <Row>
        <Col xl="1"></Col>
        <Col xl="10">
          <h1>Game settings</h1>

          <h2 className="pb-2">Opponent</h2>
          <label className="radioContainer">
            <div className="topper">2 Player</div>
            <input
              type="radio"
              name="radio"
              value="false"
              onChange={context.handlePcOr2PlayerChange}
              checked={context.pcOr2Player === false}
            />
            <span className="checkMark"></span>
          </label>
          <label className="radioContainer">
            <div className="topper">PC</div>
            <input
              type="radio"
              name="radio"
              value="true"
              onChange={context.handlePcOr2PlayerChange}
              checked={context.pcOr2Player === true}
            />
            <span className="checkMark"></span>
          </label>

          {context.pcOr2Player === true && (
            <div>
              <h2 className="pb-2">Difficulty</h2>
              <label className="radioContainer">
                <div className="topper">Easy</div>
                <input
                  type="radio"
                  name="radio2"
                  value="1"
                  onChange={context.handleDifficulty}
                  checked={context.difficulty === 1}
                />
                <span className="checkMark"></span>
              </label>
              <label className="radioContainer">
                <div className="topper">Medium</div>
                <input
                  type="radio"
                  name="radio2"
                  value="2"
                  onChange={context.handleDifficulty}
                  checked={context.difficulty === 2}
                />
                <span className="checkMark"></span>
              </label>
              <label className="radioContainer">
                <div className="topper">Hard</div>
                <input
                  type="radio"
                  name="radio2"
                  value="3"
                  onChange={context.handleDifficulty}
                  checked={context.difficulty === 3}
                />
                <span className="checkMark"></span>
              </label>
            </div>
          )}

          <h2 className="pb-2">Who goes first</h2>
          <label className="radioContainer">
            <div className="topper">Player 1</div>
            <input
              type="radio"
              name="radio3"
              value="true"
              onChange={context.handleWhoGoesFirstChange}
              checked={context.whoGoesFirst === true}
            />
            <span className="checkMark"></span>
          </label>
          <label className="radioContainer">
            <div className="topper">Player 2</div>
            <input
              type="radio"
              name="radio3"
              value="false"
              onChange={context.handleWhoGoesFirstChange}
              checked={context.whoGoesFirst === false}
            />
            <span className="checkMark"></span>
          </label>

          <div>
            <Button variant="success" onClick={handleSubmit} size="lg">
              Submit
            </Button>
          </div>
        </Col>
        <Col xl="1"></Col>
      </Row>
      <br></br>
    </Container>
  );
}
