import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { ClipLoader } from 'react-spinners';
import { Card, CardBody } from "reactstrap";
import { getToken } from '../../../onboarding'
import { IMTypeaheadComponent, IMStaticMultiSelectComponent, IMStaticSelectComponent, IMPhoto, IMModal, IMToggleSwitchComponent, IMRichTextEditor } from '../../../common';
import { TemplatesListView } from '../../generated/emailTemplates';
import { Link } from 'react-router-dom'

import "../../ui/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;

const EmailView = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [modifiedNonFormData, setModifiedNonFormData] = useState({})

    useEffect(() => {
        setModifiedNonFormData({ createdAt: new Date() , type: 'text'})
    }, []);

    const sendEmailToAllUsers = async (data, setSubmitting) => {
        console.log(JSON.stringify(data));
        setIsLoading(true);
        const token = getToken()
        const response = await fetch(baseAPIURL + 'email/emailAll?orderBy=email', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ ...data, ...modifiedNonFormData }) // body data type must match "Content-Type" header
        });
        setSubmitting(false);
        setIsLoading(false);
    }

    const handleSwitchChange = (value, fieldName) => {
        var newData = { ...modifiedNonFormData }
        if (value === 'text') {
            newData[fieldName] = 'html';
        } else {
            newData[fieldName] = 'text';
        }
        setModifiedNonFormData(newData)
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
        <>
            <Card className="Card FormCard">
                <CardBody>
                    <h1>Send e-mail</h1>
                    <Formik
                        initialValues={{}}
                        validate={values => {
                            values = {...values , ...modifiedNonFormData}
                            const errors = {};

                            if (!values.from) {
                                errors.from = 'Frield Required!';
                            } else if (
                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.from)
                            ) {
                                errors.from = 'Invalid email address';
                            }
                            if (!values.subject) {
                                errors.subject = "Field Required!"
                            }
                            if (!values.text && !values.html) {
                                errors.text = "Field Required!"
                                errors.html = "Field Required!"
                            }
                            console.log(values.html)
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            sendEmailToAllUsers(values, setSubmitting);
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue
                            /* and other goodies */
                        }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="FormFieldContainer">
                                        <label className="FormLabel">From</label>
                                        <input
                                            className="FormTextField"
                                            type="from"
                                            name="from"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.from}
                                        />
                                        <div className="ErrorMessage">
                                            {errors.from && touched.from && errors.from}
                                        </div>
                                    </div>

                                    <div className="FormFieldContainer">
                                        <label className="FormLabel">Subject</label>
                                        <input
                                            className="FormTextField"
                                            type="subject"
                                            name="subject"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.subject}
                                        />
                                        <div className="ErrorMessage">
                                            {errors.subject && touched.subject && errors.subject}
                                        </div>
                                    </div>

                                    <div className="FormFieldContainer">
                                        {modifiedNonFormData.type === 'text' && (
                                        <div>
                                            <label className="FormLabel">Message</label>
                                            <textarea
                                                className="FormTextareaField"
                                                type="text"
                                                name="text"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.text}
                                            />
                                            <div className="ErrorMessage">
                                                {errors.text && touched.text && errors.text}
                                            </div>
                                        </div>
                                        )}
                                        {modifiedNonFormData.type === 'html' && (
                                        <>
                                            <label className="FormLabel">Editor</label>
                                            <IMRichTextEditor 
                                                getHTML = { data => { setFieldValue("html", data) }}
                                                insertHTML = { insertedHTML => {
                                                    if (modifiedNonFormData.inserter === true) {
                                                        var newData = { ...modifiedNonFormData }
                                                        newData["inserter"] = false
                                                        setModifiedNonFormData(newData)
                                                        insertedHTML.value = modifiedNonFormData.insertedHTML
                                                    }
                                                }}
                                            />
                                            <div className="ErrorMessage">
                                                {errors.html}
                                            </div>
                                            <Link 
                                                className="Link AddLink" 
                                                to={{
                                                    pathname:"/admin/template/add", 
                                                    state: {html: values.html},
                                            }}>Save template</Link>
                                        </>
                                        )}
                                        <label className="FormLabel">Text</label>
                                        <IMToggleSwitchComponent isChecked={modifiedNonFormData.type === 'html'} onSwitchChange={() => handleSwitchChange(modifiedNonFormData["type"], "type")} />
                                        <label className="FormLabelStyling">Rich Text Editor</label>
                                    </div>

                                    <div className="FormActionContainer">
                                        <button className="PrimaryButton" type="submit" disabled={isSubmitting}>
                                            Send e-mail to all users
                                        </button>
                                    </div>
                                    <TemplatesListView 
                                        insertCallback={ html => { 
                                            var newData = { ...modifiedNonFormData }
                                            newData["inserter"] = true
                                            newData["insertedHTML"] = html
                                            newData["type"] = 'html';
                                            setModifiedNonFormData(newData)
                                        } 
                                    }/>
                                </form>
                            )}
                    </Formik>
                </CardBody>
            </Card>
        </>
    )
}

export default EmailView 
