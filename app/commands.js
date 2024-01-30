import { createAxios } from './functions.js';
import { getElevators } from './MongoDB/funcDB.js';
import { Elevator } from './MongoDB/modelDB.js';

const axios = createAxios();

async function getElevatorStatus() {

    const elevators = await getElevators();
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


async function updateElevatorStatus(elevatorId, status, destinationFloor) {

    const update = {
        status: status,
        destinationFloor: destinationFloor
    };
    const updatedElevator = await Elevator.findByIdAndUpdate(elevatorId, update, { new: true })
    
    console.log(`Elevator ${updatedElevator.id} was updated to status: ${updatedElevator.status}.`);
}

async function isElevatorAvailable(elevatorId) {

    const elevator = await Elevator.findById(elevatorId);

    if (elevator.status === 'idle') {
        return console.log(`Elevator ${elevator.id} is available!`);
    }
    return console.log(`Elevator ${elevator.id} is not available!`);
}

export { getElevatorStatus, callElevatorToFloor, callMultipleElevatorToFloors, updateElevatorStatus, isElevatorAvailable };