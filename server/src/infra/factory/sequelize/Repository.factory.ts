import IRepositoryFactory from "../../../core/factory/RepositoryFactory.interface";
import TransactionRepository from "../../repository/sequelize/Transaction.repository";
import CategoryRepository from "../../repository/sequelize/Category.repository";
import UserRepository from "../../repository/sequelize/User.repository";
import { Sequelize } from "sequelize-typescript";
import ReportRepository from "../../repository/sequelize/Report.repository";

export default class RepositoryFactory implements IRepositoryFactory {
  constructor(private sequelize: Sequelize) {}

  transaction() {
    return new TransactionRepository(this.sequelize);
  }
  category() {
    return new CategoryRepository(this.sequelize);
  }
  user() {
    return new UserRepository(this.sequelize);
  }
  report() {
    return new ReportRepository(this.sequelize);
  }
}
