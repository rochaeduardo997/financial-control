import { Sequelize } from "sequelize-typescript";
import User, { UserRole } from '../../../src/core/entity/User';
import IUserRepository from '../../../src/core/repository/UserRepository.interface';
import UserRepository from '../../../src/infra/repository/sequelize/User.repository';
import userSeed from '../../seed/User.seed';
import instanceSequelize from '../../../src/infra/database/sequelize/instance';

let users: User[] = [];
let sequelize:  Sequelize;
let userRepository: IUserRepository;

beforeEach(async () => {
  users = userSeed();
  sequelize = await instanceSequelize();
  userRepository = new UserRepository(sequelize);
});

describe('success', () => {
  test('create new user', async () => {
    const result = await userRepository.create(users[0]);
    expect(result.id).toBe(users[0].id);
    expect(result.name).toBe(users[0].name);
    expect(result.username).toBe(users[0].username);
    expect(result.email).toBe(users[0].email);
    expect(result.password).toBe(users[0].password);
    expect(result.status).toBe(false);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  test('login with email', async () => {
    const user   = await userRepository.create(users[0]);
    const result = await userRepository.login({ login: user.email, password: user.password });
    expect(result.id).toBe(user.id);
    expect(result.name).toBe(user.name);
    expect(result.username).toBe(user.username);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
    expect(result.status).toBeFalsy();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  test('login with username', async () => {
    const user   = await userRepository.create(users[0]);
    const result = await userRepository.login({ login: user.username, password: user.password });
    expect(result.id).toBe(user.id);
    expect(result.name).toBe(user.name);
    expect(result.username).toBe(user.username);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
    expect(result.status).toBeFalsy();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });
});

describe('fail', () => {
  test('login with invalid credentials', async () => {
    await expect(() => userRepository.login({ login: 'login', password: 'password' }))
      .rejects
      .toThrow();
  });
});

