import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import errorMiddleware from "./shared/middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Dating Backend Running ❤️" });
});

// API Routes
app.use("/api", routes);

// Error Middleware
app.use(errorMiddleware);

export default app;
