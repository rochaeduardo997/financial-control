import { Sequelize } from "sequelize-typescript";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import Category from "../../../../src/core/entity/Category";
import ICategoryRepository from "../../../../src/core/repository/CategoryRepository.interface";
import categorySeed from "../../../seed/Category.seed";
import User from "../../../../src/core/entity/User";
import IUserRepository from "../../../../src/core/repository/UserRepository.interface";
import userSeed from "../../../seed/User.seed";
import UpdateHandler from "../../../../src/core/usecase/category/Update";

let sequelize: Sequelize;
let categoryRepository: ICategoryRepository;
let userRepository: IUserRepository;
let updateHandler: UpdateHandler;
let categories: Category[];
let users: User[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  categoryRepository = repositoryFactory.category();
  userRepository = repositoryFactory.user();
  updateHandler = new UpdateHandler(categoryRepository);
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
  test("update", async () => {
    const result = await updateHandler.execute({
      id: categories[0].id,
      userId: users[0].id,
      name: "new_name",
      description: "new_description",
    });
    expect(result.id).toBe(categories[0].id);
    expect(result.name).toBe("new_name");
    expect(result.description).toBe("new_description");
  });

  test("update setting description as null", async () => {
    const result = await updateHandler.execute({
      id: categories[0].id,
      userId: users[0].id,
      name: "new_name",
    });
    expect(result.id).toBe(categories[0].id);
    expect(result.name).toBe("new_name");
    expect(result.description).toBeNull();
  });
});

describe("success", () => {
  test("update another user's category", async () => {
    await expect(
      updateHandler.execute({
        id: categories[0].id,
        userId: users[1].id,
      }),
    ).rejects.toThrow("cannot access category from another user");
  });

  test("update category by invalid id", async () => {
    await expect(
      updateHandler.execute({
        id: "invalid_id",
        userId: users[0].id,
      }),
    ).rejects.toThrow("failed on get category by id");
  });
});
