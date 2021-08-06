let googleUser;
var editing = false;
let statData;
                    
window.onload = event => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Logged in as: " + user.displayName);
      googleUser = user;
      getStats();
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
  const statName = document.querySelector('#statName').value;
  const statDescrip = document.querySelector('#statDescrip').value;
  const statLabel = document.querySelector('#statLabel').value;
  const statDate = document.querySelector('#statDate').value;
  // 2. Format the data and write it to our database
  if(editing){
    editingCard = document.getElementsByClassName("is-editing")[0];
    editingCard.classList.remove("is-editing");

    statId = editingCard.id;

    const editUpdate = {};
    editUpdate['users/' + googleUser.uid + '/Stats/' + statId + "/Name"] = statName;
    editUpdate['users/' + googleUser.uid + '/Stats/' + statId + "/Description"] = statDescrip;
    editUpdate['users/' + googleUser.uid + '/Stats/' + statId + "/Label"] = statLabel;
    editUpdate['users/' + googleUser.uid + '/Stats/' + statId + "/Date"] = statDate;

    firebase.database().ref().update(editUpdate);
    editing = false;
  }else{
      firebase.database().ref(`users/${googleUser.uid}/Stats`).push({
        Name: statName,
        Description: statDescrip,
        Label: statLabel,
        Date: statDate
    })
  }
  getStats();
}

const getStats = userId => {
    const eventsRef = firebase.database().ref(`users/${googleUser.uid}/Stats`)
    eventsRef.orderByChild("title").on("value", snapshot => {
        renderDataAsHtml(snapshot);
    });
};

//Given a list of notes, render them in HTML
const renderDataAsHtml = (data) => {
    statData = data.val();
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
        const stat = child;
        const statItem = child.id;
        cards += createCard(stat, statItem);
    })
    document.querySelector("#app").innerHTML = cards;
};

function deleteStat(statItem) {
    firebase.database().ref(`users/${googleUser.uid}/Stats/${statItem}`).remove();
}

function editStat(statCard, statItem){
    editing = true;
    statCard.classList.add("is-editing");
    modal.classList.add("is-active");

    console.log(statItem);
    console.log(statData[statItem]);
    document.querySelector('#statName').value = statData[statItem].Name;
    document.querySelector('#statDescrip').value = statData[statItem].Description;
    document.querySelector('#statLabel').value = statData[statItem].Label;
    document.querySelector('#statDate').value = statData[statItem].Date;
}

// Return a note object converted into an HTML card
const createCard = (stat, statItem) => {
    cardColor = "has-background-primary-light";
    return `
       <div class="column is-3">
            <div class="card ${cardColor}">
                <header class="card-header">
                    <p class="card-header-title">${stat.Name}</p>
                    <p class="card-header-title">${stat.Date}</p>
                </header>
                <div class="card-content">
                        <div class="container ${cardColor}">
                            ${stat.Description}
                            <br>
                            SPORT: ${stat.Label}
                        </div>
                        <footer class="card-footer ${cardColor}">
                            <button class="button card-footer-item" id="${statItem}" onclick="deleteStat(this.id)"> Delete </button>
                            <button class="button card-footer-item" id="${statItem}" onclick="editStat(this, this.id)"> Edit </button>
                        </footer>
                </div>
            </div>
       </div> `;
};