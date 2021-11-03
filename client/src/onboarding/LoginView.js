import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik } from 'formik';
import { ClipLoader } from 'react-spinners';
import { Card, CardBody } from "reactstrap";

import { loginUser } from "../app/redux/auth/actions";

import "./styles.css"

const LoginView = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({})
    const dispatch = useDispatch()
    const history = useHistory()
    const auth = useSelector((state) => state.auth)

    const login = async (data, setSubmitting) => {
        setFormData(data)
        setIsLoading(true);
        dispatch(loginUser(data, history, dispatch))
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
            <h1>Sign in to your account</h1>
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
                    errors.password = 'Required'
                }
                return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    login(values, setSubmitting)
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

                    <div>
                        <button className="PrimaryButton" type="submit" disabled={isSubmitting}>
                            Log in
                        </button>
                    </div>
                </form>
                )}
            </Formik>
            <div className="SignupInsteadContainer">
                Don't have an account? <a href="/register">Sign up</a>
            </div>
        </CardBody>
        </Card>
    )
}
  
  export default LoginView;