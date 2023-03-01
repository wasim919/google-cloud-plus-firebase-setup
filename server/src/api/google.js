const express = require('express');
const router = express.Router();

const { google } = require('googleapis');
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getDatabase } = require('firebase-admin/database');
const serviceAccount = require('../config/google-credentials.json');
const { FIREBASE_CUSTOM_TOKEN_NAMESPACE } = require('../core/constants');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, FIREBASE_DB_URL } = require('../core/constants.env');

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

initializeApp({
	credential: cert(serviceAccount),
	databaseURL: FIREBASE_DB_URL
});

const db = getDatabase();

router.get('/', (req, res) => {
	res.json({
		refresh_token: REFRESH_TOKEN
	});
});

router.post('/authLink', (req, res) => {
	try {
		// generate a url that asks permissions for Blogger and Google Calendar scopes
		const scopes = ['profile', 'email', 'https://www.googleapis.com/auth/calendar'];

		const url = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: scopes,
			// force access
			prompt: 'consent'
		});
		res.json({
			redirectUrl: url
		});
	} catch (error) {
		res.json({ error: error.message });
	}
});

router.get('/redirect', async (req, res) => {
	console.log('google.js 39 | handling redirect', req.query.code);
	// handle user login
	try {
		const { tokens } = await oauth2Client.getToken(req.query.code);
		oauth2Client.setCredentials(tokens);

		// get google user profile info
		const oauth2 = google.oauth2({
			version: 'v2',
			auth: oauth2Client
		});

		const googleUserInfo = await oauth2.userinfo.get();

		console.log('google.js 72 | credentials', tokens);

		const userRecord = await checkForUserRecord(googleUserInfo.data.email);

		if (userRecord === 'auth/user-not-found') {
			const userRecord = await createNewUser(googleUserInfo.data, tokens.refresh_token);
			const customToken = await getAuth().createCustomToken(userRecord.uid);
			res.redirect(`http://127.0.0.1:3000?${FIREBASE_CUSTOM_TOKEN_NAMESPACE}=${customToken}`);
		} else {
			const customToken = await getAuth().createCustomToken(userRecord.uid);

			await addRefreshTokenToUserInDatabase(userRecord, tokens);

			res.redirect(`http://127.0.0.1:3000?${FIREBASE_CUSTOM_TOKEN_NAMESPACE}=${customToken}`);
		}
	} catch (error) {
		res.json({ error: error.message });
	}
});

const checkForUserRecord = async (email) => {
	try {
		const userRecord = await getAuth().getUserByEmail(email);
		console.log('google.js 35 | userRecord', userRecord.displayName);
		return userRecord;
	} catch (error) {
		return error.code;
	}
};

const createNewUser = async (googleUserInfo, refreshToken) => {
	console.log('google.js 65 | creating new user', googleUserInfo.email, refreshToken);
	try {
		const userRecord = await getAuth().createUser({
			email: googleUserInfo.email,
			displayName: googleUserInfo.name,
			providerToLink: 'google.com'
		});

		console.log('google.js 72 | user record created', userRecord.uid);

		await db.ref(`users/${userRecord.uid}`).set({
			email: googleUserInfo.email,
			displayName: googleUserInfo.name,
			provider: 'google',
			refresh_token: refreshToken
		});

		return userRecord;
	} catch (error) {
		return error.code;
	}
};

const addRefreshTokenToUserInDatabase = async (userRecord, tokens) => {
	console.log('google.js 144 | adding refresh token to user in database', userRecord.uid, tokens);
	try {
		const addRefreshTokenToUser = await db.ref(`users/${userRecord.uid}`).update({
			refresh_token: tokens.refresh_token
		});
		console.log('google.js 55 | addRefreshTokenToUser', tokens);
		return addRefreshTokenToUser;
	} catch (error) {
		console.log('google.js 158 | error', error);
		return error.code;
	}
};

module.exports = router;
