import '../style/Counter.css';

export default function Counter(props) {
    function click() {
        console.log(props.state)
    }

    if (props.state === 1) {
        return (
            <div className="circle red center" onClick={click}></div>
        )
    }
    else if (props.state === 2) {
        return (
            <div className="circle blue center" onClick={click}></div>
        )
    }
    else if (props.state === 3) {
        return (
            <div className="circle red center" onClick={click}>K</div>
        )
    }
    else if (props.state === 4) {
        return (
            <div className="circle blue center" onClick={click}>K</div>
        )
    }
    else {
        return (
            <div></div>
        )
    }

}