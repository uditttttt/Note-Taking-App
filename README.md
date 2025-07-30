# Note Taking App

A full-stack, mobile-friendly note-taking application built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. It features a secure user authentication system using Email/OTP and Google OAuth, allowing users to create, view, and delete their notes.

-----

## Features

  - **Secure Authentication**: Sign up and log in via Email/OTP or Google Account.
  - **JWT Authorization**: Protected routes ensure users can only access their own notes.
  - **CRUD Functionality**: Users can Create, Read, and Delete their notes.
  - **Responsive Design**: A mobile-first UI built with Tailwind CSS, based on a Figma design.
  - **Full-Stack TypeScript**: Type safety across both the React frontend and Node.js/Express backend.

-----

## Technology Stack

  - **Frontend**: React, TypeScript, Tailwind CSS, Axios, React Router
  - **Backend**: Node.js, Express, TypeScript, Mongoose
  - **Database**: MongoDB (via Atlas)
  - **Authentication**: JWT, Google OAuth, Nodemailer

-----

## Setup and Installation

### Prerequisites

  - Node.js (v18 or later)
  - npm
  - Git
  - MongoDB Atlas account
  - Google Cloud Platform account for OAuth credentials

### 1\. Clone the Repository

```bash
git clone <your-repository-url>
cd Note-Taking-App
```

### 2\. Backend Setup (`server`)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory and add the following variables:
    ```.env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key

    # For Email/OTP
    GMAIL_USER=your_gmail_address
    GMAIL_APP_PASSWORD=your_16_character_google_app_password

    # For Google OAuth
    GOOGLE_CLIENT_ID=your_google_cloud_client_id
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

### 3\. Frontend Setup (`client`)

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Update the API and Google Client ID:
      * In `client/src/api.ts`, change the `baseURL` to your backend's URL (`http://localhost:5000/api` for local development).
      * In `client/src/main.tsx`, replace the placeholder with your Google Client ID.
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173`.