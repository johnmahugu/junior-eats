import React from 'react';
import Switch from 'react-switch'

function IMToggleSwitchComponent(props) {
    const { isChecked, onSwitchChange, disabled } = props;

    return (
        <div className="toggleSwitch">
            <Switch
                checked={isChecked}
                onChange={onSwitchChange}
                disabled={disabled}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 2px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={38}
                className="react-switch"
                id="material-switch"
            />
        </div>
    )

}

export default IMToggleSwitchComponent