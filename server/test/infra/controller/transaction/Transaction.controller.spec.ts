import * as dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import CreateHandler from "../../../../src/core/usecase/transaction/Create";
import CacheFake from "../../../../src/infra/cache/cache.fake";
import ICache from "../../../../src/infra/cache/cache.interface";
import CategoryController from "../../../../src/infra/controller/category/Category.controller";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import ExpressAdapter from "../../../../src/infra/http/ExpressAdapter";
import JWTFake from "../../../../src/infra/jwt/jwt.fake";
import IJWT from "../../../../src/infra/jwt/jwt.interface";
import userSeed from "../../../seed/User.seed";
import TransactionController from "../../../../src/infra/controller/transaction/Transaction.controller";
import ITransactionRepository from "../../../../src/core/repository/TransactionRepository.interface";
import {
  TransactionCurrency,
  TransactionDirection,
} from "../../../../src/core/entity/Transaction";
import Category from "../../../../src/core/entity/Category";
import categorySeed from "../../../seed/Category.seed";
dotenv.config();

let request: TestAgent;
let sequelize: Sequelize;
let cache: ICache;
let jwt: IJWT;
let transactionRepository: ITransactionRepository;
let createHandler: CreateHandler;
let token = "Bearer token";
let categoryId1: string = "";
let categoryId2: string = "";

const input = {
  name: "name",
  value: 10.5,
  direction: TransactionDirection.IN,
  when: new Date("2022-02-02"),
  userId: "userId",
  categoriesId: [] as string[],
  description: "description",
  currency: TransactionCurrency.GPB,
  quantity: 99,
};

beforeEach(async () => {
  cache = new CacheFake();
  jwt = new JWTFake();
  await cache.listSet(`session:id1`, "token");
  await cache.listSet(`session:id2`, "token");
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  const categoryRepository = repositoryFactory.category();
  transactionRepository = repositoryFactory.transaction();
  const httpAdapter = new ExpressAdapter(cache, jwt);
  new CategoryController(httpAdapter, categoryRepository);
  new TransactionController(
    httpAdapter,
    transactionRepository,
    categoryRepository,
  );
  httpAdapter.init();
  request = supertest(httpAdapter.app);
  const userRepository = repositoryFactory.user();
  const [user] = userSeed();
  const { id: userId } = await userRepository.create(user);
  createHandler = new CreateHandler(transactionRepository, categoryRepository);
  const categories = categorySeed(2);
  categories[0].associateUser(userId);
  categories[1].associateUser(userId);
  const { id: _categoryId1 } = await categoryRepository.create(categories[0]);
  const { id: _categoryId2 } = await categoryRepository.create(categories[1]);
  categoryId1 = _categoryId1;
  categoryId2 = _categoryId2;
  input.userId = userId;
  input.categoriesId = [];
});
afterEach(() => sequelize.close());

