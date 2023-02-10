import './Leaderboard.css'

function Leaderboard(props) {

    const leaderboardElements = props.leaderboard.map((leaderboardEl, index) => {
        return <div key={leaderboardEl.id} className='leaderboard-item'>
            <p>{index + 1}</p>
            <p>{leaderboardEl.numRolls}</p>
            <p>{`${leaderboardEl.minutes.toString().padStart(2, "0")}:${leaderboardEl.seconds.toString().padStart(2, "0")}`}</p>
        </div>
    })

    return (
        <div className={`leaderboard-container ${props.toggleLeaderboardModal ? "open" : ""}`}>
            <button className='leaderboard-close-btn' onClick={props.handleToggleLeaderBoardModal}>X</button>
            <h2>Leaderboards</h2>
            <div className="leaderboard-ranking-container">
                <div className="leaderboard-header">
                    <p>Rank</p>
                    <p onClick={props.sortNumRolls} className="leaderboard-num-rolls">Number of Rolls</p>
                    <p onClick={props.sortTime} className="leaderboard-time">Time</p>
                </div>
                {leaderboardElements}
            </div>
        </div>
    )
}

export default Leaderboard