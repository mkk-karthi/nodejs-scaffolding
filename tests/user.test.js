const request = require("supertest");
const app = require("../app");
const sequelize = require("../services/database");
const User = require("../models/user");
const helpers = require("../helpers");

beforeAll(async () => {
  // reset test DB
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await User.truncate();
  await sequelize.close();
});

describe("create user", () => {
  it("name validation", async () => {
    const res = await request(app).post("/api/user").send({
      name: "it",
      email: "test@gmail.com",
      dob: "2020-01-01",
      status: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message.includes("name")).toBeTruthy();
  });

  it("email validation", async () => {
    const res = await request(app).post("/api/user").send({
      name: "test",
      email: 123,
      dob: "2020-01-01",
      status: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message.includes("email")).toBeTruthy();
  });

  it("email validation: invalid mail", async () => {
    const res = await request(app).post("/api/user").send({
      name: "test",
      email: "test@gmail.c",
      dob: "2020-01-01",
      status: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message.includes("email")).toBeTruthy();
  });

  it("dob validation: invalid date", async () => {
    const res = await request(app).post("/api/user").send({
      name: "test",
      email: "test@gmail.com",
      dob: "2020",
      status: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message.includes("dob")).toBeTruthy();
  });

  it("dob validation: min date", async () => {
    const res = await request(app).post("/api/user").send({
      name: "test",
      email: "test@gmail.com",
      dob: "1960-01-01",
      status: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message.includes("dob")).toBeTruthy();
  });

  it("status validation", async () => {
    const res = await request(app).post("/api/user").send({
      name: "test",
      email: "test@gmail.com",
      dob: "2000-01-01",
      status: "3",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message.includes("status")).toBeTruthy();
  });

  it("create sucessfull", async () => {
    const res = await request(app).post("/api/user").send({
      name: "test",
      email: "test@gmail.com",
      dob: "2001-03-01",
      status: "1",
    });

    expect(res.statusCode).toEqual(200);
  });

  it("duplicate mail", async () => {
    const res = await request(app).post("/api/user").send({
      name: "test",
      email: "test@gmail.com",
      dob: "2000-01-01",
      status: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message.includes("email")).toBeTruthy();
  });
});

describe("list user", () => {
  it("users not found", async () => {
    await User.truncate();
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(404);
  });

  it("users found", async () => {
    let user = await User.create({
      name: "test1",
      email: "test1@gmail.com",
      dob: "2001-03-01",
      status: "1",
    });
    const res = await request(app).get("/api/users");

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length > 0).toBeTruthy();
  });
});

describe("get user", () => {
  let id;
  beforeAll(async () => {
    let user = await User.create({
      name: "test2",
      email: "test2@gmail.com",
      dob: "2001-03-01",
      status: "1",
    });
    user = user.toJSON();
    id = helpers.encrypt(user.id);
  });

  it("get user invalid id", async () => {
    const res = await request(app).get(`/api/user/1234`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message.includes("User not found")).toBeTruthy();
  });

  it("get user successfull", async () => {
    const res = await request(app).get(`/api/user/${id}`);

    expect(res.statusCode).toEqual(200);
    expect(Object.keys(res.body.data).length > 0).toBeTruthy();
  });
});

describe("update user", () => {
  let id;
  beforeAll(async () => {
    let user = await User.create({
      name: "test3",
      email: "test3@gmail.com",
      dob: "2001-03-01",
      status: "1",
    });
    id = helpers.encrypt(user.id);
  });

  it("update user by invalid id", async () => {
    const res = await request(app).put(`/api/user/1234`).send({
      name: "test4",
      email: "test4@gmail.com",
      dob: "2001-05-05",
      status: "2",
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body.message.includes("User not updated")).toBeTruthy();
  });

  it("validation error", async () => {
    const res = await request(app).put(`/api/user/${id}`).send({
      name: "test4",
      email: "test4@gmail.com",
      dob: "1960-01-01",
      status: "2",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message.includes("dob")).toBeTruthy();
  });

  it("update user", async () => {
    const res = await request(app).put(`/api/user/${id}`).send({
      name: "test4",
      email: "test4@gmail.com",
      dob: "2001-05-05",
      status: "2",
    });

    let user = await User.findByPk(helpers.decrypt(id));

    expect(res.statusCode).toEqual(200);
    expect(user.name).toBe("test4");
    expect(user.email).toBe("test4@gmail.com");
    expect(user.dob).toBe("2001-05-05");
    expect(user.status).toBe("2");
  });

  it("duplicate mail", async () => {
    let user = await User.create({
      name: "test5",
      email: "test5@gmail.com",
      dob: "2001-03-01",
      status: "1",
    });

    const res = await request(app).put(`/api/user/${id}`).send({
      name: "test5",
      email: "test5@gmail.com",
      dob: "2000-01-01",
      status: "1",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message.includes("email")).toBeTruthy();
  });
});

describe("delete user", () => {
  let id;
  beforeAll(async () => {
    let user = await User.create({
      name: "test6",
      email: "test6@gmail.com",
      dob: "2001-03-01",
      status: "1",
    });
    id = helpers.encrypt(user.id);
  });

  it("delete user by invalid id", async () => {
    const res = await request(app).delete(`/api/user/1234`).send({
      name: "test2",
      email: "test2@gmail.com",
      dob: "2001-05-05",
      status: "2",
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body.message.includes("User not deleted")).toBeTruthy();
  });

  it("delete user", async () => {
    const res = await request(app).delete(`/api/user/${id}`).send({
      name: "test2",
      email: "test2@gmail.com",
      dob: "2001-05-05",
      status: "2",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message.includes("User deleted")).toBeTruthy();
  });
});
