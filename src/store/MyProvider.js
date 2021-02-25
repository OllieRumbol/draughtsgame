import React, { useState } from "react";

export const MyContext = React.createContext();

export default function MyProvider(props) {
  //PC: true
  //2 Player: False
  const [pcOr2Player, setPcOr2Player] = useState(null);

  //Not set: 0
  //Easy: 1
  //Medium: 2
  //Hard: 3
  const [difficulty, setDifficulty] = useState("0")

  const handlePcOr2PlayerChange = (e) => {
    setPcOr2Player(e.target.value);
    if (e.target.value === "false") {
      setDifficulty(0)
    }
  }

  const handleDifficulty = (e) => {
    setDifficulty(e.target.value);
  }

  return (
    <MyContext.Provider value={{
      pcOr2Player: pcOr2Player,
      handlePcOr2PlayerChange: handlePcOr2PlayerChange,
      difficulty: difficulty,
      handleDifficulty: handleDifficulty

    }}>
      {props.children}
    </MyContext.Provider>
  )
}