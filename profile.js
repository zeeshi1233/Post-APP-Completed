import { app, auth, db, storage } from './firebas.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { setDoc, doc, query, where, onSnapshot, collection, addDoc, updateDoc,orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
let curuid;

const show_user = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      curuid = user.uid;
      const uid = user.uid;
      onSnapshot(collection(db, "users"), (data) => {
        data.docChanges().forEach((change) => {
          if (uid == change.doc.data().user) {
           localStorage.setItem("CurentName",change.doc.data().name)
           localStorage.setItem("CurentuserPic",change.doc.data().pic)
            document.getElementById("user_name").innerHTML = change.doc.data().name
            if (change.doc.data().pic) {
              document.getElementById("user_pic").src = change.doc.data().pic
            }
            else {
              document.getElementById("user_pic").src = "download.jpg"
            }
            mytest(change.doc.data())
          }

        })
      });

    } else {
      window.location.href = "login.html"
    }
  });
}
show_user()


document.getElementById("load").style.display = "grid";

function mytest(users) {
  var mytestpost = document.getElementById("userpost");
  const q = query(collection(db, "post"), where("user", "==", users.user));
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



// Edit Functions

window.edit_profile = () => {
  document.getElementById("edit_profile").style.display = "flex"
  let img = document.getElementById("upd_img")
  var curName =localStorage.getItem("CurentName")
  var curPic =localStorage.getItem("CurentuserPic")
  let name = document.getElementById("upd_name")
  name.value=curName
  img.src=curPic
}

window.upd_Pro = async () => {

  let img = document.getElementById("upd_img")
  let imgPath = document.getElementById("upd_user_img")
  let name = document.getElementById("upd_name")
  if(name.value == "" ){
name.style.border="2px  solid red"
document.getElementById("req").style.display="block"

}
else{
    name.style.border="none"
    document.getElementById("req").style.display="none"
    if (imgPath.files.length>0) {
      
      
      const storageRef = ref(storage, `user_img/${imgPath.files[0].name}`);
      
      const uploadTask = uploadBytesResumable(storageRef, imgPath.files[0]);
      uploadTask.on('state_changed',
      (snapshot) => {
        
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
            case 'running':
              console.log('Upload is running');
              break;
            }
          },
          (error) => {
            console.log(error.Message);
          },
          () => {
        
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          console.log('File available at', downloadURL);
          const washingtonRef = doc(db, "users", curuid);
          await updateDoc(washingtonRef, {
            name: name.value,
            pic: downloadURL,
          }); 
          alert("Profile is Update")
          location.reload()
          document.getElementById("edit_profile").style.display = "none"         
        });
      }
      );
    }
    else{
      const washingtonRef = doc(db, "users", curuid);
      await updateDoc(washingtonRef, {
        name: name.value,
      });
      alert("Profile is Update")
      location.reload()
      document.getElementById("edit_profile").style.display = "none"        
    }
    
  }

    }
  
  // Edit Functions
  
  
  
  window.updPic = () => {
    let imgPath = document.getElementById("upd_user_img");
    let img = document.getElementById("upd_img");
  
    if (imgPath.files.length > 0) {
      let file = imgPath.files[0];
      let objectURL = URL.createObjectURL(file);
      img.src = objectURL;
    }
  };

  window.cls=()=>{
    document.getElementById("edit_profile").style.display = "none"   
    
  }