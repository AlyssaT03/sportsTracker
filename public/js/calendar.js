let googleUser;
var editing = false;
let eventsData;
let monthAsNum;

window.onload = event => {
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Logged in as: " + user.displayName);
            googleUser = user;
            setCalendar();
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
    setCalendar();
}

const setCalendar = () => {
    var options = { month: 'long'};
    const month = document.querySelector('#month');
    const numDate = new Date();
    currentMonth = new Intl.DateTimeFormat('en-US', options).format(numDate);
    month.innerHTML = currentMonth; 
    monthAsNum = numDate.getMonth() + 1;
    let calendarCells = "<tr>";
    var monthString;
    if(monthAsNum < 10){
        monthString = "0" + monthAsNum;
    }
    else{
        monthString = monthAsNum;
    }
    firstDayOfTheMonth = new Date(numDate.getFullYear(), monthAsNum - 1, 1); 
    dayOfTheWeek = new Date(firstDayOfTheMonth).getDay();
    for(i = 0; i < dayOfTheWeek; i++){
        calendarCells += "<td></td>";
    }
    for(i = 0; i < getDaysInMonth(numDate.getMonth()); i++){
        if(dayOfTheWeek == 7){
            calendarCells += "</tr><tr>"
            dayOfTheWeek = 0;
        }
        var day = "";
        if(i < 9){
            day = "0" + (i + 1);
        }
        else{
            day = "" + (i + 1);
        }
        const currDate = numDate.getFullYear() + "-" + monthString + "-" + day;
        calendarCells += `<td id=d${currDate}>${blankCard()}</td>`
        dayOfTheWeek++;
    }
    calendarCells += "</tr>";
    document.querySelector("#app").innerHTML = calendarCells;
    getEvents();
}

const getEvents = userId => {
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
    eventList.forEach((child) => {
        eventMonth = child.Date.split("-")[1];
        if(eventMonth == monthAsNum){
            const event = child;
            const eventItem = child.id;
            const eventCard = createCard(event, eventItem);
            //document.getElementById("d" + child.Date).insertAdjacentHTML("afterbegin", eventCard);
            document.getElementById("d" + child.Date).innerHTML = eventCard;
        }
    })
};

function deleteEvent(eventItem) {
    firebase.database().ref(`${googleUser.uid}/Events/${eventItem}`).remove();
    setCalendar();
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
        <!-- <div class="column is-one-quarter"> -->
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
           
             <p class="card-footer-title">${event.Sport} </p> &nbsp;
              <p class="card-footer-title">EVENT: ${event.EventType}</p>

           </footer>
           </div>
         </div>
      <!-- </div> -->
`;
};

const blankCard = () => {
    return `
         <div class="card" style="background-color:grey;">
           <header class="card-header">
             <p class="card-header-title">No Events</p>   
           </header>
           <div class="card-content">
             <div class="content">You have no events on this day.</div>
                <footer class="card-footer" style="background-color:grey;">
                    <p class="card-footer-title">Click "Add event" below to add an event.</p>
                </footer>
           </div>
         </div>
`
}

function changeEventType(selectButton) {
    eventType = selectButton.target.value;
    console.log("Event type changed");
}

function getDaysInMonth(month){
    const thirtyDays = [3, 5, 8, 10];
    const thirtyOneDays = [0, 4, 6, 7, 9, 11];
    if(thirtyDays.includes(month)){
        return 30;
    }
    else if(thirtyOneDays.includes(month)){
        return 31;
    }
    else if (month == 1){
        return 29;
    }
    else{
        console.log("Invalid month.");
        return 0;
    }
}