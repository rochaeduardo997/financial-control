
import { Sequelize } from "sequelize-typescript";
import instanceSequelize from "../../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../../src/infra/factory/sequelize/Repository.factory";
import Transaction, { TransactionDirection } from "../../../../../src/core/entity/Transaction";
import User from "../../../../../src/core/entity/User";
import Category from "../../../../../src/core/entity/Category";
import userSeed from "../../../../seed/User.seed";
import categorySeed from "../../../../seed/Category.seed";
import transactionSeed from "../../../../seed/Transaction.seed";
import DashboardInOutTotalsHandler from "../../../../../src/core/usecase/transaction/dashboard/DashboardInOutTotals";

let users: User[] = [];
let categories: Category[] = [];
let transactions: Transaction[] = [];
let sequelize: Sequelize;
let dashboardInOutTotalsHandler: DashboardInOutTotalsHandler;

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  const reportRepository = repositoryFactory.report();

  dashboardInOutTotalsHandler = new DashboardInOutTotalsHandler(reportRepository);

  users = userSeed(2);
  categories = categorySeed(2);
  transactions = transactionSeed(4);

  await createUsers(repositoryFactory);
  await createCategories(repositoryFactory);
  await createTransactions(repositoryFactory);
});
afterEach(async () => await sequelize.close());

async function createUsers(rFactory: RepositoryFactory) {
  const userRepository = rFactory.user();
  await userRepository.create(users[0]);
  await userRepository.create(users[1]);
}
async function createCategories(rFactory: RepositoryFactory) {
  const categoryRepository = rFactory.category();
  categories[0].associateUser(users[0].id);
  categories[1].associateUser(users[0].id);
  await categoryRepository.create(categories[0]);
  await categoryRepository.create(categories[1]);
}
async function createTransactions(rFactory: RepositoryFactory) {
  const transactionRepository = rFactory.transaction();
  transactions[0].associateUser(users[0].id);
  transactions[1].associateUser(users[0].id);
  transactions[2].associateUser(users[0].id);
  transactions[3].associateUser(users[1].id);
  transactions[0].associateCategory(categories[0]);
  transactions[0].associateCategory(categories[1]);
  transactions[1].associateCategory(categories[0]);
  transactions[2].associateCategory(categories[1]);
  await transactionRepository.create(transactions[0]);
  await transactionRepository.create(transactions[1]);
  await transactionRepository.create(transactions[2]);
  await transactionRepository.create(transactions[3]);
}

describe("success", () => {
  test("get dashboard in/out totals", async () => {
    const userId = users[0].id;
    const result = await dashboardInOutTotalsHandler.execute({ userId, year: 2022 });
    const expected = {
      in: transactions.reduce((acc, curr) => {
        const isOut = curr.direction === TransactionDirection.OUT;
        const isntSameUser = curr.userId !== userId;
        if(isOut || isntSameUser) return acc;
        else return acc + curr.value;
      }, 0),
      out: transactions.reduce((acc, curr) => {
        const isIn = curr.direction === TransactionDirection.IN;
        const isntSameUser = curr.userId !== userId;
        if(isIn || isntSameUser) return acc;
        else return acc + curr.value;
      }, 0),
    };
    expect(result).toEqual(expected);
  });
});

describe("fail", () => {});
