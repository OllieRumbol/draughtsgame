import React, { useState } from "react";
import Home from "../home/Home";
import HowToPlay from "../howToPlay/HowToPlay";
import About from "../about/About";
import GameSettings from "../home/GameSettings";
import { HashRouter as Router, Route, Switch, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import MyProvider from "../../store/MyProvider";
import "../../style/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [hasSetGameSettings, setHasSetGameSettings] = useState(false);

  return (
    <MyProvider>
      <Router>
        <Container fluid>
          <div className="d-flex justify-content-center">
            <h1 data-testid="title" className="font-weight-bold title">
              Draughts Game
            </h1>
          </div>
          <br></br>
          <div className="d-flex justify-content-center">
            <h4>A draughts game built using React and Azure functions</h4>
          </div>
          <hr className="my-4"></hr>
          <ButtonToolbar className="d-flex justify-content-center">
            <Link to="/">
              <ButtonGroup className="me-3 mb-3">
                <Button data-testid="link" variant="primary" size="lg">
                  Home
                </Button>
              </ButtonGroup>
            </Link>
            <Link to="/howtoplay">
              <ButtonGroup className="me-3 mb-3">
                <Button data-testid="link" variant="primary" size="lg">
                  How to play
                </Button>
              </ButtonGroup>
            </Link>
            <Link to="/about">
              <ButtonGroup className="me-3 mb-3">
                <Button data-testid="link" variant="primary" size="lg">
                  About
                </Button>
              </ButtonGroup>
            </Link>
          </ButtonToolbar>

          <main>
            <Switch>
              <Route
                path="/"
                exact
                component={() => {
                  if (hasSetGameSettings) {
                    return <Home />;
                  } else {
                    return (
                      <GameSettings
                        setHasSetGameSettings={setHasSetGameSettings}
                      />
                    );
                  }
                }}
              />
              <Route path="/howtoplay" exact component={() => <HowToPlay />} />
              <Route path="/about" exact component={() => <About />} />
            </Switch>
          </main>
        </Container>
      </Router>
    </MyProvider>
  );
}
