const { initializeApp, cert } = require('firebase-admin/app');
const { FIREBASE_DB_URL } = require('./constants.env');
const serviceAccount = require('../config/google-credentials.json');

initializeApp({
	credential: cert(serviceAccount),
	databaseURL: FIREBASE_DB_URL
});
