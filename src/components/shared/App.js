import React from 'react';
import Home from '../home/Home'
import HowToPlay from '../howToPlay/HowToPlay'
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import '../../style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <Router>
      <Container fluid>
        <Jumbotron fluid>
          <Container>
            <h1 className="display-1 font-weight-bold">Draughts Game</h1>
            <h4>
              A draughts game built in react js
          </h4>
            <hr class="my-4"></hr>
            <ButtonToolbar>
              <Link to="/">
                <ButtonGroup className="mr-2" aria-label="First group">
                  <Button className="" variant="primary">Home</Button>
                </ButtonGroup>
              </Link>
              <Link to="/howtoplay">
                <ButtonGroup className="mr-2" aria-label="First group">
                  <Button className="" variant="primary">How to play</Button>
                </ButtonGroup>
              </Link>
            </ButtonToolbar>
          </Container>
        </Jumbotron>
        <main>
          <Switch>
            <Route path="/" exact component={() => <Home />} />
            <Route path="/howtoplay" exact component={() => <HowToPlay />} />
          </Switch>
        </main>
      </Container>
    </Router>
  );
}
