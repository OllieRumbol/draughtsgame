import React, { useState, useEffect } from "react";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DisplayCard from './shared/DisplayCard';
import Board from './Board';
import Players from './Players';
import Pieces from './Pieces';
import PiecesTaken from './PiecesTaken';
import ResultModal from './ResultModal';
import '../style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [player1Counter, setPlayer1Counter] = useState(0);
  const [player2Counter, setPlayer2Counter] = useState(0);

  const [showResultModal, setShowResultModal] = useState(false);
  const [resultsModalTitle, setResultsModalTitle] = useState("");

  //Player 1 - true
  //Player 2 - false
  const [turn, setTurn] = useState(true)

  useEffect(() => {
    // console.log(player1Counter);
    // console.log(player2Counter);
    if (player1Counter === 12) {
      setResultsModalTitle("Player 2 wins");
      setShowResultModal(true);
    }
    else if (player2Counter === 12) {
      setResultsModalTitle("Player 1 wins");
      setShowResultModal(true);
    }

  }, [player1Counter, player2Counter])

  return (
    <Container fluid>
      <Jumbotron fluid>
        <Container>
          <h1 className="display-1 font-weight-bold">Draughts Game</h1>
          <h4>
            A draughts game built in react js
          </h4>
        </Container>
      </Jumbotron>
      <Row>
        <ResultModal show={showResultModal} update={setShowResultModal} title={resultsModalTitle}></ResultModal>
        <Col xl="1"></Col>
        <Col xl="7">
          <Board player1Counter={player1Counter} setPlayer1Counter={setPlayer1Counter} player2Counter={player2Counter} setPlayer2Counter={setPlayer2Counter} turn={turn} setTurn={setTurn}></Board>
          <br></br>
        </Col>
        <Col xl="3">
          <DisplayCard title="Players" innerComponent={<Players turn={turn}></Players>}></DisplayCard>
          <br></br>
          <DisplayCard title="Pieces" innerComponent={<Pieces></Pieces>}></DisplayCard>
          <br></br>
          <DisplayCard title="Pieces Taken" innerComponent={<PiecesTaken player1Counter={player1Counter} player2Counter={player2Counter}></PiecesTaken>}></DisplayCard>
          <br></br>
        </Col>
        <Col xl="1"></Col>
      </Row>
    </Container>
  );
}
