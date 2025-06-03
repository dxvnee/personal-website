// firebase/firebase.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID,
} = process.env;

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID
};

let app;
let firestoredb;

const initializeFirebaseApp = () => {
    try {
        app = initializeApp(firebaseConfig);
        firestoredb = getFirestore(app);
        console.log('✅ Firebase initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
    }
}

const getFirestoreInstance = () => {
    if (!firestoredb) {
        throw new Error("Firebase belum diinisialisasi. Jalankan initializeFirebaseApp() terlebih dahulu.");
    }
    return firestoredb;
};

module.exports = {
    initializeFirebaseApp,
    getFirestoreInstance,
};
