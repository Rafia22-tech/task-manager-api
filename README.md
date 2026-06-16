# Task Manager Authentication Authorization

A backend API built with Node.js and Express.js.

## Features

- CRUD Operations
- JWT Authentication
- Role-Based Authorization
- Password Hashing with bcrypt
- Admin and User Roles
- Postman Testing

## Technologies

- Node.js
- Express.js
- JWT
- bcryptjs
- Postman

## API Endpoints

### Authentication

POST /signup

POST /login

### Tasks

GET /tasks

POST /tasks

PUT /tasks/:id

DELETE /tasks/:id

## Roles

### Admin
- Create Tasks
- Update Tasks
- Delete Tasks
- View All Tasks

### User
- View Assigned Tasks Only

## Testing

All APIs were tested using Postman.
