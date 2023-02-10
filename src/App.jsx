import { useState, useEffect } from 'react'
import './App.css'
import Die from './Die'
import Leaderboard from './Leaderboard'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import { useStopwatch } from 'react-timer-hook'

function App() {
  const { seconds, minutes, start, pause, reset } = useStopwatch({autoStart: true})

  const [dice, setDice] = useState(allNewDice()) //tracks dice
  const [tenzies, setTenzies] = useState(false) //tracks if player already won
  const [numRolls, setNumRolls] = useState(0) //tracks number of rolls
  const [leaderboard, setLeaderboard] = useState(() => JSON.parse(localStorage.getItem("leaderboard")) || [])
  const [toggleLeaderboardModal, setToggleLeaderboardModal] = useState(false) //tracks if leaderboard modal is open

  function sortNumRolls() {
    setLeaderboard(prevLeaderboard => prevLeaderboard.sort((a, b) => a.numRolls - b.numRolls))
  }

  function sortTime() {
    setLeaderboard(prevLeaderboard => prevLeaderboard.sort((a, b) => a.totalTimeSeconds - b.totalTimeSeconds))
  }

  function updateLeaderboard() {
    const leaderboardItem = {
      id: nanoid(),
      numRolls: numRolls,
      minutes: minutes,
      seconds: seconds,
      totalTimeSeconds: minutes * 60 + seconds
      }
    setLeaderboard(prevLeaderboard => [
      ...prevLeaderboard,
      leaderboardItem
      ]
    )
    sortTime()
  }

  useEffect(() => {
    localStorage.setItem("leaderboard",JSON.stringify(leaderboard))
  }, [leaderboard])

  useEffect(() => {
    if (dice.every((die, i, array) => die.isHeld && die.value === array[0].value)) {
      setTenzies(true)
      pause()

      updateLeaderboard()
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

  function handleToggleLeaderBoardModal() {
    setToggleLeaderboardModal(prevState => !prevState)
  }

  return (
  <main>
    {tenzies && <Confetti />}
    <Leaderboard
    leaderboard={leaderboard}
    toggleLeaderboardModal={toggleLeaderboardModal}
    handleToggleLeaderBoardModal={handleToggleLeaderBoardModal}
    sortNumRolls={sortNumRolls}
    sortTime={sortTime}
    />
    <div className="details">
      <h1 className="title">Tenzies</h1>
      <button onClick={handleToggleLeaderBoardModal} className='show-leaderboard-btn'>Leaderboards</button>
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
