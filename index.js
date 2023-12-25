const express = require('express');
const app = express();
app.use(express.json());

//Outside each elevator on each floor there is a dislay
//On the display there should be a call button, and a log message of the status and destination floor for each elevator.
//Inside each elevator there is a elevator display where you can call which floor you want to go to.

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

const elevator3 = {
    id: 3,
    currentFloor: 1,
    status: 'idle',
    destinationFloor: '',
};

const elevators = [elevator1, elevator2, elevator3];

// const floors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


//app.get

app.get('/', (req, res) => {
    res.send(elevators);
})

app.get('/elevator/:id', (req, res) => {
    const elevator = validateElevator(req, elevators)
    if (!elevator) res.status(400).send('Given elevator was not found')

    res.send(elevator);
})

//app.put

//Is the button on the floor displays that calls the closest elevator to myFloor

app.put('/elevator/call', (req, res) => {

    const myFloor = parseInt(req.body.floor);
    if (myFloor > 10 || myFloor <= 0) return res.status(400).send('ERROR! Your floor was not found!');
    const elevator = findClosestElevator(myFloor);
    console.log(`Calling elevator ${elevator.id}`);

    elevator.destinationFloor = myFloor;

    const timeOutDuration = elevatorTravelTime(elevator, myFloor);
    const travelStatus = validateElevatorStatus(elevator);

    console.log(`${travelStatus} floor ${elevator.destinationFloor}!`);

    setTimeout(() => {
        elevator.currentFloor = myFloor;
        elevator.status = 'idle';
        res.send(`Elevator have arrived at floor ${elevator.currentFloor}!`);
    }, timeOutDuration);

})

//Is the floor option buttons on the elevator display. When pressed it moves the elevator to the given floor. It displays a status message to all floor displays and displays a message to the elevator display when it have arrived.

app.put('/elevator/move/:id', (req, res) => {
    const elevator = validateElevator(req, elevators)
    if (!elevator) res.status(400).send('Given elevator was not found')

    const floor = parseInt(req.body.floor);
    if (floor > 10 || floor <= 0) return res.status(400).send('ERROR! Given floor not found.');
    elevator.destinationFloor = floor;

    const timeOutDuration = elevatorTravelTime(elevator, floor);
    const travelStatus = validateElevatorStatus(elevator);

    console.log(`${travelStatus} floor ${elevator.destinationFloor}!`);

    setTimeout(() => {
        elevator.currentFloor = floor;
        elevator.status = 'idle';
        res.send(`Elevator have arrived at floor ${elevator.currentFloor}!`);
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

function validateElevatorStatus(elevator) {

    if (elevator.currentFloor > elevator.destinationFloor) {
        elevator.status = 'moving_down';
        return 'Moving down to';
    } else if (elevator.currentFloor < elevator.destinationFloor) {
        elevator.status = 'moving_up';
        return 'Moving up to';
    } else {
        elevator.status = 'idle';
        return 'Elevator already at';
    }
}

function findClosestElevator(myFloor) {
    let closestElevator = null;
    let shortestDistance = 11; // Greater than the maximum floor (10)

    //Compares distance between the 2 elevators.
    for (let elevator of elevators) {
        const distance = Math.abs(elevator.currentFloor - myFloor)

        if (distance < shortestDistance) {
            closestElevator = elevator; //Replaces null with Elevator Object
            shortestDistance = distance; ///Update shortestDistance
        }
    }
    return closestElevator;
}

//TEST = 6 diffrent floors executed at same time

//The call to floor function can only take 1 call to floor and then execute  1 move request. when the move request is done and status is idle it can move to the next call. 

function callElevator(myFloor, toFloor) {

}

function callAllElevators(elevators, [myFloors], [toFloors]) {

}

//function that displays the status of all elevators


function displayElevators(elevators) {
    console.log('Elevator status');

    for (let elevator of elevators) {
        console.log(`Elevator ${elevator.id}`);
        console.log(elevator.status);
    }
}
displayElevators(elevators);

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));