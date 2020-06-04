
var countdowns = {};
var foo;
var timers = [];


// TODO:
// Disable save button after timer has been saved - do not add a save button to the timer li after it has been created from localstorage
// update general styling
// Have clear TImers button call clearStorage() and delete all timers. 
// Test creation and clearing of timers from storage, and saving and delting of timers
// genral refactoring
// update the timer finished modal, the timer finished logic, and the modal appearing logic


function createCountdown() {
    const eventName = document.getElementById("event-name").value;
    const eventTime = document.getElementById("event-time").value || "00:00";
    const eventDate = Date.parse(document.getElementById("event-date").value + 'T' + eventTime);

    if(validateInputs(eventName, eventDate)) {
        // calculate time remaining
        countdowns[eventName] = { timestamp: eventDate, interval: null}
        workOutTimeLeft(eventName, eventDate);
        createTimers(); // << this calls the above also...
    }
}

// create timer LI

function startTimer() {
    var eventName = document.getElementById("event-name").value;
    var eventTime = document.getElementById("event-time").value || "00:00";
    var eventDate = Date.parse(document.getElementById("event-date").value + 'T' + eventTime);

    if (validateInputs(eventName, eventDate)) {
        dates[eventName] = eventDate;
        workOutTimeLeft(eventName, eventDate);
        createTimers();
    }
}

function clearStorage() {
    delete localStorage.timers;
}

window.onload = function() {
    console.log(localStorage)
    if (localStorage.timers && localStorage.timers.length) {
        dates = JSON.parse(localStorage.timers)[0]
        console.log(dates)
        for (let [key, value] of Object.entries(dates)) {
            workOutTimeLeft(key, value);
          }
        createTimers();
    }
}

function updateErrorStyling(elementID, val, colour) {
    document.getElementById(`event-${elementID}-error`).innerHTML = val;
    document.getElementById(`event-${elementID}`).style.border = colour;
}

function validateName(nameString) {
    if (!nameString) {
        updateErrorStyling("name", "You must provide an event name", "1px solid red");
        return false;
    } else if (dates[nameString]) {
        updateErrorStyling("name", "A timer with that name already exists.", "1px solid red");
        return false;
    }
    updateErrorStyling("name", "", "1px solid #ced4da");
    return true;
}

function validateDate(timestamp) {
    if (!timestamp) {
        updateErrorStyling("date", "You must provide an event date", "1px solid red");
        return false;
    } else {
        if ((timestamp - Date.now()) < 0) {
            updateErrorStyling("date", "You cannot enter a date in the past", "1px solid red");
            return false;
        } else if (timestamp > (Date.now() + 8640000000)) {
            updateErrorStyling("date", "You cannot enter a date that far in the future", "1px solid red");
            return false;
        } else if (Object.values(dates).includes(timestamp)) {
            updateErrorStyling("date", "A countdown to that date already exists", "1px solid red");
            return false;
        } else {
            updateErrorStyling("date", "", "1px solid #ced4da");
            return true;
        }
    }
}

function validateInputs(eventName, eventDate) {
    if (validateName(eventName) && validateDate(eventDate)) {
        return true;
    }
    return false;
}




function createTimers() {
    timers.forEach(timer => {
        clearInterval(timer.timer)
    })
    for (let [key, value] of Object.entries(dates)) {
        timers.push({ name: key, timer: setInterval(() => workOutTimeLeft(key, value), 1000) })
    }
}
function removeDOMElement(id, name) {
    const countdownList = document.getElementById('countdown-list');

    if (name) {
        if(localStorage.timers && localStorage.timers.length) {
            if (Object.keys(JSON.parse(localStorage.timers)[0]).includes(name)) {
                let obj = JSON.parse(localStorage.timers)[0];
                delete obj[name];
                if (Object.keys(obj).length) {
                    localStorage.timers = JSON.stringify([obj]);
                } else {
                    clearStorage();
                }
            }
            console.log(Object.keys(JSON.parse(localStorage.timers)[0]));
            // if (Object.keys(JSON.parse(localStorage.timers[])))
        }
        delete dates[name];
        clearInterval(timers.find(timer => timer.name === name).timer)
        timers = timers.filter(timer => timer.name != name);
    }

    var element = document.getElementById(id);
    countdownList.removeChild(element);


    //     <ul id="countdown-list" class="list-group list-group-flush">
    //     <li class="list-group-item">No countdowns set</li>
    //   </ul>

    if (!countdownList.children.length && name) {
        let countdownLi = document.createElement("li");
        countdownLi.setAttribute("class", "list-group-item");
        countdownLi.setAttribute("id", "no-countdowns-li");
        countdownLi.innerHTML = 'No countdowns set'
        countdownList.appendChild(countdownLi);
    }
}

