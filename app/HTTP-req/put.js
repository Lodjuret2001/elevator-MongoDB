import express from 'express';
const router = express.Router();

import { elevators } from '../data.js';
import { findElevatorFromReq, validateFloorFromReq, findClosestElevatorTo, changeElevatorStatus, calculateTravelTime, displayTravelStatement, moveElevator, resetElevator, displayArrival } from '../functions.js';

router.put('/elevator/call', async (req, res) => {
    try {
        const myFloor = validateFloorFromReq(req, res);

        let elevator = await findClosestElevatorTo(myFloor);
        elevator.destinationFloor = myFloor;

        const travelStatement = changeElevatorStatus(elevator);
        const travelTime = calculateTravelTime(elevator, myFloor);
        displayTravelStatement(elevator, myFloor, res, travelStatement);
        await moveElevator(travelTime);

        resetElevator(elevator, myFloor);
        displayArrival(elevator, res);

    } catch (error) {
        console.error(error.message);
    }
})

router.put('/elevator/move/:id', async (req, res) => {
    try {
        const elevator = findElevatorFromReq(req, res, elevators);
        const toFloor = validateFloorFromReq(req, res);

        elevator.destinationFloor = toFloor;

        const travelStatement = changeElevatorStatus(elevator);
        const travelTime = calculateTravelTime(elevator, toFloor);
        displayTravelStatement(elevator, myFloor, res, travelStatement);
        await moveElevator(travelTime);

        resetElevator(elevator, toFloor);
        displayArrival(elevator);

    } catch (error) {
        console.error(error.message);
    }
})

export { router };