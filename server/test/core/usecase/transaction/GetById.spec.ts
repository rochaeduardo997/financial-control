import { Sequelize } from "sequelize-typescript";
import Transaction from "../../../../src/core/entity/Transaction";
import ITransactionRepository from "../../../../src/core/repository/TransactionRepository.interface";
import GetByIdHandler from "../../../../src/core/usecase/transaction/GetById";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import categorySeed from "../../../seed/Category.seed";
import transactionSeed from "../../../seed/Transaction.seed";
import userSeed from "../../../seed/User.seed";

let sequelize: Sequelize;
let transactionRepository: ITransactionRepository;
let getAllHandler: GetByIdHandler;
let transactions: Transaction[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  const userRepository = repositoryFactory.user();
  const categoryRepository = repositoryFactory.category();
  transactionRepository = repositoryFactory.transaction();

  getAllHandler = new GetByIdHandler(transactionRepository);

  const [user] = userSeed(1);
  const categories = categorySeed(2);
  transactions = transactionSeed(2);

  categories[0].associateUser(user.id);
  categories[1].associateUser(user.id);

  transactions[0].associateUser(user.id);
  transactions[1].associateUser(user.id);
  transactions[0].associateCategory(categories[0]);
  transactions[0].associateCategory(categories[1]);

  await userRepository.create(user);
  await categoryRepository.create(categories[0]);
  await categoryRepository.create(categories[1]);
  await transactionRepository.create(transactions[0]);
  await transactionRepository.create(transactions[1]);
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("get transaction by id", async () => {
    const result = await getAllHandler.execute({
      userId: transactions[0].userId!,
      id: transactions[0].id,
    });
    expect(result.id).toBe(transactions[0].id);
    expect(result.name).toBe(transactions[0].name);
    expect(result.value).toBe(transactions[0].value);
    expect(result.direction).toBe(transactions[0].direction);
    expect(result.when).toEqual(transactions[0].when);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(result.categoriesId).toEqual(
      transactions[0].categories.map((c) => c.id),
    );
    expect(result.description).toEqual(transactions[0].description);
  });

  test("get transaction by id without category", async () => {
    const result = await getAllHandler.execute({
      userId: transactions[1].userId!,
      id: transactions[1].id,
    });
    expect(result.id).toBe(transactions[1].id);
    expect(result.name).toBe(transactions[1].name);
    expect(result.value).toBe(transactions[1].value);
    expect(result.direction).toBe(transactions[1].direction);
    expect(result.when).toEqual(transactions[1].when);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(result.categoriesId).toHaveLength(0);
  });
});

describe("fail", () => {
  test("another user's id", async () => {
    await expect(
      getAllHandler.execute({
        userId: "invalid_user_id",
        id: transactions[0].id,
      }),
    ).rejects.toThrow("cannot access transaction from another user");
  });

  test("invalid transaction id", async () => {
    await expect(
      getAllHandler.execute({
        userId: transactions[0].userId!,
        id: "invalid_id",
      }),
    ).rejects.toThrow("failed on get transaction by id");
  });
});
