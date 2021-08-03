let googleUser;
let eventType;

window.onload = event => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Logged in as: " + user.displayName);
      googleUser = user;
    } else {
      window.location = "signIn.html"; // If not logged in, navigate back to login page.
    }
  });


};

const addEntry = document.querySelector("#addEntry");
const modal = document.querySelector("#modalElement");
const dropDown = document.querySelector(".dropdown-menu");

addEntry.addEventListener("click", (e) => {
 modal.classList.add("is-active");
 
 
});
 
const saveButton = document.querySelector("#save");
const cancelButton = document.querySelector("#cancel");

console.log(saveButton);

saveButton.addEventListener("click", e => {
  modal.classList.remove("is-active");
  console.log("saved");
 getData()

})

cancelButton.addEventListener("click", e => {
  modal.classList.remove("is-active");
  console.log("canceled");
})

function getData(){
     var name = document.querySelector("#eventName").value;
    var date = document.querySelector("#date").value;
    var description = document.querySelector("#description").value; 
    var sport = document.querySelector("#sport").value; 
    var eventType = document.querySelector("#eventType");

    firebase.database().ref(`${googleUser.uid}/Events`).push({
        Name: name,
        Date: date,
        "Event Type": eventType.value,
        "Sport":sport,
        Description: description,
    })

}

  function changeEventType(selectButton){
    eventType = selectButton.target.value;
    console.log("Event type changed");
  }