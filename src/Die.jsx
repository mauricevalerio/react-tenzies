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
        className={`die-face ${props.isHeld ? "held-die" : ""}`} 
        onClick={() => props.handleDieHeld(props.id)}>
            {generateDot()}
        </div>
    )
}

export default Die