import React, { useState, useEffect, useContext } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DisplayCard from '../shared/DisplayCard';
import Board from './Board';
import PcBoard from './PcBoard';
import Players from '../home/Players';
import Pieces from '../home/Pieces';
import PiecesTaken from '../home/PiecesTaken';
import ResultModal from '../home/ResultModal';
import AlertBox from '../shared/AlertBox';
import { MyContext } from '../../store/MyProvider';

export default function Home(props) {
    const [player1Counter, setPlayer1Counter] = useState(0);
    const [player2Counter, setPlayer2Counter] = useState(0);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultsModalTitle, setResultsModalTitle] = useState("");
    const [resultsModalMessage, setResultsModalMessage] = useState("");
    const context = useContext(MyContext);

    //Player 1 - true
    //Player 2 - false
    const [turn, setTurn] = useState(context.whoGoesFirst);

    useEffect(() => {
        if (player1Counter === 12) {
            setResultsModalTitle("Player 2 wins");
            setResultsModalMessage("Well done on finishing the game of draughts. I hope you had fun playing.");
            setShowResultModal(true);
        }
        else if (player2Counter === 12) {
            setResultsModalTitle("Player 1 wins");
            setResultsModalMessage("Well done on finishing the game of draughts. I hope you had fun playing.");
            setShowResultModal(true);
        }

    }, [player1Counter, player2Counter])

    return (
        <Row>
            { context.displayErrorMessage && <AlertBox title='Error connecting to external resources' end='Please check you connection. Further problems please contact support'/> }
            <ResultModal show={showResultModal} update={setShowResultModal} title={resultsModalTitle} message={resultsModalMessage}></ResultModal>
            <Col xl="1"></Col>
            <Col xl="7">
                {
                    context.pcOr2Player === true ?
                        <PcBoard player1Counter={player1Counter} setPlayer1Counter={setPlayer1Counter} player2Counter={player2Counter} setPlayer2Counter={setPlayer2Counter} turn={turn} setTurn={setTurn} setResultsModalTitle={setResultsModalTitle} setShowResultModal={setShowResultModal} setResultsModalMessage={setResultsModalMessage} /> :
                        <Board player1Counter={player1Counter} setPlayer1Counter={setPlayer1Counter} player2Counter={player2Counter} setPlayer2Counter={setPlayer2Counter} turn={turn} setTurn={setTurn} setResultsModalTitle={setResultsModalTitle} setShowResultModal={setShowResultModal} setResultsModalMessage={setResultsModalMessage} />
                }
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
