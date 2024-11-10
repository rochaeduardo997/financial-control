import * as dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import ICategoryRepository from "../../../../src/core/repository/CategoryRepository.interface";
import CreateHandler from "../../../../src/core/usecase/category/Create";
import CacheFake from "../../../../src/infra/cache/cache.fake";
import ICache from "../../../../src/infra/cache/cache.interface";
import CategoryController from "../../../../src/infra/controller/category/Category.controller";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import ExpressAdapter from "../../../../src/infra/http/ExpressAdapter";
import JWTFake from "../../../../src/infra/jwt/jwt.fake";
import IJWT from "../../../../src/infra/jwt/jwt.interface";
import userSeed from "../../../seed/User.seed";
dotenv.config();

let request: TestAgent;
let sequelize: Sequelize;
let cache: ICache;
let jwt: IJWT;
let categoryRepository: ICategoryRepository;
let createHandler: CreateHandler;
let token = "Bearer token";

const input = {
  name: "name",
  description: "description",
  userId: "userId",
};

beforeEach(async () => {
  cache = new CacheFake();
  jwt = new JWTFake();
  await cache.listSet(`session:id1`, "token");
  await cache.listSet(`session:id2`, "token");
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  categoryRepository = repositoryFactory.category();
  const httpAdapter = new ExpressAdapter(cache, jwt);
  new CategoryController(httpAdapter, categoryRepository);
  httpAdapter.init();
  request = supertest(httpAdapter.app);
  const userRepository = repositoryFactory.user();
  const [user] = userSeed();
  const { id: userId } = await userRepository.create(user);
  input.userId = userId;
  createHandler = new CreateHandler(categoryRepository);
});
afterEach(() => sequelize.close());

describe("success", () => {
  test("create", async () => {
    const { status, body } = await request
      .post("/api/v1/categories")
      .set("Authorization", token)
      .send(input);
    expect(body?.result?.id).toBeDefined();
    expect(body?.result?.name).toBe(input.name);
    expect(body?.result?.description).toBe(input.description);
    expect(status).toBe(201);
  });

  test("find all", async () => {
    const { id } = await createHandler.execute({ ...input });
    const { status, body } = await request
      .get("/api/v1/categories/all")
      .set("Authorization", token);
    expect(body.result?.[0].id).toBe(id);
    expect(body.result?.[0].name).toBe(input.name);
    expect(body.result?.[0].description).toBe(input.description);
    expect(status).toBe(200);
  });

  test("find by id", async () => {
    const { id } = await createHandler.execute({ ...input });
    const { status, body } = await request
      .get(`/api/v1/categories/${id}`)
      .set("Authorization", token);
    expect(body.result?.id).toBe(id);
    expect(body.result?.name).toBe(input.name);
    expect(body.result?.description).toBe(input.description);
    expect(status).toBe(200);
  });

  test("update by id with all fields", async () => {
    const { id } = await createHandler.execute({ ...input });
    const updateInput = {
      name: "name_updated",
      description: "description_updated",
    };
    const { status, body } = await request
      .put(`/api/v1/categories/${id}`)
      .set("Authorization", token)
      .send(updateInput);
    expect(body.result?.id).toBe(id);
    expect(body.result?.name).toBe(updateInput.name);
    expect(body.result?.description).toBe(updateInput.description);
    expect(status).toBe(200);
  });

  test("update by id with without name", async () => {
    const { id } = await createHandler.execute({ ...input });
    const updateInput = { description: "description_updated" };
    const { status, body } = await request
      .put(`/api/v1/categories/${id}`)
      .set("Authorization", token)
      .send(updateInput);
    expect(body.result?.id).toBe(id);
    expect(body.result?.name).toBe(input.name);
    expect(body.result?.description).toBe(updateInput.description);
    expect(status).toBe(200);
  });

  test("update by id with without description", async () => {
    const { id } = await createHandler.execute({ ...input });
    const updateInput = { name: "name_updated" };
    const { status, body } = await request
      .put(`/api/v1/categories/${id}`)
      .set("Authorization", token)
      .send(updateInput);
    expect(body.result?.id).toBe(id);
    expect(body.result?.name).toBe(updateInput.name);
    expect(body.result?.description).toBeFalsy();
    expect(status).toBe(200);
  });

  test("delete by id", async () => {
    const { id } = await createHandler.execute({ ...input });
    const { status, body } = await request
      .delete(`/api/v1/categories/${id}`)
      .set("Authorization", token);
    expect(body.result).toBe(true);
    expect(status).toBe(200);
    expect(await categoryRepository.getAllBy(input.userId)).toHaveLength(0);
  });
});

describe("fail", () => {
  test("fail on create without name", async () => {
    const { status, body } = await request
      .post("/api/v1/categories")
      .set("Authorization", token)
      .send({ ...input, name: undefined });
    expect(body?.result).toBe("name must be provided");
    expect(status).toBe(400);
  });

  test("fail on find by invalid id", async () => {
    const { status, body } = await request
      .get(`/api/v1/categories/invalid_id`)
      .set("Authorization", token);
    expect(body?.result).toBe("failed on get category by id");
    expect(status).toBe(404);
  });

  test("fail on update by invalid id", async () => {
    const { status, body } = await request
      .put(`/api/v1/categories/invalid_id`)
      .set("Authorization", token);
    expect(body?.result).toBe("failed on get category by id");
    expect(status).toBe(404);
  });

  test("fail on delete by invalid id", async () => {
    const { status, body } = await request
      .delete(`/api/v1/categories/invalid_id`)
      .set("Authorization", token);
    expect(body?.result).toBe("failed on delete category by id");
    expect(status).toBe(400);
  });
});
