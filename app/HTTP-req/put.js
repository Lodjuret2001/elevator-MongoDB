import express from 'express';
const router = express.Router();

import { findElevatorFromReq, findClosestElevatorTo, changeElevatorStatus, calculateTravelTime, moveElevator, resetElevator } from '../functions.js';

import { Elevator } from '../MongoDB/modelDB.js';

router.put('/elevator/call', async (req, res) => {
    try {

        const myFloor = parseInt(req.body.floor);
        if (isNaN(myFloor) || myFloor > 10 || myFloor <= 0) {
            return res.status(400).send(`ERROR! Given floor was not found!`);
        }

        let elevator = await findClosestElevatorTo(myFloor);

        if (elevator.currentFloor === myFloor) {

            elevator = await resetElevator(elevator);
            return res.send(`Elevator ${elevator.id} is already at floor ${myFloor}...`);
        }

        elevator = await changeElevatorStatus(elevator);
        const travelTime = calculateTravelTime(elevator, myFloor);
        await moveElevator(travelTime);

        elevator = await resetElevator(elevator);

        console.log(`Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`);
        res.send(`Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`);

    } catch (error) {
        console.error(error.message);
    }
})

router.put('/elevator/move/:id', async (req, res) => {
    try {

        let elevator = await findElevatorFromReq(req);
        if (!elevator) res.status(400).send(`Elevator with ID: ${req.params.id} does not exist.`)

        const toFloor = parseInt(req.body.floor);
        if (isNaN(toFloor) || toFloor > 10 || toFloor <= 0) {
            return res.status(400).send(`ERROR! Given floor was not found!`);
        }

        if (elevator.currentFloor === toFloor) {

            elevator = await resetElevator(elevator);
            return res.send(`Elevator ${elevator.id} is already at floor ${toFloor}...`);
        }

        elevator = await Elevator.findByIdAndUpdate(elevator.id, { destinationFloor: toFloor }, { new: true });

        elevator = await changeElevatorStatus(elevator);
        const travelTime = calculateTravelTime(elevator, toFloor);
        await moveElevator(travelTime);

        elevator = await resetElevator(elevator);

        console.log(`Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`);
        res.send(`Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`);

    } catch (error) {
        console.error(error.message);
    }
})

export { router };