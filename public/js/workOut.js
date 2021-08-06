let googleUser;
var editing = false;
let statData;

window.onload = event => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Logged in as: " + user.displayName);
      googleUser = user;
      getWorkOuts();
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

const addEntry = document.querySelector("#addWorkOut");
const modal = document.querySelector("#modalElement");
const dropDown = document.querySelector(".dropdown-menu");

addWorkOut.addEventListener("click", (e) => {
 modal.classList.add("is-active");
});
 
const saveButton = document.querySelector("#save");
const cancelButton = document.querySelector("#cancel");

console.log(saveButton);

saveButton.addEventListener("click", e => {
  modal.classList.remove("is-active");
  console.log("saved");
  handleWorkOutSubmit();
})

cancelButton.addEventListener("click", e => {
  modal.classList.remove("is-active");
  console.log("canceled");
})

const handleWorkOutSubmit = () => {
  // 1. Capture the form data
  const workOutName = document.querySelector('#statName').value;
  const workOutDescrip = document.querySelector('#statDescrip').value;
  const workOutLabel = document.querySelector('#statLabel').value;
  const workOutDate = document.querySelector('#statDate').value;
  // 2. Format the data and write it to our database
  if(editing){
    editingCard = document.getElementsByClassName("is-editing")[0];
    editingCard.classList.remove("is-editing");

    statId = editingCard.id;

    const editUpdate = {};
    editUpdate[googleUser.uid + '/Workouts/' + statId + "/Name"] = workOutName;
    editUpdate[googleUser.uid + '/Workouts/' + statId + "/Description"] = workOutDescrip;
    editUpdate[googleUser.uid + '/Workouts/' + statId + "/Label"] = workOutLabel;
    editUpdate[googleUser.uid + '/Workouts/' + statId + "/Date"] = workOutDate;

    firebase.database().ref().update(editUpdate);
    editing = false;
  }else{
      firebase.database().ref(`${googleUser.uid}/Workouts`).push({
        Name: workOutName,
        Description: workOutDescrip,
        Label: workOutLabel,
        Date: workOutDate
    })
  }
  getWorkOuts();
}

const getWorkOuts = userId => {
    const eventsRef = firebase.database().ref(`${googleUser.uid}/Workouts`)
    eventsRef.orderByChild("title").on("value", snapshot => {
        renderDataAsHtml(snapshot);
    });
};

//Given a list of notes, render them in HTML
const renderDataAsHtml = (data) => {
    workOutData = data.val();
    let statList = []; 
    data.forEach((child) => {
        const childObj = child.val();
        childObj.id = child.key;
        statList.push(childObj)
     })
    const sortedData = statList.sort(function(a,b){
        d1 = new Date(a.Date).getTime();
        d2 = new Date(b.Date).getTime();
        return d1 - d2});
    let cards = "";
    sortedData.forEach((child) => {
        const workOut = child;
        const workOutItem = child.id;
        cards += createCard(workOut, workOutItem);
    })
    document.querySelector("#app").innerHTML = cards;
};

function deleteWorkOut(workOutItem) {
    firebase.database().ref(`users/${googleUser.uid}/Workouts/${workOutItem}`).remove();
}

function editWorkOut(workOutCard, workOutItem){
    editing = true;
    workOutCard.classList.add("is-editing");
    modal.classList.add("is-active");

    document.querySelector('#statName').value = workOutData[workOutItem].Name;
    document.querySelector('#statDescrip').value = workOutData[workOutItem].Description;
    document.querySelector('#statLabel').value = workOutData[workOutItem].Label;
    document.querySelector('#statDate').value = workOutData[workOutItem].Date;
}

// Return a note object converted into an HTML card
const createCard = (workOut, workOutItem) => {
    cardColor = "has-background-primary-light";
    return `
          <div class="column is-3">
            <div class="card ${cardColor}">
                <header class="card-header">
                    <p class="card-header-title">${workOut.Name}</p>
                    <p class="card-header-title">${workOut.Date}</p>
                </header>
                <div class="card-content">
                        <div class="container ${cardColor}">
                            ${workOut.Description}
                            <br>
                            SPORT: ${workOut.Label}
                        </div>
                        <footer class="card-footer ${cardColor}">
                            <button class="button card-footer-item" id="${workOutItem}" onclick="deleteWorkOut(this.id)"> Delete </button>
                            <button class="button card-footer-item" id="${workOutItem}" onclick="editWorkOut(this, this.id)"> Edit </button>
                        </footer>
                </div>
            </div>
       </div> `;
};