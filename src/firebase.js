// import firebase from "firebase/app"
// import "firebase/auth"


// const app = firebase.initializeApp({
//     apiKey: "AIzaSyB8YNpQLRsFqFHTfVwJJWS0d0UwdkjLy7I",
//     authDomain: "healthhub-f540d.firebaseapp.com",
//     projectId: "healthhub-f540d",
//     storageBucket: "healthhub-f540d.appspot.com",
//     messagingSenderId: "241699810014",
//     appId: "1:241699810014:web:3bcfc02013497882c7704f"
// })


// export const auth =app.auth();
// export default app

// Import Firebase core functions
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB8YNpQLRsFqFHTfVwJJWS0d0UwdkjLy7I",
    authDomain: "healthhub-f540d.firebaseapp.com",
    projectId: "healthhub-f540d",
    storageBucket: "healthhub-f540d.appspot.com",
    messagingSenderId: "241699810014",
    appId: "1:241699810014:web:3bcfc02013497882c7704f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export default app;