import { Sequelize } from "sequelize-typescript";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import GetAllHandler from "../../../../src/core/usecase/transaction/GetAll";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import userSeed from "../../../seed/User.seed";
import ITransactionRepository from "../../../../src/core/repository/TransactionRepository.interface";
import Transaction from "../../../../src/core/entity/Transaction";
import transactionSeed from "../../../seed/Transaction.seed";

let sequelize: Sequelize;
let transactionRepository: ITransactionRepository;
let getAllHandler: GetAllHandler;
let transactions: Transaction[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  const userRepository = repositoryFactory.user();
  transactionRepository = repositoryFactory.transaction();
  getAllHandler = new GetAllHandler(transactionRepository);
  const [user, user2] = userSeed(2);
  transactions = transactionSeed(3);
  await userRepository.create(user);
  await userRepository.create(user2);
  transactions[0].associateUser(user.id);
  transactions[1].associateUser(user.id);
  transactions[2].associateUser(user2.id);
  await transactionRepository.create(transactions[0]);
  await transactionRepository.create(transactions[1]);
  await transactionRepository.create(transactions[2]);
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("get all transactions by user id", async () => {
    const result = await getAllHandler.execute({
      userId: transactions[0].userId!,
      page: 1,
    });
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(transactions[0].id);
    expect(result[0].name).toBe(transactions[0].name);
    expect(result[0].value).toBe(transactions[0].value);
    expect(result[0].direction).toBe(transactions[0].direction);
    expect(result[0].when).toEqual(transactions[0].when);
    expect(result[1].id).toBe(transactions[1].id);
    expect(result[1].name).toBe(transactions[1].name);
    expect(result[1].value).toBe(transactions[1].value);
    expect(result[1].direction).toBe(transactions[1].direction);
    expect(result[1].when).toEqual(transactions[1].when);
  });

  test("get empty list with invalid user id", async () => {
    const result = await getAllHandler.execute({ userId: "invalid" });
    expect(result).toHaveLength(0);
  });
});
