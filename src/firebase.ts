import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBd5I4WthhhkMnJPr6jzuR5jZ6OlGMByDM",
  authDomain: "tutedude-758bc.firebaseapp.com",
  projectId: "tutedude-758bc",
  storageBucket: "tutedude-758bc.firebasestorage.app",
  messagingSenderId: "1024086921689",
  appId: "1:1024086921689:web:0e06226d994646131e89c8",
  measurementId: "G-XK9DRKKPK3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 