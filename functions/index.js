const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const firebase = require('firebase');

const firebaseConfig = require('./cred')
const { validateRegisterInput, validateLoginInput } = require('./util/validator')

firebase.initializeApp(firebaseConfig)
admin.initializeApp();

app.get('/screams', async (req, res) => {

      try {
            let screams = [];
            const data =  await admin.firestore().collection('screams').orderBy('createdAt', 'desc').get();
           data.forEach((doc) => {
            screams.push({
                  screamId: doc.id,
                  ...doc.data()
                  })
            });
            return res.json(screams)
      } catch (error) {
            console.error(error)
            return res.status(400).json({error: `Error retrieving data`, why: error.message})
      }
})


app.post('/scream', async (req, res) => {
      const { body, username } = req.body;
      const newScream = {
            body,
            username,
            createdAt: new Date().toISOString()
      };

      try {
            const doc = await  admin.firestore().collection('screams').add(newScream)
            return res.json({message: `Document ${doc.id} created successfully`})
      } catch (error) {
            console.error(error)
            return res.status(500).json({error: `something went wrong`})
      }
})


app.post('/signup', async (req, res) => {

      const newUser = {
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            username: req.body.username,
      }

      const {valid, errors} = validateRegisterInput(newUser);
        if (!valid) {
            return res.status(400).json({ message:'Input Validation Error', errors })
       }

  let token, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ username: 'this username is already taken' });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        username: newUser.username,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already is use' });
      } else {
        return res
          .status(500)
          .json({ general: 'Something went wrong, please try again' });
      }
    });

})

app.post('/login', async ( { body: { email, password } }, res ) => {
      try {
         const {valid, errors} = validateLoginInput(email, password);
         if (!valid)return res.status(400).json({ message:'User login Error', errors })
         const data = await firebase.auth().signInWithEmailAndPassword(email, password)
         const token = data.user.getIdToken()
      return res.json({token})
      } catch (error) {
         console.error(error)
         if (error.code === 'auth/wrong-password') {
               return res.status(403).json({general: 'wrong credentials, please try again.'})
         }
         return res.status(500).json({error: error.code, message: error.message})
      }
});
exports.api = functions.https.onRequest(app);