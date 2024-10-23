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
    expect(result.id).toEqual(users[0].id);
    expect(result.name).toEqual(users[0].name);
    expect(result.username).toEqual(users[0].username);
    expect(result.email).toEqual(users[0].email);
    expect(result.password).toEqual(users[0].password);
    expect(result.status).toEqual(false);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });
});

