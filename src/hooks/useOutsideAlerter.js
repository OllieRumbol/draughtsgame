import { useState, useRef, useEffect } from "react";

export { useOutsideAlerter }

function useOutsideAlerter() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    function handleClickOutside(event) {
        //Only set visible as true if you have clicked the counter else false
        if (ref.current && ref.current.contains(event.target)) {
            setVisible(true);
        }
        else{
            setVisible(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside, true);
        return () => {
            //Tidy up
            document.removeEventListener("mousedown", handleClickOutside, true);
        };
    }, [ref]);

    return { visible, ref }
}