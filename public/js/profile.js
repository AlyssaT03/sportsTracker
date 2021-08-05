let googleUser;

window.onload = event => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Logged in as: " + user.displayName);
      googleUser = user;
      setProfile();
    } else {
      window.location = "signIn.html"; // If not logged in, navigate back to login page.
    }
  });
};

function googleSignout() {
   firebase.auth().signOut()
	
   .then(function() {
      console.log('Signout Succesfull')
      window.location = 'signIn.html'
   }, function(error) {
      console.log('Signout Failed')  
   });
}

function setProfile(){
    const userImg = document.querySelector("#userImg");
    userImg.src = googleUser.getBasicProfile().getImageUrl();
    console.log("attempting to set profile");
}

const addImage = document.querySelector("#addImage");
const modal = document.querySelector("#modalElement");

addImage.addEventListener("click", (e) => {
 modal.classList.add("is-active");
});

const saveButton = document.querySelector("#save");
const cancelButton = document.querySelector("#cancel");

console.log(saveButton);

saveButton.addEventListener("click", e => {
  modal.classList.remove("is-active");
  console.log("saved");
  setImage();
})

cancelButton.addEventListener("click", e => {
  modal.classList.remove("is-active");
  console.log("canceled");
})

function setImage(){
    const urlInput = document.querySelector("#addURL");
    const profileImg = document.querySelector("#userImg");
    profileImg.src = urlInput.value;
    const profileUpdate = {};
    profileUpdate[`${googleUserID}/profile/imgURL`] = urlInput.value;
    firebase.database().ref().update(profileUpdate);
}