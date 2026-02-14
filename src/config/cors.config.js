import { config } from "./env.js";

const corsOptions = {
  origin: (origin, callback) => {
    // In production, you might want to restrict this to specific domains
    const allowedOrigins = [
      "http://localhost:3000", // React default
      "http://localhost:5000", // Vite default
      config.clientUrl,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
