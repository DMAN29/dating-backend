import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./env.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dating App Backend API ❤️",
      version: "1.0.0",
      description: "API documentation for Dating App backend",
    },
    servers: [
      {
        url: config.baseUrl || `http://localhost:${config.port || 5000}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;

