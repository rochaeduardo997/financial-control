import { Sequelize } from "sequelize-typescript";
import User from '../../../src/core/entity/User';
import IUserRepository from '../../../src/core/repository/UserRepository.interface';
import UserRepository from '../../../src/infra/repository/sequelize/User.repository';
import userSeed from '../../seed/User.seed';
import Category from '../../../src/core/entity/Category';
import ICategoryRepository from '../../../src/core/repository/CategoryRepository.interface';
import CategoryRepository from '../../../src/infra/repository/sequelize/Category.repository';
import categorySeed from '../../seed/Category.seed';
import instanceSequelize from '../../../src/infra/database/sequelize/instance';

let users: User[] = [];
let categories: Category[] = [];
let sequelize: Sequelize;
let categoryRepository: ICategoryRepository;
let userRepository: IUserRepository;

beforeEach(async () => {
  categories = categorySeed(2);
  users = userSeed(2);
  sequelize = await instanceSequelize();
  categoryRepository = new CategoryRepository(sequelize);
  userRepository = new UserRepository(sequelize);
  await userRepository.create(users[0]);
  await userRepository.create(users[1]);
  categories[0].associateUser(users[0].id);
  categories[1].associateUser(users[0].id);
});

describe('success', () => {
  test('create new category', async () => {
    const result = await categoryRepository.create(categories[0]);
    expect(result.id).toBe(categories[0].id);
    expect(result.name).toBe(categories[0].name);
    expect(result.description).toBe(categories[0].description);
    expect(result.userId).toBe(categories[0].userId);
  });

  test('find by id', async () => {
    const category = await categoryRepository.create(categories[0]);
    const result = await categoryRepository.getBy(category.id, users[0].id);
    expect(result.id).toBe(category.id);
    expect(result.name).toBe(category.name);
    expect(result.description).toBe(category.description);
    expect(result.userId).toBe(category.userId);
  });

  test('find all', async () => {
    await categoryRepository.create(categories[0]);
    await categoryRepository.create(categories[1]);
    const result = await categoryRepository.getAllBy(users[0].id);
    expect(result[0].id).toBe(categories[0].id);
    expect(result[0].name).toBe(categories[0].name);
    expect(result[0].description).toBe(categories[0].description);
    expect(result[0].userId).toBe(categories[0].userId);
    expect(result[1].id).toBe(categories[1].id);
    expect(result[1].name).toBe(categories[1].name);
    expect(result[1].description).toBe(categories[1].description);
    expect(result[1].userId).toBe(categories[1].userId);
  });

  test('empty array when find all without category registered', async () => {
    const result = await categoryRepository.getAllBy(users[0].id);
    expect(result).toHaveLength(0);
  });

  test('update category', async () => {
    await categoryRepository.create(categories[0]);
    const result = await categoryRepository.updateBy(categories[0].id, categories[1]);
    expect(result.id).toBe(categories[0].id);
    expect(result.name).toBe(categories[1].name);
    expect(result.description).toBe(categories[1].description);
    expect(result.userId).toBe(categories[1].userId);
  });

  test('delete category by id', async () => {
    await categoryRepository.create(categories[0]);
    await categoryRepository.create(categories[1]);
    const deleteResult = await categoryRepository.deleteBy(categories[0].id, categories[0].userId!);
    expect(deleteResult).toBeTruthy();
    const getAllResult = await categoryRepository.getAllBy(users[0].id);
    expect(getAllResult).toHaveLength(1);
  });
});

describe('fail', () => {
  test('find by invalid id', async () => {
    await expect(() => categoryRepository.getBy('invalid_id', users[0].id))
      .rejects
      .toThrow('failed on get category by id');
  });

  test('find by from another user', async () => {
    categories[0].associateUser(users[0].id);
    categories[1].associateUser(users[1].id);
    await categoryRepository.create(categories[0]);
    await categoryRepository.create(categories[1]);
    await expect(() => categoryRepository.getBy(categories[1].id, users[0].id))
      .rejects
      .toThrow('cannot access category from another user');
  });

  test('update category with invalid id', async () => {
    await expect(() => categoryRepository.updateBy('invalid_id', categories[0]))
      .rejects
      .toThrow('failed on get category by id');
  });

  test('update category from another user', async () => {
    categories[0].associateUser(users[0].id);
    categories[1].associateUser(users[1].id);
    await categoryRepository.create(categories[0]);
    await categoryRepository.create(categories[1]);
    await expect(() => categoryRepository.updateBy(categories[1].id, categories[0]))
      .rejects
      .toThrow('cannot access category from another user');
  });

  test('delete category by invalid id', async () => {
    await categoryRepository.create(categories[0]);
    await categoryRepository.create(categories[1]);
    await expect(() => categoryRepository.deleteBy('invalid_id', 'invalid_user_id'))
      .rejects
      .toThrow('failed on delete category by id');
    const getAllResult = await categoryRepository.getAllBy(users[0].id);
    expect(getAllResult).toHaveLength(2);
  });
});

