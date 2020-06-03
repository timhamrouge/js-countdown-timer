
var dates = {};
var foo;
var timers = [];

// document.onload = function() {
//     dates = 
// }

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


function createTimers() {
    timers.forEach(timer => {
        console.log(timer)
        clearInterval(timer.timer)
    })
    for (let [key, value] of Object.entries(dates)) {
        timers.push({ name: key, timer: setInterval(() => workOutTimeLeft(key, value), 1000) })
    }
}
function removeDOMElement(id, name) {
    const countdownList = document.getElementById('countdown-list');

    if (name) {
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

function workOutTimeLeft(name, date) {
    let now = Date.now()

    // don't do this if the modal is already open. But open it after the open modal is closed if another countdown is reached
    if (now > date) {
        // handle a timer that has been reached
        // delete timer and have a pop-up, or change the timer somehow
        clearInterval(timers.find(timer => timer.name === name).timer)
        $("#exampleModal").modal();
        var audio = document.getElementById("alert")
        audio.play();
    }
    let days, hours, minutes, seconds;
    let milisecondsUntil = date - now;

    days = String(Math.floor(milisecondsUntil / (1000 * 60 * 60 * 24))).padStart(2, "0");
    hours = String(Math.floor((milisecondsUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
    minutes = String(Math.floor((milisecondsUntil % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    seconds = String(Math.floor((milisecondsUntil % (1000 * 60)) / 1000)).padStart(2, "0");


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

        let countdownDiv = document.createElement("div");
        countdownDiv.setAttribute("id", `${name}-countdown-timer-div`);

        deleteButton.innerHTML = '<i class="far fa-window-close"></i>';

        countdownDiv.innerHTML = `${name}: ${days}d ${hours}h ${minutes}m ${seconds}s`
        // console.log(document.getElementById(`${name}-countdown-timer`));
        countdownLi.appendChild(countdownDiv);
        countdownLi.appendChild(deleteButton);
        document.getElementById("countdown-list").appendChild(countdownLi);

    } else {
        document.getElementById(`${name}-countdown-timer-div`).innerHTML = `${name}: ${days}d ${hours}h ${minutes}m ${seconds}s`
    }
};



// console.log(JSON.parse(localStorage.yourObject) || {});
console.log(localStorage);
// var obj = JSON.parse(localStorage.yourObject || {});
// console.log(obj, 'here is obj');
function clearStorage() {
    delete localStorage.yourObject;
}