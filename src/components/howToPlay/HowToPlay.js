import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../../style/HowToPlay.css";

export default function HowToPlay() {
  return (
    <Container fluid>
      <Row>
        <Col xl="1"></Col>
        <Col xl="10">
          <h1>How To Play Draughts</h1>
          <h2>Goal</h2>
          <p>
            The goal of the game of draughts is to take all of the opponent's
            pieces.
          </p>
          <h2>Summary</h2>
          <p>
            Draughts is a simple game with limited movement. There are two types
            of pieces in the game. Singles and kings, they can be differentiated
            with kings having a 'K' in the centre of the game piece. Singles can
            only move towards the opponents end of the board whereas kings can
            move both up and down the board. The game starts with only single
            pieces in play. Kings can be achieved by a player moving a piece to
            the far end of the board.
          </p>
          <p>
            Players take it in turn to move a single game piece. Pieces can only
            move in a diagonal direction by one square therefore not white
            square can be used. Only one piece can occupy a square. Players can
            take an opponents piece by jumping a character if the square
            diagonally behind the piece is available.
          </p>
          <h2>Rules</h2>
          <ul>
            <li>Player play the game in turns</li>
            <li>Players can only move one piece during a turn</li>
            <li>Kings are automatically created</li>
            <li>Piece can only move diagonally</li>
            <li>Singles only move towards to the opponent</li>
            <li>Kings can only move up and down</li>
            <li>
              Pieces can only take a character if the space diagonally behind it
              is free
            </li>
          </ul>
          <h2>How to play</h2>
          <p>
            A yellow ring will appear around the piece to identify whos turn it
            is in the players section.
          </p>
          <p>
            The pieces taken section will keep count of the pieces taken, once a
            player gets to 12 they lose.
          </p>
          <p>
            To move a piece click on the piece you want to move and the square
            you want to move it to. The game will do the rest and make you the
            move is valid.
          </p>
          <p>The game will automatically king piece.</p>
        </Col>
        <Col xl="1"></Col>
      </Row>
    </Container>
  );
}
