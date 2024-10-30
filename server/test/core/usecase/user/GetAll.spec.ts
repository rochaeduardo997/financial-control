import { Sequelize } from "sequelize-typescript";
import IUserRepository from '../../../../src/core/repository/UserRepository.interface';
import UserRepository from '../../../../src/infra/repository/sequelize/User.repository';
import instanceSequelize from '../../../../src/infra/database/sequelize/instance';
import GetAllHandler from "../../../../src/core/usecase/user/GetAll";
import User from "../../../../src/core/entity/User";
import userSeed from "../../../seed/User.seed";

let sequelize:  Sequelize;
let userRepository: IUserRepository;
let getAllHandler: GetAllHandler;
let users: User[];

beforeEach(async () => {
	sequelize = await instanceSequelize();
	userRepository = new UserRepository(sequelize);
	getAllHandler = new GetAllHandler(userRepository);
	users = userSeed(2);
	await userRepository.create(users[0]);
	await userRepository.create(users[1]);
});

afterEach(async () => await sequelize.close());

describe('success', () => {
	test('get user by id', async () => {
		const result = await getAllHandler.execute();
		expect(result[0].id).toBe(users[0].id);
		expect(result[0].name).toBe(users[0].name);
		expect(result[0].username).toBe(users[0].username);
		expect(result[0].email).toBe(users[0].email);
		expect(result[1].id).toBe(users[1].id);
		expect(result[1].name).toBe(users[1].name);
		expect(result[1].username).toBe(users[1].username);
		expect(result[1].email).toBe(users[1].email);
	});
});
