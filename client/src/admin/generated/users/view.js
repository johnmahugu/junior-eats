import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ClipLoader } from 'react-spinners';
import { Card, CardBody } from "reactstrap";
import { IMPhoto } from '../../../common';
import { formatDate } from '../../helpers'

import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const DetailedUserView = (props) => {
    let { userId } = useParams()

    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState(null)

    useEffect(() => {
        fetch(baseAPIURL + 'user/' + userId)
        .then(response => response.json())
        .catch(err => {
            console.log(err)
        })
        .then(data => {
            setOriginalData(data)
            setIsLoading(false)
        });
    }, [userId]);

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

    const editPath = "/admin/user/" + userId + "/update"

    return (
        <Card className="Card FormCard">
            <CardBody>
            <h1>{originalData && originalData.firstName} {originalData && originalData.lastName}
                <a class="Link EditLink" href={editPath}>Edit</a>
            </h1>
            <div className="FormFieldContainer">
                <label className="FormLabel">E-mail</label>
                <span className="LockedFieldValue">{originalData.email}</span>
            </div>

            <div className="FormFieldContainer">
                <label className="FormLabel">First Name</label>
                <span className="LockedFieldValue">{originalData.firstName}</span>
            </div>

            <div className="FormFieldContainer">
                <label className="FormLabel">Last Name</label>
                <span className="LockedFieldValue">{originalData.lastName}</span>
            </div>

            <div className="FormFieldContainer">
                <label className="FormLabel">Profile Photo</label>
                {originalData.profilePictureURL && (
                    <IMPhoto openable className="photo" src={originalData.profilePictureURL} />
                )}
            </div>

            <div className="FormFieldContainer">
                <label className="FormLabel">Creation Date</label>
                <span className="LockedFieldValue">{originalData.createdAt && formatDate(originalData.createdAt)}</span>
            </div>

            <div className="FormFieldContainer">
                <label className="FormLabel">Location</label>
                {originalData.location && originalData.location.address && (
                    <span className="LockedFieldValue">{originalData.location.address}</span>
                )}
            </div>

            <div className="FormFieldContainer">
                <label className="FormLabel">Dating Photos</label>
                {originalData.photos && originalData.photos.map((url) =>
                    <IMPhoto openable className="photo" src={url} />
                )}
            </div>
        </CardBody>
        </Card>
    )
}
  
  export default DetailedUserView;