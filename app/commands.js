import { elevators } from "./data.js";
import { createAxios, findElevator } from './functions.js';

const axios = createAxios();

function getElevatorStatus(elevators) {
    console.log('Elevators status:');
    for (let elevator of elevators) {
        console.log(`Elevator ${elevator.id}, Current location: ${elevator.currentFloor}, Status: ${elevator.status}, Destination: ${elevator.destinationFloor}`);
    }
}

function callElevatorToFloor(floor) {
    try {
        const request = axios.put('elevator/call', { floor });
        console.log(request.data);
    } catch (error) {
        console.error(error.message);
    }
}

function callMultipleElevatorToFloors(floors) {
    //floors must be an array of numbers
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
    const elevator = findElevator(elevatorId, elevators);
    elevator.status = status;
    elevator.destinationFloor = destinationFloor;
    console.log(`Elevator ${elevator.id} was updated to Status: ${elevator.status}.`);
}

function isElevatorAvailable(elevatorId) {
    const elevator = findElevator(elevatorId, elevators);
    if (elevator.status === 'idle') {
        return console.log(`Elevator ${elevator.id} is available!`);
    }
    return console.log(`Elevator ${elevator.id} is not available!`);
}

export { getElevatorStatus, callElevatorToFloor, callMultipleElevatorToFloors, updateElevatorStatus, isElevatorAvailable };