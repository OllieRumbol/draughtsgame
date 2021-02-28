import Counter from './Counter';
import '../../style/Square.css';

export default function Square(props) {
    const state = props.state;
    const style = state === 6 ? "square tip" : state !== 0 ? "square black" : "square";
    const height = props.y;
    const width = props.x;
    const setSquareToMoveTo = props.setSquareToMoveTo;

    let click = () => {
        if (state === 5 || state === 6) {
            setSquareToMoveTo({ height: height, width: width });
        }
    }

    return (
        <div className={style} onClick={click}>
            <Counter state={state} y={height} x={width} setCounterToMove={props.setCounterToMove}></Counter>
        </div>
    )
}