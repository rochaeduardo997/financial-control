import { Sequelize } from "sequelize-typescript";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import DeleteByIdHandler from "../../../../src/core/usecase/transaction/DeleteById";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import userSeed from "../../../seed/User.seed";
import ITransactionRepository from "../../../../src/core/repository/TransactionRepository.interface";
import Transaction from "../../../../src/core/entity/Transaction";
import transactionSeed from "../../../seed/Transaction.seed";

let sequelize: Sequelize;
let transactionRepository: ITransactionRepository;
let deleteByIdHandler: DeleteByIdHandler;
let transactions: Transaction[];

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  const userRepository = repositoryFactory.user();
  transactionRepository = repositoryFactory.transaction();
  deleteByIdHandler = new DeleteByIdHandler(transactionRepository);
  const [user] = userSeed();
  transactions = transactionSeed(2);
  const { id: userId } = await userRepository.create(user);
  transactions[0].associateUser(userId);
  await transactionRepository.create(transactions[0]);
});

afterEach(async () => await sequelize.close());

describe("success", () => {
  test("delete transaction by id", async () => {
    const result = await deleteByIdHandler.execute({
      id: transactions[0].id,
      userId: transactions[0].userId!,
    });
    expect(result).toBe(true);
  });
});

describe("fail", () => {
  test("fail on delete transaction with invalid id", async () => {
    await expect(() =>
      deleteByIdHandler.execute({
        id: "invalid_id",
        userId: transactions[0].userId!,
      }),
    ).rejects.toThrow("failed on delete transaction by id");
  });

  test("fail on delete transaction with invalid user id", async () => {
    await expect(() =>
      deleteByIdHandler.execute({
        id: transactions[0].id,
        userId: "invalid_user_id",
      }),
    ).rejects.toThrow("failed on delete transaction by id");
  });
});
