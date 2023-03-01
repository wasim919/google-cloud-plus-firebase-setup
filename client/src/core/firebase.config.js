import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
	FIREBASE_API_KEY,
	FIREBASE_APP_ID,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_DB_URL,
	FIREBASE_MESSAGING_SENDER_ID,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET
} from './constants.env';

const firebaseConfig = {
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	databaseURL: FIREBASE_DB_URL,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
	appId: FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

export { firebaseAuth };
