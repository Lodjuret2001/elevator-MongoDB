import axios from 'axios';
import { elevators } from './data.js';

function createAxios() {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000'
    });
    return axiosInstance;
}

function findElevator(elevatorId, elevators) {
    const elevator = elevators.find(elevator => elevator.id === elevatorId);

    if (!elevator || undefined) {
        return console.log(`Elevator with ID: ${elevatorId} does not exist.`);
    }
    return elevator;
}

function findElevatorFromReq(req, res, elevators) {
    const elevator = elevators.find(elevator => elevator.id === parseInt(req.params.id));

    if (!elevator) res.status(400).send(`Elevator with ID: ${req.params.id} does not exist.`)
    return elevator;
}

function validateFloorFromReq(req, res) {
    const floor = parseInt(req.body.floor);

    if (isNaN(floor) || floor > 10 || floor <= 0) return res.status(400).send(`ERROR! Given floor was not found!`);

    return floor;
}

function changeElevatorStatus(elevator) {
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

function calculateTravelTime(elevator, floor) {
    //Each floor takes 3 seconds to travel
    const floorsToTravel = Math.abs(elevator.currentFloor - floor);
    return floorsToTravel * 3000;
}

function displayTravelStatement(elevator, floor, res, travelStatement) {
    let message = (elevator.currentFloor === floor)
        ? `${travelStatement} floor ${elevator.destinationFloor}!`
        : `Elevator ${elevator.id} is ${travelStatement} floor ${elevator.destinationFloor}!`;

    if (elevator.currentFloor === floor) {

        console.log(message);
        res.send(message);

    } else console.log(message);
}

async function moveElevator(travelTime) {
    console.log(`Waiting for ${travelTime / 1000} seconds`);
    await delay(travelTime);
}

function resetElevator(elevator, floor) {
    elevator.status = 'idle';
    elevator.currentFloor = floor;
    elevator.destinationFloor = '';
}

async function findClosestElevatorTo(floor) {
    try {

        let availableElevators = await findIdleElevator();

        let closestElevator = calculateDistance(availableElevators, floor);
        console.log(`Found Elevator ${closestElevator.id}`);

        return closestElevator;

    } catch (error) {
        console.error(error.message);
    }
}

function displayArrival(elevator, res) {
    res.send(`Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`);
    console.log(`Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`);
}

//Functions that should not be exported

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function findIdleElevator() {

    return new Promise((resolve, reject) => {

        const timeLoop = setInterval(() => {
            try {
                let idleElevator = elevators.filter(elevator => elevator.status === 'idle');

                if (idleElevator.length > 0) {
                    clearInterval(timeLoop);
                    resolve(idleElevator);
                }
            } catch (error) {
                console.log(error.message);
            }
        }, 2000);
    })
}

function calculateDistance(elevators, floor) {

    let closestElevator = null;
    let shortestDistance = 11; // Greater than the maximum floor (10)

    for (let elevator of elevators) {
        const distance = Math.abs(elevator.currentFloor - floor);

        if (distance < shortestDistance) {
            closestElevator = elevator;
            shortestDistance = distance;
        }
    }
    return closestElevator;
}


export { createAxios, findElevator, findElevatorFromReq, validateFloorFromReq, changeElevatorStatus, calculateTravelTime, displayTravelStatement, moveElevator, resetElevator, findClosestElevatorTo, displayArrival };