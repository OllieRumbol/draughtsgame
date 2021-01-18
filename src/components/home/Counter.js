import '../../style/Counter.css';

export default function Counter(props) {
    const state = props.state;
    const height = props.y;
    const width = props.x
    const setCounterToMove = props.setCounterToMove;

    function click() {
        // console.log(props.state);
        // console.log("Height: " + height);
        // console.log("Width: " + width);
        setCounterToMove({ state: state, height: height, width: width });
    }

    if (props.state === 1) {
        return (
            <div data-testid="player1" className="circle red center" onClick={click}></div>
        )
    }
    else if (props.state === 2) {
        return (
            <div data-testid="player2" className="circle blue center" onClick={click}></div>
        )
    }
    else if (props.state === 3) {
        return (
            <div data-testid="player1king" className="circle red center" onClick={click}>K</div>
        )
    }
    else if (props.state === 4) {
        return (
            <div data-testid="player2king" className="circle blue center" onClick={click}>K</div>
        )
    }
    else {
        return (
            <div data-testid="empty"></div>
        )
    }
}