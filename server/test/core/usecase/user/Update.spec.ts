import { Sequelize } from "sequelize-typescript";
import IUserRepository from '../../../../src/core/repository/UserRepository.interface';
import instanceSequelize from '../../../../src/infra/database/sequelize/instance';
import UpdateHandler from "../../../../src/core/usecase/user/Update";
import userSeed from "../../../seed/User.seed";
import User from "../../../../src/core/entity/User";
import CreateHandler from "../../../../src/core/usecase/user/Create";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";

const input = {
	id:       'id',
	name:     'updated_name',
	username: 'updated_username',
	email:    'updated_email@email.com',
	password: 'updated_password'
};

let sequelize:  Sequelize;
let userRepository: IUserRepository;
let updateHandler: UpdateHandler;
let createHandler: CreateHandler;
let users: User[];

beforeEach(async () => {
	sequelize = await instanceSequelize();
	const repositoryFactory = new RepositoryFactory(sequelize);
	userRepository = repositoryFactory.user();
	updateHandler = new UpdateHandler(userRepository);
	createHandler = new CreateHandler(userRepository);
	users = userSeed(2);
});

afterEach(async () => await sequelize.close());

describe('success', () => {
	test('update user', async () => {
		const { id } = await createHandler.execute(users[0]);
		input.id       = id;
		input.name     = 'new_name';
		input.username = 'new_username';
		input.email    = 'new_email@email.com';
		input.password = 'new_password';
		const result = await updateHandler.execute({ ...input });
		expect(result.id).toBe(input.id);
		expect(result.name).toBe(input.name);
		expect(result.username).toBe(input.username);
		expect(result.email).toBe(input.email);
	});
});

describe('fail', () => {
	test('fail on update user with same username', async () => {
		const { username } = await createHandler.execute(users[0]);
		const { id }       = await createHandler.execute(users[1]);
		input.id       = id;
		input.username = username;
		await expect(() => updateHandler.execute({ ...input }))
			.rejects
			.toThrow('username must be unique');
	});

	test('fail on update user with same email', async () => {
		const { email } = await createHandler.execute(users[0]);
		const { id }       = await createHandler.execute(users[1]);
		input.id    = id;
		input.email = email;
		await expect(() => updateHandler.execute({ ...input }))
			.rejects
			.toThrow('email must be unique');
	});

	test('fail on update user with invalid id', async () => {
		await expect(() => updateHandler.execute({ id: 'invalid_id' }))
			.rejects
			.toThrow('failed on get user by id');
	});
});