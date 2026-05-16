# Team Task Manager

A full-stack project management web application.

## Technologies Used
- **Frontend**: React (Vite)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT & bcrypt

## Project Structure
- `/frontend` - Contains the React application.
- `/backend` - Contains the Express backend and PostgreSQL migration scripts.

## Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your database credentials and JWT secret.
4. Run the SQL migration file located in `db/schema.sql` against your PostgreSQL database.
5. Start the backend server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
