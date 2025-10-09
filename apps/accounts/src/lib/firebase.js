// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRyooUo6KheeDUEuEV9Add_XozmN_p--0",
    authDomain: "xtrawrkx.firebaseapp.com",
    projectId: "xtrawrkx",
    storageBucket: "xtrawrkx.firebasestorage.app",
    messagingSenderId: "647527626177",
    appId: "1:647527626177:web:6e9bd04cd062e821f9ab40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

