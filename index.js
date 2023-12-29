//import npm
const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');
axios.defaults.baseURL = 'http://localhost:3000';

//Outside each floor there is a dislay
//On the display there should be a call button, and a log message of the status and destination floor for each elevator.
//Inside each elevator there is a elevator display where you can call which floor you want to go to.

console.log('Before');

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

//Elevator Commands

// getElevatorStatus(elevators);
// callElevatorToFloor(2);
// updateElevatorStatus(1, 'moving_up', 4);
// updateElevatorStatus(2, 'moving_up', 6);
// updateElevatorStatus(3, 'idle', 10);
// getElevatorStatus(elevators);
// isElevatorAvailable(1);
// isElevatorAvailable(3);
// callMultipleElevatorToFloors([1, 2, 3, 4, 5, 6]);
// callMultipleElevatorToFloors([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
// callMultipleElevatorToFloors([3, 3, 3]);

//EXPRESS ----- HTTP ----- ENDPOINTS

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
app.put('/elevator/call', async (req, res) => {
    //Is the button on the floor displays that calls the closest available elevator to myFloor
    try {
        const myFloor = parseInt(req.body.floor);
        if (myFloor > 10 || myFloor <= 0) return res.status(400).send('ERROR! Your floor was not found!');

        let elevator = await findClosestElevator(myFloor);
        elevator.destinationFloor = myFloor;
        const travelStatus = validateElevatorStatus(elevator);
        const timeOutDuration = elevatorTravelTime(elevator, myFloor);

        if (elevator.currentFloor === myFloor) {
            console.log(`Elevator ${elevator.id} is already at floor ${elevator.destinationFloor}!`);
            res.send(`Elevator is already at floor ${elevator.destinationFloor}!`);
        } else {
            // console.log(`Calling elevator ${elevator.id}`)
            console.log(`Elevator ${elevator.id} is ${travelStatus} floor ${elevator.destinationFloor}!`)

            await travelElevator(timeOutDuration)
            updateElevator(elevator, myFloor)
            // console.log(`Elevator ${elevator.id} was updated`);

            res.send(`Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`);
            console.log(`Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`);
        }
    } catch (error) {
        console.error(error.message);
    }
})

app.put('/elevator/move/:id', async (req, res) => {
    //Is the floor buttons inside the elevator. When pressed it moves the elevator to the given floor. It displays a status message and a message when it have arrived.
    try {
        const elevator = validateElevator(req, elevators)
        if (!elevator) res.status(400).send('Given elevator was not found')

        const toFloor = parseInt(req.body.floor);
        if (toFloor > 10 || toFloor <= 0) return res.status(400).send('ERROR! Given floor not found.');

        elevator.destinationFloor = toFloor;
        const travelStatus = validateElevatorStatus(elevator);
        const timeOutDuration = elevatorTravelTime(elevator, toFloor);

        if (elevator.currentFloor === toFloor) {
            console.log(`Elevator ${elevator.id} is already at floor ${elevator.destinationFloor}!`);
            res.send(`Elevator is already at floor ${elevator.destinationFloor}!`);
        } else {
            // console.log(`Calling elevator ${elevator.id}`)
            console.log(`Elevator ${elevator.id} is ${travelStatus} floor ${elevator.destinationFloor}!`)
            await travelElevator(timeOutDuration);
            updateElevator(elevator, toFloor);
            // console.log(`Elevator ${elevator.id} was updated`);

            res.send(`Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`);
            console.log(`Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`);
        }
    } catch (error) {
        console.error(error.message);
    }
})

//VALIDATE ------ FUNCTIONS

function validateElevator(req, elevators) {
    //Is used to validate if a specific elevator exist
    const elevator = elevators.find(e => e.id === parseInt(req.params.id))
    return elevator;
}

function elevatorTravelTime(elevator, floor) {
    //Calculates the travel time between each floor and return a timeOutDuration to simulate a realistic elevaotr movement delay.
    const floorsToTravel = Math.abs(elevator.currentFloor - floor);
    const timeOutDuration = floorsToTravel * 3000;
    return timeOutDuration;
}

