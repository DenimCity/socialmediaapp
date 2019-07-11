const { db } = require('../util/admin')


exports.postOneScream = async (req, res) => {

      const { body } = req.body;
      if (body.trim() === "" ){
            return res.status(400).json({ body: 'Body must not be empty'});
      }

      const newScream = {
            body: body,
            userHandle: req.user.handle,
            userImage: req.user.imageUrl,
            createdAt: new Date().toISOString(),
            likeCount: 0,
            commentCount: 0
      };

      try {
            const doc = await db.collection('screams').add(newScream)
            const screamResponse = newScream
            screamResponse.screamId = doc.id;
            return res.json(resScream);
      } catch (error) {
            console.error(error)
            return res.status(500).json({error: `something went wrong`, why: error })
      }
}

exports.getAllScreams = async (req, res) => {

      try {
            let screams = [];
            const data =  await db.collection('screams').orderBy('createdAt', 'desc').get();
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
}

exports.getScream = ( req, res) => {
      let screamData = {}
      db.doc(`/screams/${req.params.screamId}`).get()
      .then(doc => {
            if (!doc.exists){
                  return res.status(404).json({error: 'Scream not found'})
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db.collection('comments')
            .orderBy('createdAt', 'desc')
            .where('screamId', '==', req.params.screamId).get()
      })
      .then(data => {
            screamData.comments = []
            data.forEach(doc => {
                  screamData.comments.push(doc.data())
            });
            return res.json(screamData)
      })
      .catch(error => {
            console.error(error)
            return res.status(500).json({error: error.code})
      })
}

exports.commentOnScream = (req, res) => {
      if(req.body.body.trim() === '')return res.status(400).json({error: "Must not be empty"})

      const newComment = {
            body: req.body.body,
            createAt: new Date().toDateString(),
            screamId: req.params.screamId,
            userHandle: req.user.handle,
            userImage: req.user.imageUrl
      };

      db.doc(`/screams/${req.params.screamId}`).get()
      .then(doc => {
            if(!doc.exists){
                  return res.status(400).json({error: 'Scream not found'})
            }
            return db.collection('comments').add(newComment);
      })
      .then(() => {
            return res.json(newComment) 
      })
      .catch(error => {
            console.log(error)
            return res.status(500).json({error: 'Something went wrong'})
      })
}