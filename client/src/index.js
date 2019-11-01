import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
// import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// const theme = createMuiTheme(themeObject);
ReactDOM.render( 
      <Provider store={store}>
            <App/>
      </Provider>
, document.getElementById('root'));



