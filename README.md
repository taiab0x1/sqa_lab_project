# sqa_lab_project
# Green Farming Equipment Rental

A full-stack web application for renting and managing agricultural equipment. The platform allows users to register, browse, book, and manage farming equipment, while owners can post ads and manage their products.

## Features

- User registration and login (JWT authentication)
- Role-based access (user/admin)
- Browse, search, and filter equipment
- Equipment booking with date selection
- Admin dashboard for managing products and users
- Image upload for equipment
- Responsive UI with React, Tailwind CSS, and Material UI
- RESTful API with Express and MongoDB
- Cloudinary integration for image storage

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Material UI, Axios, Framer Motion
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary, Multer
- **Testing:** Selenium (Java, for E2E tests)

## Folder Structure

```
backend/         # Express API, MongoDB models, routes
frontend/        # React app (Vite, Tailwind, MUI)
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### Backend Setup

1. Go to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file (see `.env` example in the repo) with your MongoDB and Cloudinary credentials.
4. Start the backend server:
   ```sh
   npm start
   ```
   The server runs on `http://localhost:3000`.

### Frontend Setup

1. Go to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend dev server:
   ```sh
   npm run dev
   ```
   The app runs on `http://localhost:5173`.

### Running Tests

- Selenium E2E tests are located in `frontend/src/pages/sqa_lab` and `frontend/src/pages/SqaLabTest`.
- Make sure the backend and frontend servers are running before executing tests.

## API Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT
- `GET /auth/dashproducts` - Get all products (auth required)
- `POST /auth/products` - Add new product (admin only)
- `PUT /auth/products/:id` - Edit product (admin only)
- `DELETE /auth/products/:id` - Delete product (admin only)
- `POST /auth/bookings` - Create a booking (auth required)
- `GET /auth/bookings` - Get all bookings (admin only)
- `GET /auth/profile/:id` - Get user profile (auth required)
- `POST /auth/add-admin` - Add a new admin (admin only)

## License

This project is for educational purposes.

---

**Developed by your team.**
