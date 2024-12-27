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
import UserSeed from "../test/seed/User.seed";
import CategorySeed from "../test/seed/Category.seed";
import TransactionSeed from "../test/seed/Transaction.seed";
import CreateHandler from "./core/usecase/user/Create";
import LoginHandler from "./core/usecase/user/Login";
import {
  TransactionCurrency,
  TransactionDirection,
} from "./core/entity/Transaction";
import ReportController from "./infra/controller/transaction/Report.controller";
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
  const rRepository = repositoryFactory.report();

  const httpAdapter = new ExpressAdapter(cache, jwt);

  new UserController(httpAdapter, uRepository, cache, jwt);
  new CategoryController(httpAdapter, cRepository);
  new TransactionController(httpAdapter, tRepository, cRepository);
  new ReportController(httpAdapter, rRepository);

  if (nodeEnv !== "prod") {
    const [user] = UserSeed(1);
    const categories = CategorySeed(5);
    const transactions = TransactionSeed(50);
    try {
      const createHandler = new CreateHandler(uRepository);
      const { id } = await createHandler.execute(user);
      for (const c of categories) {
        c.associateUser(id);
        await cRepository.create(c);
      }
      for (const t of transactions) {
        t.associateUser(id);
        t.associateCategory(categories[Math.floor(Math.random() * 5)]);
        t.associateCategory(categories[Math.floor(Math.random() * 5)]);
        t.direction = Math.floor(Math.random() * 2)
          ? TransactionDirection.OUT
          : TransactionDirection.IN;
        t.currency = Math.floor(Math.random() * 2)
          ? TransactionCurrency.BRL
          : TransactionCurrency.USD;
        await tRepository.create(t);
      }
      const loginHandler = new LoginHandler(uRepository, jwt, cache);
      const { token } = await loginHandler.execute({
        login: user.username,
        password: user.password,
      });
      console.log({
        login: user.username,
        password: user.password,
      });
    } catch (_) {}
  }

  httpAdapter.init();
  httpAdapter.listen();
})();
