import React, { useState } from "react";

export const MyContext = React.createContext();

export default function MyProvider(props) {

  //PC: true
  //2 Player: False default
  const [pcOr2Player, setPcOr2Player] = useState(false);

  //Easy: 1 default
  //Medium: 2
  //Hard: 3
  const [difficulty, setDifficulty] = useState(1);

  //Player 1: true default
  //Player 2: false
  const [whoGoesFirst, setWhoGoesFirst] = useState(true);

  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePcOr2PlayerChange = (e) => {
    setPcOr2Player(e.target.value === "true");
    if (e.target.value === "false") {
      setDifficulty(1);
    }
  }

  const handleDifficulty = (e) => {
    setDifficulty(parseInt(e.target.value));
  }

  const handleWhoGoesFirstChange = (e) => {
    setWhoGoesFirst(e.target.value === "true");
  }

  return (
    <MyContext.Provider value={{
      pcOr2Player: pcOr2Player,
      handlePcOr2PlayerChange: handlePcOr2PlayerChange,
      difficulty: difficulty,
      handleDifficulty: handleDifficulty,
      whoGoesFirst: whoGoesFirst,
      setWhoGoesFirst: setWhoGoesFirst,
      handleWhoGoesFirstChange: handleWhoGoesFirstChange,
      displayErrorMessage : displayErrorMessage,
      setDisplayErrorMessage: setDisplayErrorMessage,
      errorMessage: errorMessage,
      setErrorMessage: setErrorMessage
    }}>
      {props.children}
    </MyContext.Provider>
  )
}