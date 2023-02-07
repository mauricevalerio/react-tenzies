import './Die.css'

function Die(props) {
    return (
        <div className="die-face">
            <p>{props.value}</p>
        </div>
    )
}

export default Die