import mongoose from "mongoose";

const elevatorSchema = new mongoose.Schema({
    _id: String,
    currentFloor: Number,
    status: String,
    destinationFloor: { type: Number, default: 0 }
});

const Elevator = mongoose.model('Elevator', elevatorSchema);

export { Elevator };