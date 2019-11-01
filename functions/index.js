const functions = require('firebase-functions');
const app = require('express')();
const { getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream, deleteScream} = require('./handlers/screams')
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser,
markNotificationsRead, getUserDetails } = require('./handlers/users')
const { authCheck } = require('./util/middleware')
const { db } = require('./util/admin')
const cors = require('cors');

app.use(cors());
// scream routes
app.get('/screams', getAllScreams);
app.get('/scream/:screamId', getScream)
//protected scream routes
app.post('/scream', authCheck, postOneScream);
app.post('/scream/:screamId/comment', authCheck, commentOnScream)

app.get('/scream/:screamId/like', authCheck, likeScream)
app.get('/scream/:screamId/unlike', authCheck, unlikeScream)
app.delete('/scream/:screamId/', authCheck, deleteScream)


// user routes
app.post('/signup', signup);
app.post('/login', login);
// protected user routes
app.post('/user/image', authCheck, uploadImage);
app.post('/user', authCheck, addUserDetails );
app.get('/user', authCheck, getAuthenticatedUser)
app.get('/user/:handle', getUserDetails)
app.get('/notifications', authCheck, markNotificationsRead)


exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore.document('likes/${id}')
      .onCreate((snapshot) => {
            return db.doc(`/screams/${snapshot.data()}`).get()
            .then(doc => {
                  if (doc.exists && doc.data().userHandle === snapshot.data().userHandle){
                        return db.doc(`/notifications/${snapshot.id}`).set({
                              createdAt: new Date.toString(),
                              recipient: doc.data().userHandle,
                              sender: doc.data().userHandle,
                              type: 'like',
                              read: false,
                              screamId :doc.id
                        })
                  }
            })
            .catch(error => {
                  console.error(error)
            })
      })


exports.createNotificationOnComment = functions.firestore.document('comments/${id}')
      .onCreate((snapshot) => {
            return db.doc(`/screams/${snapshot.data()}`).get()
            .then(doc => {
                  if (doc.exists && doc.data().userHandle === snapshot.data().userHandle){
                        return db.doc(`/notifications/${snapshot.id}`).set({
                              createdAt: new Date.toString(),
                              recipient: doc.data().userHandle,
                              sender: doc.data().userHandle,
                              type: 'comment',
                              read: false,
                              screamId :doc.id
                        })
                  }
            })
            .catch(error => {
                  console.error(error);
            })
      })

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/${id}')
      .onDelete((snapshot) => {
            return db.doc(`/notifications/${snapshot.id}`).delete()
            .catch(error => {
                  console.error(error);
            })
      })

exports.onUserImageChange = functions.firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('screams')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onScreamDelete = functions.firestore.document('/screams/{screamId}')
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('screamId', '==', screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection('likes')
          .where('screamId', '==', screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('screamId', '==', screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
