import { useState, useEffect } from 'react'
import './App.css'
import Die from './Die'
import Leaderboard from './Leaderboard'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import { useStopwatch } from 'react-timer-hook'

function App() {
  const { seconds, minutes, isRunning, start, pause, reset } = useStopwatch({autoStart: true})

  const [dice, setDice] = useState(allNewDice()) //tracks dice
  const [tenzies, setTenzies] = useState(false) //tracks if player already won
  const [numRolls, setNumRolls] = useState(0) //tracks number of rolls
  const [randomUsername, setRandomUsername] = useState(() => 'Guest' + Math.floor(Math.random() * 10000)) //generates random username
  const [toggleLeaderboardModal, setToggleLeaderboardModal] = useState(false) //tracks if leaderboard modal is open
  const [sortLeaderboard, setSortLeaderboard] = useState(false) //placeholder to re-render leaderboards in case sort happens
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  function detectDimension() {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  useEffect(() => {
      window.addEventListener("resize", detectDimension)
      return () => {
        window.removeEventListener("resize", detectDimension)
      }
  }, [windowDimension])

  useEffect(() => {
    if (dice.every((die, i, array) => die.isHeld && die.value === array[0].value)) {
      setTenzies(true)
      pause()
    }
  }, [dice])

  //game has not ended and leaderboard is open
  //game has ended and leaderboard is opened and closed
  //game has ended and isRunning is false
  useEffect(() => {
    if(toggleLeaderboardModal || tenzies && !isRunning) {
      pause()
    } else {
      start()
    }
  },[toggleLeaderboardModal])

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
      setRandomUsername('Guest' + Math.floor(Math.random() * 10000))
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
      tenzies={tenzies}
      isRunning={isRunning}
      toggleLeaderboardModal={toggleLeaderboardModal}
    />
  })

  function handleToggleLeaderboardModal() {
    setToggleLeaderboardModal(prevModalState => !prevModalState)    
  }

  return (
  <>
    {tenzies && <Confetti width={windowDimension.width} height={windowDimension.height}/>}

    <main>

      <Leaderboard
      tenzies={tenzies}
      username={randomUsername}
      numRolls={numRolls}
      minutes={minutes}
      seconds={seconds}
      toggleLeaderboardModal={toggleLeaderboardModal}
      handleToggleLeaderboardModal={handleToggleLeaderboardModal}
      setSortLeaderboard={setSortLeaderboard}
      />

      <div className="details">

        <h1 className="title">🎲Tenzies🎲</h1>

        <div className="username-and-leaderboards">
          <button onClick={handleToggleLeaderboardModal} className='btn btn-green'>Leaderboards</button>
          <h4 className="username">Welcome! <span>{randomUsername}</span></h4>
        </div>

        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        
        <div className="numrolls-and-timer">
          <p className="number-of-rolls">Number of Rolls: {numRolls}</p>
          <p className="timer">Timer: {`${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2, "0")}`}</p>
        </div>

      </div>

      <div className="dice-container">

        {dieElements}

      </div>

      <div className="btn-container">

        <button 
          className='btn btn-blue roll-dice-btn' 
          disabled={tenzies ? false : !isRunning || toggleLeaderboardModal} //if game is paused disable roll button, if game has ended new game button should still be enabled
          onClick={handleRollClick}>
          {tenzies ? "New Game" : "Roll"}
        </button>

        <button 
          className='btn btn-blue pause-btn' 
          disabled={tenzies || toggleLeaderboardModal} 
          onClick={isRunning ? pause : start}>
          {isRunning ? "Pause" : "Resume"}
        </button>
      </div>

    </main>
  </>
  )
}

export default App
