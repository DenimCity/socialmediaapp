const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
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
            console.error(err)
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
            console.error(err)
            return res.status(500).json({error: `something went wrong`})
      }
})


exports.api = functions.https.onRequest(app);