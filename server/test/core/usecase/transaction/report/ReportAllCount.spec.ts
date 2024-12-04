import { Sequelize } from "sequelize-typescript";
import instanceSequelize from "../../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../../src/infra/factory/sequelize/Repository.factory";
import Transaction from "../../../../../src/core/entity/Transaction";
import User from "../../../../../src/core/entity/User";
import Category from "../../../../../src/core/entity/Category";
import userSeed from "../../../../seed/User.seed";
import categorySeed from "../../../../seed/Category.seed";
import transactionSeed from "../../../../seed/Transaction.seed";
import ReportAllCountHandler from "../../../../../src/core/usecase/transaction/report/ReportAllCount";
import { TFilters } from "../../../../../src/core/repository/ReportRepository.interface";

let users: User[] = [];
let categories: Category[] = [];
let transactions: Transaction[] = [];
let sequelize: Sequelize;
let reportAllCountHandler: ReportAllCountHandler;

beforeEach(async () => {
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  const reportRepository = repositoryFactory.report();

  reportAllCountHandler = new ReportAllCountHandler(reportRepository);

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
  test("find all transactions filtering only by date(start and end)", async () => {
    const filters: TFilters = {
      start: new Date("2021-01-01"),
      end: new Date("2023-01-01"),
    };
    const result = await reportAllCountHandler.execute({
      userId: users[0].id,
      ...filters,
    });
    expect(result).toBe(3);
  });
});

describe("fail", () => {});
