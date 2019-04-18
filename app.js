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

        trainLine.child(name).set({
            "name": name,
            "destination": destination,
            "frequency": trainFreq,
            "first": firstTrain
        })

    })

    let createTable = function() {
        trainLine.on("child_added", function(snapshot){
        let firstTrainTime = moment(snapshot.val().first, 'hh:mm A');
        let currentTime = moment();
        let difference = currentTime.diff(firstTrainTime, 'minutes');
        let nextTrain = difference % snapshot.val().frequency;
        let untilNextTrain = snapshot.val().frequency - nextTrain;
        let nextTrainTime = moment().add(untilNextTrain, "minutes").format('hh:mm A');

        $("#train-schedule")
        .append(
            `<tr id="${snapshot.val().name}-line">
                <td>${snapshot.val().name}</td>
                <td>${snapshot.val().destination}</td>
                <td>${snapshot.val().frequency}</td>
                <td>${nextTrainTime}</td>
                <td>${untilNextTrain}</td>
                <td>
                    <button class="btn btn-light">
                        <i id="${snapshot.val().name}" class="fas fa-trash remove"></i>
                    </button>
                    <button class="btn btn-light">
                        <i id="${snapshot.val().name}" class="fas fa-sync refresh"></i>
                    </button>
                </td>
            </tr>`)
        }, function (error) {
            console.log("The read failed: " + error.code);
        });
    };
    
    $(document).on("click", ".remove", function() {
        let childId = $(this).attr("id");
        trainLine.child(childId).set(null);
        $(`#${childId}-line`).remove();
    })

    $(document).on("click", ".refresh", function() {
        let childId = $(this).attr("id");
        trainLine.child(childId).once("value").then(function(snapshot){
            let firstTrainTime = moment(snapshot.val().first, 'hh:mm A');
            let currentTime = moment();
            let difference = currentTime.diff(firstTrainTime, 'minutes');
            let nextTrain = difference % snapshot.val().frequency;
            let untilNextTrain = snapshot.val().frequency - nextTrain;
            let nextTrainTime = moment().add(untilNextTrain, "minutes").format('hh:mm A');

            $(`#${childId}-line`).empty()
            .append(`
                <td>${snapshot.val().name}</td>
                <td>${snapshot.val().destination}</td>
                <td>${snapshot.val().frequency}</td>
                <td>${nextTrainTime}</td>
                <td>${untilNextTrain}</td>
                <td>
                    <button class="btn btn-light">
                        <i id="${snapshot.val().name}" class="fas fa-trash remove"></i>
                    </button>
                    <button class="btn btn-light">
                        <i id="${snapshot.val().name}" class="fas fa-sync refresh"></i>
                    </button>
                </td>
            `);
        });
    });

    //Initial Call to Create Table On Page Load
    createTable();

    //Interval for Refresh of Table
    let intervalID;
    let rCounter = 0;
    function tableRefresh() {
        let temp = function() {
            $("#train-schedule").empty();
            createTable();
            rCounter++;
            console.log(`This interval has occurred ${rCounter} times`);
        }
        intervalID = setInterval(temp, 30000);
    }
    tableRefresh();
});