# Firebase + Goolge Cloud Authentication Base Setup

## Setup

### 1. Env Setup

#### a. Server

```
NODE_ENV=
PORT=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FIREBASE_DB_URL=
GOOGLE_REDIRECT_URI=
```

`Add google-credentials.json file inside /server/src/config`

#### b. Client

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DB_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Running Setup

### Server

```
cd server

npm install

npm run dev
```

Server runs at: `http://localhost:4000`

### Client

```
cd client

npm install

npm run dev
```

Client runs at: `http://localhost:3000`
