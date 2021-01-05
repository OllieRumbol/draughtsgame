import '../style/Square.css';
import Counter from './Counter'

export default function Square(props) {
    const state = props.state;
    const style = state !== 0 ? "square black" : "square";

    function click() {
        console.log("Free")
    }

    return (
        <div className={style} onClick={click}>
            <Counter state={state}></Counter>
        </div>
    )

}