describe("success", () => {
  test("create without categories", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions")
      .set("Authorization", token)
      .send(input);
    expect(body?.result?.id).toBeDefined();
    expect(body?.result?.name).toBe(input.name);
    expect(body?.result?.value).toBe(input.value);
    expect(body?.result?.direction).toBe(input.direction);
    expect(body?.result?.when).toEqual(input.when.toISOString());
    expect(body?.result?.createdAt).toBeDefined();
    expect(body?.result?.updatedAt).toBeDefined();
    expect(body?.result?.categoriesId).toHaveLength(0);
    expect(body?.result?.description).toBe(input.description);
    expect(status).toBe(201);
  });

  test("create with categories", async () => {
    input.categoriesId = [categoryId1];
    const { status, body } = await request
      .post("/api/v1/transactions")
      .set("Authorization", token)
      .send(input);
    expect(body?.result?.id).toBeDefined();
    expect(body?.result?.name).toBe(input.name);
    expect(body?.result?.value).toBe(input.value);
    expect(body?.result?.direction).toBe(input.direction);
    expect(body?.result?.when).toEqual(input.when.toISOString());
    expect(body?.result?.createdAt).toBeDefined();
    expect(body?.result?.updatedAt).toBeDefined();
    expect(body?.result?.categoriesId).toHaveLength(1);
    expect(body?.result?.categoriesId[0]).toBe(input.categoriesId[0]);
    expect(body?.result?.description).toBe(input.description);
    expect(body?.result?.currency).toBe(input.currency);
    expect(body?.result?.quantity).toBe(input.quantity);
    expect(status).toBe(201);
  });

  test("find all", async () => {
    const { id } = await createHandler.execute({ ...input });
    const { status, body } = await request
      .get("/api/v1/transactions/all")
      .set("Authorization", token);
    expect(body?.result?.[0].id).toBe(id);
    expect(body?.result?.[0].name).toBe(input.name);
    expect(body?.result?.[0].value).toBe(input.value);
    expect(body?.result?.[0].direction).toBe(input.direction);
    expect(body?.result?.[0].when).toEqual(input.when.toISOString());
    expect(body?.result?.[0].currency).toBe(input.currency);
    expect(body?.result?.[0].quantity).toBe(input.quantity);
    expect(status).toBe(200);
  });

  test("find all count", async () => {
    const { id } = await createHandler.execute({ ...input });
    const { status, body } = await request
      .get("/api/v1/transactions/count/all")
      .set("Authorization", token);
    expect(body?.result).toBe(1);
    expect(status).toBe(200);
  });

  test("find by id without category", async () => {
    const { id } = await createHandler.execute({ ...input });
    const { status, body } = await request
      .get(`/api/v1/transactions/${id}`)
      .set("Authorization", token);
    expect(body?.result?.id).toBe(id);
    expect(body?.result?.name).toBe(input.name);
    expect(body?.result?.value).toBe(input.value);
    expect(body?.result?.direction).toBe(input.direction);
    expect(body?.result?.when).toEqual(input.when.toISOString());
    expect(body?.result?.createdAt).toBeDefined();
    expect(body?.result?.updatedAt).toBeDefined();
    expect(body?.result?.categoriesId).toHaveLength(0);
    expect(body?.result?.description).toBe(input.description);
    expect(body?.result?.currency).toBe(input.currency);
    expect(body?.result?.quantity).toBe(input.quantity);
    expect(status).toBe(200);
  });

  test("find by id with category", async () => {
    input.categoriesId = [categoryId1];
    const { id } = await createHandler.execute({ ...input });
    const { status, body } = await request
      .get(`/api/v1/transactions/${id}`)
      .set("Authorization", token);
    expect(body?.result?.id).toBe(id);
    expect(body?.result?.name).toBe(input.name);
    expect(body?.result?.value).toBe(input.value);
    expect(body?.result?.direction).toBe(input.direction);
    expect(body?.result?.when).toEqual(input.when.toISOString());
    expect(body?.result?.createdAt).toBeDefined();
    expect(body?.result?.updatedAt).toBeDefined();
    expect(body?.result?.categoriesId).toHaveLength(1);
    expect(body?.result?.categoriesId[0]).toBe(categoryId1);
    expect(body?.result?.description).toBe(input.description);
    expect(body?.result?.currency).toBe(input.currency);
    expect(body?.result?.quantity).toBe(input.quantity);
    expect(status).toBe(200);
  });

  test("update by id with all fields", async () => {
    input.categoriesId = [categoryId1];
    const { id } = await createHandler.execute({ ...input });
    const updateInput = {
      name: "new_name",
      value: 99.98,
      direction: TransactionDirection.OUT,
      when: new Date("2010-02-02"),
      categoriesId: [categoryId2],
      description: "description_updated",
      currency: TransactionCurrency.BRL,
      quantity: 10,
    };
    const { status, body } = await request
      .put(`/api/v1/transactions/${id}`)
      .set("Authorization", token)
      .send(updateInput);
    expect(body?.result?.id).toBe(id);
    expect(body?.result?.name).toBe(updateInput.name);
    expect(body?.result?.value).toBe(updateInput.value);
    expect(body?.result?.direction).toBe(updateInput.direction);
    expect(body?.result?.when).toEqual(updateInput.when.toISOString());
    expect(body?.result?.createdAt).toBeDefined();
    expect(body?.result?.updatedAt).toBeDefined();
    expect(body?.result?.categoriesId).toHaveLength(1);
    expect(body?.result?.categoriesId[0]).toBe(categoryId2);
    expect(body?.result?.description).toBe(updateInput.description);
    expect(body?.result?.currency).toBe(updateInput.currency);
    expect(body?.result?.quantity).toBe(updateInput.quantity);
    expect(status).toBe(200);
  });

  test("update by id only adding categories", async () => {
    const { id } = await createHandler.execute({ ...input });
    const updateInput = { categoriesId: [categoryId1, categoryId2] };
    const { status, body } = await request
      .put(`/api/v1/transactions/${id}`)
      .set("Authorization", token)
      .send(updateInput);
    expect(body?.result?.id).toBe(id);
    expect(body?.result?.name).toBe(input.name);
    expect(body?.result?.value).toBe(input.value);
    expect(body?.result?.direction).toBe(input.direction);
    expect(body?.result?.when).toEqual(input.when.toISOString());
    expect(body?.result?.createdAt).toBeDefined();
    expect(body?.result?.updatedAt).toBeDefined();
    expect(body?.result?.categoriesId).toEqual([categoryId1, categoryId2]);
    expect(body?.result?.description).toBe(input.description);
    expect(body?.result?.currency).toBe(input.currency);
    expect(body?.result?.quantity).toBe(input.quantity);
    expect(status).toBe(200);
  });

  test("update by id removing all categories", async () => {
    const { id } = await createHandler.execute({ ...input });
    const updateInput = { categoriesId: [] };
    const { status, body } = await request
      .put(`/api/v1/transactions/${id}`)
      .set("Authorization", token)
      .send(updateInput);
    expect(body?.result?.id).toBe(id);
    expect(body?.result?.name).toBe(input.name);
    expect(body?.result?.value).toBe(input.value);
    expect(body?.result?.direction).toBe(input.direction);
    expect(body?.result?.when).toEqual(input.when.toISOString());
    expect(body?.result?.createdAt).toBeDefined();
    expect(body?.result?.updatedAt).toBeDefined();
    expect(body?.result?.categoriesId).toHaveLength(0);
    expect(body?.result?.description).toBe(input.description);
    expect(body?.result?.currency).toBe(input.currency);
    expect(body?.result?.quantity).toBe(input.quantity);
    expect(status).toBe(200);
  });

  test("delete by id", async () => {
    const { id } = await createHandler.execute({ ...input });
    const { status, body } = await request
      .delete(`/api/v1/transactions/${id}`)
      .set("Authorization", token);
    expect(body.result).toBe(true);
    expect(status).toBe(200);
    expect(await transactionRepository.getAllBy(input.userId)).toHaveLength(0);
  });
});

