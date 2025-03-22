import dotenv from "dotenv";
import initApp from "./server";

// Load the appropriate .env file based on NODE_ENV
const env = process.env.NODE_ENV || "dev";
dotenv.config({
  path: (() => {
    switch (env) {
      case "production":
        return ".env.prod";
      case "test":
        return ".env.test";
      case "development":
        return ".env.dev";
      default:
        return ".env"; // Default to .env if NODE_ENV is not set
    }
  })(),
});

// Get the port from the environment variables or use the default
const port = process.env.PORT || 3000;

initApp().then((app) => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port} (Environment: ${env})`);
  });
});