import { Sequelize } from "sequelize-typescript";
import User from '../../../src/core/entity/User';
import IUserRepository from '../../../src/core/repository/UserRepository.interface';
import userSeed from '../../seed/User.seed';
import Category from '../../../src/core/entity/Category';
import ICategoryRepository from '../../../src/core/repository/CategoryRepository.interface';
import categorySeed from '../../seed/Category.seed';
import Transaction from '../../../src/core/entity/Transaction';
import ITransactionRepository from '../../../src/core/repository/TransactionRepository.interface';
import transactionSeed from '../../seed/Transaction.seed';
import instanceSequelize from '../../../src/infra/database/sequelize/instance';
import RepositoryFactory from '../../../src/infra/factory/sequelize/Repository.factory';

let users: User[] = [];
let categories: Category[] = [];
let transactions: Transaction[] = [];
let sequelize: Sequelize;
let categoryRepository: ICategoryRepository;
let userRepository: IUserRepository;
let transactionRepository: ITransactionRepository;

beforeEach(async () => {
  users = userSeed(2);
  categories = categorySeed(2);
  transactions = transactionSeed(2);
  sequelize = await instanceSequelize();
  const repositoryFactory = new RepositoryFactory(sequelize);
  categoryRepository = repositoryFactory.category();
  userRepository = repositoryFactory.user();
  transactionRepository = repositoryFactory.transaction();
  await createUsers();
  await createCategories();
  transactions[0].associateUser(users[0].id);
  transactions[1].associateUser(users[0].id);
});
afterEach(async () => await sequelize.close());

async function createUsers(){
  await userRepository.create(users[0]);
  await userRepository.create(users[1]);
}

async function createCategories(){
  categories[0].associateUser(users[0].id);
  categories[1].associateUser(users[0].id);
  await categoryRepository.create(categories[0]);
  await categoryRepository.create(categories[1]);
}

