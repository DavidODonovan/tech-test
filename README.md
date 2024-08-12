## Droneshield Tech Test

To set up and run this project:

### 1 navigate to root of project.

Change permissions of bash script file;
```chmod +x start-app.sh```
### 2

The frontend of this project uses environment variables, so you need to add an `.env.local` file to the root of the `frontend` directory and add the following two keys/value pairs below, or just rename the `.env.example` file included in this repo. 

- `NEXT_PUBLIC_API_URL=http://localhost:3001` - The based URL of the REST API endpoints.
- `NEXT_PUBLIC_WS_URL=ws://localhost:3001` -  The URL for WebSocket connections.
### 3
Then run the start script;
```./start-app.sh```

This will run backend in docker containers for node.js server and postgres db, and also run the frontend in dev mode.

The start script populates the database with a default number of just 10 items. If you wish to customise just add -n flag to start command like so ```./start-app.sh -n 100```

## Observations
### Thoughts and approach
This was a great opportunity to learn the basics of Nest.js and TypeORM. 
The abstractions provided by the libraries are a bit weird at first, but powerful, and there has clearly been some
deep though put into building out Nest.js. I am particularly drawn the the opinionated nature of the library as this forces standardisation across teams and organisations for implementing common API scenarios, but the option to customise is still there. Implementing websockets was too easy! I'll be having another look at the websockets implementation to see if there is a better way to do it.

On the frontend it was a great opportunity to implement client side application level state management using two different libraries, Zustand and React-Query. This preliminary exploration, in my opinion, shows promise. It is good to have a clear separation of concerns between client-state and server-state on the frontend. I'd like to learn more about react-query's caching behaviour, and I love the simplicity of using Zustand to update sensor-status state on websocket notifications. 

### What might be done to improve this work if more time was available 
* Add auth guards to backend for api routes and websocket connection
* Use query parameters in the URL on the frontend to allow people to share tables in various states.
* I would have liked to have mocked sensor connections to the backend somehow using gRPC, or perhaps connected to a mock api somewhere on the web.
* Add some fancier styling and a modal for inspecting individual sensor information.

### Possibly use TimescaleDB in future with sensor data? 
Fireship released video on TimescaleDB on the weekend, might be useful for timestamped sensor data?... https://www.youtube.com/watch?v=69Tzh_0lHJ8





