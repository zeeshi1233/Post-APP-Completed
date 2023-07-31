import { app, auth, db, storage } from './firebas.js'
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { setDoc, doc, query, where,updateDoc ,deleteDoc,onSnapshot, collection, addDoc, orderBy, getDocs, serverTimestamp, limit } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";


let authorName;
const show_user = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      onSnapshot(collection(db, "users"), (data) => {
        localStorage.setItem("curId",uid)
        data.docChanges().forEach((change) => {
          // showPost(change.doc.data())
          if (uid == change.doc.data().user) {
            authorName = change.doc.data().name;

            if (change.doc.data().pic) {
              document.querySelector(".myimg").src = change.doc.data().pic
              document.querySelector(".myimg1").src = change.doc.data().pic
            }
            else {
              document.querySelector(".myimg").src = 'download.jpg'
              document.querySelector(".myimg1").src = 'download.jpg'
            }


            document.getElementById("name").innerHTML = authorName;
            all(change.doc.data().email)

            console.log(authorName);
          }

        });
      });
    } else {
      window.location.href = "login.html";
    }
  });
};

show_user()


//  shoow Post

document.getElementById("load").style.display = "grid"

var sugUser;
async function all(email) {
  console.log(email);
  let alluser = document.getElementById("allusers");

  const q = query(collection(db, "users"), where("email", "!=", email));
  const onSnapshot = await getDocs(q);

  onSnapshot.forEach((change) => {
    if (change.data().pic) {
      sugUser = change.data().pic
    }
    else {
      sugUser = "download.jpg"
    }

    alluser.innerHTML += `
<div class="adjust1" id="">
<div class="profile-pic" style="display: flex;align-items: center;">
    <img src="${sugUser}" id="all_user_img" width="50px " height="50px" style="border-radius: 50%;" alt="">
    <p style="font-size: 20px;margin-left: 10px;" class="name">${change.data().name}</p>
    </div>
    <div class="switch">
    <Button  onclick="chat('${change.data().name}','${change.data().pic}','${change.data().user}','${change.data().email}')">Message</Button>
    </div>
</div>
`
  })
};

window.chat=(name,pic,id,email)=>{
var select={
  name:name,
  pic:pic,
  id:id,
  email:email
}
localStorage.setItem("SelectedChat",JSON.stringify(select))
location.replace("message.html")

}


function final(users) {
  var mytestpost = document.getElementById("all_posts");
  const q = query(collection(db, "post"), where("user", "==", users.user),orderBy("timestamp","desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.size === 0) {
      document.getElementById("nofound").style.display="flex"    
      document.getElementById("load").style.display="none"
      document.getElementById("nofound").style.display="none"
    }
    else{
      snapshot.docChanges().forEach((change) => {

if (change.type==="removed") {
  let divDlt=document.getElementById(change.doc.id)
  divDlt.remove()
}
else if(change.type==="added"){
        const { name, pic, timestamp, user } = change.doc.data()
        console.log(change.doc.data());
        document.getElementById("load").style.display="none"
        let picsHtml = "";
        if (pic) {
               picsHtml = `<img src="${pic}" id="self">`;
             } else {
               picsHtml = "";
            }
      mytestpost.innerHTML += `
      <div class="border-div" id="${change.doc.id}" >
<div class="post_sty"  >
           <div class="profile-pic1" style="display: flex;align-items: center;">
             <img onclick="profile('${users.pic}','${users.user}','${users.name}')" src="${users.pic ? users.pic : 'download.jpg'}" id="ur_img" width="50px " height="50px" style="border-radius: 50%;" alt="">
             <div style='display:block;' > 
               <p style="font-size: 20px;margin-left: 10px;font-weight: bold;" id="sec">${users.name}</p>
               <span style='font-size:14px;margin-left:10px;'>${timestamp ? moment(timestamp.toDate()).fromNow():moment().fromNow()}</span>
             </div>
           </div>
           <div>
                        <i onclick="more(this,'${change.doc.id}')" style="cursor:pointer; margin-left: -30px;" class="fa-solid fa-ellipsis-vertical"></i>
                        <div id="more">
                        <ul>
                                <li><button style="    background:  rgb(90, 179, 238);
                                border: none;
                                color:white;
                                width:100px;
                                height:30px;
                                outline: none;
                                cursor: pointer;" onclick="edit(this,'${change.doc.id}','${change.doc.data().user}')" > Edit </button></li>
                               <li><button style="    background:  rgb(90, 179, 238);
                               border: none;
                               color:white;
                               width:100px;
                               height:30px;
                               outline: none;
                               cursor: pointer;" onclick="del('${change.doc.id}','${change.doc.data().user}')">Delete</li>
                           </ul>
                       </div>
                        </div>
                      
                    </div>
  

                    <div >
                    <div class="com_post">
                    <div id="rem" style="display:none;">
                    <input type="text"  placeholder="Updated Value" id="upd">
                    <div class="image-upload1">
<label for="file-input1">
    <i class="fa-solid fa-photo-film"></i>
</label>

<input id="file-input1" type="file" />
</div>
<button style="    background:  rgb(90, 179, 238);
border: none;
color:white;
outline: none;
cursor: pointer;width:150px;
height:30px;" onclick="upd('${change.doc.id}')" >Update</button>
<button style="    background:  rgb(90, 179, 238);
border: none;
color:white;
width:150px;
height:30px;
outline: none;
cursor: pointer;" onclick="cancel()" >Cancel</button>
</div>
                    <div id="old">
                        <div class="des">
                          <p style="font-size: 18px;">${name}</p>
                        </div>
                        ${picsHtml}
                      </div>
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
                    </div>
                    <br>

`


}});
  }
  });

}


