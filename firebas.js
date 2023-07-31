 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
 import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
 import { getFirestore  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
 import {getStorage } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

 const firebaseConfig = {
  apiKey: "AIzaSyCV5G8wUg2djvAze7TQg82mvn5Gl6LtGeU",
  authDomain: "userrecord-c3661.firebaseapp.com",
  projectId: "userrecord-c3661",
  storageBucket: "userrecord-c3661.appspot.com",
  messagingSenderId: "415271132494",
  appId: "1:415271132494:web:6dc1be1d3956826eabd21f",
  measurementId: "G-F0PRXPVM9Z"
};

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth=getAuth(app)
 const db=getFirestore (app)
 const storage = getStorage();
 export {app,auth,db,storage}