const BusBoy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { reduceUserDetails, validateRegisterInput, validateLoginInput } = require('../util/validator')
const { admin, db} = require('../util/admin');

const firebase = require('firebase');
const firebaseConfig = require('../util/config');

firebase.initializeApp(firebaseConfig);

exports.signup =  (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

   const {valid, errors} = validateRegisterInput(newUser);
        if (!valid) {
            return res.status(400).json({ message:'Input Validation Error', errors })
       }

const noImg = 'no-img.png';

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: 'this handle is already taken' });
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
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${
firebaseConfig.storageBucket
        }/o/${noImg}?alt=media`,
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
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
}


exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginInput(user.email, user.password);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      // auth/wrong-password
      // auth/user-not-user
      return res
        .status(403)
        .json({ general: 'Wrong credentials, please try again' });
    });
}

/// Get own Authenticated Users details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {}
  db.doc(`/user/${req.user.handle}`).get()
    .then(doc => {
      if(doc.exists) {
        userData.credentials = doc.data();
        return db.collection('likes').where('userHandle', '==', req.user.handle).get();
      }
    })
    .then(data => {
      userData.likes = []
      data.forEach(doc => {
        userData.likes.push(doc.data());
      })
      return db.collection('notifications').where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc').limit(10).get()
    })
    .then((data) => {
      userData.notifications = []
      data.forEach(doc => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,

        })
      });
      return res.json(userData)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: err.code})
    })
}



//Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`).update(userDetails)
  .then(() => res.json({message: 'Details added successfully' }))
  .catch(error => {
    console.error(error)
    return res.status(500).json({error: error.code})
  })
}

// upload image profile
exports.uploadImage = (req, res) => {
  
  let imageFilename
  let imageToBeUploaded = {};

  const busboy = new BusBoy({ headers: req.headers })
  busboy.on('file', (fieldname, file, filename, encoding, mimeType) => {

    // checking upload file type
    if (mimeType !== 'image/jpeg' && mimeType !== 'image/png') {
      return res.status(400).json({error: 'Wrong file type Submitted'})
    }

    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFilename = `${Math.round(Math.random() * 1000000000000)}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFilename);
    imageToBeUploaded = { filePath, mimeType }
    file.pipe(fs.createWriteStream(filePath))
  })
 busboy.on('finish', () => {
  admin.storage().bucket().upload(imageToBeUploaded.filePath, {
    resumable: false,
    metadata : {
      metadata: {
        contentType: imageToBeUploaded.mimeType
      }
    }
  })
  .then(()=> {
    const imageUrl = `https://firebasestorage.googleapis.comv/0/b${firebaseConfig.storageBucket}/o/${imageFilename}?alt=media`
    return db.doc(`/users/${req.user.handle}`).update({imageUrl})
  })
  .then(() => {
    return res.json({message: 'Image uploaded successfully'})
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({ error: err.code, why: 'Error occurred while uploading image' })
  })
 })
busboy.end(req.rawBody)
}




exports.markNotificationsRead  = (req, res) => {
  let batch = db.batch()
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notification/${notificationId}`);
    batch.update(notification, { read: true})
  })
  batch.commit()
  .then(() => {
    return res.json({message: 'Notifications marked Read'})
  })
  .catch(error => {
    console.error(error)
    return res.status(500).json({error: error.code})
  })
}


exports.getUserDetails  = (req, res) => {
  let userData = {}
  db.doc(`/users/${req.params.handle}`).get()
  .then(doc => {
    if (doc.exists){
      userData.user = doc.data()
      return db.collection('screams').where('userHandele', '===', req.params.handle)
      .orderBy('createdAt', 'desc')
      .get()
    } else {
      return res.status(404).json({error: "User not found"})
    }
  })
  .then(data => {
    userData.screams = []
    data.forEach(doc => {
      userData.screams.push({
        body: doc.data().body,
        createdAt: doc.data().createdAt,
        userHandle: doc.data().userHandle,
        userImage: doc.data().userImage,
        likeCount: doc.data().likeCount,
        commentCount: doc.data().commentCount,
        screamId: doc.data().screamId,
      })
    })
    return res.json(userData)
  })
  .catch(error => {
    console.error(error)
    return res.status(500).json({error: error.code})
  })
}



