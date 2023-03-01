const express = require('express');
const router = express.Router();

const { google } = require('googleapis');
const { getAuth } = require('firebase-admin/auth');
const { FIREBASE_CUSTOM_TOKEN_NAMESPACE } = require('../core/constants');
const { checkForUserRecord, addRefreshTokenToUserInDatabase } = require('../services/google.service');
const { oauth2Client } = require('../core/google.helper');

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

module.exports = router;
