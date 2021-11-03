import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ClipLoader } from 'react-spinners';
import { Card, CardBody } from "reactstrap";
import { formatDate } from '../../helpers'
import { IMForeignKeyComponent, IMForeignKeysComponent, IMMultimediaComponent, IMForeignKeysIdComponent, IMPhoto, IMToggleSwitchComponent, IMColorBoxComponent } from '../../../common'

import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const DetailedCategoriesView = (props) => {
    let { categoryId } = useParams()

    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState(null)

    useEffect(() => {
        fetch(baseAPIURL + 'category/' + categoryId)
        .then(response => response.json())
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
        .then(data => {
            setOriginalData(data)
            setIsLoading(false)
        });
    }, [categoryId]);

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

    const editPath = "/admin/category/" + categoryId + "/update"

    return (
        <Card className="Card FormCard">
            <CardBody>
            <h1>{originalData && originalData.title}
                <a className="Link EditLink" href={editPath}>Edit</a>
            </h1>

            {/* Insert all view form fields here */}
            <div className="FormFieldContainer">
                <label className="FormLabel">Title</label>
                <span className="LockedFieldValue">{originalData.title}</span>
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Photo</label>
                {originalData.photo && (
                    <IMPhoto openable className="photo" src={originalData.photo} />
                )}
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Order</label>
                <span className="LockedFieldValue">{originalData.order}</span>
            </div>
    

        </CardBody>
        </Card>
    )
}
  
  export default DetailedCategoriesView;