function validateElevatorStatus(elevator) {
    //Validates the status of the elevator and updates the status depending if the call is coming from a floor higher or lower.
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function travelElevator(timeOutDuration) {
    //Simulates a time delay for each floors the elevator need to travel
    console.log(`Waiting for ${timeOutDuration / 1000} seconds`);
    await delay(timeOutDuration);
}

function updateElevator(elevator, floor) {
    //After arriving to the called floor this function resets the elevator so it can recive next call.
    elevator.status = 'idle';
    elevator.currentFloor = floor;
    elevator.destinationFloor = '';
}

async function findClosestElevator(myFloor) {
    //Finds the closest available elevator to the given floor. This function start to check elevators with status 'idle'. It returs an array of elevators avilable. Then it itterates through all the elevators and return the closest elevator.
    try {
        // Extracts the elevator/s with status 'idle'.
        let availableElevators = await findIdleElevator();
        if (availableElevators.length === 0) {
            let idleElevator = await findIdleElevator();
            availableElevators = idleElevator;
            return availableElevators;
        }
        let closestElevator = null;
        let shortestDistance = 11; // Greater than the maximum floor (10)

        // Compares distance between the availableElevators and returns the closestElevator.
        for (let elevator of availableElevators) {
            // console.log(`Searching Elevator ${elevator.id}`);
            const distance = Math.abs(elevator.currentFloor - myFloor);

            if (distance < shortestDistance) {
                closestElevator = elevator;
                shortestDistance = distance;
            }
        }
        console.log(`Found Elevator ${closestElevator.id}`);
        return closestElevator;
    } catch (error) {
        console.error(error.message);
    }
}

async function findIdleElevator() {
    //Filters through all elevators with status 'idle', if status !== 'idle' it will search every 2 seconds for an avilable elevator. It will resolve when a elevator/elevators is found. Will return an array of objects.
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            // console.log('Searching for Elevators with status idle');
            let idleElevator = elevators.filter(elevator => elevator.status === 'idle');
            if (idleElevator.length > 0) {
                // idleElevator.forEach(elevator => {
                //     console.log(`Found Elevator ${elevator.id}`);
                // })
                clearInterval(interval);
                resolve(idleElevator);
            }
        }, 2000);
    })
}

//Elevator ----- Command ----- Functions

function getElevatorStatus(elevators) {
    //Logs the status of all 3 elevators
    console.log('Elevator status:');
    for (let elevator of elevators) {
        console.log(`Elevator ${elevator.id}, Current location: ${elevator.currentFloor}, Status: ${elevator.status}, Destination: ${elevator.destinationFloor}`);
    }
}

function callElevatorToFloor(floor) {
    //Calls closest elevator to given floor
    try {
        const request = axios.put('elevator/call', { floor });
        console.log(request.data);
    } catch (error) {
        console.error(error.message);
    }
}

function callMultipleElevatorToFloors(floors) {
    //Calls multiple floors at same time (floors must be an array of numbers)
    try {
        for (let floor of floors) {
            axios.put('/elevator/call', { floor });
        }
    }
    catch (error) {
        console.error(error.message);
    }
}


function updateElevatorStatus(elevatorId, status, destinationFloor) {
    //Updates elevator with given status and desitnationFloor
    const elevator = elevators.find(elevator => elevator.id === elevatorId);
    elevator.status = status;
    elevator.destinationFloor = destinationFloor;
}


function isElevatorAvailable(elevatorId) {
    //Checks if a elevator has status 'idle'
    const elevator = elevators.find(elevator => elevator.id === elevatorId);
    if (elevator.status === 'idle') {
        console.log(`Elevator ${elevator.id} is available!`);
    } else return console.log(`Elevator ${elevator.id} is not available!`);
}

console.log('After');

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));


