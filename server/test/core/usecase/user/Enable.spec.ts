import { Sequelize } from "sequelize-typescript";
import IUserRepository from '../../../../src/core/repository/UserRepository.interface';
import instanceSequelize from '../../../../src/infra/database/sequelize/instance';
import EnableHandler from "../../../../src/core/usecase/user/Enable";
import userSeed from "../../../seed/User.seed";
import User from "../../../../src/core/entity/User";
import CreateHandler from "../../../../src/core/usecase/user/Create";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";

let sequelize:  Sequelize;
let userRepository: IUserRepository;
let enableHandler: EnableHandler;
let createHandler: CreateHandler;
let users: User[];

beforeEach(async () => {
	sequelize = await instanceSequelize();
	const repositoryFactory = new RepositoryFactory(sequelize);
	userRepository = repositoryFactory.user();
	enableHandler = new EnableHandler(userRepository);
	createHandler = new CreateHandler(userRepository);
	users = userSeed(2);
});

afterEach(async () => await sequelize.close());

describe('success', () => {
	test('enable user by id', async () => {
		const { id } = await createHandler.execute(users[0]);
		const result = await enableHandler.execute({ id });
		expect(result).toBeTruthy();
		const { status } = await userRepository.getBy(id);
		expect(status).toBeTruthy();
	});
});

describe('fail', () => {
	test('enable user by invalid id', async () => {
		await expect(() => enableHandler.execute({ id: 'invalid_id' }))
			.rejects
			.toThrow('failed on get user by id');
	});
});