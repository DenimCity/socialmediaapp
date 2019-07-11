const functions = require('firebase-functions');
const app = require('express')();
const { getAllScreams, postOneScream} = require('./handlers/screams')
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users')
const { authCheck } = require('./util/middleware')

// scream routes
app.get('/screams', getAllScreams);
app.post('/scream', authCheck, postOneScream);
app.post('/user/image', authCheck, uploadImage);
app.post('/user', authCheck, addUserDetails );
app.get('/user', authCheck, getAuthenticatedUser)

// user routes
app.post('/signup', signup);
app.post('/login', login);

// images

exports.api = functions.https.onRequest(app);