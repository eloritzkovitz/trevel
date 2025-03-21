# Trevel Backend

The Trevel Backend is a Node.js application that provides API endpoints for users, posts and comments, interacting with a MongoDB database. Additional services include Google Login, JWT authorization and interaction with an external API (GPT).

## Features

- **User Management**:
  - Register and login service, using JWT tokens for secure authentication and authorization.
  - Google Login integration for seamless user onboarding.

- **Post and Comment Management**:
  - Create, update, and delete posts and comments.
  - Upload and manage images for posts.
  - Like and unlike posts.

## Getting Started

### Prerequisites

- **Node.js:** [Install Node.js](https://nodejs.org/)
- **MongoDB**: Ensure you have a running MongoDB instance.
- **OpenAI:** [Set up OpenAI API](https://platform.openai.com/docs/quickstart)

### Installation

1. **Clone the repository:**
```sh
   git clone https://github.com/Elor-Itz/Trevel.git
   cd Trevel/backend
   ```

2. **Install dependencies:**
```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `Trevel/backend` folder and add the following values:
```sh
   PORT=""
   DB_CONNECT=""
   TOKEN_SECRET=""  
   TOKEN_EXPIRES=""
   REFRESH_TOKEN_EXPIRES=""
   BASE_URL=""
   GOOGLE_CLIENT_ID=""
   OPENAI_API_KEY=""
   ```

4. **Run the server:**
```sh
   npm run dev     
   ``` 
   Make sure you are inside the `/backend` folder.

## Usage

1. Start the backend server.

2. Use the provided API endpoints according to your needs.

## API Endpoints

**User Endpoints**
* `POST/auth/google`: Log in using Google OAuth.
* `POST/auth/register`: Register a new user.
* `POST/auth/login`: Log in a user and receive a JWT token.
* `POST/auth/refresh`: Refresh access tokens using a refresh token.
* `GET/auth/user/:id?`: Get user data.
* `GET/auth/users`: Search users by name.
* `PUT/auth/user/:id`: Update user data.
* `POST/auth/logout`: Log out a user.

**Post Endpoints**
* `GET/posts`: Retrieve all posts.
* `GET/posts/:id`: Retrieve all posts by user ID.
* `POST/posts`: Create a new post.
* `PUT/posts/:id`: Update an existing post.
* `DELETE/posts/:id`: Delete a post.
* `POST/posts/:id/like`: Like or unlike a post.

**Comment Endpoints**
* `GET/comments`: Retrieve all comments.
* `GET/comments/:postId`: Retrieve all comments by post ID.
* `POST/comments`: Add a comment to a post.
* `PUT/comments/:id`: Update a comment.
* `DELETE/comments/:id`: Delete a comment.
* `POST/comments/:id/like`: Like or unlike a comment.

## Project Structure

* `src/:` Contains the main application code.
  * `controllers/:` Contains controllers.
  * `middleware/:` Contains middleware (authentication and file upload).
  * `models/:` Contains models and schemas.
  * `routes/:` Contains API routes.
  * `tests/:` Contains test files.
  * `utils/:` Contains utility functions.
  * `app.ts:` Initialize the application.
  * `server.ts:` Application server.
* `nodemon.json:` Contains nodemon configuration.
* `package.json:` Defines the dependencies and scripts for the Node.js project.
* `tsconfig.json:` Contains configuration files.