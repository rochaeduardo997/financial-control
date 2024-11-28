import { Sequelize } from "sequelize-typescript";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import GetAllCountHandler from "../../../../src/core/usecase/transaction/GetAllCount";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import userSeed from "../../../seed/User.seed";
import ITransactionRepository from "../../../../src/core/repository/TransactionRepository.interface";
import Transaction from "../../../../src/core/entity/Transaction";
import transactionSeed from "../../../seed/Transaction.seed";

let sequelize: Sequelize;
let transactionRepository: ITransactionRepository;
let getAllCountHandler: GetAllCountHandler;
let transactions: Transaction[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  const userRepository = repositoryFactory.user();
  transactionRepository = repositoryFactory.transaction();
  getAllCountHandler = new GetAllCountHandler(transactionRepository);
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
  test("get all transactions total count by user id", async () => {
    const result = await getAllCountHandler.execute({
      userId: transactions[0].userId!,
    });
    expect(result).toBe(2);
  });
});
