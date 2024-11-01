import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { Sequelize } from 'sequelize-typescript';
import ICache from "../../../../src/infra/cache/cache.interface";
import IJWT from "../../../../src/infra/jwt/jwt.interface";
import IUserRepository from "../../../../src/core/repository/UserRepository.interface";
import CreateHandler from "../../../../src/core/usecase/user/Create";
import CacheFake from "../../../../src/infra/cache/cache.fake";
import JWTFake from "../../../../src/infra/jwt/jwt.fake";
import * as dotenv from "dotenv";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import ExpressAdapter from "../../../../src/infra/http/ExpressAdapter";
import UserController from "../../../../src/infra/controller/user/User.controller";
dotenv.config();

let request: TestAgent;
let sequelize: Sequelize;
let cache: ICache;
let jwt: IJWT;
let userRepository: IUserRepository;
let createHandler: CreateHandler;
let token = 'Bearer token';

const input = {
	name:     'name',
	username: 'username',
	email:    'email@email.com',
	password: 'password'
};

beforeEach(async () => {
	cache = new CacheFake();
	jwt = new JWTFake();
	await cache.listSet(`session:id`, 'token');
	await cache.listSet(`session:id2`, 'token');
  sequelize = await instanceSequelize();
	const repositoryFactory = new RepositoryFactory(sequelize);
	userRepository = repositoryFactory.user();
	const httpAdapter = new ExpressAdapter(cache, jwt);
	new UserController(httpAdapter, userRepository, cache, jwt);
	httpAdapter.init();
	request = supertest(httpAdapter.app);
	createHandler = new CreateHandler(userRepository);
});
afterEach(() => sequelize.close());

describe('success', () => {
	// test('logout', async () => {
	// 	await createHandler.execute({ ...input, status: false });
	// 	const { status, body } = await request
	// 		.post('/api/v1/logout')
	// 		.set('Authorization', token);
	// 	expect(body?.result).toBe(true);
	// 	expect(status).toBe(200);
	// });

	test('login with username', async () => {
		const { id } = await createHandler.execute({ ...input });
		const { status, body } = await request
			.post('/api/v1/login')
			.send({ login: input.username, password: input.password });
		expect(body?.result?.id).toBe(id);
		expect(body?.result?.email).toBe(input.email);
		expect(body?.result?.username).toBe(input.username);
		expect(body?.result?.name).toBe(input.name);
		expect(body?.result?.token).toBeDefined();
		expect(status).toBe(200);
	});

	test('login with email', async () => {
		const { id } = await createHandler.execute({ ...input });
		const { status, body } = await request
			.post('/api/v1/login')
			.send({ login: input.email, password: input.password });
		expect(body?.result?.id).toBe(id);
		expect(body?.result?.email).toBe(input.email);
		expect(body?.result?.username).toBe(input.username);
		expect(body?.result?.name).toBe(input.name);
		expect(body?.result?.token).toBeDefined();
		expect(status).toBe(200);
	});

	test('enable by id', async () => {
		const { id } = await createHandler.execute({ ...input });
		const { status, body } = await request
			.get(`/api/v1/users/enable/${id}`)
			.set('Authorization', token);
		expect(body?.result).toBeTruthy();
		expect(status).toBe(200);
		const { status: userStatus } = await userRepository.getBy(id);
		expect(userStatus).toBeTruthy();
	});

	test('disable by id', async () => {
		const { id } = await createHandler.execute({ ...input });
		const { status, body } = await request
			.get(`/api/v1/users/disable/${id}`)
			.set('Authorization', token);
		expect(body?.result).toBeTruthy();
		expect(status).toBe(200);
		const { status: userStatus } = await userRepository.getBy(id);
		expect(userStatus).toBeFalsy();
	});

	test('create', async () => {
		const { status, body } = await request
			.post('/api/v1/users')
			.set('Authorization', token)
			.send(input);
		expect(body?.result?.id).toBeDefined();
		expect(body?.result?.email).toBe(input.email);
		expect(body?.result?.username).toBe(input.username);
		expect(body?.result?.name).toBe(input.name);
		expect(status).toBe(201);
	});

	test('find all', async () => {
		const { id } = await createHandler.execute({ ...input });
		const { status, body } = await request
			.get('/api/v1/users/all')
			.set('Authorization', token);
		expect(body.result?.[0].id).toBe(id);
		expect(body.result?.[0].username).toBe(input.username);
		expect(body.result?.[0].email).toBe(input.email);
		expect(status).toBe(200);
	});

	test('find by id', async () => {
		const { id } = await createHandler.execute({ ...input });
		const { status, body } = await request
			.get(`/api/v1/users/${id}`)
			.set('Authorization', token);
		expect(body.result?.id).toBe(id);
		expect(body.result?.username).toBe(input.username);
		expect(body.result?.name).toBe(input.name);
		expect(body.result?.email).toBe(input.email);
		expect(status).toBe(200);
	});

	test('update by id with all fields', async () => {
		const { id } = await createHandler.execute({ ...input });
		const updateInput = { email: 'email_updated@email.com', username: 'username_updated', name: 'name_updated', password: 'password_updated' };
		const { status, body } = await request
			.put(`/api/v1/users/${id}`)
			.set('Authorization', token)
			.send(updateInput);
		expect(body.result?.id).toBe(id);
		expect(body.result?.username).toBe(updateInput.username);
		expect(body.result?.name).toBe(updateInput.name);
		expect(body.result?.email).toBe(updateInput.email);
		expect(status).toBe(200);
	});

	test('update by id with without name', async () => {
		const { id } = await createHandler.execute({ ...input });
		const updateInput = { email: 'email_updated@email.com', username: 'username_updated' };
		const { status, body } = await request
			.put(`/api/v1/users/${id}`)
			.set('Authorization', token)
			.send(updateInput);
		expect(body.result?.id).toBe(id);
		expect(body.result?.username).toBe(updateInput.username);
		expect(body.result?.name).toBe(input.name);
		expect(body.result?.email).toBe(updateInput.email);
		expect(status).toBe(200);
	});

	test('delete by id', async () => {
		const { id } = await createHandler.execute({ ...input });
		const { status, body } = await request
			.delete(`/api/v1/users/${id}`)
			.set('Authorization', token);
		expect(body.result).toBe(true);
		expect(status).toBe(200);
		expect(await userRepository.getAll()).toHaveLength(0);
	});
});

