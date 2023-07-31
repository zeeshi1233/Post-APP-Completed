import {app,auth,db} from './firebas.js'
import { createUserWithEmailAndPassword,signInWithEmailAndPassword, } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {setDoc,doc,serverTimestamp  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


const signup=()=>{
const name=document.getElementById("name").value
const username=document.getElementById("userName").value
const email=document.getElementById("email").value
const password=document.getElementById("pass").value
const userData={
    name:name,
    username:username,
    email:email,
    timestamp:serverTimestamp(),
    pic:false,
}

    createUserWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
...userData,
user:user.uid
      });
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Account Create Successfuly',
        showConfirmButton: false,
        timer: 1500
      }).then(()=>{
          location.replace('login.html')
        }
        )
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: error.message,
        showConfirmButton: false,
        timer: 1500
      })
    });
  
}


const login=()=>{
    const email=document.getElementById("email").value
    const password=document.getElementById("pass").value

    
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Login Successfuly',
        showConfirmButton: false,
        timer: 1500
      }).then(()=>{
        location.replace('index.html')
      }
      )
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: error.message,
        showConfirmButton: false,
        timer: 1500
      })
  });

    }
    


window.signup=signup
window.login=login