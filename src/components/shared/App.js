import React, { useState } from 'react';
import Home from '../home/Home';
import HowToPlay from '../howToPlay/HowToPlay';
import About from '../about/About';
import GameSettings from '../home/GameSettings';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import MyProvider from '../../store/MyProvider';
import '../../style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [hasSetGameSettings, setHasSetGameSettings] = useState(false);

  return (
    <MyProvider>
      <Router>
        <Container fluid>
          <Jumbotron fluid>
            <Container>
              <h1 data-testid="title" className="display-1 font-weight-bold">Draughts Game</h1>
              <h4>A draughts game built in react js</h4>
              <hr className="my-4"></hr>
              <ButtonToolbar>
                <Link to="/">
                  <ButtonGroup className="mr-2">
                    <Button data-testid="link" variant="primary">Home</Button>
                  </ButtonGroup>
                </Link>
                <Link to="/howtoplay">
                  <ButtonGroup className="mr-2">
                    <Button data-testid="link" variant="primary">How to play</Button>
                  </ButtonGroup>
                </Link>
                <Link to="/about">
                  <ButtonGroup className="mr-2">
                    <Button data-testid="link" variant="primary">About</Button>
                  </ButtonGroup>
                </Link>
              </ButtonToolbar>
            </Container>
          </Jumbotron>
          <main>
            <Switch>
              <Route path="/" exact component={() => {
                if (hasSetGameSettings) {
                  return <Home />
                }
                else {
                  return <GameSettings setHasSetGameSettings={setHasSetGameSettings} />
                }
              }} />
              <Route path="/howtoplay" exact component={() => <HowToPlay />} />
              <Route path="/about" exact component={() => <About />} />
            </Switch>
          </main>
        </Container>
      </Router>
    </MyProvider>
  );
}
