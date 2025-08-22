const app = require("./app");
const sequelize = require("./services/database");

sequelize.sync().then(() => {
  // start the server
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log("Server running on port", port);
  });
});
