import express from 'express';
const app = express();
app.use(express.json());

//HTTP-REQ

import { router as getRoutes } from 'app\HTTP-req\get.js';
import { router as putRoutes } from 'app\HTTP-req\put.js';

app.use(getRoutes);
app.use(putRoutes);

//Elevator Commands

import { getElevatorStatus, callElevatorToFloor, callMultipleElevatorToFloors, updateElevatorStatus, isElevatorAvailable } from './commands.js';

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


const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`));


