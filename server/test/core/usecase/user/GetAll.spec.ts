import { Sequelize } from "sequelize-typescript";
import IUserRepository from "../../../../src/core/repository/UserRepository.interface";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import GetAllHandler from "../../../../src/core/usecase/user/GetAll";
import User from "../../../../src/core/entity/User";
import userSeed from "../../../seed/User.seed";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";

let sequelize: Sequelize;
let userRepository: IUserRepository;
let getAllHandler: GetAllHandler;
let users: User[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  userRepository = repositoryFactory.user();
  getAllHandler = new GetAllHandler(userRepository);
  users = userSeed(2);
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("get all users", async () => {
    await userRepository.create(users[0]);
    await userRepository.create(users[1]);
    const result = await getAllHandler.execute();
    expect(result[0].id).toBe(users[0].id);
    expect(result[0].name).toBe(users[0].name);
    expect(result[0].username).toBe(users[0].username);
    expect(result[0].email).toBe(users[0].email);
    expect(result[0].status).toBeFalsy();
    expect(result[1].id).toBe(users[1].id);
    expect(result[1].name).toBe(users[1].name);
    expect(result[1].username).toBe(users[1].username);
    expect(result[1].email).toBe(users[1].email);
    expect(result[1].status).toBeFalsy();
  });

  test("get empty array when repository is also empty", async () => {
    const result = await getAllHandler.execute();
    expect(result).toHaveLength(0);
  });
});
