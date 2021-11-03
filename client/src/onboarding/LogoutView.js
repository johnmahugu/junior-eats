import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

import { logoutUser } from "../app/redux/auth/actions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import getToken from './getToken'

import "./styles.css"

const LogoutView = () => {

    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        logout()
    }, []);

    const logout = async () => {
        const token = getToken()
        if (!token) {
            setIsLoading(false)
            return
        }
        dispatch(logoutUser(dispatch, history))
        setIsLoading(false)
    }

    if (isLoading) {
        return (
            <div className="sweet-loading card">
                <div className="spinner-container">
                    <ClipLoader
                        className="spinner"
                        sizeUnit={"px"}
                        size={50}
                        color={'#123abc'}
                        loading={isLoading}
                    />
                </div>
            </div> 
        )
    }

    return null
}

export default LogoutView;
