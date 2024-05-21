// actions.js
import axios from 'axios';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT
} from './ActionTypes';
import { API_BASE_URL } from '../../config/api';
import { WidthWideOutlined } from '@mui/icons-material';

// Register action creators
export const registerRequest = () => ({ type: REGISTER_REQUEST });
export const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
export const registerFailure = error => ({ type: REGISTER_FAILURE, payload: error });
export const register = (userData, toast) => async dispatch => {
  dispatch(registerRequest());
  try {
    // console.log(userData,"register");
    const response = await axios.post(`${API_BASE_URL}signup`, userData);
    const user = response.data;
    // localStorage.setItem("jwt", user.jwt);
    toast.success("Registration Successful");
    // alert("registration successful")
    dispatch(registerSuccess(user));
  } catch (error) {
    toast.error("Something Went Wrong, Please Try Again");
    dispatch(registerFailure(error.errorMessage));
  }
};

// Login action creators
export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = user => ({ type: LOGIN_SUCCESS, payload: user });
export const loginFailure = error => ({ type: LOGIN_FAILURE, payload: error });
export const login = (userData, navigate, from,toast) => async dispatch => {
  dispatch(loginRequest());
  try {
    const response = await axios.post(`${API_BASE_URL}login`, userData);
    const user = response.data;

    // Assuming tokens are stored in the user object returned from the API
    localStorage.setItem("wt", user.WCToken);
    localStorage.setItem("wtt", user.WCTrustedToken);
toast.success("Login Successful" );
    // Dispatch actions to update user state
    dispatch(getUser());
    dispatch(loginSuccess(user));

    // Navigate to the original destination
    navigate(from, { replace: true });

    return Promise.resolve(response);
  } catch (error) {
    // Properly handle errors
    toast.error("Login failed, please check credentials");
    // alert("Email or password mismatched, please check");
    dispatch(loginFailure(error.message));
    return Promise.reject(error);
  }
};
// export const login = (userData,navigate,from) => async dispatch => {
//   dispatch(loginRequest());
//   try {
//     const response = await axios.post(`${API_BASE_URL}login`, userData);
//     const user = response.data;
//     console.log(user,"user");
//     localStorage.setItem("wt", user.WCToken);
//     localStorage.setItem("wtt", user.WCTrustedToken);
//     dispatch(getUser());
//     dispatch(loginSuccess(user));
//     navigate(from, { replace: true });
//     alert("login successful");
//     return Promise.resolve(response);
//   } catch (error) {
//     // alert("email or password mismatched, please check");
//     dispatch(loginFailure(error.message));
//     return Promise.reject(error);
//   }
// };


// export const login = userData => async dispatch => {
//   dispatch(loginRequest());
//   try {
//     const response = await axios.post(`${API_BASE_URL}login`, userData); // Corrected API URL
//     const user = response.data;
//     localStorage.setItem("wt", user.WCToken);
//     localStorage.setItem("wtt", user.WCTrustedToken);
//     dispatch(getUser());
//     dispatch(loginSuccess(user));

// alert("login successful")

// return response;
// // navigate("/");
//   } catch (error) {
//     alert("email or password mismatched , please check")
//     dispatch(loginFailure(error.message));
//     return error;
//   }
// };

// Get user details action creator
export const getUserRequest = () => ({ type: GET_USER_REQUEST });
export const getUserSuccess = user => ({ type: GET_USER_SUCCESS, payload: user });
export const getUserFailure = error => ({ type: GET_USER_FAILURE, payload: error });

export const getUser = () => async dispatch => {
  dispatch(getUserRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}info`, {
      headers: {
        'wt': localStorage.getItem("wt"),
        'wtt': localStorage.getItem("wtt")
      }
    });
    const user = response.data;
    dispatch(getUserSuccess(user));
  } catch (error) {
    dispatch(getUserFailure(error.message));
  }
};

// Logout action creator
export const logout = () => async dispatch => {
  dispatch({ type: LOGOUT });
  // localStorage.clear();
  localStorage.removeItem('wt')
  localStorage.removeItem('wtt')
  localStorage.removeItem("state")
};
