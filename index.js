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


//EXPRESS ----- HTTP ----- REQUESTS

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

        const elevator = await findClosestElevator(myFloor);
        elevator.destinationFloor = myFloor;
        const travelStatus = validateElevatorStatus(elevator);
        const timeOutDuration = elevatorTravelTime(elevator, myFloor);

        if (elevator.currentFloor === myFloor) {
            console.log(`Elevator is already at floor ${elevator.destinationFloor}!`)
            res.send(`Elevator is already at floor ${elevator.destinationFloor}!`);
        } else {
            console.log(`Calling elevator ${elevator.id}`)
            console.log(`${travelStatus} floor ${elevator.destinationFloor}!`)

            await updateElevator(elevator, timeOutDuration, myFloor)

            console.log(`Elevator have arrived at floor ${elevator.currentFloor}!`)
            res.send(`Elevator have arrived at floor ${elevator.currentFloor}!`);
        }
    } catch (error) {
        console.error(error.message);

    }
})

app.put('/elevator/move/:id', async (req, res) => {
    //Is the floor option buttons on the elevator display. When pressed it moves the elevator to the given floor. It displays a status message to all floor displays and displays a message to the elevator display when it have arrived.
    try {
        const elevator = validateElevator(req, elevators)
        if (!elevator) res.status(400).send('Given elevator was not found')

        const toFloor = parseInt(req.body.floor);
        if (toFloor > 10 || toFloor <= 0) return res.status(400).send('ERROR! Given floor not found.');

        elevator.destinationFloor = toFloor;
        const travelStatus = validateElevatorStatus(elevator);
        const timeOutDuration = elevatorTravelTime(elevator, toFloor);

        console.log(`${travelStatus} floor ${elevator.destinationFloor}!`);

        await updateElevator(elevator, timeOutDuration, toFloor);

        console.log(`Elevator have arrived at floor ${elevator.currentFloor}!`)
        res.send(`Elevator have arrived at floor ${elevator.currentFloor}!`);

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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateElevator(elevator, timeOutDuration, floor) {
    await delay(timeOutDuration)
    elevator.currentFloor = floor;
    elevator.status = 'idle';
    elevator.destinationFloor = '';
}

async function findClosestElevator(myFloor) {
    try {
        let closestElevator = null;
        let shortestDistance = 11; // Greater than the maximum floor (10)

        //Compares distance between the 2 elevators and validates if status is idle.
        for (let elevator of elevators) {
            const distance = Math.abs(elevator.currentFloor - myFloor)

            if (distance < shortestDistance) {
                closestElevator = elevator; //Replaces null with Elevator Object
                shortestDistance = distance; ///Update shortestDistance
            }
            if (closestElevator.status !== 'idle') {
                const availableElevator = await isElevatorAvailable(elevators);
                availableElevator = closestElevator;
                return closestElevator;
            }
        }
        return closestElevator;
    } catch (error) {
        console.error('error.message');
    }
}

async function isElevatorAvailable(elevators) {
    try {
        while (true) {
            const availableElevator = elevators.find(elevator => elevator.status === 'idle');
            if (availableElevator) return availableElevator;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    } catch (error) {
        console.error(error.message);
    }
}

console.log('After');

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));


