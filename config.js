module.exports = {
  appName: "Microservices in Express.js",
  rateLimit: {
    maxReq: 100,
    maxMin: 15,
  },
  whiteListOrigins: ["localhost:8080"],
  fileDir: {
    temp: "storage/temp",
    upload: "storage/uploads",
    log: "storage/logs",
  },

  winston: {
    maxSize: "20m",
    maxFiles: "14d",
    logFilename: "log-%DATE%.log",
    errorFilename: "error-%DATE%.log",
  },
};
