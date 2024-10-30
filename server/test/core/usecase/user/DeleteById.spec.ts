import { Sequelize } from "sequelize-typescript";
import IUserRepository from '../../../../src/core/repository/UserRepository.interface';
import UserRepository from '../../../../src/infra/repository/sequelize/User.repository';
import instanceSequelize from '../../../../src/infra/database/sequelize/instance';
import DeleteByIdHandler from "../../../../src/core/usecase/user/DeleteById";
import User from "../../../../src/core/entity/User";
import userSeed from "../../../seed/User.seed";

let sequelize:  Sequelize;
let userRepository: IUserRepository;
let deleteByIdHandler: DeleteByIdHandler;
let user: User;
let users: User[];

beforeEach(async () => {
	sequelize = await instanceSequelize();
	userRepository = new UserRepository(sequelize);
	deleteByIdHandler = new DeleteByIdHandler(userRepository);
	users = userSeed(2);
	user = await userRepository.create(users[0]);
	await userRepository.create(users[1]);
});

afterEach(async () => await sequelize.close());

describe('success', () => {
	test('delete user by id', async () => {
		const result = await deleteByIdHandler.execute({ id: user.id });
		expect(result).toBe(true);
	});
});

describe('fail', () => {
	test('fail on delete user with invalid id', async () => {
		await expect(() => deleteByIdHandler.execute({ id: 'invalid_id' }))
			.rejects
			.toThrow('failed on delete user by id');
	});
});