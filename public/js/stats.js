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
    editUpdate[googleUser.uid + '/Stats/' + statId + "/Name"] = statName;
    editUpdate[googleUser.uid + '/Stats/' + statId + "/Description"] = statDescrip;
    editUpdate[googleUser.uid + '/Stats/' + statId + "/Label"] = statLabel;
    editUpdate[googleUser.uid + '/Stats/' + statId + "/Date"] = statDate;

    firebase.database().ref().update(editUpdate);
    editing = false;
  }else{
      firebase.database().ref(`${googleUser.uid}/Stats`).push({
        Name: statName,
        Description: statDescrip,
        Label: statLabel,
        Date: statDate
    })
  }
  getStats();
}

const getStats = userId => {
    const eventsRef = firebase.database().ref(`${googleUser.uid}/Stats`)
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
    firebase.database().ref(`${googleUser.uid}/Stats/${statItem}`).remove();
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
    const colors = ["has-background-primary-light", "has-background-link-light", "has-background-info-light", "has-background-success-light", "has-background-warning-light", "has-background-danger-light", "has-background-primary-dark", "has-background-link-dark", "has-background-info-dark", "has-background-success-dark", "has-background-warning-dark", "has-background-danger-dark"]
    var bk_color = colors[Math.floor(Math.random() * colors.length)]
    return `
         <div class="column is-one-quarter">
         <div class="card ${bk_color}">
           <header class="card-header">
             <p class="card-header-title">${stat.Name}</p>
             <p class="card-header-title">${stat.Date}</p>
           
           </header>
           <div class="card-content">
             <div class="content">${stat.Description}</div>
             <button class="button" id="${statItem}" onclick="deleteStat(this.id)"> Delete </button>
            <button class="button" id="${statItem}" onclick="editStat(this, this.id)"> Edit </button>
           <footer class="card-footer ${bk_color}">
           
             <p class="card-footer-title">${stat.Label}  </p>

           </footer>
           </div>
         </div>
       </div> `;
};