async function text() {
  const q = query(collection(db, "users"),);
  const onSnapshot = await getDocs(q);
  onSnapshot.forEach((change) => {
    final(change.data())
  })
};
text()



const add_post = () => {
  let text = document.getElementById("text");
  let file = document.getElementById("file-input");
  if (text.value == "" && file.files > 0) {
    alert("Fill All Fields")
  }
  else {

    if (file.files.length > 0) {

      console.log(file.files[0].name);
      const storageRef = ref(storage, `images/${file.files[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, file.files[0]);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');

          document.getElementById("load").style.display = "none"
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              document.getElementById("load").style.display = "grid"
              break;
          }
        },
        (error) => {
          console.log('error-->', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            onAuthStateChanged(auth, async (user) => {
              if (user) {
                const uid = user.uid;
                console.log(uid);
                await addDoc(collection(db, "post"), {
                  name: text.value,
                  pic: downloadURL,
                  timestamp: serverTimestamp(),
                  user: uid,
                });
              }
              text.value=""
            });
          });
        }
        );
      
    }
    else {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          console.log(uid);
          await addDoc(collection(db, "post"), {
            name: text.value,
            timestamp: serverTimestamp(),
            user: uid,

          });
        }
        text.value=""
      });
    }

  }

}



window.add_post = add_post


// Log Out

window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html"
  }).catch((error) => {
    console.log(error);
  });
}

// more 
window.more=(e,id)=>{

var x=e.parentNode.childNodes[3];
if (x.style.display=="none") {
  x.style.display="flex"
}
else{
  x.style.display="none"  
}



}
window.del=async(id,uid)=>{

 let userId=localStorage.getItem("curId")
  if (uid==userId) {    
    await deleteDoc(doc(db, "post", id))
    alert("Deleted")
    window.location.reload()
  }
else{
  alert("this is not your post")
}
}

window.edit=(e,id,uid)=>{
  let userId=localStorage.getItem("curId")
if (uid==userId) {
  
  e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[1].style.display="block"
  var old=e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[3]
  old.style.display="none"
  var x=e.parentNode.parentNode.parentNode;
  // console.log(x);s
  x.style.display="none"
}else{
  alert("yeh post teri nahi hai bee")
}
}



window.upd=(id)=>{
let inp=document.getElementById("upd");
let file=document.getElementById("file-input1");

const storageRef = ref(storage, `Udateimages/${file.files[0].name}`);
const uploadTask = uploadBytesResumable(storageRef, file.files[0]);
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
    
  }, 
  () => {
    
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
  
      const washingtonRef = doc(db, "post", id);

      
      await updateDoc(washingtonRef, {
        name:inp.value,
        pic:downloadURL,
        timestamp:serverTimestamp()
      });
location.reload()

    });
  }
);
}

window.cancel=()=>{
document.getElementById("old").style.display="block"
document.getElementById("rem").style.display="none"
}

window.profile=(pic,id,name)=>{
let pro={
  name:name,
pic:pic,
id:id

}
  localStorage.setItem("Profile_Data",JSON.stringify(pro))
location.replace("userProfile.html")
}


var inp=document.getElementById("search");
inp.addEventListener("input",async()=>{
  var val=inp.value.toLowerCase()
  let divs=document.querySelectorAll(".des")
  let divs1=document.querySelectorAll(".border-div")


  divs.forEach((change) => {
    let text=change.textContent
console.log(change);

if (text.toLowerCase().includes(val)) {
  change.parentNode.parentNode.parentNode.parentNode.style.display=""

}
else
{
  change.parentNode.parentNode.parentNode.parentNode.style.display="none"
 console.log(change.parentNode.parentNode.parentNode.parentNode,"parent hai");
}




  })









})