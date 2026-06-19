
let currentTopic = null;

let topics =  JSON.parse(localStorage.getItem("topics")) || [];

let input = document.querySelector("input");

let shuffleButton = document.querySelector(".shuffle-btn");

let addButton = document.querySelector(".new-btn");

let topicList = document.querySelector("#topic-list");

let result = document.querySelector("#result");

let doneButton = document.querySelector(".done-btn");
let today = new Date().toDateString();

let savedDate = localStorage.getItem("savedDate");

if (savedDate !== today) {
    localStorage.setItem("savedDate", today);
    localStorage.setItem("todayDone", JSON.stringify([]));
}

let todayDone = JSON.parse(localStorage.getItem("todayDone")) || [];

let totalTopics = document.querySelector("#total-topics");
let doneToday = document.querySelector("#done-today");
let needRevision = document.querySelector("#needRev");
let streak = document.querySelector("#streak");

updateStats();

function getRevisionAge(lastRevised){

    if(lastRevised === null){
        return "Never Revised";
    }

    let lastDate = new Date(lastRevised);
    let today = new Date();
    let difference = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24)

    );

    return difference + " days ago";
}

function updateStats(){
    totalTopics.innerText = "Total Topics: " + topics.length;
    doneToday.innerText = "Done Today: " + todayDone.length;

    let needRevisionCount = topics.filter(function(topic){
        if(topic.lastRevised === null){
            return false;
        }
        let lastDate = new Date(topic.lastRevised);
        let today = new Date();
        let difference = (today - lastDate) / (1000 * 60 * 60 *24);
        const PRIORITY_DAYS = 10;
        return difference >= PRIORITY_DAYS;
    });

    needRevision.innerText = "Need Revision: " + needRevisionCount.length;

    streak.innerText = "Streak: " + (Number(localStorage.getItem("streakCount")) || 0);
}

shuffleButton.addEventListener("click", function(){

    let priorityTopics = topics.filter(function(topic){
        if(todayDone.includes(topic.name)){
            return false;
        }

        if (topic.lastRevised === null){
            return false;
        }

    let lastDate = new Date(topic.lastRevised);
    let today = new Date();
    let difference = (today - lastDate) / (1000 * 60 * 60 * 24);
    const PRIORITY_DAYS = 10;
    return difference >= PRIORITY_DAYS;
    });

    let chosenList;
    if (priorityTopics.length > 0) {
        chosenList = priorityTopics;
    }
    else {
        chosenList = topics.filter(function(topic){
            return !
            todayDone.includes(topic.name);

        });
    }

    if(chosenList.length === 0){
        result.innerText = "All topics done today";
        return;
    }
    let randomIndex = Math.floor(Math.random() * chosenList.length);
    let randomTopic = chosenList[randomIndex];
    currentTopic = randomTopic;

    result.innerText = randomTopic.name + " | Last revised: " +
    getRevisionAge(randomTopic.lastRevised);

});


doneButton.addEventListener("click", function(){

    if(currentTopic === null){
        return;
    }

    if (todayDone.includes(currentTopic.name)){
        return;
    }

    todayDone.push(currentTopic.name);
    localStorage.setItem("todayDone", JSON.stringify(todayDone));

let today = new Date();
let yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
let lastRevisionDate = localStorage.getItem("lastRevisionDate");
let streakCount = Number(localStorage.getItem("streakCount")) || 0;

if(lastRevisionDate === today.toDateString()){
}
else if(lastRevisionDate === yesterday.toDateString()){
    streakCount++;
}
else{
    streakCount = 1;
}


localStorage.setItem("streakCount", streakCount);


localStorage.getItem("streakCount");
localStorage.setItem("lastRevisionDate", today.toDateString());
updateStats();
});

addButton.addEventListener("click", function(){
    if (input.value === ""){
        return;
    }

    let alreadyExists = topics.some(function(topic){
        return topic.name === input.value;
    });

    if (alreadyExists){
        return;
    }

    topics.push({
        name: input.value,
        lastRevised: null
});

localStorage.setItem("topics", JSON.stringify(topics));
console.log(topics);

updateStats();

    input.value = "";
    
});
