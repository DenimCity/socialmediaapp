import React, {Fragment} from 'react'
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
// Icons
import HomeIcon from '@material-ui/icons/Home';

function NavBar({authenticated}) {
      return (
            <div>
      <AppBar>
        <Toolbar className="nav-container">
   
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
        </Toolbar>
      </AppBar>
            </div>
      )
}

export default NavBar
