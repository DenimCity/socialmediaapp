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