import './Die.css'
import { nanoid } from 'nanoid'

function Die(props) {

    function generateDot() {
        let dotArray = []
        for (let i = 0; i < props.value; i++) {
            dotArray.push(<div key={nanoid()} className={`dot dot-${props.value}`}></div>) 
        }
        return dotArray
    }
    return (
        <div 
        className={`die-face ${props.isHeld ? "held-die" : ""} 
        ${props.tenzies || !props.isRunning || props.toggleLeaderboardModal ? "disable-die-click-event" : ""}
        ${props.isHeld ? "" : "animate-die"}
        `}
        //if game has ended, game paused, or leaderboard modal is open disable click events

        //if game is paused or game ended, disable click events
        onClick={() => props.handleDieHeld(props.id)}>
            {generateDot()}
        </div>
    )
}

export default Die

//props.isHeld ? dont run animation : run animation