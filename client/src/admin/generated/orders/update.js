import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { useParams } from "react-router-dom";
import { ClipLoader } from 'react-spinners';
import IMDatePicker from '../../ui/IMDatePicker';
import { IMLocationPicker } from '../../ui/IMLocationPicker';
import { IMTypeaheadComponent, IMColorPicker, IMMultimediaComponent, IMObjectInputComponent, IMArrayInputComponent, IMColorsContainer, IMColorBoxComponent, IMStaticMultiSelectComponent, IMStaticSelectComponent, IMPhoto, IMModal, IMToggleSwitchComponent } from '../../../common';
import { Card, CardBody } from "reactstrap";
/* Insert extra imports here */
import IMOrdersVendorTypeaheadComponent from '../ui/IMOrdersVendorTypeaheadComponent.js'

import IMOrdersAuthorTypeaheadComponent from '../ui/IMOrdersAuthorTypeaheadComponent.js'

import IMOrdersProductMultipleTypeaheadComponent from '../ui/IMOrdersProductMultipleTypeaheadComponent.js'


import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const UpdateOrdersView = (props) => {
    let { orderId } = useParams()

    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState(null)
    const [modifiedNonFormData, setModifiedNonFormData] = useState({})

    useEffect(() => {
        fetch(baseAPIURL + 'order/' + orderId)
        .then(response => response.json())
        .catch(err => {
            console.log(err)
            setIsLoading(false)
        })
        .then(data => {
            setOriginalData(data)
            if (data) {
                initializeModifieableNonFormData(data)
            }
            setIsLoading(false)
        })
    }, [orderId])

    const initializeModifieableNonFormData = (originalData) => {
        var nonFormData = {};

        /* Insert non modifiable initialization data here */
        if (originalData.address) {
            nonFormData['address'] = originalData.address
        }
        
        if (originalData.products) {
            nonFormData['products'] = originalData.products
        }
        
        if (originalData.status) {
            nonFormData['status'] = originalData.status
        }
        
        if (originalData.createdAt && Date.parse(originalData.createdAt)) {
            nonFormData['createdAt'] = new Date(originalData.createdAt)
        }
        

        console.log(nonFormData)
        setModifiedNonFormData(nonFormData)
    }

    const saveChanges = async (modifiedData, setSubmitting) => {
        console.log(JSON.stringify({...modifiedData, ...modifiedNonFormData}));
        const response = await fetch(baseAPIURL + 'order/' + orderId, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...modifiedData, ...modifiedNonFormData}) // body data type must match "Content-Type" header
        });
        if (response.ok == true) {
            window.location.reload();
        }
        setSubmitting(false);
    }

    const onTypeaheadSelect = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = value
        setModifiedNonFormData(newData)
    }

    const onMultipleTypeaheadSelect = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (newData[fieldName] != undefined ) {
            newData[fieldName].push(value)
        } else {
            newData[fieldName] = [ value ]
        }
        setModifiedNonFormData(newData)
    }

    const onMultipleTypeaheadDelete = (index, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName].splice(index, 1)
        setModifiedNonFormData(newData)
    }

    const handleSwitchChange = (value, fieldName) => {
        var newData = { ...modifiedNonFormData }
        newData[fieldName] = value ^ true;
        setModifiedNonFormData(newData)
    }

    const handleSelectChange = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = value
        setModifiedNonFormData(newData)
    }

    const handleColorChange = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = value
        setModifiedNonFormData(newData)
    }

    const handleColorDelete = (fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = null
        setModifiedNonFormData(newData)
    }


    const handleColorsChange = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (newData[fieldName] != undefined ) {
            newData[fieldName].push(value)
        } else {
            newData[fieldName] = [ value ]
        }
        setModifiedNonFormData(newData)
    }

    const handleColorsDelete = (index, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName].splice(index, 1)
        setModifiedNonFormData(newData)
    }

    const handleArrayInput = (value, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (newData[fieldName] != undefined ) {
            newData[fieldName].push(value)
        } else {
            newData[fieldName] = [ value ]
        }
        setModifiedNonFormData(newData)
    }

    const handleArrayDelete = (index, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName].splice( index, 1)
        setModifiedNonFormData(newData)
    }

    const handleObjectInput = (key, value, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (newData[fieldName] != undefined ) {
            newData[fieldName][key] = value
        } else {
            newData[fieldName] = { [key]: value }
        }
        setModifiedNonFormData(newData)
    }

    const handleObjectDelete = (key, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = Object.keys(newData[fieldName]).reduce((object, keys) => {
            if (keys !== key) {
              object[keys] = newData[fieldName][keys]
            }
            return object
          }, {})
        setModifiedNonFormData(newData)
    }

    const onDateChange = (toDate, fieldName) => {
        var newData = {...modifiedNonFormData}
        newData[fieldName] = toDate
        setModifiedNonFormData(newData)
    }

    const onLocationChange = (addressObject, fieldName) => {
        var newData = {...modifiedNonFormData}
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

    const onSimpleLocationChange = (addressObject, fieldName) => {
        var newData = {...modifiedNonFormData}
        if (!addressObject || !addressObject.location) {
            return
        }
        const location = {
            lng: addressObject.location.lng,
            lat: addressObject.location.lat,
            // address: addressObject.label,
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
            var newData = {...modifiedNonFormData}
            var currentURLs = newData[fieldName]
            if (currentURLs) {
                const newURLs = currentURLs.filter(src => src != srcToBeRemoved)
                newData[fieldName] = newURLs
                setModifiedNonFormData(newData)
            }
        } else {
            var newData = {...modifiedNonFormData}
            newData[fieldName] = null
            setModifiedNonFormData(newData)
        }
    }

    const handleMultimediaUpload = (event, fieldName, isMultiple) => {
        const files = event.target.files
        const formData = new FormData()
        for (var i = 0; i < files.length; ++i) {
            formData.append('multimedias', files[i])
        }

        fetch(baseAPIURL + 'uploadMultimedias', {
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
                // multiple media
                const data = response.data && response.data.map(item => {return { url: item.url, mime: item.mimetype } })
                if (!modifiedNonFormData[fieldName] || modifiedNonFormData[fieldName].length <= 0) {
                    newData[fieldName] = data
                } else {
                    newData[fieldName] = [...modifiedNonFormData[fieldName], ...data]
                }
            }
            setModifiedNonFormData(newData)
            console.log(response)
        })
        .catch(error => {
          console.error(error)
        })
    }

    const handleMultimediaDelete = (srcToBeRemoved, fieldName, isMultiple) => {
        if (isMultiple) {
            var newData = {...modifiedNonFormData}
            var currentData = newData[fieldName]
            if (currentData) {
                const finalData = currentData.reduce((arrayAcumulator, curVal) => {
                    if (srcToBeRemoved !== curVal.url) {
                        arrayAcumulator.push(curVal);
                    }
                    return arrayAcumulator;
                })
                newData[fieldName] =  finalData;
                setModifiedNonFormData(newData)
            }
        } else {
            var newData = {...modifiedNonFormData}
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
            <h1>{originalData && originalData.id}</h1>
            <Formik
                initialValues={originalData}
                validate={values => {
                    values = {...values, ...modifiedNonFormData};
                    const errors = {};
                    {/* Insert all form errors here */}
        if (!values.id) {
            errors.id = 'Field Required!'
        }

        if (!values.address) {
            errors.address = 'Field Required!'
        }

        if (!values.products) {
            errors.products = 'Field Required!'
        }

        if (!values.authorID) {
            errors.authorID = 'Field Required!'
        }

        if (!values.vendorID) {
            errors.vendorID = 'Field Required!'
        }

        if (!values.status) {
            errors.status = 'Field Required!'
        }

        if (!values.createdAt) {
            errors.createdAt = 'Field Required!'
        }


                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    saveChanges(values, setSubmitting)
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
                    {/* Insert all edit form fields here */}
            <div className="FormFieldContainer">
                <label className="FormLabel">Order ID</label>
                <span className="LockedFieldValue">{originalData && originalData.id}</span>
            </div>


            <div className="FormFieldContainer">
                <label className="FormLabel">Delivery Address</label>
                <div className="FormArrayField">
                    <IMObjectInputComponent 
                        nonModifiable
                        keyPlaceholder="Delivery Address Field" 
                        valuePlaceholder="Delivery Address Value" 
                        handleClick={(key, value) => handleObjectInput(key, value, "address")} 
                        handleDelete={(key) => handleObjectDelete(key, "address")} 
                        data={modifiedNonFormData["address"]}
                    />
                    <p className="ErrorMessage">
                        {errors.address && touched.address && errors.address}
                    </p>
                </div>
            </div>
        

        <div className="FormFieldContainer">
            <label className="FormLabel">Products</label>
            <IMOrdersProductMultipleTypeaheadComponent onSelect={(value) => onMultipleTypeaheadSelect(value, "products")} onDelete={(index) => onMultipleTypeaheadDelete(index, "products")} data={modifiedNonFormData.products} name={"products"} />
        </div>
    

        <div className="FormFieldContainer">
            <label className="FormLabel">Customer</label>
            <IMOrdersAuthorTypeaheadComponent onSelect={(value) => onTypeaheadSelect(value, "authorID")} id={originalData && originalData.authorID} name={originalData && originalData.authorID} />
        </div>
    

        <div className="FormFieldContainer">
            <label className="FormLabel">Restaurant</label>
            <IMOrdersVendorTypeaheadComponent onSelect={(value) => onTypeaheadSelect(value, "vendorID")} id={originalData && originalData.vendorID} name={originalData && originalData.vendorID} />
        </div>
    

            <div className="FormFieldContainer">
                <label className="FormLabel">Status</label>
                <IMStaticSelectComponent
                    options={["Order Placed","Order Delivered","Order Cancelled","Order Shipped","In Transit","Driver Pending","Order Accepted","Driver Rejected","Driver Accepted","Order Completed"]}
                    name="status"
                    onChange={handleSelectChange}
                    selectedOption={modifiedNonFormData.status}
                />
                <p className="ErrorMessage">
                    {errors.status && touched.status && errors.status}
                </p>
            </div>
            

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Date</label>
                        <IMDatePicker
                            selected={modifiedNonFormData.createdAt}
                            onChange={(toDate) => onDateChange(toDate, "createdAt")}
                        />
                    </div>
    


                    <div className="FormActionContainer">
                        <button className="PrimaryButton" type="submit" disabled={isSubmitting}>
                            Save order
                        </button>
                    </div>
                </form>
                )}
            </Formik>
        </CardBody>
        </Card>
    )
}
  
  export default UpdateOrdersView;