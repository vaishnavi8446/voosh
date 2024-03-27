const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Enhanced Authentication API",
      version: "1.0.0",
      description: "Enhanced Authentication API using JWT",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
