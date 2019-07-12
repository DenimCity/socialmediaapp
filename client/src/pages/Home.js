import React,{ useEffect, useState }  from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'
import Screams from '../components/Screams';

const Home = () => {

      const [screams, setScreams] = useState([])


      useEffect(() => {
            axios.get('/screams')
            .then(result => {
                  console.log(result.data)
                  setScreams(result.data)
            })
            .catch(error => {
                  console.error(error)
            });
      },[])
      return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {
            screams && screams.map(scream =>(
                <Screams key={scream.screamId} scream={scream} />
            ))
          }
        </Grid>
        <Grid item sm={4} xs={12}>
          {/* <Profile /> */}
          Profile
        </Grid>
      </Grid>
      )
}

export default Home
