import * as firebase from 'firebase';

export default () => {
    let firebaseApp;
    if(!firebase.apps.length) {
        firebaseApp = firebase.initializeApp({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID
        });
    } else {
        firebaseApp = firebase.app();
    }

    return firebaseApp.firestore();
}