describe("fail", () => {
  test("fail on create without name", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions")
      .set("Authorization", token)
      .send({ ...input, name: undefined });
    expect(body?.result).toBe("name must be provided");
    expect(status).toBe(400);
  });

  test("fail on create without value", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions")
      .set("Authorization", token)
      .send({ ...input, value: undefined });
    expect(body?.result).toBe("value must be provided");
    expect(status).toBe(400);
  });

  test("fail on create without direction", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions")
      .set("Authorization", token)
      .send({ ...input, direction: undefined });
    expect(body?.result).toBe("direction must be provided");
    expect(status).toBe(400);
  });

  test("fail on create with invalid direction value", async () => {
    const { status, body } = await request
      .post("/api/v1/transactions")
      .set("Authorization", token)
      .send({ ...input, direction: "invalid_direction_value" });
    expect(body?.result).toBe("direction must be in/out");
    expect(status).toBe(400);
  });

  test("fail on find by invalid id", async () => {
    const { status, body } = await request
      .get(`/api/v1/transactions/invalid_id`)
      .set("Authorization", token);
    expect(body?.result).toBe("failed on get transaction by id");
    expect(status).toBe(404);
  });

  test("fail on update by invalid id", async () => {
    const { status, body } = await request
      .put(`/api/v1/transactions/invalid_id`)
      .set("Authorization", token);
    expect(body?.result).toBe("failed on get transaction by id");
    expect(status).toBe(404);
  });

  test("fail on delete by invalid id", async () => {
    const { status, body } = await request
      .delete(`/api/v1/transactions/invalid_id`)
      .set("Authorization", token);
    expect(body?.result).toBe("failed on delete transaction by id");
    expect(status).toBe(400);
  });
});
