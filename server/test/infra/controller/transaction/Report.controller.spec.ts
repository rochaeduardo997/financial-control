import * as dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import Category from "../../../../src/core/entity/Category";
import Transaction from "../../../../src/core/entity/Transaction";
import User from "../../../../src/core/entity/User";
import ITransactionRepository from "../../../../src/core/repository/TransactionRepository.interface";
import CacheFake from "../../../../src/infra/cache/cache.fake";
import ICache from "../../../../src/infra/cache/cache.interface";
import ReportController from "../../../../src/infra/controller/transaction/Report.controller";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import ExpressAdapter from "../../../../src/infra/http/ExpressAdapter";
import JWTFake from "../../../../src/infra/jwt/jwt.fake";
import IJWT from "../../../../src/infra/jwt/jwt.interface";
import categorySeed from "../../../seed/Category.seed";
import transactionSeed from "../../../seed/Transaction.seed";
import userSeed from "../../../seed/User.seed";
dotenv.config();

let request: TestAgent;
let sequelize: Sequelize;
let cache: ICache;
let jwt: IJWT;
let token = "Bearer token";
let users: User[] = [];
let categories: Category[] = [];
let transactions: Transaction[] = [];

const input = { userId: "userId" };

beforeEach(async () => {
  cache = new CacheFake();
  jwt = new JWTFake();
  await cache.listSet(`session:id1`, "token");
  await cache.listSet(`session:id2`, "token");
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  const reportRepository = repositoryFactory.report();
  const httpAdapter = new ExpressAdapter(cache, jwt);
  new ReportController(httpAdapter, reportRepository);
  httpAdapter.init();
  request = supertest(httpAdapter.app);
  users = userSeed(2);
  categories = categorySeed(2);
  transactions = transactionSeed(4);

  await createUsers(repositoryFactory);
  await createCategories(repositoryFactory);
  await createTransactions(repositoryFactory);
});
afterEach(() => sequelize.close());

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
  test("find all count transactions filtering only by date(start and end)", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions/report/count/all")
      .set("Authorization", token)
      .send({
        ...input,
        start: new Date("2021-01-01"),
        end: new Date("2023-01-01"),
      });
    expect(body?.result).toHaveLength(3);
    expect(status).toBe(200);
  });

  test("find all transactions filtering only by date(start and end)", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions/report")
      .set("Authorization", token)
      .send({
        ...input,
        start: new Date("2021-01-01"),
        end: new Date("2023-01-01"),
      });
    expect(body?.result).toHaveLength(3);
    expect(body?.result?.[0].id).toBeDefined();
    expect(body?.result?.[0].name).toBe(transactions[0].name);
    expect(body?.result?.[0].value).toBe(transactions[0].value);
    expect(body?.result?.[0].direction).toBe(transactions[0].direction);
    expect(body?.result?.[0].when).toEqual(transactions[0].when.toISOString());
    expect(body?.result?.[0].categoriesId).toEqual([
      transactions[0].categories[0].id,
      transactions[0].categories[1].id,
    ]);
    expect(body?.result?.[1].id).toBeDefined();
    expect(body?.result?.[1].name).toBe(transactions[1].name);
    expect(body?.result?.[1].value).toBe(transactions[1].value);
    expect(body?.result?.[1].direction).toBe(transactions[1].direction);
    expect(body?.result?.[1].when).toEqual(transactions[1].when.toISOString());
    expect(body?.result?.[1].categoriesId).toEqual([
      transactions[1].categories[0].id,
    ]);
    expect(body?.result?.[2].id).toBeDefined();
    expect(body?.result?.[2].name).toBe(transactions[2].name);
    expect(body?.result?.[2].value).toBe(transactions[2].value);
    expect(body?.result?.[2].direction).toBe(transactions[2].direction);
    expect(body?.result?.[2].when).toEqual(transactions[2].when.toISOString());
    expect(body?.result?.[2].categoriesId).toEqual([
      transactions[2].categories[0].id,
    ]);
    expect(status).toBe(200);
  });

  test("find all transactions filtering by category", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions/report")
      .set("Authorization", token)
      .send({
        ...input,
        start: new Date("2021-01-01"),
        end: new Date("2023-01-01"),
        categoriesId: [categories[0].id],
      });
    expect(body?.result).toHaveLength(2);
    expect(body?.result?.[0].id).toBeDefined();
    expect(body?.result?.[1].id).toBeDefined();
    expect(status).toBe(200);
  });

  test("find all transactions filtering by value between", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions/report")
      .set("Authorization", token)
      .send({
        ...input,
        start: new Date("2021-01-01"),
        end: new Date("2023-01-01"),
        valueBetween: [10, 12],
      });
    expect(body?.result).toHaveLength(1);
    expect(body?.result?.[0].id).toBeDefined();
    expect(status).toBe(200);
  });

  test("find all transactions filtering by names", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions/report")
      .set("Authorization", token)
      .send({
        ...input,
        start: new Date("2021-01-01"),
        end: new Date("2023-01-01"),
        names: ["NAME1"],
      });
    expect(body?.result).toHaveLength(1);
    expect(body?.result?.[0].id).toBeDefined();
    expect(status).toBe(200);
  });

  test("find empty registers when filtering by dates that doesnt has register", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions/report")
      .set("Authorization", token)
      .send({
        ...input,
        start: new Date(),
        end: new Date(),
      });
    expect(body?.result).toHaveLength(0);
    expect(status).toBe(200);
  });
});
