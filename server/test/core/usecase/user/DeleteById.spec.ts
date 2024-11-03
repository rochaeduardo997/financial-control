import { Sequelize } from "sequelize-typescript";
import IUserRepository from "../../../../src/core/repository/UserRepository.interface";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import DeleteByIdHandler from "../../../../src/core/usecase/user/DeleteById";
import User from "../../../../src/core/entity/User";
import userSeed from "../../../seed/User.seed";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";

let sequelize: Sequelize;
let userRepository: IUserRepository;
let deleteByIdHandler: DeleteByIdHandler;
let user: User;
let users: User[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  userRepository = repositoryFactory.user();
  deleteByIdHandler = new DeleteByIdHandler(userRepository);
  users = userSeed(2);
  user = await userRepository.create(users[0]);
  await userRepository.create(users[1]);
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("delete user by id", async () => {
    const result = await deleteByIdHandler.execute({ id: user.id });
    expect(result).toBe(true);
  });
});

describe("fail", () => {
  test("fail on delete user with invalid id", async () => {
    await expect(() =>
      deleteByIdHandler.execute({ id: "invalid_id" }),
    ).rejects.toThrow("failed on delete user by id");
  });
});
