module.exports = {
  list(req, res) {
    res.status(200).send("Users found");
  },

  create(req, res) {
    res.status(200).send("User created");
  },

  view(req, res) {
    res.status(200).send("User found");
  },

  update(req, res) {
    res.status(200).send("User updated");
  },

  delete(req, res) {
    res.status(200).send("User deleted");
  },
};
