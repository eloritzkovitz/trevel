# Trevel Frontend

Trevel is a React application that allows user to share travel experiences.

## Getting Started

### Prerequisites

- **Node.js:** [Install Node.js](https://nodejs.org/)
- **Backend Server**: Ensure the Trevel backend is running. Follow the [backend setup instructions](../backend/README.md).

### Installation

1. **Clone the repository:**
```sh
   git clone https://github.com/Elor-Itz/Trevel.git
   cd Trevel/frontend
   ```

2. **Install dependencies:**
```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `Trevel/frontend` folder and add the following values:
```sh
   REACT_APP_API_URL=<YOUR_BACKEND_BASE_URL>
   REACT_APP_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
   ```

4. **Run the server:**
```sh
   npm run dev     
   ``` 
   Make sure you are inside the `/frontend` folder.

## Project Structure

* `src/:` Contains the main application code.
  * `assets/:` Static assets.
  * `components/:` Reusable UI elements.
  * `context/:` Context providers for global state management.
  * `services/:` API service functions for interacting with the backend. 
  * `styles/:` Custom CSS styles. 
  * `utils/:` Contains utility functions.
  * `main.tsx:` Entry point to the application.
* `package.json:` Defines the dependencies and scripts for the Node.js project.
* `tsconfig.json:` Contains configuration files.