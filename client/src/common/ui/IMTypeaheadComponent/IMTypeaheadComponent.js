import React, { useEffect, useState } from 'react';
import "./styles.css"
import { getToken } from "../../../onboarding";

const baseAPIURL = require("../../../admin/config").baseAPIURL

function IMTypeaheadComponent(props) {

    const [isLoading, setIsLoading] = useState(true);
    const [elements, setElements] = useState(null);
    const [typeaheadValue, setTypeaheadValue] = useState('')
    const [inputValue, setInputValue] = useState(null)

    const { id, name } = props

    useEffect(() => {
        fetch(baseAPIURL + "user/" + id)
            .then(response => response.json())
            .catch(err => {
                console.log(err)
                setIsLoading(false)
            })
            .then(data => {
                if (data) {
                    setInputValue(data.firstName + " " + data.lastName)
                }
                setIsLoading(false)
            });
    }, [props.id]);

    useEffect(() => {
        if (typeaheadValue == null) {
            return
        }
        const token = getToken()
        const config = {
            headers: { 'Authorization': token }
        };
        fetch(baseAPIURL  + "users/?limit=10&search=" + typeaheadValue, config)
            .then(response => response.json())
            .catch(err => {
                console.log(err)
            })
            .then(data => {
                console.log(data)
                if (data && data.users) {
                    setElements(data.users)
                }
            });
    }, [typeaheadValue])

    const handleChange = (event) => {
        const text = event.target.value
        console.log(text)
        setTypeaheadValue(text)
        setInputValue(text)
    }

    const listItems = elements && elements.length ? (elements.map((element) =>
        <li>{element.firstName} {element.lastName}</li>
    )) : null
  
    if (isLoading) {
        return null
    }

    return (
        <div className="TypeaheadComponent">
            <input className="FormTextField" type="text" name={name} value={inputValue} onChange={handleChange}/>
            <div className="TypeaheadResultsContainer">
                <ul className="TypeaheadResultsList" id={id}>
                    {listItems}
                </ul>
            </div>
        </div>
    )
}

export default IMTypeaheadComponent