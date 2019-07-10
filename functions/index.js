const functions = require('firebase-functions');
const app = require('express')();
const { getAllScreams, postOneScream} = require('./handlers/screams')
const { signup, login, uploadImage } = require('./handlers/users')
const { authCheck } = require('./util/middleware')

// scream routes
app.get('/screams', getAllScreams);
app.post('/scream', authCheck, postOneScream)

// user routes
app.post('/signup', signup);
app.post('/login', login);

// images
app.post('/user/image', authCheck, uploadImage)

exports.api = functions.https.onRequest(app);