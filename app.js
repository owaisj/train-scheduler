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
        let firstTrain = $("#train-first-hour").val() + ":" + $("#train-first-minute").val() + " " + $("#meridiem").val();
        console.log(firstTrain);

        trainLine.push({
            "name": name,
            "destination": destination,
            "frequency": trainFreq,
            "first": firstTrain
        })

    })

    trainLine.on("child_added", function(snapshot){
        let firstTrainTime = moment(snapshot.val().first, 'hh:mm A');
        let currentTime = moment();
        let difference = currentTime.diff(firstTrainTime, 'minutes');
        let nextTrain = difference % snapshot.val().frequency;
        let untilNextTrain = snapshot.val().frequency - nextTrain;
        let nextTrainTime = moment().add(untilNextTrain, "minutes").format('hh:mm A');

        console.log(firstTrainTime);
        console.log(currentTime);
        console.log(difference);
        console.log(nextTrain);
        console.log(untilNextTrain);
        console.log(nextTrainTime);

        $("#train-schedule").append(
            `<tr>
                <td>${snapshot.val().name}</td>
                <td>${snapshot.val().destination}</td>
                <td>${snapshot.val().frequency}</td>
                <td>${nextTrainTime}</td>
                <td>${untilNextTrain}</td>
            </tr>`
        )
    })
});