import { Sequelize } from "sequelize-typescript";
import IUserRepository from "../../../../src/core/repository/UserRepository.interface";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import CreateHandler from "../../../../src/core/usecase/user/Create";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";

const input = {
  name: "name",
  username: "username",
  email: "email@email.com",
  password: "password",
};

let sequelize: Sequelize;
let userRepository: IUserRepository;
let createHandler: CreateHandler;

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  userRepository = repositoryFactory.user();
  createHandler = new CreateHandler(userRepository);
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("create user", async () => {
    const result = await createHandler.execute({ ...input });
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.username).toBe(input.username);
    expect(result.email).toBe(input.email);
  });
});

describe("fail", () => {
  test("fail on create user with same username", async () => {
    await createHandler.execute(input);
    await expect(() =>
      createHandler.execute({ ...input, email: "email2@email.com" }),
    ).rejects.toThrow("username must be unique");
  });

  test("fail on create user with same email", async () => {
    await createHandler.execute(input);
    await expect(() =>
      createHandler.execute({ ...input, username: "username2" }),
    ).rejects.toThrow("email must be unique");
  });

  test("fail on create user without password", async () => {
    await expect(() =>
      createHandler.execute({ ...input, password: "" }),
    ).rejects.toThrow("password must be provided");
  });
});
