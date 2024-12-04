import { Sequelize } from "sequelize-typescript";
import Category from "../../../src/core/entity/Category";
import Transaction from "../../../src/core/entity/Transaction";
import User from "../../../src/core/entity/User";
import instanceSequelize from "../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../src/infra/factory/sequelize/Repository.factory";
import categorySeed from "../../seed/Category.seed";
import transactionSeed from "../../seed/Transaction.seed";
import userSeed from "../../seed/User.seed";
import IReportRepository, {
  TFilters,
} from "../../../src/core/repository/ReportRepository.interface";

let users: User[] = [];
let categories: Category[] = [];
let transactions: Transaction[] = [];
let sequelize: Sequelize;
let reportRepository: IReportRepository;

beforeEach(async () => {
  users = userSeed(2);
  categories = categorySeed(2);
  transactions = transactionSeed(4);
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  reportRepository = repositoryFactory.report();
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
    const result = await reportRepository.getAllCountBy(users[0].id, filters);
    expect(result).toBe(3);
  });

  test("find all transactions filtering only by date(start and end)", async () => {
    const filters: TFilters = {
      start: new Date("2021-01-01"),
      end: new Date("2023-01-01"),
    };
    const result = await reportRepository.getAllBy(users[0].id, filters);
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(transactions[0].id);
    expect(result[0].name).toBe(transactions[0].name);
    expect(result[0].value).toBe(transactions[0].value);
    expect(result[0].direction).toBe(transactions[0].direction);
    expect(result[0].when).toEqual(transactions[0].when);
    expect(result[0].categories).toEqual(transactions[0].categories);
    expect(result[0].description).toBe(transactions[0].description);
    expect(result[1].id).toBe(transactions[1].id);
    expect(result[1].name).toBe(transactions[1].name);
    expect(result[1].value).toBe(transactions[1].value);
    expect(result[1].direction).toBe(transactions[1].direction);
    expect(result[1].when).toEqual(transactions[1].when);
    expect(result[1].categories).toEqual(transactions[1].categories);
    expect(result[1].description).toBe(transactions[1].description);
    expect(result[2].id).toBe(transactions[2].id);
    expect(result[2].name).toBe(transactions[2].name);
    expect(result[2].value).toBe(transactions[2].value);
    expect(result[2].direction).toBe(transactions[2].direction);
    expect(result[2].when).toEqual(transactions[2].when);
    expect(result[2].categories).toEqual(transactions[2].categories);
    expect(result[2].description).toBe(transactions[2].description);
  });

  test("find all transactions filtering by category", async () => {
    const filters: TFilters = {
      start: new Date("2021-01-01"),
      end: new Date("2023-01-01"),
      categoriesId: [categories[0].id],
    };
    const result = await reportRepository.getAllBy(users[0].id, filters);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(transactions[0].id);
    expect(result[1].id).toBe(transactions[1].id);
  });

  test("find all transactions filtering by value between", async () => {
    const filters: TFilters = {
      start: new Date("2021-01-01"),
      end: new Date("2023-01-01"),
      valueBetween: [10, 12],
    };
    const result = await reportRepository.getAllBy(users[0].id, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(transactions[0].id);
  });

  test("find all transactions filtering by names", async () => {
    const filters: TFilters = {
      start: new Date("2021-01-01"),
      end: new Date("2023-01-01"),
      names: ["NAME1"],
    };
    const result = await reportRepository.getAllBy(users[0].id, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(transactions[0].id);
  });

  test("find empty registers when filtering by dates that doesnt has register", async () => {
    const filters: TFilters = {
      start: new Date(),
      end: new Date(),
      names: ["NAME1"],
    };
    const result = await reportRepository.getAllBy(users[0].id, filters);
    expect(result).toHaveLength(0);
  });
});

describe("fail", () => {});
