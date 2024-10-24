import { Sequelize } from 'sequelize-typescript';
import UserModel from '../../repository/sequelize/models/User.model';
import CategoryModel from '../../repository/sequelize/models/Category.model';
import TransactionModel from '../../repository/sequelize/models/Transaction.model';
import TransactionCategoryRelationModel from '../../repository/sequelize/models/TransactionCategoryRelation.model';

const instanceSequelize = async () => {
  const database = process.env.DB_DB!;
  const username = process.env.DB_USER!;
  const password = process.env.DB_PASSWORD!;
  const host     = process.env.DB_HOST!;
  const nodeEnv  = process.env.NODE_ENV || 'prod';
  let result: Sequelize;

  if(nodeEnv == 'test')
    result = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync:    { force: true },
      database
    });
  else
    result = new Sequelize({
      username, password, database, host,
      dialect: 'postgres',
      logging: false
    });

  console.log(nodeEnv == 'test' ? 'using sqlite' : 'using postgresql');

  result.addModels([
    UserModel,
    CategoryModel,
    TransactionModel, TransactionCategoryRelationModel
  ]);

  await result.sync();

  return result;
}

export default instanceSequelize;
