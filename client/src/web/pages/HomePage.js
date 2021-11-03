import React from 'react';

import { useHistory } from "react-router-dom";
import getToken from '../../onboarding/getToken'

import "../styles.css"

const HomePage = () => {

    const history = useHistory()
    const token = getToken()
    if (token) {
        history.push("/admin")
    } else {
        history.push("/login")
    }

    return (
        <div>
            This is the web home page.
        </div> 
    )
}

export default HomePage;
