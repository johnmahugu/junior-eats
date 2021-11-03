import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ClipLoader } from 'react-spinners';
import { Card, CardBody } from "reactstrap";
import { formatDate } from '../../helpers'
import { IMForeignKeyComponent, IMPhoto, IMToggleSwitchComponent } from '../../../common'

import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const DetailedTemplatesView = (props) => {
    let { templateId } = useParams()

    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState(null)

    useEffect(() => {
        fetch(baseAPIURL + 'template/' + templateId)
        .then(response => response.json())
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
        .then(data => {
            setOriginalData(data)
            setIsLoading(false)
        });
    }, [templateId]);

    if (isLoading || !originalData) {
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

    const editPath = "/admin/template/" + templateId + "/update"

    return (
        <Card className="Card FormCard">
            <CardBody>
            <h1>{originalData && originalData.name}
                <a className="Link EditLink" href={editPath}>Edit</a>
            </h1>

            {/* Insert all view form fields here */}
            <div className="FormFieldContainer">
                <label className="FormLabel">Title</label>
                <span className="LockedFieldValue">{originalData.title}</span>
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Description</label>
                <span className="LockedFieldValue">{originalData.description}</span>
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Html</label>
                <span className="LockedFieldValue">{originalData.html}</span>
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Photos</label>
                {originalData.photos && originalData.photos.map((url) =>
                    <IMPhoto openable className="photo" src={url} />
                )}
            </div>
    

        </CardBody>
        </Card>
    )
}
  
  export default DetailedTemplatesView;