import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../../style/HowToPlay.css";

export default function HowToPlay() {
  return (
    <Row>
      <Col xl="1"></Col>
      <Col xl="10">
        <h1>
          <span class="badge bg-dark">Welcome</span>
        </h1>
        <p>
          My name is Ollie and I'm a developer. Welcome to my simple draughts
          game, I'm adding features all the time. Currently, in this game there
          are 2 modes, 2-player mode and VS the computer mode with multiple
          levels of difficulty. The game has a variety of features to help the
          players. such as showing you status about the game and all potential
          moves of a given player.
        </p>
        <h2>
          <span class="badge bg-dark">Goals</span>
        </h2>
        <p>
          The goal of the game of draughts is to take all of the opponent's
          pieces or block your opponent from moving.
        </p>
        <h2>
          <span class="badge bg-dark">Game Summary</span>
        </h2>
        <p>
          Draughts is a simple game with limited movement. There are two types
          of pieces in the game. Singles and kings, they can be differentiated
          with kings having a 'K' in the centre of the game piece. Singles can
          only move towards the opponents end of the board whereas kings can
          move both up and down the board. The game starts with only single
          pieces in play. Kings can be achieved by a player moving a piece to
          the far end of the board where the game we automatically turn you
          single into a king.
        </p>
        <p>
          Players take it in turn to move a single game piece. Pieces can only
          move in a diagonal direction by one square therefore no white squares
          can be used. Only one piece can occupy a square. Players can take an
          opponents piece by jumping a character if the square diagonally behind
          the piece is available. Players can jump multiple times if there is a
          space available after taking your opponents piece.
        </p>
        <h2>
          <span class="badge bg-dark">Rules</span>
        </h2>
        <ul>
          <li>Players can only move there own pieces</li>
          <li>Player play the game in turns</li>
          <li>Players can only move one piece during a turn</li>
          <li>Kings are automatically created</li>
          <li>Piece can only move diagonally</li>
          <li>Singles only move towards to the opponent</li>
          <li>Kings can only move up and down the board</li>
          <li>
            Pieces can only take a character if the space diagonally behind it
            is free, or both directions if the piece is a king.
          </li>
        </ul>
        <h2>
          <span class="badge bg-dark">How to play</span>
        </h2>
        <p>
          Useful stats cards will appear next to or below the draughts board.
          These cards identify whos go it is, game pieces and how many pieces
          have been taken.
        </p>
        <p>
          Once a player has setup a game using game settings, a player can
          select one of 12 pieces on the board to move. When a piece is selected
          a yellow ring will appear around the piece. The player can then click
          on a square they want to move to or jump too. If a player takes an
          opponents piece it will automaiically be removed.
        </p>
        <p>
          Players take it in turn to move pieces. Kings are automatically added
          once a player's piece has reached the oppoents end of the board. Kings
          can move in both directions inlike singles. At any time players can
          click the 'Show player tips' button. This button highlights all the
          available squares a player can move too.
        </p>
        <p>
          The game is over when a player has lost all the pices or can't move.
          Therefore, the other player wins
        </p>
      </Col>
      <Col xl="1"></Col>
    </Row>
  );
}
