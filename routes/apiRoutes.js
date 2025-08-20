const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Node version " + process.version);
});

const apiRouter = express.Router();

const userController = require("../controllers/userController");
apiRouter.get("/users", userController.list);
apiRouter.post("/user", userController.create);
apiRouter.get("/user/:id", userController.view);
apiRouter.put("/user/:id", userController.update);
apiRouter.delete("/user/:id", userController.delete);

router.use("/api", apiRouter);

router.all(/(.*)/, (req, res) => {
  res.status(404).send("Not found");
});

module.exports = router;
