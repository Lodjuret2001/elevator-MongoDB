import express from 'express';
const router = express.Router();

import { getElevators } from '../MongoDB/funcDB.js';
import { Elevator } from '../MongoDB/modelDB.js';

router.get('/', async (req, res) => {
    const elevators = await getElevators();
    res.send(elevators);
})

router.get('/elevator/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    const elevator = await Elevator.findById(id);
    res.send(elevator);
})

export { router };