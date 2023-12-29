Elevator Control System

This project implements an elevator control system using Node.js and Express. It simulates the operation of elevators in a building with the ability to call elevators to different floors and move them to specific destinations.

Features
- Call elevators to specific floors.
- Move elevators to desired destinations.
- Find the closest available elevator.
- Check elevator status and availability.

Getting Started

Before you start, ensure you have the following prerequisites installed:

- Node.js
- Express.js
- Axios

Installation

1. Clone the repository:

   git clone <repository-url>

2. Install dependencies:

   npm install

The server will start on the specified port (default is 3000).

Usage

The system provides a set of API endpoints to interact with the elevators. You can use these endpoints to call elevators, move them to specific floors, and retrieve elevator information.

API Endpoints

- GET / - Get the status of all elevators.
- GET /elevator/:id - Get the status of a specific elevator by ID.
- PUT /elevator/call - Call the closest available elevator to a specific floor.
- PUT /elevator/move/:id - Move a specific elevator to a desired floor.

Validation Functions

- validateElevator(req, elevators) - Validate the existence of a specific elevator.
- elevatorTravelTime(elevator, floor) - Calculate travel time between floors.
- validateElevatorStatus(elevator) - Validate and update elevator status.
- delay(ms) - Simulate a time delay.
- travelElevator(timeOutDuration) - Simulate elevator movement delay.
- updateElevator(elevator, floor) - Update elevator status after arriving at a floor.
- findClosestElevator(myFloor) - Find the closest available elevator to a given floor.
- findIdleElevator() - Find idle elevators.

Elevator Command Functions

- getElevatorStatus(elevators) - Log the status of all elevators.
- callElevatorToFloor(floor) - Call the closest elevator to a given floor.
- callMultipleElevatorToFloors(floors) - Call multiple elevators to different floors simultaneously.
- updateElevatorStatus(elevatorId, status, destinationFloor) - Update elevator status and destination floor.
- isElevatorAvailable(elevatorId) - Check if a specific elevator is available.

License

This project is licensed under the MIT License.
