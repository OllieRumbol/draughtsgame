import '../style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Board from './Board';

function App() {
  return (
    <Container fluid>
      <Jumbotron fluid>
        <Container>
          <h1 className="display-1 font-weight-bold">Draughts Game</h1>
          <h4>
            A draughts game built in react
          </h4>
        </Container>
      </Jumbotron>
      <Board></Board>
    </Container>
  );
}

export default App;
