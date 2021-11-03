import React, { useState } from 'react';
import { Formik } from 'formik';
import { ClipLoader } from 'react-spinners';
import { Card, CardBody } from "reactstrap";

import { registerUser } from "../app/redux/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import "./styles.css"

const SignUpView = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({})
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)

    const history = useHistory()

    const create = async (data, setSubmitting) => {
        // console.log(JSON.stringify(data));
        setFormData(data)
        setIsLoading(true);
        dispatch(registerUser(data, history, dispatch))
        setSubmitting(false);
        setIsLoading(false);
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
        <Card className="Card LoginCard">
            <CardBody>
            <h1>Create New Account</h1>
            <Formik
                initialValues={formData}
                validate={values => {
                    const errors = {};
                    if (!values.email) {
                        errors.email = 'Required';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Invalid email address';
                    }
                    if (!values.password) {
                        errors.password = 'Required';
                    }
                    if (!values.confirmPassword) {
                        errors.confirmPassword = 'Required';
                    } else if (values.confirmPassword != values.password) {
                        errors.confirmPassword = "Passwords didn't match!";
                    }
                    if (!values.firstName) {
                        errors.firstName = 'Required';
                    }
                    if (!values.lastName) {
                        errors.lastName = 'Required';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    create(values, setSubmitting)
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
                        <p className="ErrorMessage">
                            {errors.email && touched.email && errors.email}
                            {auth && auth.errors && auth.errors.email}
                        </p>
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
                        <p className="ErrorMessage">
                            {errors.firstName && touched.firstName && errors.firstName}
                            {auth && auth.errors && auth.errors.firstName}
                        </p>
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
                        <p className="ErrorMessage">
                            {errors.lastName && touched.lastName && errors.lastName}
                            {auth && auth.errors && auth.errors.lastName}
                        </p>
                    </div>

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Password</label>
                        <input
                            className="FormTextField"
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        />
                        <p className="ErrorMessage">
                            {errors.password && touched.password && errors.password}
                            {auth && auth.errors && auth.errors.password}
                        </p>
                    </div>

                    <div className="FormFieldContainer">
                        <label className="FormLabel">Confirm Password</label>
                        <input
                            className="FormTextField"
                            type="password"
                            name="confirmPassword"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.confirmPassword}
                        />
                        <p className="ErrorMessage">
                            {errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
                            {auth && auth.errors && auth.errors.confirmPassword}
                        </p>
                    </div>

                    <div>
                        <button className="PrimaryButton" type="submit" disabled={isSubmitting}>
                            Create account
                        </button>
                    </div>
                </form>
                )}
            </Formik>
            <div className="SignupInsteadContainer">
                Already have an account? <a href="/login">Log in</a>
            </div>
        </CardBody>
        </Card>
    )
}

export default SignUpView;
