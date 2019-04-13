$(document).ready(function(){
    $("#submit").on("click", (event) => {
        event.preventDefault();
        let schedule = $("#train-schedule");

        let name = $("#train-name").val();
        console.log(name);
        let destination = $("#train-destination").val();
        console.log(destination);
        let trainFreq = $("#train-freq").val();
        console.log(trainFreq);
        let firstTrain = $("#train-first").val();
        firstTrain = moment(firstTrain, 'hh:mm').format('hh:mm');
        console.log(firstTrain);

    })
});