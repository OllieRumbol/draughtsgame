import '../style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Board from './Board';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DisplayCard from './shared/DisplayCard';
import Players from './Players';
import Pieces from './Pieces';
import PiecesTaken from './PiecesTaken';

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
      <Row>
        <Col lg="1"></Col>
        <Col lg="7">
          <Board></Board>
          <br></br>
        </Col>
        <Col lg="3">
          <DisplayCard title="Players" innerComponent={<Players></Players>}></DisplayCard>
          <br></br>
          <DisplayCard title="Pieces" innerComponent={<Pieces></Pieces>}></DisplayCard>
          <br></br>
          <DisplayCard title="Pieces Taken" innerComponent={<PiecesTaken></PiecesTaken>}></DisplayCard>
        </Col>
        <Col lg="1"></Col>
      </Row>
    </Container>
  );
}

export default App;
