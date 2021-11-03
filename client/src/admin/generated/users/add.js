import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { ClipLoader } from 'react-spinners';
import IMDatePicker from '../../ui/IMDatePicker';
import { IMLocationPicker } from '../../ui/IMLocationPicker';
import { IMPhoto } from '../../../common';
import { Card, CardBody } from "reactstrap";

import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const AddNewUserView = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [modifiedNonFormData, setModifiedNonFormData] = useState({})

    useEffect(() => {
        setModifiedNonFormData({ createdAt: new Date()})
    }, []);

    const createUser = async (data, setSubmitting) => {
        console.log(JSON.stringify(data));
        setIsLoading(true);
        const response = await fetch(baseAPIURL + 'user/add', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data, ...modifiedNonFormData}) // body data type must match "Content-Type" header
        });
        setSubmitting(false);
        setIsLoading(false);
    }

    const onDateChange = (toDate, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = toDate
        setModifiedNonFormData(newData)
    }

    const onLocationChange = (addressObject, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (!addressObject || !addressObject.location || !addressObject.gmaps) {
            return
        }
        const location = {
            longitude: addressObject.location.lng,
            latitude: addressObject.location.lat,
            address: addressObject.label,
            placeID: addressObject.placeId,
            detailedAddress: addressObject.gmaps.address_components
        }
        newData[fieldName] = location
        setModifiedNonFormData(newData)
    }

    const handleImageUpload = (event, fieldName, isMultiple) => {
        const files = event.target.files
        const formData = new FormData()
        for (var i = 0; i < files.length; ++i) {
            formData.append('photos', files[i])
        }

        fetch(baseAPIURL + 'upload', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(response => {
            var newData = {...modifiedNonFormData}
            if (!isMultiple) {
                const url = response.data && response.data[0] && response.data[0].url
                newData[fieldName] = url
            } else {
                // multiple photos
                const urls = response.data && response.data.map(item => item.url)
                if (!modifiedNonFormData[fieldName] || modifiedNonFormData[fieldName].length <= 0) {
                    newData[fieldName] = urls
                } else {
                    newData[fieldName] = [...modifiedNonFormData[fieldName], ...urls]
                }
            }
            setModifiedNonFormData(newData)
            console.log(response)
        })
        .catch(error => {
          console.error(error)
        })
      }

    const handleDeletePhoto = (srcToBeRemoved, fieldName, isMultiple) => {
        if (isMultiple) {
            var newData = { ...modifiedNonFormData }
            var currentURLs = newData[fieldName]
            if (currentURLs) {
                const newURLs = currentURLs.filter(src => src != srcToBeRemoved)
                newData[fieldName] = newURLs
                setModifiedNonFormData(newData)
            }
        } else {
            var newData = { ...modifiedNonFormData }
            newData[fieldName] = null
            setModifiedNonFormData(newData)
        }
    }

    if (isLoading) {
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

    return (
        <Card className="Card FormCard">
            <CardBody>
            <h1>Create New Customer</h1>
            <Formik
                initialValues={{}}
                validate={values => {
                    const errors = {};

                    if (!values.email) {
                        errors.email = 'Required';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Invalid email address';
                    }
                    if (!values.firstName) {
                        errors.firstName = 'Required'
                    }
                    if (!values.lastName) {
                        errors.lastName = 'Required'
                    }

                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    createUser(values, setSubmitting);
                }}
            >
                {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
                /* and other goodies */
                }) => (
                <form onSubmit={handleSubmit}>
                    <div className="FormFieldContainer">
                        <label className="FormLabel">E-mail</label>
                        <input
                            className="FormTextField"
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        />
                        <div className="ErrorMessage">
                            {errors.email && touched.email && errors.email}
                        </div>
                    </div>

                    <div className="FormFieldContainer">
                        <label className="FormLabel">First Name</label>
                        <input
                            className="FormTextField"
                            type="firstName"
                            name="firstName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.firstName}
                        />
                        <div className="ErrorMessage">
                            {errors.firstName && touched.firstName && errors.firstName}
                        </div>
                    </div>

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Last Name</label>
                        <input
                            className="FormTextField"
                            type="lastName"
                            name="lastName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.lastName}
                        />
                        <div className="ErrorMessage">
                            {errors.lastName && touched.lastName && errors.lastName}
                        </div>
                    </div>

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Profile Photo</label>
                        {modifiedNonFormData.profilePictureURL && (
                            <IMPhoto openable dismissable className="photo" src={modifiedNonFormData.profilePictureURL} onDelete={(src) => handleDeletePhoto(src, "profilePictureURL", false) } />
                        )}
                        <input className="FormFileField" id="profilePictureURL" name="profilePictureURL" type="file" onChange={(event) => {
                            handleImageUpload(event, "profilePictureURL", false);
                        }} />
                    </div>

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Creation Date</label>
                        <IMDatePicker
                            selected={modifiedNonFormData.createdAt}
                            onChange={(toDate) => onDateChange(toDate, "createdAt")}
                        />
                    </div>

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Location</label>
                        <IMLocationPicker
                            initialValue={modifiedNonFormData.location && modifiedNonFormData.location.address}
                            onLocationChange={(addressObject) => onLocationChange(addressObject, "location")}                    
                        />
                    </div>

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Dating Photos</label>
                        {modifiedNonFormData.photos && modifiedNonFormData.photos.map((url) =>
                            <IMPhoto openable dismissable className="photo" src={url} onDelete={(src) => handleDeletePhoto(src, "photos", true) } />
                        )}
                        <input className="FormFileField" multiple id="photos" name="photos" type="file" onChange={(event) => {
                            handleImageUpload(event, "photos", true);
                        }} />
                    </div>

                    <div className="FormActionContainer">
                        <button className="PrimaryButton" type="submit" disabled={isSubmitting}>
                            Create customer
                        </button>
                    </div>
                </form>
                )}
            </Formik>
        </CardBody>
        </Card>
    )
}
  
  export default AddNewUserView;