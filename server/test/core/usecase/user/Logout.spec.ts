import { Sequelize } from "sequelize-typescript";
import ICache from "../../../../src/infra/cache/cache.interface";
import instanceSequelize from "../../../../src/infra/database/sequelize/instance";
import CacheFake from "../../../../src/infra/cache/cache.fake";
import LogoutHandler from "../../../../src/core/usecase/user/Logout";
import * as dotenv from 'dotenv';
dotenv.config();

let sequelize: Sequelize;
let cache:     ICache;

beforeEach(async () => {
	sequelize = await instanceSequelize();
	cache = new CacheFake();
});
afterEach(async () => await sequelize.close());

describe('success', () => {
	test('logout, delete token from register', async () => {
		const logoutHandler = new LogoutHandler(cache);
		await cache.listSet('session:id', 'token1');
		await cache.listSet('session:id', 'token2');
		const result = await logoutHandler.execute({ id: 'id', token: 'token1' });
		const valuesCached = await cache.listGet('session:id');
		expect(result).toEqual(true);
		expect(valuesCached).toHaveLength(1);
		expect(valuesCached[0]).toEqual('token2');
	});
});