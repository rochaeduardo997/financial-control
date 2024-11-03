import { Sequelize } from "sequelize-typescript";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import DeleteByIdHandler from "../../../../src/core/usecase/category/DeleteById";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import Category from "../../../../src/core/entity/Category";
import ICategoryRepository from "../../../../src/core/repository/CategoryRepository.interface";
import categorySeed from "../../../seed/Category.seed";
import User from "../../../../src/core/entity/User";
import IUserRepository from "../../../../src/core/repository/UserRepository.interface";
import userSeed from "../../../seed/User.seed";

let sequelize: Sequelize;
let categoryRepository: ICategoryRepository;
let userRepository: IUserRepository;
let deleteByIdHandler: DeleteByIdHandler;
let category: Category;
let categories: Category[];
let users: User[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  categoryRepository = repositoryFactory.category();
  userRepository = repositoryFactory.user();
  deleteByIdHandler = new DeleteByIdHandler(categoryRepository);
  categories = categorySeed(2);
  users = userSeed(2);
  await userRepository.create(users[0]);
  await userRepository.create(users[1]);
  categories[0].associateUser(users[0].id);
  categories[1].associateUser(users[1].id);
  category = await categoryRepository.create(categories[0]);
  await categoryRepository.create(categories[1]);
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("delete category by id", async () => {
    const result = await deleteByIdHandler.execute({
      id: category.id,
      userId: users[0].id,
    });
    expect(result).toBe(true);
  });
});

describe("fail", () => {
  test("fail on delete category with invalid id", async () => {
    await expect(() =>
      deleteByIdHandler.execute({ id: "invalid_id", userId: users[0].id }),
    ).rejects.toThrow("failed on delete category by id");
  });

  test("fail on delete category with invalid user id", async () => {
    await expect(() =>
      deleteByIdHandler.execute({ id: category.id, userId: "invalid_user_id" }),
    ).rejects.toThrow("failed on delete category by id");
  });
});
