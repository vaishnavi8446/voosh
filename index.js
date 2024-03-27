const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");
const swaggerSpec = require('./middleware/swagger');
const swaggerUi = require("swagger-ui-express");

//connect to db
mongoose.connect(
  "mongodb://127.0.0.1:27017/auth",
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (!err) {
      console.log("Connected");
    } else {
      console.log("Error");
    }
  }
);

const app = express();
app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/user", userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
