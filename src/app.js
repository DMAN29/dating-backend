import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import routes from "./routes/index.js";
import errorMiddleware from "./shared/middleware/error.middleware.js";
import corsOptions from "./config/cors.config.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join("public", "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Dating Backend Running ❤️" });
});

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
