import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { ClipLoader } from 'react-spinners';
import { Card, CardBody } from "reactstrap";
import { getToken } from '../../../onboarding'

import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const NotificationView = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [modifiedNonFormData, setModifiedNonFormData] = useState({})

    useEffect(() => {
        setModifiedNonFormData({ createdAt: new Date()})
    }, []);

    const sendPushNotificationToAllUsers = async (data, setSubmitting) => {
        console.log(JSON.stringify(data));
        setIsLoading(true);
        const token = getToken()
        const response = await fetch(baseAPIURL + 'notification/pushAll?orderBy=pushToken', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({...data, ...modifiedNonFormData}) // body data type must match "Content-Type" header
        });
        setSubmitting(false);
        setIsLoading(false);
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
            <h1>Send push notification</h1>
            <Formik
                initialValues={{}}
                validate={values => {
                    const errors = {};
                    if (!values.message) {
                        errors.message = "Field Required!"
                    }
                    if (!values.title) {
                        errors.title = "Field Required!"
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    sendPushNotificationToAllUsers(values, setSubmitting);
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
                        <label className="FormLabel">Title</label>
                        <input
                            className="FormTextField"
                            type="title"
                            name="title"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title}
                        />
                        <div className="ErrorMessage">
                            {errors.title && touched.title && errors.title}
                        </div>
                    </div>

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Message</label>
                        <textarea
                            className="FormTextareaField"
                            type="message"
                            name="message"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.message}
                        />
                        <div className="ErrorMessage">
                            {errors.message && touched.message && errors.message}
                        </div>
                    </div>

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Icon</label>
                        {modifiedNonFormData.icon && (
                            <img class="photo" src={modifiedNonFormData.icon} alt='photo'/>
                        )}
                        <input className="FormFileField" id="icon" name="icon" type="file" onChange={(event) => {
                            handleImageUpload(event, "icon", false);
                        }} />
                    </div>

                    <div className="FormActionContainer">
                        <button className="PrimaryButton" type="submit" disabled={isSubmitting}>
                            Send notification to all users
                        </button>
                    </div>
                </form>
                )}
            </Formik>
        </CardBody>
        </Card>
    )
}
  
 export default NotificationView 