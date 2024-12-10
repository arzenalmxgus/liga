import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDmJQeuAPHi4nEY2pS9HRkIFKePPtsPC2E",
  authDomain: "exam-kay-sir-marlou.firebaseapp.com",
  projectId: "exam-kay-sir-marlou",
  storageBucket: "exam-kay-sir-marlou.firebasestorage.app",
  messagingSenderId: "1021305985812",
  appId: "1:1021305985812:web:40675c29dc35ef8b29c001",
  measurementId: "G-GLMJ7C8VEV"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);