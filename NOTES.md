**Refresh:** I save each round in MySQL and keep only the game ID in the browser. When the page refreshes, the app loads the saved game again. If the refresh happens before both players pick, that round starts again because their hidden choices are not saved.

**CORS issue:** At first, starting a game gave a 403 error because of a CORS problem. I fixed it using the Vite proxy and by allowing localhost requests in Spring Boot.

**Deployment:** I deployed the backend on AWS EC2 and connected it to MySQL on AWS RDS. I used an environment file for the database password and a systemd service to keep the backend running.

**Nginx issue:** Nginx failed because the default server was configured twice. I removed the extra configuration and tested it again.

**Frontend:** I built the React app and configured Nginx to serve it and send API requests to the Spring Boot backend.