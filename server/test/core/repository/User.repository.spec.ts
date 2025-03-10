import { Sequelize } from "sequelize-typescript";
import User, { UserRole } from "../../../src/core/entity/User";
import IUserRepository from "../../../src/core/repository/UserRepository.interface";
import UserRepository from "../../../src/infra/repository/sequelize/User.repository";
import userSeed from "../../seed/User.seed";
import instanceSequelize from "../../../src/infra/database/sequelize/instance";

let users: User[] = [];
let sequelize: Sequelize;
let userRepository: IUserRepository;

beforeEach(async () => {
  users = userSeed(2);
  sequelize = await instanceSequelize();
  userRepository = new UserRepository(sequelize);
});
afterEach(async () => await sequelize.close());

describe("success", () => {
  test("disable user", async () => {
    users[0].status = true;
    await userRepository.create(users[0]);
    const result = await userRepository.disableBy(users[0].id);
    expect(result).toBeTruthy();
    const { status } = await userRepository.getBy(users[0].id);
    expect(status).toBeFalsy();
  });

  test("enable user", async () => {
    await userRepository.create(users[0]);
    const result = await userRepository.enableBy(users[0].id);
    expect(result).toBeTruthy();
    const { status } = await userRepository.getBy(users[0].id);
    expect(status).toBeTruthy();
  });

  test("create new user", async () => {
    const result = await userRepository.create(users[0]);
    expect(result.id).toBe(users[0].id);
    expect(result.name).toBe(users[0].name);
    expect(result.username).toBe(users[0].username);
    expect(result.email).toBe(users[0].email);
    expect(result.password).toBe(users[0].password);
    expect(result.status).toBeFalsy();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  test("login with email", async () => {
    const user = await userRepository.create(users[0]);
    const result = await userRepository.login({
      login: user.email,
      password: user.password,
    });
    expect(result.id).toBe(user.id);
    expect(result.name).toBe(user.name);
    expect(result.username).toBe(user.username);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
    expect(result.status).toBeFalsy();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  test("login with username", async () => {
    const user = await userRepository.create(users[0]);
    const result = await userRepository.login({
      login: user.username,
      password: user.password,
    });
    expect(result.id).toBe(user.id);
    expect(result.name).toBe(user.name);
    expect(result.username).toBe(user.username);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
    expect(result.status).toBeFalsy();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  test("find by id", async () => {
    const user = await userRepository.create(users[0]);
    const result = await userRepository.getBy(user.id);
    expect(result.id).toBe(user.id);
    expect(result.name).toBe(user.name);
    expect(result.username).toBe(user.username);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
    expect(result.status).toBeFalsy();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  test("find all", async () => {
    await userRepository.create(users[0]);
    await userRepository.create(users[1]);
    const result = await userRepository.getAll();
    expect(result[0].id).toBe(users[0].id);
    expect(result[0].name).toBe(users[0].name);
    expect(result[0].username).toBe(users[0].username);
    expect(result[0].email).toBe(users[0].email);
    expect(result[0].password).toBe(users[0].password);
    expect(result[0].status).toBeFalsy();
    expect(result[0].createdAt).toBeDefined();
    expect(result[0].updatedAt).toBeDefined();
    expect(result[1].id).toBe(users[1].id);
    expect(result[1].name).toBe(users[1].name);
    expect(result[1].username).toBe(users[1].username);
    expect(result[1].email).toBe(users[1].email);
    expect(result[1].password).toBe(users[1].password);
    expect(result[1].status).toBeFalsy();
    expect(result[1].createdAt).toBeDefined();
    expect(result[1].updatedAt).toBeDefined();
  });

  test("empty array when find all without user registered", async () => {
    const result = await userRepository.getAll();
    expect(result).toHaveLength(0);
  });

  test("update user", async () => {
    await userRepository.create(users[0]);
    const result = await userRepository.updateBy(users[0].id, users[1]);
    expect(result.id).toBe(users[0].id);
    expect(result.name).toBe(users[1].name);
    expect(result.username).toBe(users[1].username);
    expect(result.email).toBe(users[1].email);
    expect(result.password).toBe(users[1].password);
    expect(result.status).toBeFalsy();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  test("delete user by id", async () => {
    await userRepository.create(users[0]);
    await userRepository.create(users[1]);
    const deleteResult = await userRepository.deleteBy(users[0].id);
    expect(deleteResult).toBeTruthy();
    const getAllResult = await userRepository.getAll();
    expect(getAllResult).toHaveLength(1);
  });
});

describe("fail", () => {
  test("create user with same username", async () => {
    await userRepository.create(users[0]);
    const userWithSameUsername = new User(
      users[1].id,
      users[0].name,
      users[0].username,
      users[1].email,
      users[0].password,
      users[0].status,
      users[0].role,
      users[0].createdAt,
      users[0].updatedAt,
    );
    await expect(() =>
      userRepository.create(userWithSameUsername),
    ).rejects.toThrow("username must be unique");
  });

  test("create user with same email", async () => {
    await userRepository.create(users[0]);
    await expect(() => userRepository.create(users[0])).rejects.toThrow(
      "email must be unique",
    );
  });

  test("login with invalid credentials", async () => {
    await expect(() =>
      userRepository.login({ login: "login", password: "password" }),
    ).rejects.toThrow();
  });

  test("find by invalid id", async () => {
    await expect(() => userRepository.getBy("invalid_id")).rejects.toThrow(
      "failed on get user by id",
    );
  });

  test("update user with invalid id", async () => {
    await expect(() =>
      userRepository.updateBy("invalid_id", users[0]),
    ).rejects.toThrow("failed on update user");
  });

  test("update user with same email", async () => {
    await userRepository.create(users[0]);
    await userRepository.create(users[1]);
    await expect(() =>
      userRepository.updateBy(users[0].id, users[1]),
    ).rejects.toThrow("email must be unique");
  });

  test("update user with same username", async () => {
    await userRepository.create(users[0]);
    await userRepository.create(users[1]);
    const userWithSameUsername = new User(
      users[0].id,
      users[0].name,
      users[1].username,
      users[0].email,
      users[0].password,
      users[0].status,
      users[0].role,
      users[0].createdAt,
      users[0].updatedAt,
    );
    await expect(() =>
      userRepository.updateBy(users[0].id, userWithSameUsername),
    ).rejects.toThrow("username must be unique");
  });

  test("delete user by invalid id", async () => {
    await userRepository.create(users[0]);
    await userRepository.create(users[1]);
    await expect(() => userRepository.deleteBy("invalid_id")).rejects.toThrow(
      "failed on delete user by id",
    );
    const getAllResult = await userRepository.getAll();
    expect(getAllResult).toHaveLength(2);
  });

  test("enable user by invalid id", async () => {
    await expect(() => userRepository.enableBy("invalid_id")).rejects.toThrow(
      "failed on enable user",
    );
  });

  test("disable user by invalid id", async () => {
    await expect(() => userRepository.disableBy("invalid_id")).rejects.toThrow(
      "failed on disable user",
    );
  });
});
