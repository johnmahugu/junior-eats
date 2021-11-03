import React, { useEffect, useState } from 'react';
import { getToken } from "../../../onboarding"

const baseAPIURL = require('../../config').baseAPIURL;

function IMOrdersProductMultipleTypeaheadComponent(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState(null);
    const [typeaheadValue, setTypeaheadValue] = useState('')
    const [myData, setData] = useState([])
    const [isTypeaheadVisible, setIsTypeaheadVisible] = useState(false)

    const { data, name, onSelect, onDelete } = props

    useEffect(() => {
        if (!data) {
            setIsLoading(false)
            return
        }
        setData(data) 
        setIsLoading(false)
    }, [data && data.length]);

    useEffect(() => {
        if (typeaheadValue == null) {
            return
        }
        const token = getToken()
        const config = {
            headers: { 'Authorization': token }
        };
        fetch(baseAPIURL  + "products/?limit=10&search=" + typeaheadValue, config)
            .then(response => response.json())
            .catch(err => {
                console.log(err)
            })
            .then(data => {
                console.log(data)
                if (data && data.products) {
                    setProducts(data.products)
                }
            });
    }, [typeaheadValue])

    const handleChange = (event) => {
        const text = event.target.value
        setTypeaheadValue(text)
    }

    const onFocus = () => {
        setIsTypeaheadVisible(true)
    }

    const onBlur = () => {
        //setIsTypeaheadVisible(false)
    }

    const onClick = (data) => {
        setTypeaheadValue('')
        onSelect && onSelect(data)
        setIsTypeaheadVisible(false)
    }

    const viewPath = myData && myData.length && myData.map(elem => ("/admin/" + 'product' + "/" + elem.id + '/view'))

    const listItems = products && products.length ? (products.map((data) =>
        <li onClick={() => onClick(data)}><table key={data.id}><tr><td><img src={data.photo} /></td><td><span>{data.name}</span></td></tr></table></li> // <li>{element.firstName} {element.lastName}</li>
    )) : null

    const dataItems = myData && myData.length ? (myData.map((data, index) => 
        <li><a href={viewPath[index]}>{
            data.name
        }</a>
            <button onClick={() => onDelete(index)} type="button" style={{float:'right', padding:0, border:'none', background:'none'}}>x</button>
        </li>
    )) : null

  
    if (isLoading) {
        console.log("Error loading data")
    }

    return (
        <div className="TypeaheadComponent" style={{verticalAlign:"top"}}>
            <div className="FormSelectionField">
                {dataItems}
            </div>
            <input className="FormTextField" autocomplete='off' onFocus={onFocus} onBlur={onBlur} type="text" name={name} value={typeaheadValue} onChange={handleChange}/>
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

export default IMOrdersProductMultipleTypeaheadComponent