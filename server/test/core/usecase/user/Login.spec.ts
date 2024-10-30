import { Sequelize } from "sequelize-typescript";
import IUserRepository from '../../../../src/core/repository/UserRepository.interface';
import instanceSequelize from '../../../../src/infra/database/sequelize/instance';
import LoginHandler from "../../../../src/core/usecase/user/Login";
import User from "../../../../src/core/entity/User";
import userSeed from "../../../seed/User.seed";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import JWTFake from "../../../../src/infra/jwt/jwt.fake";

let sequelize:  Sequelize;
let userRepository: IUserRepository;
let loginHandler: LoginHandler;
let user: User;
let users: User[];

beforeEach(async () => {
	sequelize = await instanceSequelize();
	const repositoryFactory = new RepositoryFactory(sequelize);
	const jwt = new JWTFake();
	userRepository = repositoryFactory.user();
	loginHandler = new LoginHandler(userRepository, jwt);
	users = userSeed(2);
	user = await userRepository.create(users[0]);
});

afterEach(async () => await sequelize.close());

describe('success', () => {
	test('login with email', async () => {
		const result = await loginHandler.execute({
			login:    user.email,
			password: users[0].password
		});
		expect(result.token).toBeDefined();
	});

	test('login with username', async () => {
		const result = await loginHandler.execute({
			login:    user.username,
			password: users[0].password
		});
		expect(result.token).toBeDefined();
	});
});

describe('fail', () => {
	test('failed login with invalid login', async () => {
		await expect(() => loginHandler.execute({
			login:    'invalid_login',
			password: users[0].password
		}))
			.rejects
			.toThrow('incorrect login/password');
	});
	
	test('failed login with invalid password', async () => {
		await expect(() => loginHandler.execute({
			login:    user.username,
			password: 'invalid_password'
		}))
			.rejects
			.toThrow('incorrect login/password');
	});
});