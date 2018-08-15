// Initialize Firebase
var config = {
    apiKey: "AIzaSyCGsZX0qjzEpc5Eg0VvXvQWqGJnxNGAGrA",
    authDomain: "train-scheduler-bc7bd.firebaseapp.com",
    databaseURL: "https://train-scheduler-bc7bd.firebaseio.com",
    projectId: "train-scheduler-bc7bd",
    storageBucket: "",
    messagingSenderId: "270985835512"
};
firebase.initializeApp(config);

var database = firebase.database();

var name = "";
var destination = "";
var firstTime = "";
var frequency = "";
var minutesAway = "";

$("#submit").on("click", function(event) {
    event.preventDefault();

    name = $("#name").val().trim();
    destination = $("#destination").val().trim();
    frequency = parseInt($("#frequency").val().trim());
    firstTime = $("#first-time").val().trim().toLowerCase();

    // check that time entered is in specified military format and doesn't contain letters and inputs aren't empty
    if (firstTime.length === 5 && !firstTime.match(/[a-z]/i) && name != "" && destination != "" && frequency != "") {
        database.ref().push({
            name: name,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency,
            minutesAway: minutesAway,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    } else {
        alert("Please enter your information in the specified format.");
    }
    
    // clear input fields
    $("#name").val("");
    $("#destination").val("");
    $("#first-time").val("");
    $("#frequency").val("");
})

database.ref().on("child_added", function(childSnapshot) {
    $("#new-train").append(
        "<tr><td>" + childSnapshot.val().name +
        "</td><td>" + childSnapshot.val().destination +
        "</td><td>" + childSnapshot.val().frequency +
        "</td><td>" + childSnapshot.val().firstTime +
        "</td><td>" + childSnapshot.val().minutesAway + "</td></tr>");
})