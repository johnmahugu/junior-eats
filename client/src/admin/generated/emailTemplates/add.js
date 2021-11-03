import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { ClipLoader } from 'react-spinners';
import IMDatePicker from '../../ui/IMDatePicker';
import { IMLocationPicker } from '../../ui/IMLocationPicker';
import { IMTypeaheadComponent, IMStaticMultiSelectComponent, IMStaticSelectComponent, IMPhoto, IMModal, IMToggleSwitchComponent } from '../../../common';
import { Card, CardBody } from "reactstrap";
/* Insert extra imports here */

import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const AddNewTemplatesView = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [modifiedNonFormData, setModifiedNonFormData] = useState({})
    const [originalData, setOriginalData] = useState({title: '', description: '', html: '', ...props.location.state})

    console.log(props.location.state)

    useEffect(() => {
        setModifiedNonFormData({ createdAt: new Date() })
    }, []);

    const createTemplates = async (data, setSubmitting) => {
        console.log(JSON.stringify(data));
        setIsLoading(true);
        const response = await fetch(baseAPIURL + 'template/add', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data, ...modifiedNonFormData }) // body data type must match "Content-Type" header
        });
        setSubmitting(false);
        setIsLoading(false);
    }

    const onTypeaheadSelect = (value, fieldName) => {
        var newData = { ...modifiedNonFormData }
        newData[fieldName] = value
        setModifiedNonFormData(newData)
    }

    const handleSwitchChange = (value, fieldName) => {
        var newData = { ...modifiedNonFormData }
        newData[fieldName] = value ^ true;
        setModifiedNonFormData(newData)
    }

    const handleSelectChange = (value, fieldName) => {
        var newData = { ...modifiedNonFormData }
        newData[fieldName] = value
        setModifiedNonFormData(newData)
    }

    const onDateChange = (toDate, fieldName) => {
        var newData = { ...modifiedNonFormData }
        newData[fieldName] = toDate
        setModifiedNonFormData(newData)
    }

    const onLocationChange = (addressObject, fieldName) => {
        var newData = { ...modifiedNonFormData }
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
                var newData = { ...modifiedNonFormData }
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
                <h1>Create New Templates</h1>
                <Formik
                    initialValues={originalData}
                    validate={values => {
                        values = { ...values, ...modifiedNonFormData };
                        const errors = {};
                        {/* Insert all form errors here */ }
                        if (!values.title) {
                            errors.title = 'Field Required!'
                        }

                        if (!values.description) {
                            errors.description = 'Field Required!'
                        }

                        if (!values.html) {
                            errors.html = 'Field Required!'
                        }


                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        createTemplates(values, setSubmitting);
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
                                {/* Insert all add form fields here */}
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
                                    <p className="ErrorMessage">
                                        {errors.title && touched.title && errors.title}
                                    </p>
                                </div>


                                <div className="FormFieldContainer">
                                    <label className="FormLabel">Description</label>
                                    <input
                                        className="FormTextField"
                                        type="description"
                                        name="description"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.description}
                                    />
                                    <p className="ErrorMessage">
                                        {errors.description && touched.description && errors.description}
                                    </p>
                                </div>


                                <div className="FormFieldContainer">
                                    <label className="FormLabel">Html</label>
                                    <textarea
                                        className="FormTextareaField"
                                        type="html"
                                        name="html"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.html}
                                    />
                                    <p className="ErrorMessage">
                                        {errors.html && touched.html && errors.html}
                                    </p>
                                </div>


                                <div className="FormFieldContainer">
                                    <label className="FormLabel">Photos</label>
                                    {modifiedNonFormData.photos && modifiedNonFormData.photos.map((url) =>
                                        <IMPhoto openable dismissable className="photo" src={url} onDelete={(src) => handleDeletePhoto(src, "photos", true)} />
                                    )}
                                    <input className="FormFileField" multiple id="photos" name="photos" type="file" onChange={(event) => {
                                        handleImageUpload(event, "photos", true);
                                    }} />
                                </div>



                                <div className="FormActionContainer">
                                    <button className="PrimaryButton" type="submit" disabled={isSubmitting}>
                                        Create template
                        </button>
                                </div>
                            </form>
                        )}
                </Formik>
            </CardBody>
        </Card>
    )
}

export default AddNewTemplatesView;