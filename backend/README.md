# Study Planner — Backend

Same structure and auth pattern as your `day-17` backend (Express +
Mongoose, MVC folders, JWT auth via `authCheck` middleware), extended with
the entities the Study Planner project needs: subjects, tasks, schedules,
and a dashboard summary endpoint.

I built this, ran it locally, and verified: all files pass a syntax check,
the server boots cleanly with no import errors, and all four core code
paths (missing-field validation on register/login, the auth middleware
rejecting a request with no token, and the root route) return exactly the
expected responses. I could **not** test the actual database reads/writes
in this environment — MongoDB's own binary is blocked by network
restrictions here — so double-check the CRUD endpoints once you've got a
real MongoDB Atlas connection running, and tell me if anything misbehaves.

## One change from day-17, on purpose

`day-17`'s `auth.js` had the JWT secret hardcoded as `'PBEL'` directly in
the code. Here it's read from `process.env.JWT_SECRET` instead — hardcoding
a secret means anyone who sees the source code (e.g. once it's public on
GitHub) can forge valid tokens. Put a random string in your `.env` for
this instead.

## Setup

1. `npm install`
2. Create a `.env` file in this folder:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=any_long_random_string_you_make_up
   PORT=5000
   ```
   (Same Atlas setup process as `day-17` — see the guide from earlier.)
3. `npm run server`
4. You should see `connection created between server and DB` and `Server
   is running on port 5000`.

## API reference

All routes are prefixed `/api`. Routes marked 🔒 require an
`Authorization` header with the JWT returned from login.

| Method | Route | Purpose |
|---|---|---|
| POST | `/auth/register` | Create an account (`fullName`, `email`, `password`) |
| POST | `/auth/login` | Log in, returns a JWT token |
| GET | `/auth/profile` 🔒 | Get the logged-in user's profile |
| POST | `/subjects` 🔒 | Create a subject (`name`, `description`) |
| GET | `/subjects` 🔒 | List your subjects |
| PUT | `/subjects/:id` 🔒 | Update a subject |
| DELETE | `/subjects/:id` 🔒 | Delete a subject |
| POST | `/tasks` 🔒 | Create a task (`title`, `subjectId`, `deadline`, `priority`) |
| GET | `/tasks` 🔒 | List tasks — optional `?subjectId=` and `?completed=true/false` filters |
| PUT | `/tasks/:id` 🔒 | Update a task (e.g. mark completed) |
| DELETE | `/tasks/:id` 🔒 | Delete a task |
| POST | `/schedules` 🔒 | Create a study session (`subjectId`, `date`, `startTime`, `endTime`) |
| GET | `/schedules` 🔒 | List your scheduled sessions |
| PUT | `/schedules/:id` 🔒 | Update a session |
| DELETE | `/schedules/:id` 🔒 | Delete a session |
| GET | `/dashboard` 🔒 | Summary: subject count, task counts, completion rate, next 5 deadlines |

## What's next

This is the backend only. Next steps, in order:
1. Test each endpoint with Postman/Thunder Client once MongoDB is connected.
2. Build the React frontend pages (Landing, Register, Login, Dashboard,
   Subjects, Tasks, Schedule, Progress, Profile) — can reuse your
   `day-25` frontend's routing/Chakra UI setup as a starting point.
3. Optional AI feature (per the assignment spec): a route that takes your
   subjects + task deadlines + available hours and generates a suggested
   study schedule — good candidate for a Gemini API call, similar to what
   `day-31`'s GenAI backend already does.
