import express from 'express';
const app = express();
app.use(express.json());

import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/elevator-app')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to database', err));


//HTTP-REQ

import { router as getRoutes } from './HTTP-req/get.js';
import { router as putRoutes } from './HTTP-req/put.js';

app.use(getRoutes);
app.use(putRoutes);

//Elevator Commands

import { getElevatorStatus, callElevatorToFloor, callMultipleElevatorToFloors, updateElevatorStatus, isElevatorAvailable } from './commands.js';

async function run() {
    
    // await getElevatorStatus();
    // await callElevatorToFloor(2);
    // await updateElevatorStatus(1, 'idle', 0);
    // await updateElevatorStatus(2, 'idle', 0);
    // await updateElevatorStatus(3, 'idle', 0);
    // await getElevatorStatus();
    // await isElevatorAvailable(1);
    // await isElevatorAvailable(3);
    // await callMultipleElevatorToFloors([1, 2, 3, 4, 5, 6]);
    // await callMultipleElevatorToFloors([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    // await callMultipleElevatorToFloors([8, 8, 8]);

}

run();

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));