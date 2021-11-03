import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ClipLoader } from 'react-spinners';
import { Card, CardBody } from "reactstrap";
import { formatDate } from '../../helpers'
import { IMForeignKeyComponent, IMForeignKeysComponent, IMMultimediaComponent, IMForeignKeysIdComponent, IMPhoto, IMToggleSwitchComponent, IMColorBoxComponent } from '../../../common'

import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const DetailedOrdersView = (props) => {
    let { orderId } = useParams()

    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState(null)

    useEffect(() => {
        fetch(baseAPIURL + 'order/' + orderId)
        .then(response => response.json())
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
        .then(data => {
            setOriginalData(data)
            setIsLoading(false)
        });
    }, [orderId]);

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

    const editPath = "/admin/order/" + orderId + "/update"

    return (
        <Card className="Card FormCard">
            <CardBody>
            <h1>{originalData && originalData.id}
                <a className="Link EditLink" href={editPath}>Edit</a>
            </h1>

            {/* Insert all view form fields here */}
            <div className="FormFieldContainer">
                <label className="FormLabel">Order ID</label>
                <span className="LockedFieldValue">{originalData && originalData.id}</span>
            </div>


            <div className="FormFieldContainer">
                <label className="FormLabel">Delivery Address</label>
                <span className="FormArrayField">
                    { originalData.address && Object.keys(originalData.address).map( key => {
                        if(typeof originalData.address[key] === "string" || typeof originalData.address[key] === "number") {
                            return (<li>{key}: {originalData.address[key]}</li>)} 
                        }
                    )}
                </span>
            </div>
        

             <div className="FormFieldContainer">
                <label className="FormLabel">Products</label>
                <IMForeignKeysComponent data={originalData.products} apiRouteName="product" titleKey="name" />
            </div>
    

             <div className="FormFieldContainer">
                <label className="FormLabel">Customer</label>
                <IMForeignKeyComponent id={originalData.authorID} apiRouteName="user" titleKey="firstName" />
            </div>
    

             <div className="FormFieldContainer">
                <label className="FormLabel">Restaurant</label>
                <IMForeignKeyComponent id={originalData.vendorID} apiRouteName="restaurant" titleKey="title" />
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Status</label>
                <span className="LockedFieldValue">{originalData && originalData.status}</span>
            </div>
        

            <div className="FormFieldContainer">
                <label className="FormLabel">Date</label>
                <span className="LockedFieldValue">{originalData.createdAt && formatDate(originalData.createdAt)}</span>
            </div>
    

        </CardBody>
        </Card>
    )
}
  
  export default DetailedOrdersView;