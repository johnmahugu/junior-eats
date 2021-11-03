import React from 'react'
import { IMColorBoxComponent } from '../../../common'
import "./styles.css";

function IMColorsContainer(props) {
    const { data, handleDelete } = props

    var colorItems;
    if (data) {
        colorItems = data.map((color, index) =>
            <IMColorBoxComponent color={color} handleDelete={() => handleDelete(index)}/>
        );
    }

    return (
        <div className="colorCellContainer">
            {colorItems}
        </div>
    )
}

export default IMColorsContainer