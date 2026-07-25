# Group Project Fairness Auditor — Backend

A lightweight REST API that tracks contributions across group project members and calculates fairness metrics.

Built with **Node.js**, **Express**, and **Supabase**.

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your Supabase project URL and anon key. All required variables are documented in `.env.example`.

### 3. Set up the database

Run the SQL in `schema.sql` (or the snippet in the docs) inside the **Supabase SQL Editor** to create the `projects`, `members`, and `contributions` tables.

### 4. Start the server

```bash
# Development — auto-restarts on file changes
npm run dev

# Production
npm start
```

The server runs on `http://localhost:5000` by default.

---

## Environment variables

| Variable                 | Required | Description                              |
|--------------------------|----------|------------------------------------------|
| `PORT`                   | No       | HTTP port (default `5000`)               |
| `NODE_ENV`               | No       | `development` or `production`            |
| `CORS_ORIGIN`            | No       | Allowed origin(s), e.g. `http://localhost:3000`. Use `*` to allow all. |
| `SUPABASE_URL`           | Yes      | Your Supabase project URL                |
| `SUPABASE_ANON_KEY`      | Yes      | Supabase anon/public key                 |
| `SUPABASE_SERVICE_ROLE_KEY` | No    | Only needed for admin operations         |

---

## API reference

All responses follow a consistent envelope:

```json
{ "success": true,  "data": { ... } }
{ "success": false, "message": "Human-readable error" }
```

### Health

| Method | Endpoint       | Description        |
|--------|----------------|--------------------|
| GET    | `/api/health`  | Liveness check     |

### Projects

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| POST   | `/api/projects`       | Create a project      |
| GET    | `/api/projects`       | List all projects     |
| GET    | `/api/projects/:id`   | Get one project       |

**POST `/api/projects` body**
```json
{
  "name":           "Final Year App",
  "subject":        "CS401",
  "professor_name": "Dr. Smith",
  "deadline":       "2026-08-01"
}
```

### Members

| Method | Endpoint                                | Description                |
|--------|-----------------------------------------|----------------------------|
| POST   | `/api/projects/:projectId/members`      | Add a member to a project  |
| GET    | `/api/projects/:projectId/members`      | List members of a project  |

**POST body**
```json
{ "name": "Alice" }
```

### Contributions

| Method | Endpoint                                       | Description                      |
|--------|------------------------------------------------|----------------------------------|
| POST   | `/api/projects/:projectId/contributions`       | Log a contribution               |
| GET    | `/api/projects/:projectId/contributions`       | List contributions for a project |

**POST body**
```json
{
  "member_id":     "uuid-of-member",
  "task_title":    "Set up CI pipeline",
  "description":   "Configured GitHub Actions for lint + test",
  "task_category": "DevOps",
  "hours_spent":   3.5
}
```

`description` and `task_category` are optional.

### Report

| Method | Endpoint                                | Description                              |
|--------|-----------------------------------------|------------------------------------------|
| GET    | `/api/projects/:projectId/report`       | Fairness report for a project            |

**Response**
```json
{
  "success": true,
  "data": {
    "project": { "id": "...", "name": "Final Year App", "..." : "..." },
    "members": [
      { "name": "Alice", "hours": 12,  "tasks": 4, "percentage": 48   },
      { "name": "Bob",   "hours": 8.5, "tasks": 3, "percentage": 34   },
      { "name": "Carol", "hours": 4.5, "tasks": 2, "percentage": 18   }
    ],
    "totalHours": 25
  }
}
```

`percentage` is each member's share of total logged hours, rounded to 2 decimal places.

---

## Folder structure

```
backend/
├── app.js              # Express app — middleware, routes, error handler
├── server.js           # HTTP server entry point
├── .env.example        # Environment variable template
└── src/
    ├── config/
    │   └── supabase.js         # Supabase client (singleton)
    ├── controllers/
    │   ├── health.controller.js
    │   ├── project.controller.js
    │   ├── member.controller.js
    │   ├── contribution.controller.js
    │   └── report.controller.js
    ├── middleware/
    │   ├── auth.js             # Auth placeholder (wire in later)
    │   └── errorHandler.js     # Global Express error handler
    ├── routes/
    │   ├── health.routes.js
    │   ├── project.routes.js   # Mounts member, contribution, report routers
    │   ├── member.routes.js
    │   ├── contribution.routes.js
    │   └── report.routes.js
    ├── services/
    │   ├── project.service.js
    │   ├── member.service.js
    │   ├── contribution.service.js
    │   └── report.service.js
    └── utils/
        ├── response.js         # successResponse / errorResponse helpers
        └── validate.js         # isValidUUID, assertProjectExists, assertMemberExists
```
