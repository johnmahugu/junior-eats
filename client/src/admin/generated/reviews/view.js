import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ClipLoader } from 'react-spinners';
import { Card, CardBody } from "reactstrap";
import { formatDate } from '../../helpers'
import { IMForeignKeyComponent, IMForeignKeysComponent, IMMultimediaComponent, IMForeignKeysIdComponent, IMPhoto, IMToggleSwitchComponent, IMColorBoxComponent } from '../../../common'

import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const DetailedReviewsView = (props) => {
    let { reviewId } = useParams()

    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState(null)

    useEffect(() => {
        fetch(baseAPIURL + 'review/' + reviewId)
        .then(response => response.json())
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
        .then(data => {
            setOriginalData(data)
            setIsLoading(false)
        });
    }, [reviewId]);

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

    const editPath = "/admin/review/" + reviewId + "/update"

    return (
        <Card className="Card FormCard">
            <CardBody>
            <h1>{originalData && originalData.starCount}
                <a className="Link EditLink" href={editPath}>Edit</a>
            </h1>

            {/* Insert all view form fields here */}
             <div className="FormFieldContainer">
                <label className="FormLabel">Author</label>
                <IMForeignKeyComponent id={originalData.authorID} apiRouteName="user" titleKey="firstName" />
            </div>
    

             <div className="FormFieldContainer">
                <label className="FormLabel">Restaurant</label>
                <IMForeignKeyComponent id={originalData.entityID} apiRouteName="restaurant" titleKey="title" />
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Review</label>
                <span className="LockedFieldValue">{originalData.text}</span>
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Rating</label>
                <span className="LockedFieldValue">{originalData.rating}</span>
            </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Date</label>
                <span className="LockedFieldValue">{originalData.createdAt && formatDate(originalData.createdAt)}</span>
            </div>
    

        </CardBody>
        </Card>
    )
}
  
  export default DetailedReviewsView;