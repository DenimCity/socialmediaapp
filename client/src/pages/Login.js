import React, { useState, useEffect, Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import AppIcon from '../images/icon.png'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
      form: {
            textAlign: 'center'
      },
      image: {
        margin: '20px auto 20px auto'
      }
}




// useEffect(() => {
//     console.log('count changed', props.count);
// }, [props.count])

const Login = (props) => {

   const [values,setValues] = useState({
       email: '',
      password: '',
      errors: {}
})

    const handleSubmit = (event) => {
      console.log('hi')
    }

    const handleChange = (e) => setValues({...values, [e.target.name]: e.target.value })
    


  const { classes, UI } = props;
  return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="monkey"/>
          <Typography variant="h2" className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
              <TextField 
              id="email" name="email"
              type="email" label="Email"
              value={values.email}
              onChange={handleChange} fullWidth/>
              <TextField 
              id="password" name="password"
              type="password" label="Password"
              value={values.password}
              onChange={handleChange} fullWidth/>
          </form>
        </Grid>
       <Grid item sm />
      </Grid>
      )
    
}

export default (withStyles(styles)(Login))
