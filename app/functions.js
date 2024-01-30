import AsyncLock from 'async-lock';
const lock = new AsyncLock();

import axios from 'axios';

function createAxios() {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000'
    });
    return axiosInstance;
}

import { Elevator } from './MongoDB/modelDB.js';

async function findElevatorFromReq(req) {
    
    const id = parseInt(req.params.id);
    return await Elevator.findById(id);
}

async function findClosestElevatorTo(floor) {
    
    try {
        const release = await lock.acquire('elevatorLock', async () => {

            try {
                const availableElevators = await findIdleElevator();
                let closestElevator = calculateDistance(availableElevators, floor);

                closestElevator = await Elevator.findByIdAndUpdate(closestElevator.id, { destinationFloor: floor }, { new: true });

                return closestElevator;

            } catch (error) {
              console.error(error);
            }
        });

        return release;

    } catch (error) {
        console.error(`Error in findClosestElevatorTo: ${error.message}`);
    }
}

async function changeElevatorStatus(elevator) {

    const id = elevator.id;
    const direction = elevator.currentFloor < elevator.destinationFloor ? 'up' : 'down';

    const update = {
        status: `moving_${direction}`,
    };

    console.log(`Elevator ${id} is moving ${direction} to floor ${elevator.destinationFloor}!`);

    return await Elevator.findByIdAndUpdate(id, update, { new: true });
}


function calculateTravelTime(elevator, floor) {
    //Each floor takes 3 seconds to travel
    const floorsToTravel = Math.abs(elevator.currentFloor - floor);
    return floorsToTravel * 3000;
}

async function moveElevator(travelTime) {
    console.log(`Waiting for ${travelTime / 1000} seconds`);
    await delay(travelTime);
}

async function resetElevator(elevator) {

    const id = elevator.id;

    const reset = {
        status: 'idle',
        currentFloor: elevator.destinationFloor,
        destinationFloor: 0
    };

    return await Elevator.findByIdAndUpdate(id, reset, { new: true });
}

//Functions that should not be exported

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function findIdleElevator() {

    return new Promise((resolve, reject) => {

        const timeLoop = setInterval(async () => {
            try {
                console.log('Searching for elevators...');

                const idleElevator = await Elevator.find({ destinationFloor: 0 });

                if (idleElevator.length > 0) {
                    console.log('Found:', idleElevator);
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


export { createAxios, findElevatorFromReq, changeElevatorStatus, calculateTravelTime, moveElevator, resetElevator, findClosestElevatorTo };