function saveTimer(name) {
    let obj = {};
    obj[name] = dates[name];

    console.log(obj, 'obj')

    if (localStorage.timers && localStorage.timers.length) {
        let timersInStorage = JSON.parse(localStorage.timers)[0]
        obj = Object.assign(timersInStorage, obj)
    }

    localStorage.timers = JSON.stringify([obj])

}

function deleteTimer(name) {
    //delete from localStorage if it's there

    clearInterval(timers.find(timer => timer.name === name).timer);
    timers = timers.filter(timer => timer.name != name);
    delete dates[name];

    const timerDiv = document.getElementById(`${name}-countdown-timer-div`);



}

function stopAudio() {
    var audio = document.getElementById("alert")
    audio.pause();
}

function handleEventReached(name) {
    console.log(name)
    // delete the timer, from localstorage and the global object, clear the interval
}

formatString = (units) => ""+units.padStart(2, "0");

getDays = (timeUntil) => formatString(Math.floor(timeUntil / (1000 * 60 * 60 * 24)));
getHours = (timeUntil) => formatString(Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
getMinutes = (timeUntil) => formatString(Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60)));
getSeconds = (timeUntil) => formatString(Math.floor((timeUntil % (1000 * 60)) / 1000));

function updateCountdownElement(name) {

}

function calculateTimeRemaining(name, date){    
    const now = Date.now();
    const msLeft = date - now;
    // let days = getDays(msLeft), hours = getHours(msLeft), minutes = getMinutes(msLeft), seconds;

    const countdownElement  = document.getElementById(`${name}-countdown-timer-div`);

    if (!countdownElement) {
        // call function to create countdown div
    } else {
        // the below is fine but we never need to update the name
        countdownElement.innerHTML = `${name}: ${days}d ${hours}h ${minutes}m ${seconds}s`
    }


    

}



function workOutTimeLeft(name, date) {
    let now = Date.now();

    // don't do this if the modal is already open. But open it after the open modal is closed if another countdown is reached
    if (now > date) {
        handleEventReached(name);
        // handle a timer that has been reached
        // delete timer and have a pop-up, or change the timer somehow
        clearInterval(timers.find(timer => timer.name === name).timer)
        document.getElementById("countdown-modal-body").innerHTML = name;
        $("#exampleModal").modal();
        var audio = document.getElementById("alert")
        audio.currentTime = 0;
        audio.play();
    }
    let days, hours, minutes, seconds;
    let timeUntil = date - now;

    days = getDays(timeUntil);
    hours = getHours(timeUntil);
    minutes = getMinutes(timeUntil);
    seconds = getSeconds(timeUntil);


    let emptyListItem = document.getElementById('no-countdowns-li');

    if (emptyListItem) {
        removeDOMElement('no-countdowns-li')
    }

    if (!document.getElementById(`${name}-countdown-timer-div`)) {
        let countdownLi = document.createElement("li");
        countdownLi.setAttribute("id", `${name}-countdown-timer`);
        countdownLi.setAttribute("class", "list-group-item");

        let deleteButton = document.createElement("BUTTON");
        deleteButton.onclick = () => removeDOMElement(`${name}-countdown-timer`, name)

        let saveButton = document.createElement("BUTTON");
        saveButton.onclick = () => saveTimer(name);

        let countdownDiv = document.createElement("div");
        countdownDiv.setAttribute("id", `${name}-countdown-timer-div`);

        deleteButton.innerHTML = 'X';
        saveButton.innerHTML = 'Save';


        countdownDiv.innerHTML = `${name}: ${days}d ${hours}h ${minutes}m ${seconds}s`
        // console.log(document.getElementById(`${name}-countdown-timer`));
        countdownLi.appendChild(countdownDiv);
        countdownLi.appendChild(deleteButton);
        countdownLi.appendChild(saveButton);

        document.getElementById("countdown-list").appendChild(countdownLi);

    } else {
        document.getElementById(`${name}-countdown-timer-div`).innerHTML = `${name}: ${days}d ${hours}h ${minutes}m ${seconds}s`
    }
};