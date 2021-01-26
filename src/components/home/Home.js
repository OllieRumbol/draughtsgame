import React, { useState, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DisplayCard from '../shared/DisplayCard';
import Board from './Board';
import Players from '../home/Players';
import Pieces from '../home/Pieces';
import PiecesTaken from '../home/PiecesTaken';
import ResultModal from '../home/ResultModal';

export default function Home(props) {
    const [player1Counter, setPlayer1Counter] = useState(0);
    const [player2Counter, setPlayer2Counter] = useState(0);

    const [showResultModal, setShowResultModal] = useState(false);
    const [resultsModalTitle, setResultsModalTitle] = useState("");

    //Player 1 - true
    //Player 2 - false
    const [turn, setTurn] = useState(true)

    useEffect(() => {
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
    )
}
