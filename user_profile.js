import { app, auth, db, storage } from './firebas.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { setDoc, doc, query, where, onSnapshot, collection, addDoc, updateDoc,orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
let curuid;

const show_user = () => {
    var userProfile=JSON.parse(localStorage.getItem("Profile_Data"))
  onAuthStateChanged(auth, (user) => {
    if (user) {
      onSnapshot(collection(db, "users"), (data) => {
        data.docChanges().forEach((change) => {
          if (change.doc.data().user===userProfile.id) {
         document.getElementById("user_name").innerHTML=change.doc.data().name
         document.getElementById("user_pic").src=userProfile.pic
          }
        })
      });
      mytest(user.uid)
    } else {
      window.location.href = "login.html"
    }
    
  });
}
show_user()




document.getElementById("load").style.display = "grid";

function mytest(uid) {
    var users=JSON.parse(localStorage.getItem("Profile_Data"))
  var mytestpost = document.getElementById("userpost");
  if (users.id===uid) {
    location.replace("profile.html")
  }
  const q = query(collection(db, "post"), where("user", "==", users.id));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.size === 0) {
      document.getElementById("nofound").style.display="flex"
      document.getElementById("load").style.display="none"
    }
    else{
      document.getElementById("nofound").style.display="none"
    snapshot.docChanges().forEach((change) => {
      document.getElementById("load").style.display="none"
      const { name, pic, timestamp, user } = change.doc.data()
      console.log(change.doc.data());
      let picsHtml = "";
             if (pic) {
               picsHtml = `<img src="${pic}" id="self">`;
             } else {
               picsHtml = "";
            }
      mytestpost.innerHTML += `
<div class="post_sty" id="post_sty">
           <div class="profile-pic1" style="display: flex;align-items: center;">
             <img src="${users.pic ? users.pic : 'download.jpg'}" id="ur_img" width="50px " height="50px" style="border-radius: 50%;" alt="">
             <div style='display:block;' > 
               <p style="font-size: 20px;margin-left: 10px;font-weight: bold;" id="sec">${users.name}</p>
               <span style='font-size:14px;margin-left:10px;'>${timestamp ? moment(timestamp.toDate()).fromNow():moment().fromNow()}</span>
             </div>
           </div>
           <div>
                        <i style="margin-left: -30px;" class="fa-solid fa-ellipsis-vertical"></i>
                      </div>
                    </div>
                    <div style="box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;">
                      <div class="com_post">
                        <div class="des">
                          <p style="font-size: 18px;">${name}</p>
                        </div>
                        ${picsHtml}
                      </div>
                      <div class="social">
                        <div>
                          <li><i class="fa-regular fa-heart"></i></li>
                        </div>
                        <div>
                          <li><i class="fa-regular fa-message"></i></li>
                        </div>
                        <div>
                          <li><i class="fa-regular fa-bookmark"></i></li>
                        </div>
                        <div>
                          <li><i class="fa-solid fa-share"></i></li>
                        </div>
                      </div>
                      <br>
                    </div>
                    <br>

`


    });
  }
  });

}
