import express from 'express';
const router = express.Router();

import { elevators } from '../data.js';
import { findElevatorFromReq } from '../functions.js';


router.get('/', (req, res) => {
    res.send(elevators);
})

router.get('/elevator/:id', (req, res) => {
    const elevator = findElevatorFromReq(req, res, elevators);
    res.send(elevator);
})

export { router };