const functions = require('firebase-functions');
const app = require('express')();
const { getAllScreams, postOneScream, getScream, commentOnScream} = require('./handlers/screams')
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users')
const { authCheck } = require('./util/middleware')

// scream routes
app.get('/screams', getAllScreams);
app.get('/scream/:screamId', getScream)
//protected scream routes
app.post('/scream', authCheck, postOneScream);
app.post('/scream/:screamId/comment', authCheck, commentOnScream)



// user routes
app.post('/signup', signup);
app.post('/login', login);
// protected user routes
app.post('/user/image', authCheck, uploadImage);
app.post('/user', authCheck, addUserDetails );
app.get('/user', authCheck, getAuthenticatedUser)

// images

exports.api = functions.https.onRequest(app);