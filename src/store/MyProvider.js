import React, { useState } from "react";

export const MyContext = React.createContext();

export default function MyProvider(props) {
    //PC: true
    //2 Player: False
    const [pcOr2Player, setPcOr2Player] = useState(null);

    const handlePcOr2PlayerChange = (e) => {
        setPcOr2Player(e.target.value);
      }

    return (
        <MyContext.Provider value={{
            pcOr2Player: pcOr2Player,
            handlePcOr2PlayerChange: handlePcOr2PlayerChange
        }}>
          {props.children}
        </MyContext.Provider>
      )
}