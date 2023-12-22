const express = require('express');
const app = express();
app.use(express.json());

const elevator1 = {
    id: 1,
    currentFloor: 1,
    status: ['idle', 'moving_up', 'moving_down'],
    destinationFloor: '',
};

const elevator2 = {
    id: 2,
    currentFloor: 1,
    status: ['idle', 'moving_up', 'moving_down'],
    destinationFloor: '',
};

const elevators = [elevator1, elevator2];

const floors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


//app.get

app.get('/', (req, res) => {
    res.send(elevators);
})

app.get('/elevator/:id', (req, res) => {
    const elevator = validateElevator(req, elevators)
    if (!elevator) res.status(400).send('Given elevator was not found')

    res.send(elevator);
})

app.get('/elevator/current/floor', (req, res) => {
    res.send(elevator.currentFloor.toString());
})

//app.put
app.put('/elevator/move/:id', (req, res) => {
    const elevator = validateElevator(req, elevators)
    if (!elevator) res.status(400).send('Given elevator was not found')

    const floor = parseInt(req.body.floor);
    elevator.destinationFloor = floor;
    res.send(`Going to floor ${elevator.destinationFloor}...`);
})

//functions

function validateElevator(req, elevators) {
    const elevator = elevators.find(e => e.id === parseInt(req.params.id))
    return elevator;
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