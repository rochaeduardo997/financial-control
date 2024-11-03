import { Sequelize } from "sequelize-typescript";
import IUserRepository from "../../../../src/core/repository/UserRepository.interface";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import GetByIdHandler from "../../../../src/core/usecase/user/GetById";
import User from "../../../../src/core/entity/User";
import userSeed from "../../../seed/User.seed";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";

let sequelize: Sequelize;
let userRepository: IUserRepository;
let getByIdHandler: GetByIdHandler;
let user: User;
let users: User[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  userRepository = repositoryFactory.user();
  getByIdHandler = new GetByIdHandler(userRepository);
  users = userSeed(2);
  user = await userRepository.create(users[0]);
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("get user by id", async () => {
    const result = await getByIdHandler.execute({ id: user.id });
    expect(result.id).toBe(user.id);
    expect(result.name).toBe(user.name);
    expect(result.username).toBe(user.username);
    expect(result.email).toBe(user.email);
  });
});

describe("fail", () => {
  test("fail on get user with invalid id", async () => {
    await expect(() =>
      getByIdHandler.execute({ id: "invalid_id" }),
    ).rejects.toThrow("failed on get user by id");
  });
});