describe('success', () => {
  test('create new transaction without category', async () => {
    const result = await transactionRepository.create(transactions[0]);
    expect(result.id).toBe(transactions[0].id);
    expect(result.name).toBe(transactions[0].name);
    expect(result.value).toBe(transactions[0].value);
    expect(result.direction).toBe(transactions[0].direction);
    expect(result.when).toEqual(transactions[0].when);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(result.categories).toHaveLength(0);
    expect(result.userId).toBe(transactions[0].userId);
  });

  test('create new transaction with associated categories', async () => {
    transactions[0].associateCategory(categories[0]);
    transactions[0].associateCategory(categories[1]);
    transactions[1].associateCategory(categories[0]);
    transactions[1].associateCategory(categories[1]);
    const result = await transactionRepository.create(transactions[0]);
    expect(result.id).toBe(transactions[0].id);
    expect(result.name).toBe(transactions[0].name);
    expect(result.value).toBe(transactions[0].value);
    expect(result.direction).toBe(transactions[0].direction);
    expect(result.when).toEqual(transactions[0].when);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(result.categories[0]).toEqual(categories[0]);
    expect(result.categories[1]).toEqual(categories[1]);
    expect(result.userId).toBe(transactions[0].userId);
  });

  test('find by id', async () => {
    transactions[0].associateCategory(categories[0]);
    transactions[0].associateCategory(categories[1]);
    const transaction = await transactionRepository.create(transactions[0]);
    const result = await transactionRepository.getBy(transaction.id, users[0].id);
    expect(result).toEqual(transaction);
  });

  test('find all count', async () => {
    await transactionRepository.create(transactions[0]);
    await transactionRepository.create(transactions[1]);
    const result = await transactionRepository.getAllCountBy(users[0].id);
    expect(result).toBe(2);
  });

  test('find all with categories', async () => {
    transactions[0].associateCategory(categories[0]);
    transactions[0].associateCategory(categories[1]);
    const tr1 = await transactionRepository.create(transactions[0]);
    transactions[1].associateCategory(categories[0]);
    const tr2 = await transactionRepository.create(transactions[1]);
    const result = await transactionRepository.getAllBy(users[0].id, 1);
    expect(result[0]).toEqual(tr1);
    expect(result[1]).toEqual(tr2);
  });

  test('find all without categories', async () => {
    const tr1 = await transactionRepository.create(transactions[0]);
    const tr2 = await transactionRepository.create(transactions[1]);
    const result = await transactionRepository.getAllBy(users[0].id, 1);
    expect(result[0]).toEqual(tr1);
    expect(result[1]).toEqual(tr2);
  });

  test('empty array when find all without transaction registered', async () => {
    const result = await transactionRepository.getAllBy(users[0].id, 0);
    expect(result).toHaveLength(0);
  });

  test('update transaction without change categories', async () => {
    transactions[0].associateCategory(categories[0]);
    await transactionRepository.create(transactions[0]);
    const result = await transactionRepository.updateBy(transactions[0].id, transactions[1]);
    expect(result.id).toBe(transactions[0].id);
    expect(result.name).toBe(transactions[1].name);
    expect(result.value).toBe(transactions[1].value);
    expect(result.direction).toBe(transactions[1].direction);
    expect(result.when).toEqual(transactions[1].when);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(result.categories).toHaveLength(0);
    expect(result.userId).toBe(transactions[1].userId);
  });

  test('update transaction changing categories', async () => {
    transactions[0].associateCategory(categories[0]);
    transactions[1].associateCategory(categories[0]);
    transactions[1].associateCategory(categories[1]);
    await transactionRepository.create(transactions[0]);
    const result = await transactionRepository.updateBy(transactions[0].id, transactions[1]);
    expect(result.categories).toEqual([ categories[0], categories[1] ]);
  });

  test('delete category by id', async () => {
    await transactionRepository.create(transactions[0]);
    await transactionRepository.create(transactions[1]);
    const deleteResult = await transactionRepository.deleteBy(transactions[0].id, transactions[0].userId!);
    expect(deleteResult).toBeTruthy();
    const getAllResult = await transactionRepository.getAllBy(users[0].id);
    expect(getAllResult).toHaveLength(1);
  });
});

describe('fail', () => {
  test('create that already exists', async () => {
    await transactionRepository.create(transactions[0]);
    await expect(() => transactionRepository.create(transactions[0]))
      .rejects
      .toThrow('id must be unique');
  });

  test('find by invalid id', async () => {
    await expect(() => transactionRepository.getBy('invalid_id', users[0].id))
      .rejects
      .toThrow('failed on get transaction by id');
  });

  test('find by from another user', async () => {
    transactions[0].associateUser(users[0].id);
    transactions[1].associateUser(users[1].id);
    await transactionRepository.create(transactions[0]);
    await transactionRepository.create(transactions[1]);
    await expect(() => transactionRepository.getBy(transactions[1].id, users[0].id))
      .rejects
      .toThrow('cannot access transaction from another user');
  });

  test('update transaction with invalid id', async () => {
    await expect(() => transactionRepository.updateBy('invalid_id', transactions[0]))
      .rejects
      .toThrow('failed on get transaction by id');
  });

  test('update transaction from another user', async () => {
    transactions[0].associateUser(users[0].id);
    transactions[1].associateUser(users[1].id);
    await transactionRepository.create(transactions[0]);
    await transactionRepository.create(transactions[1]);
    await expect(() => transactionRepository.updateBy(transactions[1].id, transactions[0]))
      .rejects
      .toThrow('cannot access transaction from another user');
  });

  test('delete transaction by invalid id', async () => {
    await transactionRepository.create(transactions[0]);
    await transactionRepository.create(transactions[1]);
    await expect(() => transactionRepository.deleteBy('invalid_id', 'invalid_user_id'))
      .rejects
      .toThrow('failed on delete transaction by id');
    const getAllResult = await transactionRepository.getAllBy(users[0].id);
    expect(getAllResult).toHaveLength(2);
  });
});

