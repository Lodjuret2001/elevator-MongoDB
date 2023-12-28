//import npm
const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');
axios.defaults.baseURL = 'http://localhost:3000';

//Outside each elevator on each floor there is a dislay
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
    //Is the button on the floor displays that calls the closest elevator to myFloor
    try {
        const myFloor = parseInt(req.body.floor);
        if (myFloor > 10 || myFloor <= 0) return res.status(400).send('ERROR! Your floor was not found!');

        let elevator = await findClosestElevator(myFloor);
        elevator.destinationFloor = myFloor;
        const travelStatus = validateElevatorStatus(elevator);
        const timeOutDuration = elevatorTravelTime(elevator, myFloor);

        if (elevator.currentFloor === myFloor) {
            res.send(`Elevator is already at floor ${elevator.destinationFloor}!`);
        } else {
            console.log(`Calling elevator ${elevator.id}`)
            console.log(`${travelStatus} floor ${elevator.destinationFloor}!`)


            updateElevator(elevator, myFloor)
            await travelElevator(timeOutDuration)

            console.log(`Elvevator ${elevator.id} was updated`);
            res.send(`Elevator have arrived at floor ${elevator.currentFloor}!`);
            console.log(`Elevator have arrived at floor ${elevator.currentFloor}!`);
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
            res.send(`Elevator is already at floor ${elevator.destinationFloor}!`);
        } else {
            console.log(`${travelStatus} floor ${elevator.destinationFloor}!`);

            await updateElevator(elevator, timeOutDuration, toFloor);

            res.send(`Elevator have arrived at floor ${elevator.currentFloor}!`);
        }

    } catch (error) {
        console.error(error.message);
    }

})

//VALIDATE ------ FUNCTIONS

function validateElevator(req, elevators) {
    const elevator = elevators.find(e => e.id === parseInt(req.params.id))
    return elevator;
}

function elevatorTravelTime(elevator, floor) {
    const floorsToTravel = Math.abs(elevator.currentFloor - floor);
    const timeOutDuration = floorsToTravel * 3000;
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function travelElevator(timeOutDuration) {
    console.log(`Waiting for ${timeOutDuration} seconds`);
    await delay(timeOutDuration);
    elevator.status = 'idle';
}

function updateElevator(elevator, floor) {
    elevator.currentFloor = floor;
    elevator.destinationFloor = '';
}

async function findClosestElevator(myFloor) {
    try {
        // Extracts the elevators with status 'idle'.
        let availableElevators = await findIdleElevator();
        if (availableElevators.length === 0) {
            console.log('No available elevators');
            let idleElevator = await findIdleElevator();
            availableElevators = idleElevator;
            return availableElevators;
        }
        let closestElevator = null;
        let shortestDistance = 11; // Greater than the maximum floor (10)

        // Compares distance between the 2 elevators and validates if status is idle.
        for (let elevator of availableElevators) {
            console.log(`Searching Elevator ${elevator.id}`);
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
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            console.log('Searching for Elevators with status idle');
            const idleElevator = elevators.filter(elevator => elevator.status === 'idle');
            if (idleElevator.length > 0) {
                clearInterval(interval);
                resolve(idleElevator);
            }
        }, 1000);
    })
}

//Elevator ----- Command ----- Functions

function getElevatorStatus(elevators) {
    console.log('Elevator status:');
    for (let elevator of elevators) {
        console.log(`Elevator ${elevator.id}, Current location: ${elevator.currentFloor}, Status: ${elevator.status}, Destination: ${elevator.destinationFloor}`);
    }
}

async function callElevatorToFloor(floor) {
    try {
        const request = await axios.put('elevator/call', { floor });
        console.log(request.data);
    } catch (error) {
        console.error(error.message);
    }
}

function callMultipleElevatorToFloors(floors) {
    try {
        for (let floor of floors) {
            axios.put('/elevator/call', { floor });
        }
    }
    catch (error) {
        console.error(error.message);
    }
}

callMultipleElevatorToFloors([2, 4, 6, 8]);

function updateElevatorStatus(elevatorId, status, destinationFloor) {
    const elevator = elevators.find(elevator => elevator.id === elevatorId);
    elevator.status = status;
    elevator.destinationFloor = destinationFloor;
}

function isElevatorAvailable(elevatorId) {
    const elevator = elevators.find(elevator => elevator.id === elevatorId);
    if (elevator.status === 'idle') {
        console.log(`Elevator ${elevator.id} is available!`);
    } else return console.log(`Elevator ${elevator.id} is not available!`);
}

console.log('After');

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));


