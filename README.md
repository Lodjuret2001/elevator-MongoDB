I apologize for the confusion. I've updated the README to correctly reflect the provided endpoints:

```markdown
# Elevator Control System

This project implements a simple elevator control system using Node.js and Express.

## Setup

1. Navigate to your project folder:
   ```bash
   cd path/to/your/project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start | node index.js | nodemon index.js
   ```

The application will be running on `http://localhost:3000`.

## API Endpoints

### GET Requests

#### 1. Get All Elevators
```http
GET /
```
Returns a list of all elevators.

#### 2. Get Elevator by ID
```http
GET /elevator/:id
```
Returns information about a specific elevator based on the provided ID.

### PUT Requests

#### 3. Call Elevator to Floor
```http
PUT /elevator/call
```

Body:
```json
{
  "floor": 2
}
```

#### 4. Move Elevator to Floor
```http
PUT /elevator/move/:id
```

Body:
```json
{
  "floor": 5
}
```

### Commands

Some commands have been provided in the index.js. Uncomment and use them as needed.

### Elevator Control Functions

Various utility functions have been implemented to control elevators.

#### Functions (to be used internally)

- `createAxios`: Create an Axios instance.
- `findElevator`: Find elevator by ID.
- `findElevatorFromReq`: Find elevator from request parameters.
- `validateFloorFromReq`: Validate floor from request body.
- `changeElevatorStatus`: Change elevator status based on destination floor.
- `calculateTravelTime`: Calculate travel time between floors.
- `displayTravelStatement`: Display travel statement based on elevator and floor.
- `moveElevator`: Move elevator asynchronously with a specified travel time.
- `resetElevator`: Reset elevator status and floor.
- `findClosestElevatorTo`: Find the closest available elevator to a floor.
- `displayArrival`: Display elevator arrival message.

#### Functions (not exported)

- `delay`: Introduce a delay using a Promise.
- `findIdleElevator`: Find an idle elevator asynchronously.

## Notes

- Adjust the base URL in the `createAxios` function.
- Ensure proper setup and dependencies are installed.
- Use provided API endpoints to interact with the elevator control system.
```