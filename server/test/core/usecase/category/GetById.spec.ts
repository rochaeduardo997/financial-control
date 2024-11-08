import { Sequelize } from "sequelize-typescript";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import Category from "../../../../src/core/entity/Category";
import ICategoryRepository from "../../../../src/core/repository/CategoryRepository.interface";
import categorySeed from "../../../seed/Category.seed";
import User from "../../../../src/core/entity/User";
import IUserRepository from "../../../../src/core/repository/UserRepository.interface";
import userSeed from "../../../seed/User.seed";
import GetByIdHandler from "../../../../src/core/usecase/category/GetById";

let sequelize: Sequelize;
let categoryRepository: ICategoryRepository;
let userRepository: IUserRepository;
let getByIdHandler: GetByIdHandler;
let categories: Category[];
let users: User[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  categoryRepository = repositoryFactory.category();
  userRepository = repositoryFactory.user();
  getByIdHandler = new GetByIdHandler(categoryRepository);
  categories = categorySeed(2);
  users = userSeed(2);
  await userRepository.create(users[0]);
  await userRepository.create(users[1]);
  categories[0].associateUser(users[0].id);
  categories[1].associateUser(users[0].id);
  await categoryRepository.create(categories[0]);
  await categoryRepository.create(categories[1]);
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("get by id", async () => {
    const result = await getByIdHandler.execute({
      id: categories[0].id,
      userId: users[0].id,
    });
    expect(result.id).toBe(categories[0].id);
    expect(result.name).toBe(categories[0].name);
    expect(result.description).toBe(categories[0].description);
    expect(result.userId).toBe(categories[0].userId);
  });
});

describe("success", () => {
  test("get another user's category", async () => {
    await expect(
      getByIdHandler.execute({
        id: categories[0].id,
        userId: users[1].id,
      }),
    ).rejects.toThrow("cannot access category from another user");
  });
});
