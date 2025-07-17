import dotenv from "dotenv"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import tripRoutes from "./routes/tripRoutes";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const app = express();

dotenv.config();

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(uploadDir));

// Serve the API routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/auth", authRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use("/trips", tripRoutes);

// Swagger documentation
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trevel API",
      version: "1.0.0",
      description: "API documentation for Trevel",
    },
    servers: [
      { 
        url: "http://localhost:3000",
        description: 'Local server',      
     },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Connect to database
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

// Initialize application
const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;