import '../style/Square.css';
import Counter from './Counter'

export default function Square(props) {
    const isBlack = props.isBlack;
    const style = isBlack ? "square black" : "square";
    const showCounter = props.showCounter;

    return (
        <div class={style}>
            
        </div>
    )

}