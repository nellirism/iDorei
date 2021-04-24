// set the date at the top of the page using vanilla js
// var rightNow = new Date();
// $("#currentDay").text(rightNow);

// set the date at the top of the page using momentjs
var today = moment();
$("#currentDay").text(today.format("MMMM Do, YYYY - hh:mm:ss a"));

// declare tasks objects to store in localStorage
var tasks = {
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": []
};

var setTasks = function() {
    // add tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var getTasks = function() {
    // load tasks from localStorage and create tasks in the right row

    var loadedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (loadedTasks) {
        tasks = loadedTasks

        // for each key/value pair in tasks, create a task
        $.each(tasks, function(hour, task) {
            var hourDiv = $("#" + hour);
            createTask(task, hourDiv);
        })
    }
    // make sure the past/current/future time is reflected
    auditTasks()
}

var createTask = function(taskText, hourDiv) {
    // create a task in the row that corresponds to the specified hour 
    var taskDiv = hourDiv.find(".task");
    var taskP = $("<p>")
        .addClass("description")
        .text(taskText)
    taskDiv.html(taskP);
}

var auditTasks = function() {
    // update the background of each row based on the time of day

    var currentHr = moment().hour();
    $(".taskinfo").each(function() {
        var elementHr = parseInt($(this).attr("id"));

        //  handle past, present and future
        if (elementHr < currentHr) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        else if (elementHr === currentHr) {
            $(this).removeClass(["past", "future"]).addClass("present");
        }
        else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};

var replaceTextArea = function(textareaEl) {
    // replaces the provided textarea element with a p element and persist the date in localStorage
    debugger;
    // get the necessary elements
    var tazinfo = textareaEl.closest(".taskinfo");
    var textAreas = tazinfo.find("textarea");
    
    // get the time and task
    var time = tazinfo.attr("id");
    var text = textAreas.val().trim();

    // persist data
    tasks[time] = [text]; // setting to a one item list since there's only one task for now
    setTasks();

    // replace the textarea element with a p element
    createTask(text, tazinfo);
}

// CLICK 

// tasks
$(".task").click(function() {

    // save the other tasks if they're already been clicked
    $("textarea").each(function() {
        replaceTextArea($(this));
    })

    // convert to a textarea element if the time hadn't passed
    var time = $(this).closest(".taskinfo").attr("id");
    if (parseInt(time) >= moment().hour()) {

        // create a textInput element that includes the current task
        var text = $(this).text();
        var textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);

        // add the textInput element to the parent div
        $(this).html(textInput);
        textInput.trigger("focus");
    }
})

// save button click handler
$(".saveBtn").click(function() {
    replaceTextArea($(this));
})

// update tast backgrounds on the hour
timeToHr = 3600000 - today.milliseconds(); // check how much time is left until the next hour
setTimeout(function() {
    setInterval(auditTasks, 3600000)
}, timeToHr);

// get the tasks from localStorage on load
getTasks();