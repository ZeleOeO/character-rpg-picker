// ─────────────────────────────────────────────────────────────
//  firebase-config.js  –  Firebase initialisation
//
//  ⚠️  This key is visible in your page source to anyone who
//  opens DevTools. That is normal for client-side Firebase;
//  protect access using Firebase Security Rules in the console,
//  not by hiding the key.
// ─────────────────────────────────────────────────────────────

const firebaseConfig = {
    apiKey:            "AIzaSyCgVHi2WN9kRs6uQS_HFXIihBvWduPDYxA",
    authDomain:        "rpg-character-picker.firebaseapp.com",
    projectId:         "rpg-character-picker",
    storageBucket:     "rpg-character-picker.firebasestorage.app",
    messagingSenderId: "473471353264",
    appId:             "1:473471353264:web:5d8226ec75822775f7d675",

    // Realtime Database URL.
    // Default (US region): https://rpg-character-picker-default-rtdb.firebaseio.com
    // EU region would look like: https://rpg-character-picker-default-rtdb.europe-west1.firebasedatabase.app
    // Check your Firebase Console → Realtime Database for the exact URL.
    databaseURL: "https://rpg-character-picker-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
