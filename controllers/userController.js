const Joi = require("joi").extend(require("@joi/date"));
const sequelize = require("sequelize");
const User = require("../models/user");
const helpers = require("../helpers");
const logger = require("../services/logger");

module.exports = {
  async list(req, res) {
    try {
      // get users from table
      let users = await User.findAll();

      if (users && users.length > 0) {
        // collect the data
        users = users.map((row) => {
          row = row.toJSON();
          return {
            ...row,
            id: helpers.encrypt(row.id),
          };
        });

        helpers.response(res, "User found", { data: users });
      } else {
        helpers.response(res, "User not found", {}, 404);
      }
    } catch (e) {
      logger.error("user list error:", e);
      helpers.response(res, "Internal server error", {}, 500);
    }
  },

  async create(req, res) {
    try {
      // Validate the input
      const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        status: Joi.number().valid(1, 2).empty("").default(1),
        dob: Joi.date().format("YYYY-MM-DD").min("1970-01-01").max("2020-12-30").empty(""),
      })
        .unknown()
        .required();

      const { value, error } = schema.validate(req.body || {});

      // validation error
      if (error) {
        helpers.response(res, error.details[0].message, {}, 400);
      } else {
        // chech email is already exist
        let checkMail = await User.findOne({ where: { email: value.email } });
        if (checkMail) {
          helpers.response(res, "email already exist", {}, 400);
          return;
        }

        // insert user
        let user = await User.create({
          name: value.name,
          email: value.email,
          dob: value.dob,
          status: value.status,
        });

        if (user) {
          helpers.response(res, "User created");
        } else {
          helpers.response(res, "User not created");
        }
      }
    } catch (e) {
      logger.error("user create error:", e);
      helpers.response(res, "Internal server error", {}, 500);
    }
  },

  async view(req, res) {
    try {
      // get and decrypt the id
      let id = helpers.decrypt(req.params.id);

      // get user from table
      let user = await User.findOne({
        where: { id: id },
      });

      if (user) {
        // collect the data
        user = user.toJSON();
        user.id = helpers.encrypt(user.id);

        helpers.response(res, "User found", { data: user });
      } else {
        helpers.response(res, "User not found", {}, 404);
      }
    } catch (e) {
      logger.error("user view error:", e);
      helpers.response(res, "Internal server error", {}, 500);
    }
  },

  async update(req, res) {
    try {
      // Validate the input
      const schema = Joi.object({
        name: Joi.string().min(3).max(30).empty(""),
        email: Joi.string().email().empty(""),
        status: Joi.number().valid(1, 2).empty(""),
        dob: Joi.date()
          .format("YYYY-MM-DD")
          .min("1970-01-01")
          .max("2020-12-30")
          .empty(""),
      })
        .or("name", "email", "status", "dob")
        .unknown()
        .required();

      const { value, error } = schema.validate(req.body);

      // validation error
      if (error) {
        helpers.response(res, error.details[0].message, {}, 400);
      } else {
        // get and decrypt the id
        let id = helpers.decrypt(req.params.id);

        // chech email is already exist
        if (value.email) {
          let checkMail = await User.findOne({
            where: { email: value.email, id: { [sequelize.Op.ne]: id } },
          });
          if (checkMail) {
            helpers.response(res, "email already exist", {}, 400);
            return;
          }
        }
        
        let input = {
          name: value.name,
          email: value.email,
        };
        if (value.status) input["status"] = value.status;
        if (value.dob) input["dob"] = value.dob;

        // update user
        let updated = await User.update(input, { where: { id } });

        if (updated[0] == 1) {
          helpers.response(res, "User updated");
        } else {
          helpers.response(res, "User not updated", {}, 404);
        }
      }
    } catch (e) {
      logger.error("user update error:", e);
      helpers.response(res, "Internal server error", {}, 500);
    }
  },

  async delete(req, res) {
    try {
      // get and decrypt the id
      let id = helpers.decrypt(req.params.id);

      // delete user
      let deleted = await User.destroy({ where: { id } });

      if (deleted == 1) {
        helpers.response(res, "User deleted");
      } else {
        helpers.response(res, "User not deleted", {}, 404);
      }
    } catch (e) {
      logger.error("user update error:", e);
      helpers.response(res, "Internal server error", {}, 500);
    }
  },
};
