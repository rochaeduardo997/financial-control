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
	// 	expect(body?.result).toEqual(true);
	// 	expect(status).toEqual(200);
	// });

	test('login with username', async () => {
		const { id } = await createHandler.execute({ ...input });
		const { status, body } = await request
			.post('/api/v1/login')
			.send({ login: input.username, password: input.password });
		expect(body?.result?.id).toEqual(id);
		expect(body?.result?.email).toEqual(input.email);
		expect(body?.result?.username).toEqual(input.username);
		expect(body?.result?.name).toEqual(input.name);
		expect(body?.result?.token).toBeDefined();
		expect(status).toEqual(200);
	});

	test('login with email', async () => {
		const { id } = await createHandler.execute({ ...input });
		const { status, body } = await request
			.post('/api/v1/login')
			.send({ login: input.email, password: input.password });
		expect(body?.result?.id).toEqual(id);
		expect(body?.result?.email).toEqual(input.email);
		expect(body?.result?.username).toEqual(input.username);
		expect(body?.result?.name).toEqual(input.name);
		expect(body?.result?.token).toBeDefined();
		expect(status).toEqual(200);
	});

	// test('enable by id', async () => {
	// 	const user = await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.get(`/api/v1/users/enable/${user.id}`)
	// 		.set('Authorization', token);
	// 	expect(body?.result?.id).toEqual(input.id);
	// 	expect(body?.result?.email).toEqual(input.email);
	// 	expect(body?.result?.username).toEqual(input.username);
	// 	expect(body?.result?.fullname).toEqual(input.fullname);
	// 	expect(body?.result?.status).toEqual(true);
	// 	expect(status).toEqual(200);
	// });
	//
	// test('disable by id', async () => {
	// 	const user = await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.get(`/api/v1/users/disable/${user.id}`)
	// 		.set('Authorization', token);
	// 	expect(body?.result?.id).toEqual(input.id);
	// 	expect(body?.result?.email).toEqual(input.email);
	// 	expect(body?.result?.username).toEqual(input.username);
	// 	expect(body?.result?.fullname).toEqual(input.fullname);
	// 	expect(body?.result?.status).toEqual(false);
	// 	expect(status).toEqual(200);
	// });
	//
	// test('create with status false', async () => {
	// 	const { status, body } = await request
	// 		.post('/api/v1/users')
	// 		.set('Authorization', token)
	// 		.send({ ...input, status: false });
	// 	expect(body?.result?.email).toEqual(input.email);
	// 	expect(body?.result?.username).toEqual(input.username);
	// 	expect(body?.result?.fullname).toEqual(input.fullname);
	// 	expect(body?.result?.status).toEqual(false);
	// 	expect(status).toEqual(201);
	// });
	//
	// test('create with all fields', async () => {
	// 	const { status, body } = await request
	// 		.post('/api/v1/users')
	// 		.set('Authorization', token)
	// 		.send(input);
	// 	expect(body?.result?.email).toEqual(input.email);
	// 	expect(body?.result?.username).toEqual(input.username);
	// 	expect(body?.result?.fullname).toEqual(input.fullname);
	// 	expect(body?.result?.status).toEqual(input.status);
	// 	expect(status).toEqual(201);
	// });
	//
	// test('create with without fullname', async () => {
	// 	const { status, body } = await request
	// 		.post('/api/v1/users')
	// 		.set('Authorization', token)
	// 		.send({ ...input, fullname: undefined });
	// 	expect(body?.result?.email).toEqual(input.email);
	// 	expect(body?.result?.username).toEqual(input.username);
	// 	expect(body?.result?.fullname).toEqual(input.username);
	// 	expect(body?.result?.status).toEqual(input.status);
	// 	expect(status).toEqual(201);
	// });
	//
	// test('find all', async () => {
	// 	await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.get('/api/v1/users/all')
	// 		.set('Authorization', token);
	// 	expect(body.result?.[0].id).toEqual(input.id);
	// 	expect(body.result?.[0].username).toEqual(input.username);
	// 	expect(body.result?.[0].email).toEqual(input.email);
	// 	expect(body.result?.[0].status).toEqual(input.status);
	// 	expect(status).toEqual(200);
	// });
	//
	// test('find by id', async () => {
	// 	await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.get(`/api/v1/users/${input.id}`)
	// 		.set('Authorization', token);
	// 	expect(body.result?.id).toEqual(input.id);
	// 	expect(body.result?.username).toEqual(input.username);
	// 	expect(body.result?.email).toEqual(input.email);
	// 	expect(body?.result?.status).toEqual(input.status);
	// 	expect(status).toEqual(200);
	// });
	//
	// test('update by id with all fields', async () => {
	// 	await userRepository.create(new User(input));
	// 	const updateInput = { email: 'email_updated@email.com', username: 'username_updated', fullname: 'fullname_updated', password: 'password_updated' };
	// 	const { status, body } = await request
	// 		.put(`/api/v1/users/${input.id}`)
	// 		.set('Authorization', token)
	// 		.send(updateInput);
	// 	expect(body.result?.id).toEqual(input.id);
	// 	expect(body.result?.username).toEqual(updateInput.username);
	// 	expect(body.result?.fullname).toEqual(updateInput.fullname);
	// 	expect(body.result?.email).toEqual(updateInput.email);
	// 	expect(body?.result?.status).toEqual(input.status);
	// 	expect(status).toEqual(200);
	// });
	//
	// test('update by id with without fullname', async () => {
	// 	await userRepository.create(new User(input));
	// 	const updateInput = { email: 'email_updated@email.com', username: 'username_updated' };
	// 	const { status, body } = await request
	// 		.put(`/api/v1/users/${input.id}`)
	// 		.set('Authorization', token)
	// 		.send(updateInput);
	// 	expect(body.result?.id).toEqual(input.id);
	// 	expect(body.result?.username).toEqual(updateInput.username);
	// 	expect(body.result?.fullname).toEqual(input.fullname);
	// 	expect(body.result?.email).toEqual(updateInput.email);
	// 	expect(body?.result?.status).toEqual(input.status);
	// 	expect(status).toEqual(200);
	// });
	//
	// test('delete by id', async () => {
	// 	await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.delete(`/api/v1/users/${input.id}`)
	// 		.set('Authorization', token);
	// 	expect(body.result).toEqual(true);
	// 	expect(status).toEqual(200);
	// 	expect(await userRepository.findAll()).toHaveLength(0);
	// });
});

