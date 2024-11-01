import ICache from "../../cache/cache.interface";
import IJWT from "../../jwt/jwt.interface";
import IUserRepository from "../../../core/repository/UserRepository.interface";
import LoginHandler from "../../../core/usecase/user/Login";
import IHttp from "../../http/HTTP.interface";
import CreateHandler from "../../../core/usecase/user/Create";
import GetAll from "../../../core/usecase/user/GetAll";
import GetByIdHandler from "../../../core/usecase/user/GetById";
import Update from "../../../core/usecase/user/Update";
import DeleteByIdHandler from "../../../core/usecase/user/DeleteById";

type TRouteResponse = { statusCode: number, result: any }

class UserController {
	constructor(httpAdapter: IHttp, private userRepository: IUserRepository, private cache: ICache, private jwt: IJWT){
		const BASE_URL_PATH = '/users';

		// httpAdapter.addRoute('post',   '/logout',                      this.LogoutRoute.bind(this));
		httpAdapter.addRoute('post',   '/login',                       this.LoginRoute.bind(this));
		// httpAdapter.addRoute('get',    `${BASE_URL_PATH}/enable/:id`,  this.EnableByIdRoute.bind(this));
		// httpAdapter.addRoute('get',    `${BASE_URL_PATH}/disable/:id`, this.DisableByIdRoute.bind(this));
		httpAdapter.addRoute('post',   `${BASE_URL_PATH}`,             this.CreateRoute.bind(this));
		httpAdapter.addRoute('get',    `${BASE_URL_PATH}/all`,         this.FindAllRoute.bind(this));
		httpAdapter.addRoute('get',    `${BASE_URL_PATH}/:id`,         this.FindByIdRoute.bind(this));
		httpAdapter.addRoute('put',    `${BASE_URL_PATH}/:id`,         this.UpdateByIdRoute.bind(this));
		httpAdapter.addRoute('delete', `${BASE_URL_PATH}/:id`,         this.DeleteByIdRoute.bind(this));

		console.log('user controller successful loaded');
	}

	// private async LogoutRoute(req: any, res: any): Promise<TRouteResponse>{
	// 	try{
	// 		const logoutHandler = new LogoutHandler(this.cache);
	// 		const result = await logoutHandler.execute(req.body);
	// 		return { statusCode: 200, result };
	// 	}catch(err: any){
	// 		console.error('failed on route: user login, ', err);
	// 		throw new Error(err.message);
	// 	}
	// }

	private async LoginRoute(req: any, res: any): Promise<TRouteResponse>{
		try{
			const loginHandler = new LoginHandler(this.userRepository, this.jwt, this.cache);
			const result = await loginHandler.execute(req.body);
			return { statusCode: 200, result };
		}catch(err: any){
			console.error('failed on route: user login, ', err);
			throw new Error(err.message);
		}
	}

	// private async EnableByIdRoute(req: any, res: any): Promise<TRouteResponse>{
	// 	try{
	// 		const enableHandler = new EnableByIdHandler(this.userRepository);
	// 		const result = await enableHandler.execute(req.params);
	// 		return { statusCode: 200, result };
	// 	}catch(err: any){
	// 		console.error('failed on route: enable user, ', err);
	// 		throw new Error(err.message);
	// 	}
	// }
	//
	// private async DisableByIdRoute(req: any, res: any): Promise<TRouteResponse>{
	// 	try{
	// 		const disableHandler = new DisableByIdHandler(this.userRepository, this.cache);
	// 		const result = await disableHandler.execute(req.params);
	// 		return { statusCode: 200, result };
	// 	}catch(err: any){
	// 		console.error('failed on route: disable user, ', err);
	// 		throw new Error(err.message);
	// 	}
	// }

	private async CreateRoute(req: any, res: any): Promise<TRouteResponse>{
		try{
			const createHandler = new CreateHandler(this.userRepository);
			const result = await createHandler.execute(req.body);
			return { statusCode: 201, result };
		}catch(err: any){
			console.error('failed on route: user create, ', err);
			throw new Error(err.message);
		}
	}

	private async FindAllRoute(req: any, res: any): Promise<TRouteResponse>{
		try{
			const getAll = new GetAll(this.userRepository);
			const result = await getAll.execute();
			return { statusCode: 200, result };
		}catch(err: any){
			console.error('failed on route: user find all, ', err);
			throw new Error(err.message);
		}
	}

	private async FindByIdRoute(req: any, res: any): Promise<TRouteResponse>{
		try{
			const { id } = req.params;
			const findById = new GetByIdHandler(this.userRepository);
			const result = await findById.execute({ id });
			return { statusCode: 200, result };
		}catch(err: any){
			console.error('failed on route: user find by id, ', err);
			throw new Error(err?.message);
		}
	}

	private async UpdateByIdRoute(req: any, res: any): Promise<TRouteResponse>{
		try{
			const { id } = req.params;
			const updateById = new Update(this.userRepository);
			const result = await updateById.execute({ ...req.body, id });
			return { statusCode: 200, result }
		}catch(err: any){
			console.error('failed on route: update user by id', err);
			throw new Error(err.message);
		}
	}

	private async DeleteByIdRoute(req: any, res: any): Promise<TRouteResponse>{
		try{
			const { id } = req.params;
			const deleteById = new DeleteByIdHandler(this.userRepository);
			const result = await deleteById.execute({ id });
			return { statusCode: 200, result }
		}catch(err: any){
			console.error('failed on route: delete user by id', err);
			throw new Error(err.message);
		}
	}
}

export default UserController;