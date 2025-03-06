const admin = require('firebase-admin');

// Initialize Firebase Admin with default credentials (set GOOGLE_APPLICATION_CREDENTIALS env variable)
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

module.exports = db;
