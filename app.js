$(document).ready(function(){
    const config = {
        apiKey: "AIzaSyAUoKWzA0ZxaHGu2YELSjBjmP-ZdIytdYI",
        authDomain: "train-scheduler-4d444.firebaseapp.com",
        databaseURL: "https://train-scheduler-4d444.firebaseio.com",
        projectId: "train-scheduler-4d444",
        storageBucket: "train-scheduler-4d444.appspot.com",
        messagingSenderId: "181376007815"
      };
    firebase.initializeApp(config);
    database = firebase.database();
    let trainLine = database.ref("trains");

    $("#submit").on("click", (event) => {
        event.preventDefault();
        let name = $("#train-name").val();
        console.log(name);
        let destination = $("#train-destination").val();
        console.log(destination);
        let trainFreq = $("#train-freq").val();
        console.log(trainFreq);
        let firstTrain = $("#train-first").val();
        console.log(firstTrain);

        trainLine.push({
            "name": name,
            "destination": destination,
            "frequency": trainFreq,
            "first": firstTrain
        })

    })

    trainLine.on("child_added", function(snapshot){
        //TODO: Time Calculations
        //Take snapshot.val().first and convert to moment

        $("#train-schedule").append(
            `<tr>
                <td>${snapshot.val().name}</td>
                <td>${snapshot.val().destination}</td>
                <td>${snapshot.val().frequency}</td>
                <td>Next Arrival?</td>
                <td>Minutes Away?</td>
            </tr>`
        )
    })
});