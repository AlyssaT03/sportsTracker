let googleUser;
let username;
let fetchChat;



window.onload = event => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Logged in as: " + user.displayName);
      googleUser = user;
       username = user.displayName
        fetchChat = firebase.database().ref(`Messages`);
        fetchChat.on('value', (snapshot) => {
   console.log("running")
  const messages = snapshot.val();
  const message = `<li class=${
    username === messages.username ? "sent" : "receive"
  }><span>${messages.username}: </span>${messages.message}</li>`;
  // append the message on the page
  document.getElementById("messages").innerHTML += message;
});
        
    } else {
      window.location = "signIn.html"; // If not logged in, navigate back to login page.
    }
  });
 

   
  //fetchChat()
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

const db = () => firebase.database()

document.getElementById("message-form").addEventListener("submit", sendMessage);

function sendMessage(e) {
  e.preventDefault();

  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  console.log(message+"messge")    
  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document.getElementById("messages").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
  db().ref(`Messages`).set({
    username,
    message,
  });
}



//const fetchChat = () => db.ref(`${googleUser.uid}/Messages`);
// fetchChat.on("child_added", snapshot) {
//     console.log("running")
//   const messages = snapshot.val();
//   const message = `<li class=${
//     username === messages.username ? "sent" : "receive"
//   }><span>${messages.username}: </span>${messages.message}</li>`;
//   // append the message on the page
//   document.getElementById("messages").innerHTML += message;
// };



