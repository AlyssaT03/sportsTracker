let googleUser;
var editing = false;
let eventsData;

window.onload = event => {
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Logged in as: " + user.displayName);
            googleUser = user;
            getNotes();
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
    getData();
})

cancelButton.addEventListener("click", e => {
    modal.classList.remove("is-active");
    console.log("canceled");
})

function getData() {
    const name = document.querySelector("#eventName").value;
    const date = document.querySelector("#date").value;
    const description = document.querySelector("#description").value;
    const sport = document.querySelector("#sport").value;
    const eventType = document.querySelector("#eventType").value;

     if(editing){
    editingCard = document.getElementsByClassName("is-editing")[0];
    editingCard.classList.remove("is-editing");

    eventId = editingCard.id;

    const editUpdate = {};
    editUpdate[googleUser.uid + '/Events/' + eventId + "/Name"] = name;
    editUpdate[googleUser.uid + '/Events/' + eventId + "/Description"] = description;
    editUpdate[googleUser.uid + '/Events/' + eventId + "/Sport"] = sport;
    editUpdate[googleUser.uid + '/Events/' + eventId + "/Date"] = date;
    editUpdate[googleUser.uid + '/Events/' + eventId + "/EventType"] = eventType;

    firebase.database().ref().update(editUpdate);
    editing = false;
  }else{
    firebase.database().ref(`${googleUser.uid}/Events`).push({
        Name: name,
        Date: date,
        EventType: eventType,
        Sport: sport,
        Description: description,
    })
}
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
    eventsData = data.val();
    let eventList = [];
     data.forEach((child) => {
        const childObj = child.val();
        childObj.id = child.key;
        eventList.push(childObj)
     })
    const sortedData = eventList.sort(function(a,b){
        d1 = new Date(a.Date).getTime();
        d2 = new Date(b.Date).getTime();
        return d1 - d2});
    let cards = "";
    sortedData.forEach((child) => {
        const event = child;
        const eventItem = child.id;
        cards += createCard(event, eventItem);
    })

    document.querySelector("#app").innerHTML = cards;
};

function deleteEvent(eventItem) {
    firebase.database().ref(`${googleUser.uid}/Events/${eventItem}`).remove();
}

function editEvent(eventCard, eventItem){
    editing = true;
    eventCard.classList.add("is-editing");
    modal.classList.add("is-active");

    document.querySelector('#eventName').value = eventsData[eventItem].Name;
    document.querySelector('#description').value = eventsData[eventItem].Description;
    document.querySelector('#sport').value = eventsData[eventItem].Sport;
    document.querySelector('#date').value = eventsData[eventItem].Date;
    document.querySelector('#eventType').value = eventsData[eventItem].EventType;
}

// Return a note object converted into an HTML card
const createCard = (event, eventItem) => {
    const colors = ["has-background-primary-light", "has-background-link-light", "has-background-info-light", "has-background-success-light", "has-background-warning-light", "has-background-danger-light", "has-background-primary-dark", "has-background-link-dark", "has-background-info-dark", "has-background-success-dark", "has-background-warning-dark", "has-background-danger-dark"]
    var bk_color = colors[Math.floor(Math.random() * colors.length)]
    if (event.EventType == "practice") {
        bk_color = colors[0]
    } else if (event.EventType == "tournament") {
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
             <button class="button" id="${eventItem}" onclick="deleteEvent(this.id)"> Delete </button>
            <button class="button" id="${eventItem}" onclick="editEvent(this, this.id)"> Edit </button>
           <footer class="card-footer ${bk_color}">

           
             <p class="card-footer-title">${event.Sport}  </p>
       
              <p class="card-footer-title">${event.EventType}</p>

           </footer>
           </div>
         </div>
       </div> `;
};

function changeEventType(selectButton) {
    eventType = selectButton.target.value;
    console.log("Event type changed");
}