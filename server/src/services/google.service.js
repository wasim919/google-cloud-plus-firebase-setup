const { getAuth } = require('firebase-admin/auth');
const { getDatabase } = require('firebase-admin/database');

const db = getDatabase();

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

module.exports = {
	checkForUserRecord,
	addRefreshTokenToUserInDatabase,
	createNewUser
};
