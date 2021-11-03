import React from 'react'
import dismissIcon from '../assets/dismiss.png'
import "./styles.css";

function IMDismissButton(props) {
    const { className, onPress } = props

    const allClasses = className + " DismissButton"

    return (
        <div className={allClasses} onClick={onPress}>
            <img className="DismissIcon" src={dismissIcon} alt="Dismiss" />
        </div>
    )
}

export default IMDismissButton