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
                        <div className="card-columns">
                            <ProjectCard title="Draughts Game Phase 1 Epic" colour="success" features={["React Project Setup ✔", "Board setup ✔", "Counter setup ✔", "UI design ✔", "Move counter ✔", "Take counter ✔", "Game end ✔", "King me ✔", "Turns ✔"]} status="Complete"></ProjectCard>
                            <ProjectCard title="React Router Epic" colour="success" features={["Setup ✔", "Refactor ✔", "Production changes ✔"]} status="Complete"></ProjectCard>
                            <ProjectCard title="Pages Epic" colour="success" features={["How to play ✔", "About ✔"]} status="Complete"></ProjectCard>
                            <ProjectCard title="CI/CD and Unit Tests Epic" colour="warning" features={["Create basic pipeline in yaml ✔", "Setup testing environment and add to pipeline ✔", "Unit test components", "Unit test web app logic"]} status="In progress"></ProjectCard>
                            <ProjectCard title="Player tips Epic" colour="success" features={["UI changes to display user tips ✔", "Logic to work out where a player can move ✔", "Logic to work out where a player can take another counter ✔"]} status="Complete"></ProjectCard>
                            <ProjectCard title="Draughts Game Phase 2 Epic" colour="success" features={["Double jumps ✔", "Game over - no one can move ✔", "Restart ✔", "Undo ✔", "CSS for selecting a counter ✔"]} status="Complete"></ProjectCard>
                            <ProjectCard title="Automated 2nd Player Phase 1 Epic" colour="success" features={["Game setup page, 2 player or VS PC. Along with other settings ✔", "Web app logic for PC to decide next move (random logic) ✔", "Render PC move on page ✔"]} status="Complete"></ProjectCard>
                            <ProjectCard title="Automated 2nd Player Phase 2 Epic" colour="success" features={["Use some kind of genetic search algorithm to find best move ✔", "Add new setting to the game setting page for other opponent type ✔", "Use new setting in the frontend ✔"]} status="Complete"></ProjectCard>
                            <ProjectCard title="Mobile responsive UI Epic" colour="success" features={["Game setup page is mobile responsive ✔", "Game board page is mobile responsive ✔", "How to play page is mobile responsive ✔", "About page is mobile responsive ✔"]} status="Complete"></ProjectCard>
                            <ProjectCard title="Draughts Game Phase 3 Epic" colour="warning" features={["Setting to decide who goes first", "Setting for if singles can take kings", "Update how to play", "Give up button ✔", "Go back to player settings", "Display mode when against PC ✔", "Error message for game settings"]} status="In progress"></ProjectCard>
                            <ProjectCard title="Automated 2nd Player Phase 3 Epic" colour="warning" features={["Refactor logic from V1, V2 and V3 ✔", "Improve algorithm with alpha beta pruning", "Experiment with different depths ✔", "Improve evaluation function ✔", "Add new setting for new mode and use in frontend ✔"]} status="In progress"></ProjectCard>
                            <ProjectCard title="Tutorial Epic" colour="danger" features={[]} status="Not started"></ProjectCard>
                            <ProjectCard title="Support Epic" colour="danger" features={["Game tips results in no possible moves ✔ (26/1/21)", "Player tips not showing all possible moves for a king ✔ (31/1/21)", "Player tips infinite loop ✔ (1/2/21)", "Double jumps and undo ✔ (2/2/21)", "Undo is hiding player tips when no moves have been made ✔ (6/2/21)", "Change board layout, currently back to front ✔ (16/2/21)", "No more moves check is too late ✔ (18/2/21)", "Clicking off modal closes modal ✔ (26/2/21)"]} status="Paused due to no further work"></ProjectCard>
                            <ProjectCard title="Technical Debt Epic Epic" colour="danger" features={["Refactor main use effect logic ✔ (28/1/21)", "Refactor player tips logic ✔ (28/2/21)", "Replace JS alert with bootstrap modal for invalid more ✔ (27/2/21)"]} status="Paused due to no further work"></ProjectCard>
                        </div>
                    </div>
                    <br></br>
                </Col>
                <Col xl="1"></Col>
            </Row>
        </Container>
    )
}