import dotenv from "dotenv";
import initApp from "./server";

// Determine which environment file to load
const env = process.env.NODE_ENV || "dev"; // Default to 'development' if not set
const envFile = `.env_${env}`;

dotenv.config({ path: envFile });

// Debugging logs
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Loaded environment file: ${envFile}`);
console.log(`DB_CONNECT: ${process.env.DB_CONNECT}`);

const port = process.env.PORT || 3000; // Fallback to 3000 if PORT is undefined

initApp().then((app) => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port} (Environment: ${env}, Loaded: ${envFile})`);
  });
});