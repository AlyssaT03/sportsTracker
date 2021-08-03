document.querySelectorAll("#nav li").forEach(function(navEl) {
  navEl.onclick = function() { toggleTab(this.id, this.dataset.target); }
});

function toggleTab(selectedNav, targetId) {
  var navEls = document.querySelectorAll("#nav li");

  navEls.forEach(function(navEl) {
    if (navEl.id == selectedNav) {
      navEl.classList.add("is-active");
    } else {
      if (navEl.classList.contains("is-active")) {
        navEl.classList.remove("is-active");
      }
    }
  });

  var tabs = document.querySelectorAll(".tab-pane");

  tabs.forEach(function(tab) {
    if (tab.id == targetId) {
      tab.style.display = "block";
    } else {
      tab.style.display = "none";
    }
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
  bestPartOfDay.value = "";
  dayInput.value = "";
})

cancelButton.addEventListener("click", e => {
  modal.classList.remove("is-active");
  console.log("canceled");
})


var dayInput = document.querySelector("#dayInput");
var sleepInput = document.querySelector("#hoursOfSleep");
var bestPartOfDay = document.querySelector("#bestPartOfDay");


var happy = document.querySelector("#happy");
var meh = document.querySelector("#meh");
var sad = document.querySelector("#sad");

var mood;

happy.addEventListener("click", e => {
  mood = "happy";
  console.log("happy");
});

meh.addEventListener("click", e => {
  mood = "meh";
  console.log("meh");
});

sad.addEventListener("click", e => {
  mood = "sad";
  console.log("sad");
});

var monday = document.querySelector(".monday");
var tuesday = document.querySelector(".tuesday");
var wednesday = document.querySelector(".wednesday");
var thursday = document.querySelector(".thursday");
var friday = document.querySelector(".friday");
var saturday = document.querySelector(".saturday");
var sunday = document.querySelector(".sunday");



function getData(){

  
  
  var day=dayInput.value;
  if(day.toLowerCase()=="monday"){
   document.getElementById("mbest").innerHTML="Best Part of Day: " + bestPartOfDay.value;
    monday.classList.add(mood);
    
   }
  else if(day.toLowerCase()=="tuesday"){
    document.getElementById("tubest").innerHTML="Best Part of Day: " + bestPartOfDay.value
    tuesday.classList.add(mood);
   
   }
  
  else if(day.toLowerCase()=="wednesday"){
    document.getElementById("wbest").innerHTML="Best Part of Day: " + bestPartOfDay.value
    wednesday.classList.add(mood);
   
   }
  else if(day.toLowerCase()=="thursday"){
   document.getElementById("thbest").innerHTML="Best Part of Day: " + bestPartOfDay.value
    thursday.classList.add(mood);
   }
  else if(day.toLowerCase()=="friday"){
    console.log("friday");
    document.getElementById("fbest").innerHTML="Best Part of Day: " + bestPartOfDay.value
    friday.classList.add(mood);
   
   }
  else if(day.toLowerCase()=="saturday"){
    document.getElementById("sabest").innerHTML="Best Part of Day: " + bestPartOfDay.value
    saturday.classList.add(mood);
   
   }
  else if(day.toLowerCase()=="sunday"){
    document.getElementById("subest").innerHTML="Best Part of Day: " + bestPartOfDay.value
    sunday.classList.add(mood);
   
   }
  
  
  
}



