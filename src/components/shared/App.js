import React from 'react';
import Home from '../home/Home'
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
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
            <div>
              <Link to="/">
                <Button className="" variant="primary">Home</Button>
              </Link>
            </div>
          </Container>
        </Jumbotron>
        <main>
          <Switch>
            <Route path="/" exact component={() => <Home />} />
          </Switch>
        </main>
      </Container>
    </Router>
  );
}
