Refresh decision: the game lives in MySQL (RDS), not in the browser. Every round is saved as soon as both players pick, and the browser keeps only the `gameId` in localStorage.
On page load, the app calls `GET /api/games/{id}` and rebuilds the `useReducer` state from the saved rounds (the `LOADED` action).
Why: the database is the one source of truth, and the score can't be edited from the browser. The cost is one extra API call, and a refresh between Player 1's and Player 2's pick restarts that round, because the hidden pick is never stored.

What broke:
1. Starting a game gave a 403 locally. Spring was rejecting the `Origin` header on POST requests as "Invalid CORS request". I fixed it by dropping the header in the Vite proxy and allowing any localhost port in `@CrossOrigin`.