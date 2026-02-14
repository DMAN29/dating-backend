import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import routes from "./routes/index.js";
import errorMiddleware from "./shared/middleware/error.middleware.js";
import swaggerSpec from "./config/swagger.config.js";
import corsOptions from "./config/cors.config.js";

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Dating Backend Running ❤️" });
});

// API Routes
app.use("/api", routes);

// Error Middleware
app.use(errorMiddleware);

export default app;
