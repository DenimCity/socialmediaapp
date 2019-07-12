import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Home, Login, SignUp } from './pages';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeObject from './util/theme';
import NavBar from './components/NavBar';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
import jwtDecode from 'jwt-decode';
import store from './redux/store'
import axios from 'axios';
import AuthRoute from './util/AuthRoute';


const token = localStorage.FBIdToken
if (token) {
  const decodedToken = jwtDecode(token)
  if (decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser)
    window.location.href = '/login'
  } else {
   store.dispatch({ type: SET_AUTHENTICATED})
   axios.defaults.headers.common['Authorization'] = token;
   store.dispatch(getUserData())
  }
}

const theme = createMuiTheme(themeObject);

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
        </Switch>
       </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
