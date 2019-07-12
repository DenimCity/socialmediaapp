import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import moment from 'moment'
// Icons
import ChatIcon from '@material-ui/icons/Chat';

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};
const Scream = (props) => {
       const {
      classes,
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        screamId,
        likeCount,
        commentCount
      }
    } = props;
      return (
            <Card className={classes.card}>
                   <CardMedia
                        image={userImage}
                        title="Profile image"
                        className={classes.image}
                  />
                  <CardContent className={classes.content}>
                        <Typography  variant='h5' 
                        component={Link} to={`/user/${ userHandle }`}  
                        color="primary">{userHandle}</Typography>
                        <Typography variant='body2' color="textSecondary">{moment(createdAt).fromNow()}</Typography>
                        <Typography variant='body1' color="textSecondary">{body}</Typography>
                  </CardContent>
            </Card>
      )
}

export default (withStyles(styles)(Scream))
