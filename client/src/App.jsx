import { signInWithCustomToken } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import styles from './App.module.css';
import { FIREBASE_CUSTOM_TOKEN_NAMESPACE } from './core/constants';
import { firebaseAuth } from './core/firebase.config';
import axios from 'axios';

function App() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		firebaseAuth.onAuthStateChanged((user) => {
			if (!user) {
				setUser(null);
			} else {
				setUser(user);
			}
		});
	}, []);

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const customToken = searchParams.get(FIREBASE_CUSTOM_TOKEN_NAMESPACE);
		if (!!customToken?.trim()?.length) {
			handleFirebaseLogin(customToken);
		}
	}, []);

	const handleFirebaseLogin = async (customToken) => {
		try {
			await signInWithCustomToken(firebaseAuth, customToken);
		} catch (error) {
			console.error(error);
		}
	};

	const renderLogoutUI = () => {
		return <button onClick={handleLogin}>Sign in with Google</button>;
	};

	const renderLoggedInUI = () => {
		return (
			<div className={styles.loginUI}>
				<pre>You are logged in as {JSON.stringify(user, null, 2)}</pre>
				<button onClick={handleLogout}>Logout</button>
			</div>
		);
	};

	const handleLogin = async () => {
		try {
			const { data } = await axios.post('http://localhost:4000/api/v1/google/authLink');
			location.replace(data.redirectUrl);
		} catch (error) {
			console.error(error);
		}
	};

	const handleLogout = async () => {
		try {
			await firebaseAuth.signOut();
		} catch (error) {
			console.error(error);
		}
	};
	return <div className={styles.container}>{!!Object.keys(user ?? {}).length ? renderLoggedInUI() : renderLogoutUI()}</div>;
}

export default App;
