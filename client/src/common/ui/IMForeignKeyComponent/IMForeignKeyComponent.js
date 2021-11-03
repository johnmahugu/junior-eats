import React, { useEffect, useState } from 'react';
import "./styles.css";

const baseAPIURL = require("../../../admin/config").baseAPIURL

function IMForeignKeyComponent(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState(null);
    const { apiRouteName, id, titleKey } = props

    useEffect(() => {

        fetch(baseAPIURL + apiRouteName + '/' + id)
        .then(response => response.json())
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
        .then(data => {
            if (data) {
                setName(data[titleKey])
            }
            setIsLoading(false)
        });
    }, [props.id]);
  
    if (isLoading) {
        return null
    }

    const viewPath = "/admin/" + apiRouteName + "/" + id + '/view'
    return (
        <div className="ForeignKeyComponent">
            <a href={viewPath}>{name}</a>
        </div>
    )
}

export default IMForeignKeyComponent