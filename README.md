# Elevator Control System

This project implements a simple elevator control system using Node.js and Express.

## Setup

1. Clone the GitHub repository to your local machine:

   ```bash
   git clone https://github.com/lodjuret2001/elevator-control-system.git
   ```

2. Navigate to your project folder:
   ```bash
   cd path/to/your/project
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the application:
   ```bash
   npm start | node index.js | nodemon index.js
   ```
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

## MongoDB Setup

Ensure that you have MongoDB installed and running.

```javascript
import mongoose from 'mongoose';

mongoose.connect('your-connection-string-here')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to database', err));
```

## MongoDB Schema

```javascript
import mongoose from "mongoose";

const elevatorSchema = new mongoose.Schema({
    _id: String,
    currentFloor: Number,
    status: String,
    destinationFloor: { type: Number, default: 0 }
});

const Elevator = mongoose.model('Elevator', elevatorSchema);

export { Elevator };
```

## Importing Elevator Data

To import the elevator data to your local MongoDB server, follow these steps:

1. Clone the GitHub repository to your local machine:

   ```bash
   git clone https://github.com/lodjuret2001/elevator-control-system.git
   ```

2. Open a terminal or command prompt.

3. Use the following command to import the elevator data to your local MongoDB server:

   ```bash
   mongoimport --db elevator-app --collection elevators --file your-path-to-the-json-file\data.json --jsonArray
   ```

   Replace `your-path-to-the-json-file` with the actual path to the `data.json` file.

   - `--db elevator-app`: Specifies the name of the database (`elevator-app`). Change it if your database has a different name.
   - `--collection elevators`: Specifies the name of the collection (`elevators`). Change it if your collection has a different name.
   - `--file your-path-to-the-json-file\data.json`: Specifies the path to your elevator data JSON file.
   - `--jsonArray`: Indicates that the provided file contains an array of JSON documents.

4. After executing the command, you should see output indicating the progress of the import.

## Notes

- Adjust the base URL in the `createAxios` function.
- Ensure proper setup and dependencies are installed.
- Use provided API endpoints to interact with the elevator control system.
```



