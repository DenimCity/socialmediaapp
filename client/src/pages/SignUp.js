import React, { useState, useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
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
import { signUpUser } from '../redux/actions/userActions'

const styles = (theme) => ({
  ...theme
});

const SignUp = (props) =>  {

  const [state, setState] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      handle: '',
      errors: {}
    })
  
  useEffect(() =>{
    if (props.UI.errors) {
      setState({...state,  errors: props.UI.errors });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.UI.errors]) 

  const handleSubmit = (event) => {
    event.preventDefault();
    setState({...state, loading: true });
    const newUserData = {
      email: state.email,
      password: state.password,
      confirmPassword: state.confirmPassword,
      handle: state.handle
    };
    props.signUpUser(newUserData, props.history);
  };


  const handleChange = event => setState({...state, [event.target.name]: event.target.value})
  
  
    const { classes, UI: { loading } } = props;
    const { errors } = state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={AppIcon} alt="monkey" className={classes.image} />
          <Typography variant="h2" className={classes.pageTitle}>
            SignUp
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
              value={state.email}
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
              value={state.password}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              className={classes.textField}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              value={state.confirmPassword}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              id="handle"
              name="handle"
              type="text"
              label="Handle"
              className={classes.textField}
              helperText={errors.handle}
              error={errors.handle ? true : false}
              value={state.handle}
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
              SignUp
              {loading && (
                <CircularProgress size={30} className={classes.progress} />
              )}
            </Button>
            <br />
            <small>
              Already have an account ? Login <Link to="/login">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
}


const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

export default connect(mapStateToProps, {signUpUser})(withStyles(styles)(SignUp));
