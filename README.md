# Task Manager Authentication 

A backend-only **Node.js + Express.js Task Manager API** project with CRUD operations, JWT-based authentication, role-based authorization, and bcrypt password hashing.

This project is designed for testing with **Postman**. No frontend/webpage is required.

## Project Features

* User Signup & Login
* JWT Authentication
* Role-Based Authorization
* Password Hashing using bcryptjs
* CRUD Operations for Tasks
* Admin Task Management
* User-Specific Task Access
* JSON File Storage
* Postman API Testing

## Technologies Used

* Node.js
* Express.js
* JSON Web Token (JWT)
* bcryptjs
* Postman

## Project Structure

```txt
task-manager-authentication-authorization
│
├── server.js
├── users.json
├── tasks.json
├── package.json
├── package-lock.json
└── README.md
```

## API Endpoints

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | /signup            | Register User         |
| POST   | /login             | Login User            |
| GET    | /tasks             | View Tasks            |
| POST   | /tasks             | Create Task (Admin)   |
| PUT    | /tasks/:id         | Update Task (Admin)   |
| DELETE | /tasks/:id         | Delete Task (Admin)   |
| GET    | /admin/users-tasks | View Users with Tasks |

## Authentication

JWT token is generated during login and must be included in protected routes using Bearer Token authentication.

## Authorization

### Admin

* Create Tasks
* Update Tasks
* Delete Tasks
* View All Tasks
* View Users and Assigned Tasks

### User

* Login
* View Own Assigned Tasks Only

## Testing

All API endpoints were tested using Postman.

## Project Summary

This project demonstrates Authentication and Authorization using JWT and bcrypt in Node.js. Admin users can manage tasks and monitor assigned work, while regular users can only access their own tasks.

## Author

**Created By:** Rafia
