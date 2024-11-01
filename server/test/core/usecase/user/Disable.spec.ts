import { Sequelize } from "sequelize-typescript";
import IUserRepository from '../../../../src/core/repository/UserRepository.interface';
import instanceSequelize from '../../../../src/infra/database/sequelize/instance';
import userSeed from "../../../seed/User.seed";
import User from "../../../../src/core/entity/User";
import CreateHandler from "../../../../src/core/usecase/user/Create";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import DisableHandler from "../../../../src/core/usecase/user/Disable";
import CacheFake from "../../../../src/infra/cache/cache.fake";

let sequelize:  Sequelize;
let userRepository: IUserRepository;
let disableHandler: DisableHandler;
let createHandler: CreateHandler;
let users: User[];

beforeEach(async () => {
	sequelize = await instanceSequelize();
	const repositoryFactory = new RepositoryFactory(sequelize);
	const cache = new CacheFake();
	userRepository = repositoryFactory.user();
	disableHandler = new DisableHandler(userRepository, cache);
	createHandler = new CreateHandler(userRepository);
	users = userSeed(2);
});

afterEach(async () => await sequelize.close());

describe('success', () => {
	test('disable user by id', async () => {
		const { id } = await createHandler.execute(users[0]);
		const result = await disableHandler.execute({ id });
		expect(result).toBeTruthy();
		const { status } = await userRepository.getBy(id);
		expect(status).toBeFalsy();
	});
});

describe('fail', () => {
	test('disable user by invalid id', async () => {
		await expect(() => disableHandler.execute({ id: 'invalid_id' }))
			.rejects
			.toThrow('failed on get user by id');
	});
});