import React, { useState } from "react";

export const MyContext = React.createContext();

export default function MyProvider(props) {
  //PC: true
  //2 Player: False
  const [pcOr2Player, setPcOr2Player] = useState(null);
  //
  //Easy: true
  //Hard: False
  const [easyOrHard, setEasyOrHard] = useState(null)

  const handlePcOr2PlayerChange = (e) => {
    setPcOr2Player(e.target.value);
    if(e.target.value === "false"){
      setEasyOrHard(null)
    }
  }

  const handleEasyOrHard = (e) => {
    setEasyOrHard(e.target.value);
  }

  return (
    <MyContext.Provider value={{
      pcOr2Player: pcOr2Player,
      handlePcOr2PlayerChange: handlePcOr2PlayerChange,
      easyOrHard: easyOrHard,
      handleEasyOrHard: handleEasyOrHard

    }}>
      {props.children}
    </MyContext.Provider>
  )
}