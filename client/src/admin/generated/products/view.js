import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ClipLoader } from 'react-spinners';
import { Card, CardBody } from "reactstrap";
import { formatDate } from '../../helpers'
import { IMForeignKeyComponent, IMForeignKeysComponent, IMMultimediaComponent, IMForeignKeysIdComponent, IMPhoto, IMToggleSwitchComponent, IMColorBoxComponent } from '../../../common'

import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const DetailedProductsView = (props) => {
    let { productId } = useParams()

    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState(null)

    useEffect(() => {
        fetch(baseAPIURL + 'product/' + productId)
        .then(response => response.json())
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
        .then(data => {
            setOriginalData(data)
            setIsLoading(false)
        });
    }, [productId]);

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

    const editPath = "/admin/product/" + productId + "/update"

    return (
        <Card className="Card FormCard">
            <CardBody>
            <h1>{originalData && originalData.name}
                <a className="Link EditLink" href={editPath}>Edit</a>
            </h1>

            {/* Insert all view form fields here */}
            <div className="FormFieldContainer">
                <label className="FormLabel">Name</label>
                <span className="LockedFieldValue">{originalData.name}</span>
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Cover Photo</label>
                {originalData.photo && (
                    <IMPhoto openable className="photo" src={originalData.photo} />
                )}
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Photos</label>
                {originalData.photos && originalData.photos.map((url) =>
                    <IMPhoto openable className="photo" src={url} />
                )}
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Price</label>
                <span className="LockedFieldValue">{originalData.price}</span>
            </div>
    

             <div className="FormFieldContainer">
                <label className="FormLabel">Restaurant</label>
                <IMForeignKeyComponent id={originalData.vendorID} apiRouteName="restaurant" titleKey="title" />
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Description</label>
                <span className="LockedFieldValue">{originalData.description}</span>
            </div>
    

        </CardBody>
        </Card>
    )
}
  
  export default DetailedProductsView;