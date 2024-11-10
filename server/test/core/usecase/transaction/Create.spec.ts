import { Sequelize } from "sequelize-typescript";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import CreateHandler from "../../../../src/core/usecase/transaction/Create";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import userSeed from "../../../seed/User.seed";
import ITransactionRepository from "../../../../src/core/repository/TransactionRepository.interface";
import categorySeed from "../../../seed/Category.seed";
import { TransactionDirection } from "../../../../src/core/entity/Transaction";

let sequelize: Sequelize;
let createHandler: CreateHandler;
let transactionRepository: ITransactionRepository;

const input = {
  id: "id",
  name: "name",
  value: 10.5,
  direction: TransactionDirection.IN,
  when: new Date("2022-02-02"),
  userId: "userId",
  categoriesId: [] as string[],
};

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  transactionRepository = repositoryFactory.transaction();
  const categoryRepository = repositoryFactory.category();
  const userRepository = repositoryFactory.user();
  createHandler = new CreateHandler(transactionRepository, categoryRepository);
  const [user] = userSeed();
  const [category] = categorySeed();
  const { id: userId } = await userRepository.create(user);
  category.associateUser(userId);
  const { id: categoryId } = await categoryRepository.create(category);
  input.userId = userId;
  input.categoriesId = [categoryId];
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("create transaction without category", async () => {
    input.categoriesId = [];
    const result = await createHandler.execute({ ...input });
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.value).toBe(input.value);
    expect(result.direction).toBe(input.direction);
    expect(result.when).toEqual(input.when);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(result.categoriesId).toHaveLength(0);
  });

  test("create transaction with category", async () => {
    const result = await createHandler.execute({ ...input });
    expect(result.categoriesId).toHaveLength(1);
  });
});

describe("fail", () => {
  test("create transaction with invalid user id", async () => {
    input.userId = "invalid_id";
    await expect(() => createHandler.execute({ ...input })).rejects.toThrow(
      "cannot access category from another user",
    );
  });

  test("create transaction with invalid category id", async () => {
    input.categoriesId = ["invalid_id"];
    await expect(() => createHandler.execute({ ...input })).rejects.toThrow(
      "failed on get category by id",
    );
  });
});
