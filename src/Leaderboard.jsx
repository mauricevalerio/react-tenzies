import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import './Leaderboard.css'

function Leaderboard(props) {

    const [leaderboard, setLeaderboard] = useState(() => JSON.parse(localStorage.getItem("leaderboard")) || [])
    const [isSortTimeAscending, setIsSortTimeAscending] = useState(true)
    const [isSortRollsAscending, setIsSortRollsAscending] = useState(false)

    function sortNumRolls() {
        setIsSortRollsAscending(prevSort => !prevSort)
        props.setSortLeaderboard(prevState => ! prevState) //forces parent component to re-render even if the game is won
        isSortRollsAscending ?
        setLeaderboard(prevLeaderboard => prevLeaderboard.sort((a, b) => a.numRolls - b.numRolls))
        :
        setLeaderboard(prevLeaderboard => prevLeaderboard.sort((a, b) => b.numRolls - a.numRolls))
    }

    function sortTime() {
        setIsSortTimeAscending(prevSort => !prevSort)
        props.setSortLeaderboard(prevState => ! prevState) //forces parent component to re-render even if the game is won
        isSortTimeAscending ? 
        setLeaderboard(prevLeaderboard => prevLeaderboard.sort((a, b) => b.totalTimeSeconds - a.totalTimeSeconds))
        :
        setLeaderboard(prevLeaderboard => prevLeaderboard.sort((a, b) => a.totalTimeSeconds - b.totalTimeSeconds))
    }

    function updateLeaderboard() {
        const leaderboardItem = {
          id: nanoid(),
          username: props.username,
          numRolls: props.numRolls,
          minutes: props.minutes,
          seconds: props.seconds,
          totalTimeSeconds: props.minutes * 60 + props.seconds
          }
        setLeaderboard(prevLeaderboard => [
          ...prevLeaderboard,
          leaderboardItem
          ]
        )
        sortTime()
    }

    useEffect(() => {
        if (props.tenzies) {
            updateLeaderboard()
        }
    }, [props.tenzies])

    useEffect(() => {
        localStorage.setItem("leaderboard",JSON.stringify(leaderboard))
    }, [leaderboard])

    const leaderboardElements = leaderboard.map(leaderboardEl => {
        return <div key={leaderboardEl.id} className='leaderboard-item'>
            <p>{leaderboardEl.username}</p>
            <p>{leaderboardEl.numRolls}</p>
            <p>{`${leaderboardEl.minutes.toString().padStart(2, "0")}:${leaderboardEl.seconds.toString().padStart(2, "0")}`}</p>
        </div>
    })

    return (
        <div className={`leaderboard-modal ${props.toggleLeaderboardModal ? "open" : ""}`}>

            <button className='leaderboard-close-btn' onClick={props.handleToggleLeaderboardModal}>X</button>

            <h2>🏆Leaderboards🏆</h2>
            
            <div className="sort-options">
                <p>Sort By:</p> 
                <span onClick={sortNumRolls}>Rolls</span>
                <span onClick={sortTime}>Time</span>
            </div>

            <div className="leaderboard-header">
                <p>Username</p>
                <p>Rolls</p>
                <p>Time</p>
            </div>
            
            {leaderboardElements}
        </div>
    )
}

export default Leaderboard