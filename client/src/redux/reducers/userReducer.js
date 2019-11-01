import {SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI,LOADING_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, MARK_NOTIFICATIONS_READ} from '../types';

const INITIAL_STATE = {
      authenticated: false,
      credentials: {},
      likes: [],
      loading: false,
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
                        ...action.payload,
                         loading: false
                  }
                  case LOADING_USER: 

                  return{
                        ...state,
                        loading: true
                  }
                  case MARK_NOTIFICATIONS_READ:
                        return {
                              ...state
                        }     
            default:
                  return state
      }
} 