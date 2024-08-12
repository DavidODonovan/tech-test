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

The start script populates the database with a default number of just 10 items. If you wish to customise just add -n flag to start command like so ```./start-app.sh -n 20```

## Observations
### Possibly use TimescaleDB in future? 

Fireship released video on TimescaleDB on weekend, might be useful for timestamped sensor data?... https://www.youtube.com/watch?v=69Tzh_0lHJ8





