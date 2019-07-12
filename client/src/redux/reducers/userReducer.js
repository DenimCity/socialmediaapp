import {SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_AUTHENTICATED, SET_UNAUTHENTICATED} from '../types';

const INITIAL_STATE = {
      authenticated: false,
      credentials: {},
      likes: [],
      notifications: []
}

export default function(state = INITIAL_STATE, action) {
      switch(action.type){
            case SET_AUTHENTICATED:
                  return {
                        ...state,
                        authenticated: true,
                  };
            case SET_UNAUTHENTICATED:
                  return INITIAL_STATE
            case SET_USER:
                  // ..is spreading the matching data from payload into the state
                  return {
                        ...state,
                        authenticated: true,
                        ...action.payload
                  }      
            default:
                  return state
      }
} 