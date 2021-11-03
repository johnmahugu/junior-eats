import React, { useEffect, useState } from 'react';
import { getToken } from "../../../onboarding"

const baseAPIURL = require('../../config').baseAPIURL;

function IMRestaurantsCategoryTypeaheadComponent(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState(null);
    const [typeaheadValue, setTypeaheadValue] = useState('')
    const [inputValue, setInputValue] = useState(null)
    const [isTypeaheadVisible, setIsTypeaheadVisible] = useState(false)

    const { id, name, onSelect } = props

    useEffect(() => {
        if (!id) {
            setIsLoading(false)
            return
        }
        fetch(baseAPIURL + "category/" + id)
            .then(response => response.json())
            .catch(err => {
                console.log(err)
                setIsLoading(false)
            })
            .then(data => {
                if (data) {
                    setInputValue(data.title) // data.firstName + " " + data.lastName)
                }
                setIsLoading(false)
            });
    }, []);

    useEffect(() => {
        if (typeaheadValue == null) {
            return
        }
        const token = getToken()
        const config = {
            headers: { 'Authorization': token }
        };
        fetch(baseAPIURL  + "categories/?limit=10&search=" + typeaheadValue, config)
            .then(response => response.json())
            .catch(err => {
                console.log(err)
            })
            .then(data => {
                console.log(data)
                if (data && data.categories) {
                    setCategories(data.categories)
                }
            });
    }, [typeaheadValue])

    const handleChange = (event) => {
        const text = event.target.value
        setTypeaheadValue(text)
        setInputValue(text)
    }

    const onFocus = () => {
        setIsTypeaheadVisible(true)
    }

    const onBlur = () => {
        //setIsTypeaheadVisible(false)
    }

    const onClick = (data) => {
        setInputValue(data.title)
        onSelect && onSelect(data.id)
        setIsTypeaheadVisible(false)
    }

    const listItems = categories && categories.length ? (categories.map((data) =>
        <li onClick={() => onClick(data)}><table key={data.id}><tr><td><img src={data.photo} /></td><td><span>{data.title}</span></td></tr></table></li> // <li>{element.firstName} {element.lastName}</li>
    )) : null

    if (isLoading) {
        console.log("Error loading data for: " + id)
    }

    return (
        <div className="TypeaheadComponent">
            <input className="FormTextField" autoComplete="off" onFocus={onFocus} onBlur={onBlur} type="text" name={name} value={inputValue} onChange={handleChange} />
            {isTypeaheadVisible && (
                <div className="TypeaheadResultsContainer">
                    <ul className="TypeaheadResultsList" id={name}>
                        {listItems}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default IMRestaurantsCategoryTypeaheadComponent