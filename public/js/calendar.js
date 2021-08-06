let googleUser;
var editing = false;
let eventsData;
let monthAsNum;
let currentYear = 2021;
let bk_color;
const colors = ["has-background-link-light", "has-background-info-light", "has-background-success-light", "has-background-danger-light", "has-background-primary-dark", 
                    "has-background-link-dark", "has-background-info-dark", "has-background-success-dark", "has-background-warning-dark", "has-background-danger-dark"]

window.onload = event => {
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("Logged in as: " + user.displayName);
            googleUser = user;
            bk_color = colors[Math.floor(Math.random() * colors.length)]
            setCalendar();
            getEvents();
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
    makeNewEvent();
});

function makeNewEvent(date){
    modal.classList.add("is-active");
    if(date != null){
        const dateBox = document.querySelector("#date");
        dateBox.value = date;
    }
}

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
    editUpdate['users/' + googleUser.uid + '/Events/' + eventId + "/Name"] = name;
    editUpdate['users/' + googleUser.uid + '/Events/' + eventId + "/Description"] = description;
    editUpdate['users/' + googleUser.uid + '/Events/' + eventId + "/Sport"] = sport;
    editUpdate['users/' + googleUser.uid + '/Events/' + eventId + "/Date"] = date;
    editUpdate['users/' + googleUser.uid + '/Events/' + eventId + "/EventType"] = eventType;

    firebase.database().ref().update(editUpdate);
    editing = false;
  }else{
    firebase.database().ref(`users/${googleUser.uid}/Events`).push({
        Name: name,
        Date: date,
        EventType: eventType,
        Sport: sport,
        Description: description,
    })
}
    setCalendar();
    renderDataAsHtml(eventsData);
}

const setCalendar = () => {
    let currentMonth;
    const monthText = document.querySelector('#month');
        var options = { month: 'long'};
        let numDate = new Date();
        currentMonth = new Intl.DateTimeFormat('en-US', options).format(numDate);
        monthAsNum = numDate.getMonth() + 1;
    monthText.innerHTML = currentMonth; 
    let calendarCells = `<tr class="columns">`;
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
            calendarCells += `</tr><tr class="columns">`
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
        calendarCells += `<td class="column is-blank" id=d${currDate}>${blankCard(currDate)}</td>`
        dayOfTheWeek++;
    }
    calendarCells += "</tr>";
    document.querySelector("#app").innerHTML = calendarCells;
}

const getEvents = userId => {
    const eventsRef = firebase.database().ref(`users/${googleUser.uid}/Events`)
    eventsRef.orderByChild("title").on("value", snapshot => {
        eventsData = snapshot.val();
        renderDataAsHtml(eventsData);
        getLabelButtons();
    });
};

//Given a list of notes, render them in HTML
const renderDataAsHtml = (data) => {
    let eventList = [];
    console.log(data);
    for(const child in data){
        const childObj = data[child];
         childObj.id = child;
         eventList.push(childObj)
         console.log(childObj);
    }
    eventList.forEach((child) => {
        eventMonth = child.Date.split("-")[1];
        if(eventMonth == monthAsNum){
            const event = child;
            const eventItem = child.id;
            const eventCard = createCard(event, eventItem);
            const eventSlot = document.getElementById("d" + child.Date);
            if(eventSlot.classList.contains("is-blank")){
                document.getElementById("d" + child.Date).innerHTML = eventCard;
                eventSlot.classList.remove("is-blank");
            }else{
                document.getElementById("d" + child.Date).insertAdjacentHTML("afterbegin", "<br>" + eventCard);
            }
           // document.getElementById("d" + child.Date).insertAdjacentHTML("afterbegin", "<br>" + eventCard);
            //document.getElementById("d" + child.Date).innerHTML = eventCard;
        }
    })
};

function deleteEvent(eventItem) {
    console.log(eventItem);
    firebase.database().ref(`users/${googleUser.uid}/Events/${eventItem}`).remove();
    setCalendar();
    renderDataAsHtml(eventsData);
}

//Places the label buttons above the cards.
function getLabelButtons() {
  let labels =
    `<button class="all button is-link has-text-weight-medium is-medium"  onclick="showAll()">ALL</button>`;
  //console.log(sortedLabels);
//   for (var i = 0; i < sortedLabels.length; i++) {
//     console.log(sortedLabels[i]);
//     labels += createLabelButton(sortedLabels[i]);
//   }
    labels += createLabelButton("Practice");
    labels += createLabelButton("Tournament");
  document.querySelector("#labelsBox").innerHTML = labels;
}

// Sorts the notes by label.
function filterByLabel(labelName) {
  console.log("filtering" + labelName);
  let eventsOfCertainLabel = [];
  for (const eventItem in eventsData) {
    const event = eventsData[eventItem];
      if (event.EventType == labelName.toLowerCase()) {
        eventsOfCertainLabel.push(event);
      }
  }
  console.log(eventsOfCertainLabel);
  setCalendar();
  renderDataAsHtml(eventsOfCertainLabel);
}

//Creates label buttons.
function createLabelButton(labelName) {
  console.log("Generating label for " + labelName);
  const label = `
        <button class="button is-link has-text-weight-medium is-medium"  onclick="filterByLabel('${labelName}')">${labelName}</button>`;
  return label;
}

function showAll() {
  renderDataAsHtml(eventsData);
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
    let cardColor;
    if (event.EventType == "practice") {
        cardColor = "has-background-primary-light";
    } else if (event.EventType == "tournament") {
        cardColor = "has-background-warning-light";
    }
    console.log(eventItem);
    return `
        
            <div class="card ${cardColor} is-scheduled">
                <header class="card-header">
                    <p class="card-header-title">${event.Name}</p>
                    <p class="card-header-title">${event.Date}</p>
                    <p class="card-header-title">${event.EventType.toUpperCase()}</p>
                </header>
                <div class="card-content">
                        <div class="container ${cardColor}">
                            ${event.Description}
                            <br>
                            SPORT: ${event.Sport}
                        </div>
                        <footer class="card-footer ${cardColor}">
                            <button class="button" id="${eventItem}" onclick="deleteEvent(this.id)"> Delete </button>
                            <button class="button" id="${eventItem}" onclick="editEvent(this, this.id)"> Edit </button>
                        </footer>
                </div>
            </div>
        `;
};

const blankCard = (date) => {
    return `
         <div class="card is-blank" style="background-color:grey;">
           <header class="card-header">
             <p class="card-header-title">No Events</p>   
           </header>
           <div class="card-content">
             <div class="content">You have no events on this day.</div>
                <footer class="card-footer" style="background-color:grey;">
                    <button class="button" onclick='makeNewEvent("${date}")'> Add event on this day</button>
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