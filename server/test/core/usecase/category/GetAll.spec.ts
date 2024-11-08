import { Sequelize } from "sequelize-typescript";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import Category from "../../../../src/core/entity/Category";
import ICategoryRepository from "../../../../src/core/repository/CategoryRepository.interface";
import categorySeed from "../../../seed/Category.seed";
import User from "../../../../src/core/entity/User";
import IUserRepository from "../../../../src/core/repository/UserRepository.interface";
import userSeed from "../../../seed/User.seed";
import GetAllHandler from "../../../../src/core/usecase/category/GetAll";

let sequelize: Sequelize;
let categoryRepository: ICategoryRepository;
let userRepository: IUserRepository;
let getAllHandler: GetAllHandler;
let categories: Category[];
let users: User[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  categoryRepository = repositoryFactory.category();
  userRepository = repositoryFactory.user();
  getAllHandler = new GetAllHandler(categoryRepository);
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
  test("get all categories", async () => {
    const result = await getAllHandler.execute({ userId: users[0].id });
    expect(result[0].id).toBe(categories[0].id);
    expect(result[0].name).toBe(categories[0].name);
    expect(result[0].description).toBe(categories[0].description);
    expect(result[1].id).toBe(categories[1].id);
    expect(result[1].name).toBe(categories[1].name);
    expect(result[1].description).toBe(categories[1].description);
  });

  test("get empty array when repository is also empty", async () => {
    const result = await getAllHandler.execute({ userId: users[1].id });
    expect(result).toHaveLength(0);
  });
});
