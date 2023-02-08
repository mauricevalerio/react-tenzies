import { useState, useEffect } from 'react'
import './App.css'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import { useStopwatch } from 'react-timer-hook'

function App() {
  const { seconds, minutes, start, pause, reset } = useStopwatch({autoStart: true})

  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [numRolls, setNumRolls] = useState(0)

  useEffect(() => {
    if (dice.every((die, i, array) => die.isHeld && die.value === array[0].value)) {
      setTenzies(true)
      pause()
    }
  }, [dice])

  function generateNewDie() {
    return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice 
  }

  function handleRollClick() {
    if (tenzies) {
      setDice(allNewDice())
      setTenzies(false)
      setNumRolls(0)
      reset()
    } else {
      setDice(oldDice => oldDice.map(die => die.isHeld ? die : generateNewDie()))
      setNumRolls(prevNumRolls => prevNumRolls + 1)
    }
    
  }

  function handleDieHeld(dieId) {
    setDice(oldDice => oldDice.map(die => die.id === dieId ? { ...die, isHeld: !die.isHeld } : die))
  }

  const dieElements = dice.map(die => {
    return <Die 
      key={die.id}
      id={die.id}
      value={die.value}
      isHeld={die.isHeld}
      handleDieHeld={handleDieHeld}
    />
  })

  return (
  <main>
    {tenzies && <Confetti />}
    <div className="details">
      <h1 className="title">Tenzies</h1>
      <div></div>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="details-inner">
        <p className="number-of-rolls">Number of Rolls: {numRolls}</p>
        <p className="timer">Timer: {`${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2, "0")}`}</p>
      </div>
    </div>
    <div className="dice-container">
      {dieElements}
    </div>
    <button className='roll-dice-btn' onClick={handleRollClick}>{tenzies ? "New Game" : "Roll"}</button>
  </main>

  )
}

export default App
