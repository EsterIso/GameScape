import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyA582vpXtFF-1IEZIxEPb7XDkaUCdDbWz0",
  authDomain: "gamescape-bcd48.firebaseapp.com",
  projectId: "gamescape-bcd48",
  storageBucket: "gamescape-bcd48.firebasestorage.app",
  messagingSenderId: "1067157907188",
  appId: "1:1067157907188:web:c98918bb8111ed2a5260a1",
  measurementId: "G-YV37VHGBEV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };