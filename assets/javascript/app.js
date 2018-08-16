// Initialize Firebase
var config = {
    apiKey: "AIzaSyCGsZX0qjzEpc5Eg0VvXvQWqGJnxNGAGrA",
    authDomain: "train-scheduler-bc7bd.firebaseapp.com",
    databaseURL: "https://train-scheduler-bc7bd.firebaseio.com",
    projectId: "train-scheduler-bc7bd",
    storageBucket: "train-scheduler-bc7bd.appspot.com",
    messagingSenderId: "270985835512"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainsArray = [];
var id = 0;

$("#submit").on("click", function(event) {
    event.preventDefault();

    id++;

    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var frequency = parseInt($("#frequency").val().trim());
    var firstTime = $("#first-time").val().trim().toLowerCase();
    // push back firstTime by 1 day to make sure it comes before current time
    var firstTimeAdjusted = moment(firstTime, "HH:mm").subtract(1, "days");
    var timeDiff = moment().diff(moment(firstTimeAdjusted), "minutes");
    var timeRemainder = timeDiff % frequency;
    var minutesAway = frequency - timeRemainder;
    var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm");

    trainsArray.push({
        name: name,
        destination: destination,
        frequency: frequency,
        nextTrain: nextTrain,
        minutesAway: minutesAway,
    })

    // check that time entered is in specified military format and doesn't contain letters and inputs aren't empty
    if (firstTime.length === 5 && !firstTime.match(/[a-z]/i) && name != "" && destination != "" && frequency != "") {
        database.ref().push({
            name: name,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency,
            minutesAway: minutesAway,
            nextTrain: nextTrain,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
        // database.ref().push(trainsArray);
    } else {
        alert("Please enter your information in the specified format.");
    }
    
    // clear input fields
    $("#name").val("");
    $("#destination").val("");
    $("#first-time").val("");
    $("#frequency").val("");

    console.log(trainsArray);
})

// for (var i = 0; i < trainsArray.length; i++) {

// }


database.ref().on("child_added", function(childSnapshot) {
    $("#new-train").append(
        "<tr id='" + id + "'><td>" + childSnapshot.val().name +
        "</td><td>" + childSnapshot.val().destination +
        "</td><td>" + childSnapshot.val().frequency +
        "</td><td>" + childSnapshot.val().nextTrain +
        "</td><td>" + childSnapshot.val().minutesAway +
        "</td><td>" + "<button class='cancel'>x</button>" + "</td></tr>");
        // ^^ add unique firebase id as id in the cancel button so that when i click on it i can target the unique id to delete that row
})
