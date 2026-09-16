# Task API - RESTful CRUD Application

## Project Overview

Task API is a RESTful backend application developed using **Node.js** and **Express.js**.
The application was upgraded from SQLite-based storage to a **containerized PostgreSQL database** using Docker and Docker Compose.
The project provides a complete CRUD (Create, Read, Update, Delete) system for managing tasks through REST API endpoints.
The API maintains the same functionality while changing the storage layer from SQLite to PostgreSQL.
---

# Project Description

This project demonstrates the development of a scalable backend API system with PostgreSQL database integration.

Users can perform the following operations:

- Create new tasks
- View all available tasks
- Retrieve a specific task by ID
- Update existing task information
- Delete tasks

The API implements:

- Request validation
- Proper HTTP status codes
- Error handling
- Parameterized PostgreSQL queries
- Persistent database storage using Docker volume

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime environment |
| Express.js | Framework for building RESTful APIs |
| JavaScript | Application logic |
| PostgreSQL | Database management system |
| pg | PostgreSQL driver for Node.js |
| Docker | Containerization platform |
| Docker Compose | Multi-container application management |
| Git | Version control system |
| GitHub | Source code hosting |

---

# Project Structure

```
Build_first_CRUD_API/

│
├── src/
│   ├── database/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── taskController.js
│   │
│   ├── models/
│   │   └── taskModel.js
│   │
│   ├── routes/
│   │   └── taskRoutes.js
│   │
│   └── app.js
│
├── Dockerfile
├── compose.yaml
├── .env.example
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

# Key Features

- RESTful API implementation
- PostgreSQL database integration
- Dockerized application
- Docker Compose based deployment
- CRUD operation support
- Input validation
- Error handling
- Parameterized SQL queries
- Automatic database table creation
- Automatic initial data seeding
- Persistent database storage using Docker volume

---

# Environment Configuration

Create a `.env` file:

```
DATABASE_URL=postgres://postgres:dev@db:5432/tasks
```
---

# Running the Application

## Start Complete Application Stack

Run:

```bash
docker compose up
```

This command starts:

- Node.js API container
- PostgreSQL database container
- Docker network
- Persistent PostgreSQL volume

API will run at:

```
http://localhost:3000
```

---

## Stop Application

```bash
docker compose down
```

Database data remains available because PostgreSQL uses Docker volume persistence.

---

# API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |

---

# CRUD Testing

## Get All Tasks

**GET** `/tasks`

Retrieves all tasks from PostgreSQL database.

Example:

```bash
curl -i http://localhost:3000/tasks
```

---

## Get Task By ID

**GET** `/tasks/:id`

Retrieves a specific task by ID.

Example:

```bash
curl -i http://localhost:3000/tasks/1
```

---

## Create Task

**POST** `/tasks`

Creates a new task in PostgreSQL.

Example:

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"New Task"}'
```

Success Response:

```
201 Created
```

---

## Update Task

**PUT** `/tasks/:id`

Updates an existing task.

Example:

```bash
curl -X PUT http://localhost:3000/tasks/1 \
-H "Content-Type: application/json" \
-d '{"title":"Updated Task","done":true}'
```

Success Response:

```
200 OK
```

---

## Delete Task

**DELETE** `/tasks/:id`

Deletes a task from PostgreSQL.

Example:

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

Success Response:

```
204 No Content
```

---

# Database

The application uses PostgreSQL for persistent task storage.

The database table is automatically created when the application starts.

Database table:

| Column | Type |
|--------|------|
| id | SERIAL PRIMARY KEY |
| title | TEXT |
| done | BOOLEAN |

---

# Database Check

Access PostgreSQL:

```bash
docker exec -it taskdb psql -U postgres -d tasks
```

Show tables:

```sql
\dt
```

View data:

```sql
SELECT * FROM tasks;
```

---

# Database Persistence

PostgreSQL data is stored using Docker volume.

Testing:

1. Create tasks
2. Stop containers:

```bash
docker compose down
```

3. Start again:

```bash
docker compose up
```

4. Previous task data remains available.

---

# Docker Commands

Build and start:

```bash
docker compose up
```

Run in background:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

Check containers:

```bash
docker ps
```

---

# Assignment Progress

Completed stages:

- Stage 0: PostgreSQL in Docker and gitignore
- Stage 1: Connect application using environment variables and create PostgreSQL table
- Stage 2: Read tasks from PostgreSQL
- Stage 3: Full CRUD operations on PostgreSQL
- Stage 4: Docker Compose complete stack
- Stage 5: Documentation and submission preparation

---

Developed by **Sakhawat Hossain**

This project demonstrates practical backend development skills through RESTful API development using Node.js and Express.js, PostgreSQL database integration, Docker containerization, and complete CRUD operation implementation.