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

const handleStatsSubmit = () => {
  // 1. Capture the form data
  const statName = document.querySelector('#statName');
  const statDescrip = document.querySelector('#statDescrip');
  const statLabel = document.querySelector('#statLabel');
  // 2. Format the data and write it to our database
  firebase.database().ref(`currentNotes/users/${googleUser.uid}`).push({
    name: statName.value,
    description: statDescrip.value,
    label: statLabel.value
  })
  // 3. Clear the form so that we can write a new note
  .then(() => {
    noteTitle.value = "";
    noteText.value = "";
    noteLabel.value = "";
  });
}

