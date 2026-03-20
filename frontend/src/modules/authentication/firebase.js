import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQZa1iB2XnnQBVheKrVa3dZOW8PSPb68U",
  authDomain: "featurevault.firebaseapp.com",
  projectId: "featurevault",
  storageBucket: "featurevault.firebasestorage.app",
  messagingSenderId: "941235426806",
  appId: "1:941235426806:web:a31c804ae7365d9db563d7",
  measurementId: "G-NZL595Q3D7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();