import { useOutsideAlerter } from '../../hooks/useOutsideAlerter';
import '../../style/Counter.css';

export default function Counter(props) {
    const { visible, ref } = useOutsideAlerter();

    let player1Css = visible ? "circle red center yellow" : "circle red center";
    let player2Css = visible ? "circle blue center yellow" : "circle blue center";

    const state = props.state;
    const height = props.y;
    const width = props.x
    const setCounterToMove = props.setCounterToMove;

    let click = () => {
        setCounterToMove({ state: state, height: height, width: width });
    }

    if (props.state === 1) {
        return (
            <div ref={ref} className={player1Css} onClick={click}></div>
        )
    }
    else if (props.state === 2) {
        return (
            <div ref={ref} className={player2Css} onClick={click}></div>
        )
    }
    else if (props.state === 3) {
        return (
            <div ref={ref} className={player1Css} onClick={click}>K</div>
        )
    }
    else if (props.state === 4) {
        return (
            <div ref={ref} className={player2Css} onClick={click}>K</div>
        )
    }
    else {
        return (
            <div></div>
        )
    }
}