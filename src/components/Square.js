import Counter from './Counter';
import '../style/Square.css';

export default function Square(props) {
    const state = props.state;
    const style = state !== 0 ? "square black" : "square";
    const height = props.y;
    const width = props.x;
    const setSquareToMoveTo = props.setSquareToMoveTo;

    function click() {
        // console.log("Free");
        // console.log("Height: " + height);
        // console.log("Width: " + width);
        if (state === 5) {
            setSquareToMoveTo({ height: height, width: width });
        }
    }

    return (
        <div className={style} onClick={click}>
            <Counter state={state} y={height} x={width} setCounterToMove={props.setCounterToMove}></Counter>
        </div>
    )
}