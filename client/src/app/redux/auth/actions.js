import axios from "axios";
import setAuthToken from "../../../onboarding/setAuthToken"
import jwt_decode from "jwt-decode";
import { firebase } from '../../../admin/firebase'
import {
  SET_CURRENT_USER,
  USER_LOADING,
  GET_ERRORS
} from "./types";

const jwt = require("jsonwebtoken");
const baseAPIURL = require('../../../admin/config').baseAPIURL;
const keys = require("../../../admin/config");
const validateRegisterInput = require('../../../admin/helpers/register')
const validateLoginInput = require('../../../admin/helpers/login')

// Register User
export const registerUser = (userData, history, dispatch2) => dispatch => {
  const { errors, isValid } = validateRegisterInput(userData)

  if (!isValid) {
    dispatch2({
      type: GET_ERRORS,
      payload: errors
    })
  } else {
    const { email, password, firstName, lastName } = userData
    //firebase.auth().createUserWithEmailAndPassword auto logs in the user in the firebase object => no need to dispatch login
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid
        const createdAt = new Date();
        const payload = {
          id: uid
        }

        const data = {
          id: uid,
          userId: uid,
          email,
          firstName,
          lastName,
          createdAt,
        }
        console.log("The user UID is :", uid)

        axios
          .post(baseAPIURL + 'user/add', data)
          .then(response => {
            console.log(response.data)
          })
          .catch(error => {
            console.log(error)
          })
        //Loggins user to jwt
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            var bearerToken = "Bearer " + token
            localStorage.setItem("jwtToken", bearerToken);
            // Set bearerToken to Auth header
            setAuthToken(bearerToken);
            // Decode bearerToken to get user data
            const decoded = jwt_decode(bearerToken);
            // Set current user
            dispatch2(setCurrentUser(decoded));
            history.push("/admin/users")
          }
        );
      })
      .catch((error) => {
        console.log('_error:', error);
        if (error.code === 'auth/email-already-in-use') {
          dispatch2({
            type: GET_ERRORS,
            payload: {
              email: "Email already in use!"
            }
          })
        } else {
          dispatch2({
            type: GET_ERRORS,
            payload: {
              server: "Server error"
            }
          })
        }
      })
  }
};

// Login - get user token
export const loginUser = (userData, history, dispatch2) => dispatch => {
  const { errors, isValid } = validateLoginInput(userData)

  if (!isValid) {
    dispatch2({
      type: GET_ERRORS,
      payload: errors
    })
  } else {
    const { email, password } = userData
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid
        const payload = {
          id: uid
        }
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            const bearerToken = "Bearer " + token
            localStorage.setItem("jwtToken", bearerToken);
            // Set bearerToken to Auth header
            setAuthToken(bearerToken);
            // Decode bearerToken to get user data
            const decoded = jwt_decode(bearerToken);
            // Set current user
            dispatch2(setCurrentUser(decoded));
            history.push("/admin/users")
          }
        );
      })
      .catch((error) => {
        console.log('error:', error);
        var myErrors = {};
        switch (error.code) {
          case 'auth/wrong-password':
            myErrors['password'] = "Wrong password!"
            break;
          case 'auth/network-request-failed':
            myErrors['server'] = "Server error!"
            break;
          case 'auth/user-not-found':
            myErrors['email'] = "No user with this email!"
            break;
          default:
            myErrors['server'] = "Server error!"
        }
        dispatch2({
          type: GET_ERRORS,
          payload: myErrors
        })
      })
  }
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = (dispatch, history) => dispatch2 => {
  firebase
    .auth()
    .signOut()
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  history.push("/login")

};