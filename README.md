# Facebook-Project-Mern
# Project Name: Social Media App (MERN Stack)
# Frontend
# Technologies Used:
# React.js: A JavaScript library for building user interfaces. We used React to create dynamic and  interactive web pages.

# Material-UI: A popular React UI framework that provides pre-built components and styles to enhance the UI development process.

# React Router DOM: Used for handling routing between different pages (Signup, Login, Profile, Timeline, etc.).

# Formik: A form management library for handling form state and validation.

# Yup: A JavaScript schema validator used with Formik to handle form validation.

# Axios: A promise-based HTTP client used to send requests to the backend API and manage responses.

# LocalStorage: Used to store the authentication token securely after login, so users stay logged in.

# Key Pages:
Signup: Allows users to create an account by providing their name, email, password, and age.

Login: Users can log into the platform using their email and password.

OTP Verification: A page to verify the OTP sent to the user's email during registration.

Password Forget: Allows users to reset their password via OTP verification.

Profile: Displays the user’s profile and allows updates.

Timeline: Shows posts from the user’s friends and the user can create and view posts.

Create Post: Enables users to create new posts.

Edit Post: Allows users to edit existing posts.

# Backend
# Technologies Used:
# Node.js: JavaScript runtime built on Chrome's V8 JavaScript engine. We used Node.js to build the backend of the app.

# Express.js: A web application framework for Node.js, used to handle routing and HTTP requests.

# MongoDB: A NoSQL database used to store user information, posts, and other data in the app.

# Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js, which provides a straightforward way to model and interact with the database.

# JWT (JSON Web Token): Used for user authentication, allowing secure login and authorization by issuing tokens.

# Bcrypt.js: Used for password hashing before storing user credentials in the database.

# Nodemailer: A package used to send OTP emails to users during the signup process or password reset.

# API Endpoints:
POST /user/signup: Registers a new user and sends an OTP to the user's email for verification.

POST /user/otp-verify: Verifies the OTP entered by the user during signup.

POST /user/login: Authenticates the user and issues a JWT token for subsequent requests.

POST /user/forgot-password: Sends a password reset email to the user.

POST /user/againVerify/New_password: Allows the user to reset their password after verifying the OTP.

POST /user/logout: Logs out the user by clearing the JWT token from the frontend.

Installation
Frontend Setup:
Clone the repository: git clone <repo_url>

Navigate to the frontend folder: cd frontend

Install dependencies: npm install

Start the development server: npm start

Open the app in your browser at http://localhost:3000

Backend Setup:
Clone the repository: git clone <repo_url>

Navigate to the backend folder: cd backend

Install dependencies: npm install

Set up environment variables in a .env file:

PORT=4000

MONGO_URI=<Your MongoDB URI>

JWT_SECRET_KEY=<Your JWT Secret Key>

EMAIL_SERVICE=<Email service provider (e.g., Gmail)>

EMAIL_USERNAME=<Your email username>

EMAIL_PASSWORD=<Your email password>

Start the server: npm start

The backend will be running on http://localhost:4000.

# Features
User registration with OTP verification.

Secure login using JWT token-based authentication.

Password reset functionality via OTP verification.

Post creation, editing, and viewing.

Profile management (view and update).

Responsive UI with Material-UI components.

Protected routes based on JWT authentication.

