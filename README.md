# Task API - RESTful CRUD Application

## Project Overview

Task API is a RESTful backend application developed using **Node.js** and **Express.js**.  
The project provides a complete CRUD (Create, Read, Update, Delete) system for managing tasks through structured API endpoints.

The application follows a modular backend architecture by separating business logic, routing, and data management into different layers. Swagger UI is integrated to provide interactive API documentation and testing support.

---

# Project Description

This project demonstrates the development of a simple and scalable backend API system.

Users can perform the following operations:

- Create new tasks
- View all available tasks
- Retrieve a specific task by ID
- Update existing task information
- Delete tasks

The API implements proper request handling, validation, error responses, and standard HTTP status codes following REST API development practices.

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime environment for backend development |
| Express.js | Web framework for building RESTful APIs |
| JavaScript | Programming language used for application logic |
| Swagger UI | API documentation and interactive testing |
| Git | Version control system |
| GitHub | Source code hosting and collaboration |

---

# Project Structure
he project follows a layered architecture:

```
Build_CRUD_api/

│
├── src/
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
│   ├── swagger.json
│   │
│   └── app.js
│
├── screenshots/
│
├── server.js
├── package.json
├── package-lock.json
└── README.md


---

# Key Features

- RESTful API implementation
- Modular folder architecture
- CRUD operation support
- Input validation
- Proper HTTP status code handling
- Error handling for invalid requests
- Swagger-based API documentation
- Easy API testing through Swagger UI

---

# API Documentation

Swagger UI provides an interactive interface for exploring and testing the API.

Documentation URL:  http://localhost:3000/docs


Available endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |

---

# Data Storage

Currently, the application uses an in-memory JavaScript array for task storage.

Example:

```javascript
let tasks = [];

Developed by **Sakhawat Hossain**

This project demonstrates practical backend development skills using Node.js, Express.js, RESTful API design, and API documentation practices.