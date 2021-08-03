let googleUser;

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

const addEntry = document.querySelector("#addStat");
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
  handleStatsSubmit();
 
})

cancelButton.addEventListener("click", e => {
  modal.classList.remove("is-active");
  console.log("canceled");
})

const handleStatsSubmit = () => {
  // 1. Capture the form data
  const statName = document.querySelector('#statName');
  const statDescrip = document.querySelector('#statDescrip');
  const statLabel = document.querySelector('#statLabel');
  const statDate = document.querySelector('#statDate');
  // 2. Format the data and write it to our database
  firebase.database().ref(`${googleUser.uid}/Stats`).push({
    name: statName.value,
    description: statDescrip.value,
    label: statLabel.value,
    date: statDate.value
  })
}
