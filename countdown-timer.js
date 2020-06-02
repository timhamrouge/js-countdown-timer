    
    var dates = {};
    var foo;
    var timers = [];
    
    // document.onload = function() {
    //     dates = 
    // }

        function updateDOMElementInnerHTML(elementID, val) {
            document.getElementById(`event-${elementID}-error`).innerHTML = val;
        }

        function updateDOMElementColour(elementID, colour) {
            document.getElementById(`event-${elementID}`).style.border = colour;
        }


        // 1px solid #ced4da
        function validateName(nameString) {
            if (!nameString) {
                    updateDOMElementInnerHTML("name", "You must provide an event name");
                    updateDOMElementColour("name", "1px solid red")
                    return false;
            } else if (dates[nameString]){
                updateDOMElementInnerHTML("name", "A timer with that name already exists.");
                updateDOMElementColour("name", "1px solid red")
                    return false;
                }
                    console.log('trig in else')
                    updateDOMElementInnerHTML("name", "");
                    updateDOMElementColour("name", "1px solid #ced4da")

                    return true;
        }

        function validateDate(timestamp) {
            if (!timestamp) {
                    updateDOMElementInnerHTML("date", "You must provide an event date");
                    updateDOMElementColour("date", "1px solid red");

                    return false;
                } else {
                    if ((timestamp - Date.now()) < 0) {
                        updateDOMElementInnerHTML("date", "You cannot enter a date in the past");
                    updateDOMElementColour("date", "1px solid red");

                        return false;
                        
                    } else if (timestamp > (Date.now() + 8640000000)) {
                        updateDOMElementInnerHTML("date", "You cannot enter a date that far in the future");
                    updateDOMElementColour("date", "1px solid red");

                        return false;
                        
                    } else if (Object.values(dates).includes(timestamp)){
                        updateDOMElementInnerHTML("date", "A countdown to that date already exists");
                    updateDOMElementColour("date", "1px solid red");

                        return false;
                        
                    } else {
                        updateDOMElementInnerHTML("date", "");
                    updateDOMElementColour("date", "1px solid #ced4da");

                        return true;
                    }
                }
        }

        // function createCountdown() {
        //     var eventTime = document.getElementById("event-time").value || "00:00";
        //     var eventDate = Date.parse(document.getElementById("event-date").value + 'T' + eventTime);
        //     var nameValid = validateName(document.getElementById("event-name").value);
        //     var dateValid = validateDate(eventDate);

        //     if (nameValid, dateValid) {
        //         // check if name and timestamp already exists on dates object
        //         dates[eventName] = eventDate;
        //         createTimer(eventName, eventDate);
        //     }  

        // }

        function validateInputs() {
            var eventName = document.getElementById("event-name").value;
            var eventTime = document.getElementById("event-time").value || "00:00";
            var eventDate = Date.parse(document.getElementById("event-date").value + 'T' + eventTime);
            var nameValid = validateName(eventName);
            var dateValid = validateDate(eventDate);
            
            console.log(nameValid, ' - name, ', dateValid, ' -date')

            if (nameValid && dateValid) {
                console.log('valid');
                // check if name and timestamp already exists on dates object
                // dates.push({name: eventName, date: eventDate});
                dates[eventName] = eventDate;
                createTimers(eventName, eventDate);
            }  
        }


        function createTimers() {
            timers.forEach(timer => {
                console.log(timer)
                clearInterval(timer.timer)
            })
            for (let [key, value] of Object.entries(dates)) {
                timers.push({name: key, timer: setInterval(() => workOutTimeLeft(key, value), 1000) })
            }
            // timers = dates.map(date => {
            //     console.log(date);
            //     return { name : date.name, timer : setInterval(() => workOutTimeLeft(date.name, date.date), 1000) };
            // })
            // workOutTimeLeft(name, date);
            // foo = setInterval(() => workOutTimeLeft(name, date), 1000)
        }
        function removeDOMElement(name) {
            var element = document.getElementById(`${name}-countdown-timer`);
            element.parentNode.removeChild(element);
        }

        function workOutTimeLeft(name, date) {
            let now = Date.now()
            let countdownString = '';
            let years, months, weeks, days, hours, minutes, seconds;
            let milisecondsUntil = date - now;

            days = String(Math.floor(milisecondsUntil / (1000 * 60 * 60 * 24))).padStart(2, "0");
            hours = String(Math.floor((milisecondsUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
            minutes = String(Math.floor((milisecondsUntil % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
            seconds = String(Math.floor((milisecondsUntil % (1000 * 60)) / 1000)).padStart(2, "0");

            console.log(String(days).padStart(2, "0"), hours, minutes, seconds);

            // console.log(countdownString);

        //     <ul id="countdown-list" class="list-group list-group-flush">
        //     <li class="list-group-item">No countdowns set</li>
        //   </ul>

            if(!document.getElementById(`${name}-countdown-timer`)) {
                let countdownLi = document.createElement("li");
                let deleteButton = document.createElement("BUTTON");
                deleteButton.onclick = () => removeDOMElement(name)
                let countdownDiv = document.createElement("div");
                deleteButton.innerHTML = '<i class="far fa-window-close"></i>';
                countdownDiv.setAttribute("id", `${name}-countdown-timer`)
                countdownLi.setAttribute("class", "list-group-item");

                countdownDiv.innerHTML = `${name}: ${days}d ${hours}h ${minutes}m ${seconds}s`
                // console.log(document.getElementById(`${name}-countdown-timer`));
                countdownLi.appendChild(countdownDiv);
                countdownLi.appendChild(deleteButton);
                document.getElementById("countdown-list").appendChild(countdownLi);

            } else {
                document.getElementById(`${name}-countdown-timer`).innerHTML = `${name}: ${days}d ${hours}h ${minutes}m ${seconds}s`
            }

            // console.log(years, months, weeks, days, hours, minutes, seconds);


            // setInterval(() => cb(years, months, weeks, days, hours, minutes, seconds), 1000);
        // window.onload = function() {
        //     setInterval(cb, 1000)
        // }
        // var interval;
        // TODO
        // use clearInterval and setInterval for the countdown
        // use localStorage to set timers
        // format milisecond for eventDate into actual date
        //
        // interval = window.setInterval(console.log('a second has passed'), 1000);
            // console.log(name, date, 'timothy')

        };



        // console.log(JSON.parse(localStorage.yourObject) || {});
        console.log(localStorage);
        // var obj = JSON.parse(localStorage.yourObject || {});
        // console.log(obj, 'here is obj');
        function clearStorage() {
            delete localStorage.yourObject;
        }