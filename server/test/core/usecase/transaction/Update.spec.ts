import { Sequelize } from "sequelize-typescript";
import Transaction, {
  TransactionCurrency,
  TransactionDirection,
} from "../../../../src/core/entity/Transaction";
import ITransactionRepository from "../../../../src/core/repository/TransactionRepository.interface";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import categorySeed from "../../../seed/Category.seed";
import transactionSeed from "../../../seed/Transaction.seed";
import userSeed from "../../../seed/User.seed";
import UpdateHandler from "../../../../src/core/usecase/transaction/Update";
import Category from "../../../../src/core/entity/Category";

let sequelize: Sequelize;
let updateHandler: UpdateHandler;
let transactions: Transaction[];
let categories: Category[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  const userRepository = repositoryFactory.user();
  const categoryRepository = repositoryFactory.category();
  const transactionRepository = repositoryFactory.transaction();

  updateHandler = new UpdateHandler(transactionRepository, categoryRepository);

  const [user] = userSeed(1);
  categories = categorySeed(2);
  transactions = transactionSeed(1);

  categories[0].associateUser(user.id);
  categories[1].associateUser(user.id);

  transactions[0].associateUser(user.id);
  transactions[0].associateCategory(categories[0]);

  await userRepository.create(user);
  await categoryRepository.create(categories[0]);
  await categoryRepository.create(categories[1]);
  await transactionRepository.create(transactions[0]);
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("update", async () => {
    const result = await updateHandler.execute({
      userId: transactions[0].userId!,
      id: transactions[0].id,
      name: "new_name",
      value: 99.89,
      direction: TransactionDirection.IN,
      when: new Date("2000-02-02"),
      categoriesId: [categories[1].id],
      currency: TransactionCurrency.USD,
      quantity: 50,
    });
    expect(result.id).toBe(transactions[0].id);
    expect(result.name).toBe("new_name");
    expect(result.value).toBe(99.89);
    expect(result.direction).toBe(TransactionDirection.IN);
    expect(result.when).toEqual(new Date("2000-02-02"));
    expect(result.currency).toBe(TransactionCurrency.USD);
    expect(result.quantity).toBe(50);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(result.categoriesId).toEqual([categories[1].id]);
  });
});

describe("fail", () => {
  test("another user's id", async () => {
    await expect(
      updateHandler.execute({
        userId: "invalid_user_id",
        id: transactions[0].id,
      }),
    ).rejects.toThrow("cannot access transaction from another user");
  });

  test("invalid transaction id", async () => {
    await expect(
      updateHandler.execute({
        userId: transactions[0].userId!,
        id: "invalid_id",
      }),
    ).rejects.toThrow("failed on get transaction by id");
  });
});
