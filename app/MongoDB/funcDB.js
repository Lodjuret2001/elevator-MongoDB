import { Elevator } from "./modelDB.js";

async function getElevators() {
    return await Elevator.find();
}

export { getElevators };