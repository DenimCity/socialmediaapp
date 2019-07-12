import React, { Component, useState, useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { Link } from 'react-router-dom';

// MUI Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// Redux stuff
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = (theme) => ({
  ...theme
});

const Login = (props) =>  {
  const [values, setValues] = useState({
      email: '',
      password: '',
      errors: {}
    })

    useEffect(() => {
      if (props.UI.errors) {
      setValues({...values, errors: props.UI.errors });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.UI.errors])


  const { classes,  UI: { loading }} = props;
  const {  email, errors, password } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    props.loginUser(userData, props.history);
  };

  const handleChange = (event) => setValues({...values, [event.target.name]: event.target.value});

    
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="monkey" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={values.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={values.password}
              onChange={handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Login
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              dont have an account ? sign up <Link to="/signup">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  // }
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
})

export default connect(mapStateToProps, { loginUser })(withStyles(styles)(Login));
