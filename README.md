# Trevel - A Social Network for Travel Enthusiasts ✈️

## 🌍 Overview
Trevel is a social networking platform designed for users to share their travel experiences, post trip highlights, and interact with fellow travelers. Users can upload photos, write travel stories, comment on posts, and mark their favorite content. The platform integrates 🤖 **AI-powered content suggestions** to enhance user experience and provide relevant travel insights.

---

## ✨ Features

### 🔐 **Authentication**
- 📃 **User Registration & Login:** Register and log in using your email and password.
- 🔗 **Google Login:** Sign in with your Google account.
- 🔑 **JWT-based Authentication:** Secure authentication with access and refresh tokens.
- 🍪 **Session Management:** The app uses cookies to maintain user sessions.

### 👤 **User Profile**
- ✏️ **Profile Details:** Customize your profile, including a profile picture, biography and contact information.
- 📝 **User Posts:** View all posts created by the user.

### 🪟 **Content Display**
- 🖼️ **Share Your Experiences:** Share your travel experiences with others, both in text and pictures.
- 🛠️ **Edit & Delete:** Modify or remove your content.
- 🤖 **AI-Powered Suggestions:** Discovered an interesting destination? Receive information or travel itineraries right away!

### 🗨️ **Engagement & Interaction**
- 💬 **Comments:** Share your thoughts and photos of the recipes you’ve tried.
- ❤️ **Likes:** Engage with your favorite posts by liking them!

### 🎨 **UI/UX Design**
- 💻 **Modern Interface:** Thoughtful use of layouts and colors.
- 🌙 **Dark Theme:** Tired of bright colors? You can adjust the appearance for a dark display.
- 🛡️ **Form Validation:** Secure user input handling.

---

## ⚙️ **Technology Stack**

### 💻 **Backend**
- 🟢 **Node.js & Express.js** - Scalable backend framework.
- 🛢️ **MongoDB** - NoSQL database for efficient data handling.
- 🔐 **JWT** - Secure user authentication.
- 📜 **Swagger** - API documentation.
- ✅ **Jest** - Unit testing framework.

### 🌐 **Frontend**
- ⚛️ **React.js** - Modern UI library for dynamic user interfaces.
- 🎨 **Bootstrap** - Responsive styling for sleek design.

### ☁️ **Deployment**
- 🔒 **HTTPS & SSL** - Secure connection.
- ♻️ **PM2** - Process management.

---

## 📖 API Documentation

**User Endpoints**
* `POST/auth/register`: Register a new user.
* `POST/auth/login`: Log in a user and receive a JWT token.
* `POST/auth/google`: Log in using Google OAuth.
* `POST/auth/refresh`: Refresh access tokens using a refresh token.
* `GET/auth/user/:id?`: Get user information.
* `PUT/auth/user/:id`: Update user information.
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

---

## 👤 Authors
- [Elor Itzkovitz](https://github.com/Elor-Itz)
- [Adi Cahal](https://github.com/Adica6)
