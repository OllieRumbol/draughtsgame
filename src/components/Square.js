import '../style/Square.css';
import Counter from './Counter'

export default function Square(props) {
    const state = props.state;
    const style = state !== 0 ? "square black" : "square";
    const height = props.y;
    const width = props.x

    function click() {
        console.log("Free");
        console.log("Height: " + height);
        console.log("Width: " + width);
    }

    return (
        <div className={style} onClick={click}>
            <Counter state={state} y={height} x={width}></Counter>
        </div>
    )

}