import {SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, LOADING_USER, SET_AUTHENTICATED, MARK_NOTIFICATIONS_READ} from '../types';
import axios from 'axios';


export const loginUser = (userData, history ) => async (dispatch) => {
      dispatch({ type: LOADING_UI})

      try {
      const result = await axios.post('/login',userData)
      setAuthorizationHeader(result.data.token)
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS})
      history.push('/')
      } catch (error) {
            console.log(error)
            console.log(error)
            // dispatch({ type: SET_ERRORS,
            // payload: error.response.data })
      }
}
export const signUpUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/signup', newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push('/');
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const setAuthorizationHeader = (token) => {
       const fbIdToken = `Bear ${token}`
      localStorage.setItem('FBIdToken', fbIdToken)
      axios.defaults.headers.common['Authorization'] = fbIdToken;
}

export const logoutUser = () => (dispatch) => {
      localStorage.removeItem('FBIdToken')
      delete axios.defaults.headers.common['Authorization']
      dispatch({type: SET_AUTHENTICATED})
}


export const uploadImage = (formData) => async (dispatch) =>{
      dispatch({type: LOADING_USER })
      try {
            const response = await axios.post('/user/image',formData )
            console.log(response.data)
            if(response.data){
                  dispatch(getUserData())
            }
      } catch (error) {
            console.error(error)
      }
}
export const editUserDetails = (userDetails) => async (dispatch) =>{
      dispatch({type: LOADING_USER })
      try {
            const response = await axios.post('/user/',userDetails )
            console.log(response.data)
            if(response.data){
                  dispatch(getUserData())
            }
      } catch (error) {
            console.error(error)
      }
}


export const getUserData = () => async (dispatch) => {
      dispatch({ type: LOADING_USER })
     try {
      const res = await axios.get('/user');
            dispatch({ 
                  type: SET_USER,
                  payload: res.data
            })
     } catch (error) {
           console.error(error)
     }
}
export const markNotificationsRead = (notificationIds) => async (dispatch) => {
     try {
      const res = await axios.post('/notifications', notificationIds);
            dispatch({ 
                  type: MARK_NOTIFICATIONS_READ,
                  payload: res.data
            })
     } catch (error) {
           console.error(error)
     }
}