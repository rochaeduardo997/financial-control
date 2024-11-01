import { Sequelize } from "sequelize-typescript";
import ICategoryRepository from '../../../../src/core/repository/CategoryRepository.interface';
import instanceSequelize from '../../../../src/infra/database/sequelize/instance';
import CreateHandler from "../../../../src/core/usecase/category/Create";
import RepositoryFactory from "../../../../src/infra/factory/sequelize/Repository.factory";
import IUserRepository from "../../../../src/core/repository/UserRepository.interface";
import userSeed from "../../../seed/User.seed";

const input = {
	name:        'name',
	description: 'description',
	userId:      'userId'
};

let sequelize:  Sequelize;
let categoryRepository: ICategoryRepository;
let userRepository: IUserRepository;
let createHandler: CreateHandler;

beforeEach(async () => {
	sequelize = await instanceSequelize();
	const repositoryFactory = new RepositoryFactory(sequelize);
	categoryRepository = repositoryFactory.category();
	userRepository = repositoryFactory.user();
	createHandler = new CreateHandler(categoryRepository);
	const [ user ] = userSeed();
	const { id: userId } = await userRepository.create(user);
	input.userId = userId;
});

afterEach(async () => await sequelize.close());

describe('success', () => {
	test('create category', async () => {
		const result = await createHandler.execute({ ...input });
		expect(result.id).toBeDefined();
		expect(result.name).toBe(input.name);
		expect(result.description).toBe(input.description);
		expect(result.userId).toBe(input.userId);
	});
});

describe('fail', () => {
	test('create category with invalid user id', async () => {
		input.userId = "invalid_id";
		await expect(() => createHandler.execute({ ...input }))
			.rejects
			.toThrow("failed on get user by id");
	});
});