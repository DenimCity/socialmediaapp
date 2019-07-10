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

async function authorization(req, res, next){
      let idToken
      if (req.headers.authorization && req.headers.authorization.includes('Bearer')){
            idToken = req.headers.authorization.split('Bearer ')[1]
      } else {
            console.error('No token found')
            return res.status(403).json({error: 'Unauthorized'})
      }

     try {
       const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('decoded token',decodedToken)
      req.user = decodedToken
      const data = await db.collection('users').where('userID', '===', req.user.uid).limit(1).get()
      req.user.username = data.docs[0].data().username;
      return next()
     } catch (error) {
           console.error('Error while verifying token', err)
           return res.status(403).json(error)
     }
}

app.post('/scream',authorization, async (req, res) => {
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
            username: req.user.username,
      }

      const {valid, errors} = validateRegisterInput(newUser);
        if (!valid) {
            return res.status(400).json({ message:'Input Validation Error', errors })
       }
     /*  const user = await db.doc(`/users/${newUser.username}`).get()
      if (user.exists){
            return res.status(400).json({ username: 'this username is already taken' });
      } else {
          const data = await admin.auth().createUser({ newUser })
          const userId = data.user.uid;
          const token = await data.user.getIdToken();
          const userCredentials = {
                  username: newUser.username,
                  email: newUser.email,
                  createdAt: new Date().toISOString(),
                  userId
      };

      db.doc(`/users/${newUser.username}`).set(userCredentials);
      return res.status(201).json({ token });
      }
      */
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