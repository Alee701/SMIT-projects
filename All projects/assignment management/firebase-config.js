// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAcgeaLsMPapn2pA_jSwX1jMWSATjAZn24",
    authDomain: "project-display-d76e2.firebaseapp.com",
    projectId: "project-display-d76e2",
    storageBucket: "project-display-d76e2.appspot.com",
    messagingSenderId: "103551304123",
    appId: "1:103551304123:web:a4aae93f38de501a37049e",
    measurementId: "G-6GXLH2CEW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