describe('fail', () => {
	// test('fail on enable with invalid id', async () => {
	// 	const { status, body } = await request
	// 		.get('/api/v1/users/enable/invalid_id')
	// 		.set('Authorization', token);
	// 	expect(body?.result).toBe('failed on enable user by id invalid_id');
	// 	expect(status).toBe(400);
	// });
	//
	// test('fail on disable with invalid id', async () => {
	// 	const { status, body } = await request
	// 		.get('/api/v1/users/disable/invalid_id')
	// 		.set('Authorization', token);
	// 	expect(body?.result).toBe('failed on disable user by id invalid_id');
	// 	expect(status).toBe(400);
	// });

	test('fail on request without token', async () => {
		const { status, body } = await request
			.post('/api/v1/logout')
			.set('Authorization', 'invalid_token');
		console.log(status, body)
		expect(body?.result).toBe('invalid token');
		expect(status).toBe(401);
	});

	test('fail on login with invalid login', async () => {
		const { status, body } = await request
			.post('/api/v1/login')
			.set('Authorization', token)
			.send({ login: 'invalid_login', password: input.password });
		expect(body?.result).toBe('incorrect login/password');
		expect(status).toBe(400);
	});

	test('fail on login with invalid password', async () => {
		const { status, body } = await request
			.post('/api/v1/login')
			.set('Authorization', token)
			.send({ login: input.username, password: 'invalid_password' });
		expect(body?.result).toBe('incorrect login/password');
		expect(status).toBe(400);
	});

	test('fail on create without email', async () => {
		const { status, body } = await request
			.post('/api/v1/users')
			.set('Authorization', token)
			.send({ ...input, email: 'email' });
		expect(body?.result).toBe('invalid email format');
		expect(status).toBe(400);
	});

	test('fail on create with invalid email format', async () => {
		const { status, body } = await request
			.post('/api/v1/users')
			.set('Authorization', token)
			.send({ ...input, email: 'invalid' });
		expect(body?.result).toBe('invalid email format');
		expect(status).toBe(400);
	});

	test('fail on create with same email', async () => {
		await createHandler.execute({ ...input });
		const { status, body } = await request
			.post('/api/v1/users')
			.set('Authorization', token)
			.send({ ...input });
		expect(body?.result).toBe('email must be unique');
		expect(status).toBe(400);
	});

	test('fail on create with same username', async () => {
		await createHandler.execute({ ...input });
		const { status, body } = await request
			.post('/api/v1/users')
			.set('Authorization', token)
			.send({ ...input, email: 'email2@email.com' });
		expect(body?.result).toBe('username must be unique');
		expect(status).toBe(400);
	});

	test('fail on find by invalid id', async () => {
		const { status, body } = await request
			.get(`/api/v1/users/invalid_id`)
			.set('Authorization', token);
		expect(body?.result).toBe('failed on get user by id');
		expect(status).toBe(404);
	});

	test('fail on update with invalid email format', async () => {
		const { id } = await createHandler.execute({ ...input });
		const { status, body } = await request
			.put(`/api/v1/users/${id}`)
			.set('Authorization', token)
			.send({ ...input, email: 'invalid' });
		expect(body?.result).toBe('invalid email format');
		expect(status).toBe(400);
	});

	test('fail on update with same email', async () => {
		await createHandler.execute({ ...input });
		const { id } = await createHandler.execute({ ...input, username: 'username2', email: 'email2@email.com' });
		const { status, body } = await request
			.put(`/api/v1/users/${id}`)
			.set('Authorization', token)
			.send({ email: input.email });
		expect(body?.result).toBe('email must be unique');
		expect(status).toBe(400);
	});

	test('fail on update with same username', async () => {
		await createHandler.execute({ ...input });
		const { id } = await createHandler.execute({ ...input, username: 'username2', email: 'email2@email.com' });
		const { status, body } = await request
			.put(`/api/v1/users/${id}`)
			.set('Authorization', token)
			.send({ username: input.username });
		expect(body?.result).toBe('username must be unique');
		expect(status).toBe(400);
	});
});