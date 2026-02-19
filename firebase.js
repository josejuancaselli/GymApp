// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5rCHNVHv5hVm2CBQ-axQoR3khwdycyWU",
  authDomain: "gym-app-6ab61.firebaseapp.com",
  projectId: "gym-app-6ab61",
  storageBucket: "gym-app-6ab61.firebasestorage.app",
  messagingSenderId: "293991958803",
  appId: "1:293991958803:web:b5ddacf9c55ee27ddd72e6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
