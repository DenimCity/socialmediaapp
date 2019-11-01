import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
// Redux
import store from './redux/store'
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';


// Components
import NavBar from './components/layout/NavBar';
// Utilities
import {  AuthRoute, themeObject } from './util';
// Pages
import { Home, Login, SignUp, User } from './pages';


const theme = createMuiTheme(themeObject);


axios.defaults.baseURL = "https://us-central1-socialape-f9d4c.cloudfunctions.net/api"

const token = localStorage.FBIdToken
if (token) {
  const decodedToken = jwtDecode(token)
  if (decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser())
    window.location.href = '/login'
  } else {
   store.dispatch({ type: SET_AUTHENTICATED})
   axios.defaults.headers.common['Authorization'] = token;
   store.dispatch(getUserData())
  }
}


function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <NavBar/>
       <div className="container">
          <Switch>
          <Route exact path='/' component={Home}/>
          <AuthRoute exact path='/login' component={Login}/>
          <AuthRoute exact path='/signup' component={SignUp}/>
            <Route exact path="/users/:handle" component={User} />
        </Switch>
       </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;


