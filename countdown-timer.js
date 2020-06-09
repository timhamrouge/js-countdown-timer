var countdowns = {};

showstorage = () => console.log(localStorage);


// TODO:
// Disable save button after timer has been saved - do not add a save button to the timer li after it has been created from localstorage



window.onload = function () {
    console.log(localStorage)
    if (localStorage.timers && localStorage.timers.length) {
        for (let [key, value] of Object.entries(JSON.parse(localStorage.timers)[0])) {
            createCountdown(key, value);
        }
    }
};

// THIS IS ALL DONE

function clearStorage() {
    delete localStorage.timers;
}

function clearAllTimers() {
    clearStorage();
    for(countdown in countdowns) {
        deleteTimer(countdown)
    }
}

formatString = (unit) => String(unit).padStart(2, "0");

getDays = (timeUntil) => formatString(Math.floor(timeUntil / (1000 * 60 * 60 * 24)));
getHours = (timeUntil) => formatString(Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
getMinutes = (timeUntil) => formatString(Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60)));
getSeconds = (timeUntil) => formatString(Math.floor((timeUntil % (1000 * 60)) / 1000));


function validateName(nameString) {
    if (!nameString) {
        updateErrorStyling("name", "You must provide an event name", "1px solid red");
        return false;
    } else if (countdowns[nameString]) {
        updateErrorStyling("name", "A timer with that name already exists.", "1px solid red");
        return false;
    }
    updateErrorStyling("name", "", "1px solid #ced4da");
    return true;
};

function timestampExists(timestamp) {
    return (Object.entries(countdowns).map(arr => arr[1].timestamp)).includes(timestamp);
};

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
        } else if (timestampExists(timestamp)) {
            updateErrorStyling("date", "A countdown to that date already exists", "1px solid red");
            return false;
        } else {
            updateErrorStyling("date", "", "1px solid #ced4da");
            return true;
        }
    }
};

function validateInputs(eventName, eventDate) {
    if (validateName(eventName) && validateDate(eventDate)) {
        return true;
    }
    return false;
};

function handleEventReached(name) {
    document.getElementById("countdown-modal-body").innerHTML = name;
    const audio = document.getElementById("alert");
    audio.currentTime = 0;
    audio.play();
    $("#countdown-modal").modal();
    deleteTimer(name);
}

function calculateTimeRemaining(ms) {
    return { days: getDays(ms), hours: getHours(ms), minutes: getMinutes(ms), seconds: getSeconds(ms) };
};

function tickCountdown(name, date) {
    const now = Date.now();

    if (now > date) {
        return handleEventReached(name);
    }

    const msLeft = date - now;
    const countdownElement = document.getElementById(`${name}-countdown-card-text`);

    const units = calculateTimeRemaining(msLeft);

    if (!countdownElement) {
        createCountdownElement(name, units);
    } else {
        // this is fine but the name doesn't need to be updated every time
        countdownElement.innerHTML = `${units.days}d ${units.hours}h ${units.minutes}m ${units.seconds}s`;
    }
};

function createTick(name, date) {
    return setInterval(() => tickCountdown(name, date), 1000);
};

function validateForm() {
    const eventName = document.getElementById("event-name").value;
    const eventTime = document.getElementById("event-time").value || "00:00";
    const eventDate = Date.parse(document.getElementById("event-date").value + 'T' + eventTime);

    if (validateInputs(eventName, eventDate)) {
        createCountdown(eventName, eventDate)
    }
};

function createCountdown(eventName, eventDate) {
    countdowns[eventName] = { timestamp: eventDate, interval: createTick(eventName, eventDate) };
    tickCountdown(eventName, eventDate);
};

// TODO: refactor this
function createCountdownElement(name, units) {
    const { days, hours, minutes, seconds } = units;
    const countdownLi = document.createElement("li");
    countdownLi.setAttribute("id", `${name}-countdown-timer`);
    countdownLi.setAttribute("class", "list-group-item");

    const countdownCard = document.createElement("div");
    countdownCard.setAttribute("class", 'card')

    const countdownCardBody = document.createElement("div");
    countdownCardBody.setAttribute("class", "card-body")

    const countdownCardTitle = document.createElement("h4");
    countdownCardTitle.setAttribute("class", "card-title");
    countdownCardTitle.innerHTML = name;

    const countdownCardText = document.createElement("p");
    countdownCardText.setAttribute("class", "card-text");
    countdownCardText.setAttribute("id", `${name}-countdown-card-text`)
    countdownCardText.setAttribute("style", "text-align: center; font-size: 8vw;")

    countdownCardText.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`

    const countdownCardButtons = document.createElement("div")
    countdownCardButtons.setAttribute("class", "btn-group float-right");
    countdownCardButtons.setAttribute("role", "group");


    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn btn-danger float-right")
    deleteButton.setAttribute("type", "button")

    deleteButton.onclick = () => deleteTimer(name);
    deleteButton.innerHTML = 'Delete';

    let saveButton = document.createElement("button");
    saveButton.setAttribute("class", "btn btn-success float-right")
    saveButton.setAttribute("style", "margin-right: 4px;")

    saveButton.setAttribute("type", "button")

    saveButton.onclick = () => saveTimer(name);
    saveButton.innerHTML = 'Save';

    countdownLi.appendChild(countdownCard)
    countdownCard.appendChild(countdownCardBody)
    countdownCardBody.appendChild(countdownCardTitle)
    countdownCardBody.appendChild(countdownCardText)
    countdownCardBody.appendChild(deleteButton)
    countdownCardBody.appendChild(saveButton)

    document.getElementById("countdown-list").appendChild(countdownLi);
}



function updateErrorStyling(elementID, val, colour) {
    document.getElementById(`event-${elementID}-error`).innerHTML = val;
    document.getElementById(`event-${elementID}`).style.border = colour;
}

function stopAudio() {
    var audio = document.getElementById("alert")
    audio.pause();
}

function saveTimer(name) {
    let obj = {};
    obj[name] = countdowns[name].timestamp;

    if (localStorage.timers && localStorage.timers.length) {
        let timersInStorage = JSON.parse(localStorage.timers)[0]
        obj = Object.assign(timersInStorage, obj)
    }
    localStorage.timers = JSON.stringify([obj]);
}

function deleteTimer(name) {
    clearInterval(countdowns[name].interval);
    delete countdowns[name];

    if (localStorage.timers && localStorage.timers.length && Object.keys(JSON.parse(localStorage.timers)[0]).includes(name)) {
        let timers = JSON.parse(localStorage.timers)[0];
        delete timers[name]
        if (Object.keys(timers).length) {
            localStorage.timers = JSON.stringify([timers]);
        } else {
            clearStorage();
        }


    }
    // TODO: put this in Delete DOM element function
    const countdownDiv = document.getElementById(`${name}-countdown-timer`);
    countdownDiv.parentNode.removeChild(countdownDiv);
}


// TODO: this functionality
function handlePlaceholderVisibility() {
    const element = document.getElementById('no-countdowns-li');

}

