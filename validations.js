//functions

function validateElevator(req, elevators) {
    const elevator = elevators.find(e => e.id === parseInt(req.params.id))
    return elevator;
}

function elevatorTravelTime(elevator, floor) {

    const floorsToTravel = Math.abs(elevator.currentFloor - floor);
    const timeOutDuration = floorsToTravel * 1000;
    return timeOutDuration;
}

function validateElevatorStatus(elevator) {

    if (elevator.currentFloor > elevator.destinationFloor) {
        elevator.status = 'moving_down';
        return 'Moving down to';
    } else if (elevator.currentFloor < elevator.destinationFloor) {
        elevator.status = 'moving_up';
        return 'Moving up to';
    } else {
        elevator.status = 'idle';
        return 'Elevator already at';
    }
}

function findClosestElevator(myFloor) {
    let closestElevator = null;
    let shortestDistance = 11; // Greater than the maximum floor (10)

    //Compares distance between the 2 elevators.
    for (let elevator of elevators) {
        const distance = Math.abs(elevator.currentFloor - myFloor)

        if (distance < shortestDistance) {
            closestElevator = elevator; //Replaces null with Elevator Object
            shortestDistance = distance; ///Update shortestDistance
        }
    }
    return closestElevator;
}

module.exports = {
    validateElevator,
    elevatorTravelTime,
    validateElevatorStatus,
    findClosestElevator,
};