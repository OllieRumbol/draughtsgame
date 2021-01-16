import React from 'react';
import ProjectCard from '../shared/ProjectCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function About() {

    return (
        <Container fluid>
            <Row>
                <Col xl="1"></Col>
                <Col xl="10">
                    <div>
                        <h1>About</h1>
                        <p>This game was made in loving memory of my grandad, Ernest Rumbol. My grandad taught me this game many years ago. Over the years we have played thousands of games together. As I got older and understood the game more, the more games I won. However, grandad still loved playing even when he wiped the board clean because he lost the game after the first move. We played with many different rule sets, his favourite was forcing users to take a piece if available, I thought the game was more tactical if you didn't. I hope that people play this game with as much fun as we did.</p>
                    </div>
                    <div>
                        <h2>Technical information</h2>
                        <p>Below lets the tools used to build this web application. You can find the source code at the <a href="https://github.com/OllieRumbol/draughtsgame">Git Repo</a></p>
                        <ul>
                            <li><a href="https://reactjs.org/">React with hooks</a></li>
                            <li><a href="https://react-bootstrap.github.io/">React bootstrap</a></li>
                            <li><a href="https://reactrouter.com/web/guides/quick-start">React router</a></li>
                            <li><a href="https://pages.github.com/">Git pages (for hosting)</a></li>
                            <li><a href="https://testing-library.com/docs/react-testing-library/intro/">React testing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2>Project Plan</h2>
                        <div class="card-columns">
                            <ProjectCard title="Draughts Game Phase 1 Epic" colour="success" features={["React Project Setup", "Board setup", "Counter setup", "UI design", "Move counter", "Take counter", "Game end", "King me", "Turns"]} status="Complete"></ProjectCard>
                            <ProjectCard title="React Router Epic" colour="success" features={["Setup", "Refactor", "Production changes"]} status="Complete"></ProjectCard>
                            <ProjectCard title="Pages Epic" colour="success" features={["How to play", "About"]} status="Complete"></ProjectCard>
                            <ProjectCard title="CI/CD and Unit Tests" colour="warning" features={["Create basic pipeline in yaml", "Setup unit tests"]} status="Not started"></ProjectCard>
                            <ProjectCard title="Player tips" colour="danger" features={["Add tips section to the UI"]} status="Not started"></ProjectCard>
                            <ProjectCard title="Automated 2nd Player" colour="danger" features={[]} status="Not started"></ProjectCard>
                            <ProjectCard title="Draughts Game Phase 2" colour="danger" features={["Game setup page", "Double jumps", "Game over - no one can move", "Restart", "Undo", "Better CSS"]} status="Not started"></ProjectCard>
                            <ProjectCard title="Support" colour="danger" features={[]} status="Not started"></ProjectCard>
                        </div>
                    </div>
                    <br></br>
                </Col>
                <Col xl="1"></Col>
            </Row>
        </Container>
    )
}