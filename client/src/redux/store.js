import { combineReducers, createStore, applyMiddleware, compose} from 'redux'
import thunk from 'react-redux'

import userReducer from './reducers/userReducer'
import dataReducer from './reducers/dataReducer'
import uiReducers from './reducers/uiReducers'

const initialState = {}
const middleware = [thunk];

const reducers = combineReducers({
      user: userReducer,
      data: dataReducer,
      UI: uiReducers
})

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));
const store = createStore(reducers, initialState, enhancer);

export default store;