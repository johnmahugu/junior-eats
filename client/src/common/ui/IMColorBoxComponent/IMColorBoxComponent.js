import React from 'react';
import "./styles.css";

function IMColorBoxComponent(props) {
    const { color, handleDelete } = props

    if (!color) {
        return null
    }

    return (
        <div 
            className="ColorBoxComponent" 
            style={{backgroundColor: color}}
            onClick={handleDelete}
        >
        </div>
    )
}

export default IMColorBoxComponent