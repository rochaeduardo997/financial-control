import * as dotenv from "dotenv";
import CacheFake from "./infra/cache/cache.fake";
import RedisAdapter from "./infra/cache/RedisAdapter";
import CategoryController from "./infra/controller/category/Category.controller";
import TransactionController from "./infra/controller/transaction/Transaction.controller";
import UserController from "./infra/controller/user/User.controller";
import instanceSequelize from "./infra/database/sequelize/instance";
import RepositoryFactory from "./infra/factory/sequelize/Repository.factory";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import JSONWebTokenAdapter from "./infra/jwt/JSONWebTokenAdapter";
dotenv.config({ path: __dirname + "/./../.env" });

(async () => {
  const nodeEnv = process.env.NODE_ENV || "prod";
  const sequelize = await instanceSequelize();
  const cache = /test/.test(nodeEnv) ? new CacheFake() : new RedisAdapter();
  await cache.connect();
  const jwt = new JSONWebTokenAdapter();

  const repositoryFactory = new RepositoryFactory(sequelize);
  const uRepository = repositoryFactory.user();
  const cRepository = repositoryFactory.category();
  const tRepository = repositoryFactory.transaction();

  const httpAdapter = new ExpressAdapter(cache, jwt);

  new UserController(httpAdapter, uRepository, cache, jwt);
  new CategoryController(httpAdapter, cRepository);
  new TransactionController(httpAdapter, tRepository, cRepository);

  httpAdapter.init();
  httpAdapter.listen();
})();
