const express = require('express');
const app = express();
app.use(express.json());

// Outside each elevator on each floor there is a dislay
//On the display there should be a call button, and a log message of the status and destination floor.
//Inside each elevator there is a display where you can call which floor you want to go to

const elevator1 = {
    id: 1,
    currentFloor: 1,
    status: 'idle',
    destinationFloor: '',
};

const elevator2 = {
    id: 2,
    currentFloor: 1,
    status: 'idle',
    destinationFloor: '',
};

const elevators = [elevator1, elevator2];

const floors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


//app.get

app.get('/', (req, res) => {
    console.log(elevators);
})

app.get('/elevator/:id', (req, res) => {
    const elevator = validateElevator(req, elevators)
    if (!elevator) res.status(400).send('Given elevator was not found')

    res.send(elevator);
})

//app.put

//When you press a floor you want to go to(the inside display of the elevator) it displays the status and destination floor.

app.put('/elevator/move/:id', (req, res) => {

    const timeOutDuration = elevatorTravelTime(elevator, floor);
    const elevator = validateElevator(req, elevators)
    if (!elevator) res.status(400).send('Given elevator was not found')

    const floor = parseInt(req.body.floor);
    elevator.destinationFloor = floor;
    
    console.log(`Going to floor ${elevator.destinationFloor}!`);

    setTimeout(() => {
        elevator.currentFloor = floor;
        res.send(`You have arrived at floor ${elevator.currentFloor}!`);
    }, timeOutDuration);
})



//functions

function validateElevator(req, elevators) {
    const elevator = elevators.find(e => e.id === parseInt(req.params.id))
    return elevator;
}

function elevatorTravelTime(elevator, floor) {

    const floorsToTravel = Math.abs(elevator.currentFloor - floor);
    const timeOutDuration = floorsToTravel * 1000;
    return timeOutDuration;
}

function validateStatus() {

}
// function getElevatorStatus(elevator) {
//     //Retrieve the current location and status of all elevators.
//     return new Promise((resolve, reject) => {


//     })
// }

// function callElevatorToFloor(floor) {
//     //Call the closest available elevator to the specified floor.
//     return new Promise((resolve, reject) => {

//     })
// }

// function updateElevatorStatus(elevatorId, status, destinationFloor) {
//     //Update the status and destination floor of an elevator.
//     return new Promise((resolve, reject) => {

//     })
// }

// function isElevatorAvailable(elevatorId) {
//     //Check if a specific elevator is available to serve a new call.
//     return new Promise((resolve, reject) => {

//     })
// }








const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));