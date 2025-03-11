const admin = require('firebase-admin');
const serviceAccount = require("./nourishnet-452913-e0e23935815c.json")

// Initialize Firebase Admin with default credentials (set GOOGLE_APPLICATION_CREDENTIALS env variable)
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://nourishnet-23e6e.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;
