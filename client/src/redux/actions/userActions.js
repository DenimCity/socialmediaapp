import {SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI} from '../types';
import axios from 'axios';


export const loginUser = (userData, history ) => async (dispatch) => {
      dispatch({ type: LOADING_UI})

      try {
      const result = await axios.post('/login',userData)
      const fbIdToken = `Bear ${result.data.token}`
      localStorage.setItem('FBIdToken', fbIdToken)
      axios.defaults.headers.common['Authorization'] = fbIdToken;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS})
      history.push('/')
      } catch (error) {
            dispatch({ type: SET_ERRORS,
            payload: error.response.data })
      }
}


export const getUserData = () => async (dispatch) => {
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