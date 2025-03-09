import * as dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import Category from "../../../../src/core/entity/Category";
import Transaction, {
  TransactionCurrency, TransactionDirection
} from "../../../../src/core/entity/Transaction";
import User from "../../../../src/core/entity/User";
import CacheFake from "../../../../src/infra/cache/cache.fake";
import ICache from "../../../../src/infra/cache/cache.interface";
import DashboardController from "../../../../src/infra/controller/transaction/Dashboard.controller";
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
  new DashboardController(httpAdapter, reportRepository);
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
    const year = 2022;
    const { status, body } = await request
      .get(`/api/v1/dashboard/in_out?year=${year}`)
      .set("Authorization", token)
    const userId = users[0].id;
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
    expect(body?.result).toEqual(expected);
    expect(status).toBe(200);
  });
});