describe('fail', () => {
	// test('fail on enable with invalid id', async () => {
	// 	const { status, body } = await request
	// 		.get('/api/v1/users/enable/invalid_id')
	// 		.set('Authorization', token);
	// 	expect(body?.msg).toEqual('failed on enable user by id invalid_id');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on disable with invalid id', async () => {
	// 	const { status, body } = await request
	// 		.get('/api/v1/users/disable/invalid_id')
	// 		.set('Authorization', token);
	// 	expect(body?.msg).toEqual('failed on disable user by id invalid_id');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on request without token', async () => {
	// 	await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.post('/api/v1/logout')
	// 		.set('Authorization', 'invalid_token');
	// 	expect(body?.msg).toEqual('invalid token');
	// 	expect(status).toEqual(401);
	// });
	//
	// test('fail on login with status disable', async () => {
	// 	await createHandler.execute({ ...input, status: false });
	// 	const { status, body } = await request
	// 		.post('/api/v1/login')
	// 		.set('Authorization', token)
	// 		.send({ login: input.email, password: input.password });
	// 	expect(body?.msg).toEqual('disabled user');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on login with invalid login', async () => {
	// 	await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.post('/api/v1/login')
	// 		.set('Authorization', token)
	// 		.send({ login: 'invalid_login', password: input.password });
	// 	expect(body?.msg).toEqual('login/password incorrect');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on login with invalid password', async () => {
	// 	await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.post('/api/v1/login')
	// 		.set('Authorization', token)
	// 		.send({ login: input.username, password: 'invalid_password' });
	// 	expect(body?.msg).toEqual('login/password incorrect');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on create without email', async () => {
	// 	const { status, body } = await request
	// 		.post('/api/v1/users')
	// 		.set('Authorization', token)
	// 		.send({});
	// 	expect(body?.msg).toEqual('invalid email format');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on create with invalid email format', async () => {
	// 	const { status, body } = await request
	// 		.post('/api/v1/users')
	// 		.set('Authorization', token)
	// 		.send({ ...input, email: 'invalid' });
	// 	expect(body?.msg).toEqual('invalid email format');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on create with same email', async () => {
	// 	await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.post('/api/v1/users')
	// 		.set('Authorization', token)
	// 		.send({ ...input });
	// 	expect(body?.msg).toEqual('email must be unique');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on create with same username', async () => {
	// 	await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.post('/api/v1/users')
	// 		.set('Authorization', token)
	// 		.send({ ...input, email: 'email2@email.com' });
	// 	expect(body?.msg).toEqual('username must be unique');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on update with invalid email format', async () => {
	// 	const user = await userRepository.create(new User(input));
	// 	const { status, body } = await request
	// 		.put(`/api/v1/users/${user.id}`)
	// 		.set('Authorization', token)
	// 		.send({ ...input, email: 'invalid' });
	// 	expect(body?.msg).toEqual('invalid email format');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on update with same email', async () => {
	// 	await userRepository.create(new User(input));
	// 	const user = await userRepository.create(new User({ ...input, id: 'id2', username: 'username2', email: 'email2@email.com' }));
	// 	const { status, body } = await request
	// 		.put(`/api/v1/users/${user.id}`)
	// 		.set('Authorization', token)
	// 		.send({ email: input.email });
	// 	expect(body?.msg).toEqual('email must be unique');
	// 	expect(status).toEqual(400);
	// });
	//
	// test('fail on update with same username', async () => {
	// 	await userRepository.create(new User(input));
	// 	const user = await userRepository.create(new User({ ...input, id: 'id2', username: 'username2', email: 'email2@email.com' }));
	// 	const { status, body } = await request
	// 		.put(`/api/v1/users/${user.id}`)
	// 		.set('Authorization', token)
	// 		.send({ username: input.username });
	// 	expect(body?.msg).toEqual('username must be unique');
	// 	expect(status).toEqual(400);
	// });
});