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


   getNotes();



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
    "EventType":eventType,
    "Sport":sport,
    Description: description,

  })

   getNotes();

}


const getNotes = userId => {
  const eventsRef = firebase.database().ref(`${googleUser.uid}/Events`)
  eventsRef.orderByChild("title").on("value", snapshot => {
    renderDataAsHtml(snapshot);
  });
};

//Given a list of notes, render them in HTML
const renderDataAsHtml = (data) => {
  let cards = "";
  data.forEach((child) => {
    const event = child.val();
    const eventItem = child.key
    cards += createCard(event, eventItem);

  })

  document.querySelector("#app").innerHTML = cards;
};




function deleteNote(eventItem)
{
  
 
    firebase.database().ref(`${googleUser.uid}/Events/${eventItem}`).remove();
    
 
}




// Return a note object converted into an HTML card
const createCard = (event, eventItem) => {
  const colors = ["has-background-primary-light", "has-background-link-light", "has-background-info-light", "has-background-success-light", "has-background-warning-light", "has-background-danger-light","has-background-primary-dark","has-background-link-dark","has-background-info-dark","has-background-success-dark","has-background-warning-dark","has-background-danger-dark"]
  var bk_color = colors[Math.floor(Math.random()*colors.length)]
  if(event.EventType=="practice"){
      bk_color = colors[0]
  }
  else if(event.EventType=="tournament"){
      bk_color = colors[4]
  }
  
  return `
         <div class="column is-one-quarter">
         <div class="card ${bk_color}">
           <header class="card-header">
             <p class="card-header-title">${event.Name}</p>
             <p class="card-header-title">${event.Date}</p>
           
           </header>
           <div class="card-content">
             <div class="content">${event.Description}</div>
             <button class="button" id="${eventItem}" onclick="deleteNote(this.id)"> Delete </button>
            
           <footer class="card-footer ${bk_color}">

           
             <p class="card-footer-title">${event.Sport}  </p>
       
              <p class="card-footer-title">${event.EventType}</p>

           </footer>
           </div>
         </div>
       </div> `;
};
