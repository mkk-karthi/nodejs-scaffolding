const User = require("../models/user");

module.exports = () => {
  User.create({
    name: "admin",
    email: "admin@gmail.com",
    status: "1",
  });
  User.create({
    name: "user",
    email: "user@gmail.com",
    status: "2",
  });
};
