import '../style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Board from './Board';

function App() {
  return (
    <div className="container fluid">
      <Jumbotron fluid>
        <Container>
          <h1>Draughts Game</h1>
          <p>
            A draughts game built in react
          </p>
        </Container>
      </Jumbotron>
      <Board></Board>
    </div>
  );
}

export default App;
