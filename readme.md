# Playa API

This is a Node.js and Express backend API for the Playa application, which allows users to book services and manage products.

## Features

- User authentication (signup, login)
- JWT-based authorization
- Booking management (create, view, delete)
- Product management

## Installation

1. Clone the repository:

```
git clone https://github.com/TP-Full-stack/playa-api.git
cd playa-api
```

2. Install dependencies:

```
npm install
```

3. Create a `.env` file in the root directory with the following environment variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/Playa-app
JWT_SECRET=4f3e7b2d3c8f0a3b0e6c9d7a2f5e8c1d3b0a6f9e4c2b7a0d8e1f3b5c4a9e7d2
JWT_EXPIRE=30d
```

4. Start the development server:

```
npm run dev
```

## API Endpoints

### Authentication

- **POST /signup** - Register a new user
- **POST /login** - Login a user and receive JWT token

### Bookings

- **POST /** - Create a new booking (protected)
- **GET /** - Get all bookings (protected)
- **DELETE /:id** - Delete a booking by ID (protected)

### Products

- **GET /products** - Get all products
- **GET /products/:id** - Get a product by ID

## Authentication

This API uses JWT (JSON Web Token) for authentication. To access protected routes, you must include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens

## Development

To contribute to this project:

1. Create a new branch for your feature
2. Make your changes
3. Push your branch to GitHub
4. Create a Pull Request to merge into main

## License

[MIT](LICENSE)
