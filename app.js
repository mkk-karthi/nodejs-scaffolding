const express = require("express");
const config = require("./config");
const app = express();

// setup dotenv
require("dotenv").config();

// set static public path
app.use("/public", express.static("public"));

// config body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// config helmet
const helmet = require("helmet");
app.use(helmet());

// config rate limit
const rateLimit = require("express-rate-limit");
app.use(
  rateLimit({
    windowMs: config.rateLimit.maxMin * 60 * 1000,
    max: config.rateLimit.maxReq,
    message: "Too Many Requests",
    // store:
  })
);

// setup logger middleware
const logger = require("./libs/logger");
app.use((req, res, next) => {
  req.logger = logger;
  const { method, url, ip } = req;

  next();

  logger.info("Request received", {
    method: method,
    url: url,
    ip: ip,
    statusCode: res.statusCode,
    data: res.data,
  });
});

// config swagger
const { swaggerUi, swaggerSpec } = require("./libs/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// config cors
const cors = require("cors");
const corsOptions = {
  origin: function (origin, callback) {
    if (config.whiteListOrigins && config.whiteListOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
};

const router = require("./routes/apiRoutes");
app.use("/", cors(corsOptions), router);

// error handling middleware
app.use((err, req, res, next) => {
  logger.error("Express error:", err);
  res.status(500).send("Internal server error");
});

// config database
const sequelize = require("./services/database");
const configDB = async () => {
  try {
    await sequelize.authenticate();

    logger.info("Database Connected.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
};
configDB();

// start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server running on port", port);
});
