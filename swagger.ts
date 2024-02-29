import swaggerJSDoc from "swagger-jsdoc";
import express from "express";
import path from "path";

const app = express();

// Swagger definition
const swaggerDefinition = {
  info: {
    title: "Your API Title",
    version: "1.0.0",
    description: "Description of your API",
  },
  basePath: "/",
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "./routes/*.ts")], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };
