# Stone Paper Scissors

A two-player Stone Paper Scissors game played over 6 rounds.
Game data is stored in MySQL, and a History page shows all past games.

## Stack
- Frontend: React (useReducer for game state), Vite
- Backend: Spring Boot, Spring Data JPA
- Database: MySQL (AWS RDS)
- Hosting: AWS EC2 with Nginx

## Structure
- `backend/` Spring Boot API
- `frontend/` React app

## Run locally
Backend: `cd backend && ./mvnw spring-boot:run`
Frontend: `cd frontend && npm install && npm run dev`